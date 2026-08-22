import { h } from "preact"
import { resolveRelative, simplifySlug } from "@quartz-community/utils/path"
import { Graph } from "@quartz-community/graph"
import { articleStyles } from "./styles.js"
import { previewTopScript } from "./script.js"

const defaultOptions = {
  // Candidate frontmatter keys, in order. A box appears for each key the note
  // actually has, so the number and kind of boxes varies per note — houses show
  // a seat, characters an era, and nothing renders an empty cell.
  fields: ["type", "house", "seat", "region", "founded", "era", "book", "status"],
  // Rendered in the blood accent rather than parchment, as "Extant" is in 7a.
  accentFields: ["status"],
  rootsHeading: "The roots of this page",
  graphHeading: "Greensight",
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
  // `stub`, `great-house`) but read as labels in the boxes. Anything carrying
  // its own capitals — titles, eras, book names — is left exactly as written.
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

export const WeirwoodArticle = (userOpts) => {
  const opts = { ...defaultOptions, ...(userOpts ?? {}) }
  // Composed rather than placed in a layout slot. Registered components still
  // have their CSS and d3 script emitted, so this is the real interactive graph
  // — just relocated from the sidebar into the band.
  const GraphComponent = Graph()

  const Article = ({ fileData, allFiles, cfg, ...rest }) => {
    const slug = fileData.slug
    if (!isArticlePage(slug)) return null

    const frontmatter = fileData.frontmatter ?? {}
    const boxes = opts.fields
      .filter((key) => !isEmpty(frontmatter[key]))
      .map((key) => ({
        key,
        label: prettify(key),
        value: formatValue(frontmatter[key]),
        accent: opts.accentFields.includes(key),
      }))

    const currentSlug = simplifySlug(slug)
    const backlinks = allFiles.filter(
      (file) => file.unlisted !== true && file.links?.includes(currentSlug),
    )

    const metaGrid = boxes.length
      ? h(
          "div",
          { class: "ww-meta" },
          boxes.map((box) =>
            h("div", { class: "ww-meta-box" }, [
              h("div", { class: "ww-meta-label" }, box.label),
              h(
                "div",
                { class: box.accent ? "ww-meta-value ww-meta-accent" : "ww-meta-value" },
                box.value,
              ),
            ]),
          ),
        )
      : null

    const roots = h("section", { class: "ww-roots" }, [
      h("div", { class: "ww-roots-heading" }, opts.rootsHeading),
      h("div", { class: "ww-roots-grid" }, [
        h("div", { class: "ww-greensight" }, [
          h("div", { class: "ww-roots-label" }, opts.graphHeading),
          h(
            "div",
            { class: "ww-greensight-box" },
            h(GraphComponent, { fileData, allFiles, cfg, ...rest }),
          ),
        ]),
        h("div", { class: "ww-backlinks" }, [
          h("div", { class: "ww-roots-label" }, `Backlinks · ${backlinks.length}`),
          backlinks.length
            ? h(
                "div",
                { class: "ww-backlinks-grid" },
                backlinks.map((file) =>
                  h(
                    "div",
                    { class: "ww-backlink" },
                    h(
                      "a",
                      { class: "internal", href: resolveRelative(slug, file.slug) },
                      file.frontmatter?.title ?? file.slug,
                    ),
                  ),
                ),
              )
            : h("p", { class: "ww-backlinks-empty" }, "No page roots here yet."),
        ]),
      ]),
    ])

    return h("div", { class: "ww-article-head" }, [metaGrid, roots])
  }

  Article.css = articleStyles
  Article.afterDOMLoaded = previewTopScript
  return Article
}
