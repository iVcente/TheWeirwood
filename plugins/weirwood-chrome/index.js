import path from "path"
import { joinSegments } from "@quartz-community/utils/path"
import { WeirwoodFolder } from "./components/folder.js"

export { WeirwoodHeader } from "./components/index.js"

/** Every folder a slug sits under, innermost first: "a/b/c" -> ["a/b", "a", "."]. */
const foldersOf = (slug) => {
  let folder = path.dirname(slug ?? "")
  const folders = [folder]
  while (folder !== ".") {
    folder = path.dirname(folder ?? "")
    folders.push(folder)
  }
  return folders
}

/**
 * The section index page type.
 *
 * This replaces @quartz-community/folder-page rather than layering over it, and
 * that plugin is disabled in quartz.config.yaml. Sitting on top of it would
 * have looked like it worked: a higher priority does win the `match` for any
 * folder that has an index.md, but virtual folder pages — the ones Quartz
 * invents for a directory with no index.md — are emitted in a separate pass
 * using the layout of whichever page type *generated* them. Leaving generation
 * to folder-page would therefore have rendered those folders with the stock
 * dated listing and no hero, silently, on exactly the pages nobody wrote an
 * index for. So generation lives here too, ported from that plugin.
 *
 * Priority beats content-page (0); the root index is claimed by
 * weirwood-landing at the same priority but a narrower match.
 */
export const plugin = (opts) => {
  const body = () => WeirwoodFolder(opts)

  return {
    name: "WeirwoodFolderPage",
    priority: 20,
    // Every folder index EXCEPT the tag tree's. `tags/index` ends in "/index"
    // too, and this page type out-priorities @quartz-community/tag-page (20 vs
    // 10) — so without this guard a real content/tags/index.md would be served
    // a section hero listing nothing, in place of the tag listing.
    match: ({ slug }) => slug.endsWith("/index") && !slug.startsWith("tags/"),
    layout: "folder",
    frame: "full-width",
    body,
    generate({ content }) {
      const folders = new Set()
      const foldersWithIndex = new Set()
      // Quartz slugifies directory names, so the on-disk name is the better
      // label when the two differ; map slug segment -> directory name.
      const displayNames = new Map()

      for (const [, file] of content) {
        const data = file.data
        const slug = data?.slug
        if (!slug) continue

        // An index note claims its folder whether or not it is listed. This
        // check sits ABOVE the unlisted guard on purpose: the section indexes
        // here are all `unlisted: true` (see any content/<folder>/index.md),
        // and skipping them would leave their folders looking index-less — so
        // a virtual index would be generated for a folder that already has a
        // real one, and the same slug would be emitted twice.
        if (slug.endsWith("/index")) {
          foldersWithIndex.add(slug.slice(0, -"/index".length))
        }

        // An unlisted page should not, however, bring a folder into existence
        // on its own.
        if (data.unlisted === true) continue

        for (const folder of foldersOf(slug)) {
          if (folder !== "." && folder !== "tags") folders.add(folder)
        }

        const relativePath = data?.relativePath
        if (!relativePath) continue
        const slugParts = path
          .dirname(slug)
          .split("/")
          .filter((s) => s !== ".")
        const pathParts = path
          .dirname(relativePath)
          .split("/")
          .filter((s) => s !== ".")
        for (let i = 0; i < slugParts.length && i < pathParts.length; i++) {
          if (slugParts[i] && pathParts[i] && !displayNames.has(slugParts[i])) {
            displayNames.set(slugParts[i], pathParts[i])
          }
        }
      }

      // An index.md that never declared a title would otherwise render as
      // "index". Name it after its folder, which is what the hero prints.
      for (const [, file] of content) {
        const slug = file.data?.slug
        if (!slug || !slug.endsWith("/index")) continue
        const frontmatter = file.data.frontmatter
        if (!frontmatter || (frontmatter.title && frontmatter.title !== "index")) continue
        const segment = slug.slice(0, -"/index".length).split("/").pop()
        frontmatter.title = displayNames.get(segment) ?? segment
      }

      const virtualPages = []
      for (const folder of folders) {
        if (foldersWithIndex.has(folder)) continue
        const segment = folder.split("/").pop() ?? folder
        virtualPages.push({
          slug: joinSegments(folder, "index"),
          title: displayNames.get(segment) ?? segment,
          data: {},
        })
      }
      return virtualPages
    },
  }
}
