import { getAllSegmentPrefixes, joinSegments } from "@quartz-community/utils/path"
import { WeirwoodTags } from "./components/tags.js"

export { WeirwoodTags } from "./components/tags.js"

/**
 * The tag page type.
 *
 * This REPLACES @quartz-community/tag-page, which is disabled in
 * quartz.config.yaml, rather than layering over it — and it has to, for the
 * same reason weirwood-chrome owns the section index. Every tag page but
 * /tags itself is a VIRTUAL page, and a virtual page is emitted with the
 * layout and the body of the page type that GENERATED it; `match` is only ever
 * consulted for real files on disk. So a higher-priority page type that does
 * not generate would render nothing at all here, and two page types that both
 * generate would emit the same slug twice and put every tag into the
 * greensight graph twice over.
 *
 * `/tags` is the exception: content/tags/index.md is a real file, so it goes
 * through `match` like any other page and this type renders it as the index.
 */
export const plugin = (opts) => {
  const body = () => WeirwoodTags(opts)

  return {
    name: "WeirwoodTagPage",
    // Above content-page (0), and the same priority the plugin it replaces
    // used. weirwood-chrome's folder page type sits at 20 and declines every
    // tags/ slug, so `tags/index` reaches this one rather than being served a
    // section hero listing nothing.
    priority: 10,
    match: ({ slug }) => slug === "tags" || slug.startsWith("tags/"),
    layout: "tag",
    frame: "full-width",
    body,
    generate({ content }) {
      const listed = content.map(([, file]) => file.data).filter((data) => data?.unlisted !== true)

      // getAllSegmentPrefixes is what makes a nested tag (`houses/great`) also
      // count as its parent (`houses`), which is the behaviour the tag links
      // in the title block already assume.
      const tags = new Set(
        listed.flatMap((data) => data?.frontmatter?.tags ?? []).flatMap(getAllSegmentPrefixes),
      )
      // The index is a tag page like any other as far as generation goes. It
      // is skipped below while content/tags/index.md exists — that file is
      // what lets the listing carry `unlisted: true` — and generated if it is
      // ever deleted, so the "all tags" chip can never point at a 404.
      tags.add("index")

      const existing = new Set()
      for (const [, file] of content) {
        const slug = file.data?.slug
        if (slug && slug.startsWith("tags/")) existing.add(slug)
      }

      const virtualPages = []
      for (const tag of tags) {
        const slug = joinSegments("tags", tag)
        if (existing.has(slug)) continue
        virtualPages.push({ slug, title: tag, data: {} })
      }
      return virtualPages
    },
  }
}
