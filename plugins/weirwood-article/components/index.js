import { h } from "preact"
import { resolveRelative, simplifySlug, slugTag } from "@quartz-community/utils/path"
// Shared with the header and the folder page, which draw the same ten marks at
// three sizes. Both plugins are symlinked out of ./plugins by the same config,
// and Node resolves a symlinked module against its real path, so this relative
// hop lands in plugins/weirwood-chrome. Keep the two directories siblings.
import { Emblem } from "../../weirwood-chrome/components/emblems.js"
import { GreensightBox } from "../../weirwood-chrome/components/greensight.js"
import { sectionOf } from "../../weirwood-chrome/components/sections.js"
import { articleStyles } from "./styles.js"

const defaultOptions = {
  // Candidate frontmatter keys, in the order the handoff's boxes run. A box
  // appears only for a key the note actually has, so the number and kind of
  // boxes varies per note and nothing renders an empty cell.
  //
  // `status` is deliberately absent: a stub is a badge in the tag row now, not
  // a box of its own.
  fields: ["type", "house", "era", "book", "seat", "region", "founded"],
  rootsHeading: "The roots of this page",
  greensightHeading: "Greensight",
  // Marks an unfinished entry in the tag row.
  stubLabel: "stub",
}

const prettify = (key) =>
  key
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

const formatValue = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean).join(" · ")
  if (value instanceof Date) return value.toISOString().slice(0, 10)

  const text = String(value)
  // Enum-ish values are written as lowercase slugs in frontmatter (`house`,
  // `great-house`) but read as labels in the boxes. Anything carrying its own
  // capitals — titles, eras, book names — is left exactly as written.
  if (/^[a-z0-9-]+$/.test(text)) return prettify(text)
  return text
}

const isEmpty = (value) =>
  value === undefined ||
  value === null ||
  value === "" ||
  (Array.isArray(value) && value.length === 0)

/** Pages that should carry the article furniture. */
const isArticlePage = (slug) => {
  if (!slug) return false
  if (slug === "index" || slug.endsWith("/index")) return false
  return !(slug === "tags" || slug.startsWith("tags/"))
}

/**
 * The inbound-link count, and nothing else.
 *
 * This is the only place that number survives — the band deliberately carries
 * no backlink list, on the grounds that it should stay one height whether seven
 * pages lead here or twenty-five, and the count is what keeps that an honest
 * trade rather than a lossy one. So the figure stays and the "see them in the
 * graph" tail goes: the panel is visibly a button, and it does not need to
 * narrate itself at 9px.
 */
const inbound = (count) => {
  if (count === 0) return "Nothing leads here yet"
  if (count === 1) return "1 page leads here"
  return `${count} pages lead here`
}

export const WeirwoodArticle = (userOpts) => {
  const opts = { ...defaultOptions, ...(userOpts ?? {}) }

  const Article = ({ fileData, allFiles }) => {
    const slug = fileData.slug
    if (!isArticlePage(slug)) return null

    const frontmatter = fileData.frontmatter ?? {}
    const section = sectionOf(slug)

    // Two sources, one grid. The named `fields` cover the frontmatter this site
    // already writes; `facts:` is an open, ordered map for anything a single
    // entry needs and no other page shares — bearers, tally, whatever — so the
    // boxes never have to be hardcoded per type.
    const facts = frontmatter.facts
    const factEntries =
      facts && typeof facts === "object" && !Array.isArray(facts) ? Object.entries(facts) : []

    const boxes = [
      ...opts.fields
        .filter((key) => !isEmpty(frontmatter[key]))
        .map((key) => ({ key, value: frontmatter[key] })),
      ...factEntries.filter(([, value]) => !isEmpty(value)).map(([key, value]) => ({ key, value })),
    ].map(({ key, value }) => ({
      key,
      label: prettify(key),
      value: formatValue(value),
    }))

    const currentSlug = simplifySlug(slug)
    const backlinks = (allFiles ?? []).filter(
      (file) => file.unlisted !== true && file.links?.includes(currentSlug),
    )

    const tags = (frontmatter.tags ?? []).filter(Boolean)
    // `stub: true` and the `status: stub` this site's frontmatter already uses
    // both raise the badge; neither is required.
    const isStub = frontmatter.stub === true || frontmatter.status === "stub"

    const titleBlock = h("section", { class: "ww-title-block" }, [
      section
        ? h(Emblem, { section, size: 200, strokeWidth: 0.7, class: "ww-title-watermark" })
        : null,
      h("div", { class: "ww-band-inner ww-title-inner" }, [
        h("h1", { class: "ww-title" }, frontmatter.title ?? slug),
        frontmatter.words ? h("p", { class: "ww-words" }, frontmatter.words) : null,
        tags.length || isStub
          ? h("div", { class: "ww-chips" }, [
              ...tags.map((tag) =>
                h(
                  "a",
                  { class: "ww-chip", href: resolveRelative(slug, `tags/${slugTag(tag)}`) },
                  tag,
                ),
              ),
              isStub ? h("span", { class: "ww-chip ww-chip--stub" }, opts.stubLabel) : null,
            ])
          : null,
      ]),
    ])

    const metaGrid = boxes.length
      ? h(
          "div",
          { class: "ww-band-inner ww-meta" },
          boxes.map((box) =>
            h("div", { class: "ww-meta-box" }, [
              h("div", { class: "ww-meta-label" }, box.label),
              h("div", { class: "ww-meta-value" }, box.value),
            ]),
          ),
        )
      : null

    // No backlink list. The connections live in the graph, which keeps this
    // band one height whether seven pages lead here or twenty-five — the reason
    // it can sit above the prose at all.
    const roots = h(
      "section",
      { class: "ww-roots" },
      h("div", { class: "ww-band-inner" }, [
        h("div", { class: "ww-roots-heading" }, opts.rootsHeading),
        h(GreensightBox, {
          heading: opts.greensightHeading,
          sub: inbound(backlinks.length),
          size: "article",
        }),
      ]),
    )

    return h("div", { class: "ww-article-head" }, [titleBlock, metaGrid, roots])
  }

  Article.css = articleStyles
  return Article
}
