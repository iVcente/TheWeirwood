import { h } from "preact"
import { resolveRelative } from "@quartz-community/utils/path"
import { htmlToJsx } from "@quartz-community/utils/jsx"
import { Emblem } from "./emblems.js"
import { GreensightBox } from "./greensight.js"
import { discoverSections, isArticle, sectionOf } from "./sections.js"

const defaultOptions = {
  rootsHeading: "Roots of the tree",
  greensightHeading: "Greensight",
  // Short on purpose. This is 9px mono, uppercase, tracked 0.14em — a sentence
  // set that way reads as noise however sensible it is on the page. It only has
  // to do one job: say what is behind an invented word and an abstract glyph.
  greensightSub: "Every page and every link",
}

/** "1 entry recorded" / "7 entries recorded" — no dates anywhere on this site. */
const recorded = (count) => `${count} ${count === 1 ? "entry" : "entries"} recorded`

/**
 * The body of a section index. Replaces @quartz-community/folder-page's
 * FolderContent, whose listing is a dated <li> stack; this is the card grid the
 * handoff specifies, under a hero carrying the section's own emblem.
 */
export const WeirwoodFolder = (userOpts) => {
  const opts = { ...defaultOptions, ...(userOpts ?? {}) }

  const Folder = ({ fileData, allFiles, tree }) => {
    const slug = fileData.slug
    const section = sectionOf(slug) ?? slug.replace(/\/index$/, "")
    const prefix = `${section}/`

    const entries = (allFiles ?? [])
      .filter((file) => isArticle(file) && file.slug?.startsWith(prefix))
      .sort((a, b) =>
        String(a.frontmatter?.title ?? a.slug).localeCompare(
          String(b.frontmatter?.title ?? b.slug),
        ),
      )

    // The index note's own prose heads the page. Falling back to the derived
    // description keeps a folder without an index.md — one Quartz generated
    // itself — from opening on nothing.
    const hasProse = (tree?.children?.length ?? 0) > 0
    const description = hasProse ? htmlToJsx(tree) : fileData.description

    const hero = h("section", { class: "ww-section-hero" }, [
      h(Emblem, {
        section,
        size: 230,
        strokeWidth: 0.7,
        class: "ww-section-mark",
      }),
      h("div", { class: "ww-band-inner ww-section-hero-inner" }, [
        h("h1", { class: "ww-section-title" }, fileData.frontmatter?.title ?? section),
        h("div", { class: "ww-section-rule", "aria-hidden": "true" }),
        description ? h("div", { class: "ww-section-desc" }, description) : null,
        h("div", { class: "ww-section-count" }, recorded(entries.length)),
      ]),
    ])

    // auto-fit rather than auto-fill: a folder holding one entry gives that
    // card the whole row instead of stranding it in a quarter of one.
    const list = h(
      "div",
      { class: "ww-band-inner ww-entries" },
      entries.map((file) => {
        const tags = (file.frontmatter?.tags ?? []).filter(Boolean)
        return h("a", { class: "ww-entry", href: resolveRelative(slug, file.slug) }, [
          h("h2", { class: "ww-entry-title" }, file.frontmatter?.title ?? file.slug),
          file.description ? h("p", { class: "ww-entry-desc" }, file.description) : null,
          tags.length
            ? h(
                "div",
                { class: "ww-chips" },
                tags.map((tag) => h("span", { class: "ww-chip" }, tag)),
              )
            : null,
        ])
      }),
    )

    const sections = discoverSections(allFiles)
    const roots = h("section", { class: "ww-roots" }, [
      h("div", { class: "ww-band-inner" }, [
        h("div", { class: "ww-roots-heading" }, opts.rootsHeading),
        h(GreensightBox, {
          heading: opts.greensightHeading,
          sub: opts.greensightSub,
          size: "folder",
        }),
        h(
          "nav",
          { class: "ww-tiles", "aria-label": "Sections" },
          sections.map((entry) => {
            const current = entry.segment === section
            const body = [
              h(Emblem, { section: entry.segment, size: 26, class: "ww-tile-emblem" }),
              h("span", { class: "ww-tile-label" }, entry.title),
            ]
            // The current section stays in the row — the reader should see the
            // whole tree from anywhere in it — but as a marked, non-clickable
            // tile rather than a link back to the page they are on.
            return current
              ? h("span", { class: "ww-tile ww-tile--current", "aria-current": "page" }, body)
              : h("a", { class: "ww-tile", href: resolveRelative(slug, entry.segment) }, body)
          }),
        ),
      ]),
    ])

    return h("div", { class: "ww-folder popover-hint" }, [hero, list, roots])
  }

  return Folder
}
