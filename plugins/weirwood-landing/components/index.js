import { h } from "preact"
import { resolveRelative } from "@quartz-community/utils/path"
import { Graph } from "@quartz-community/graph"
// Shared with weirwood-chrome so the front door's greensight and a section
// index's open the same way. Node resolves a symlinked module against its real
// path, so this relative hop lands in plugins/weirwood-chrome.
import { graphOptions } from "../../weirwood-chrome/components/graph-config.js"
import { landingStyles } from "./styles.js"

const defaultOptions = {
  tagline: "The trees remember.",
  ctaLabel: "Greensight",
  // "" opens Quartz's global-graph overlay. A slug here makes it a plain link.
  ctaLink: "",
  worldLabel: "World",
  // The section this opens. Hidden entirely when no such section exists, so the
  // button can never point at a page that has not been written.
  worldLink: "places",
  // The one route to /tags from the front door. It sits UNDER the count boxes
  // rather than beside the two buttons: a tag is a cut across the sections, so
  // it ranks below them, and a third filled CTA would turn one gesture and one
  // way in into a menu of three — three stacked slabs on a phone, out of a
  // landing that is meant to be a single screen.
  //
  // One word, in the same voice the count labels are set in. The line sits in a
  // row of ten section names; a sentence there would be the only prose in the
  // block and would read as a notice rather than as the eleventh way in.
  tagsLabel: "Tags",
  tagsLink: "tags/index",
  // Optional explicit ordering of the count boxes; anything not listed follows
  // alphabetically. Sections themselves are always discovered, never listed.
  order: [],
}

/** Pages a reader can land on — excludes the index, folder indexes and tag pages. */
const isArticle = (file) => {
  const slug = file?.slug
  if (!slug || file.unlisted === true) return false
  if (slug === "index" || slug.endsWith("/index")) return false
  return !(slug === "tags" || slug.startsWith("tags/"))
}

const prettify = (segment) =>
  segment
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

/**
 * Discover the count boxes from the content tree itself: every top-level
 * subdirectory that holds at least one article becomes a cell. Add a folder and
 * a cell appears on its own; nothing here needs maintaining.
 *
 * A folder's label comes from its own index note's title when one exists
 * (content/houses/index.md), so it can be named deliberately, and falls back to
 * the prettified directory name.
 */
const discoverSections = (allFiles, order) => {
  const counts = new Map()
  const titles = new Map()

  for (const file of allFiles) {
    const slug = file?.slug
    if (!slug || !slug.includes("/")) continue
    const segment = slug.split("/")[0]
    if (!segment || segment === "tags") continue

    if (slug === `${segment}/index`) {
      // Only honour a deliberately chosen title. The folder-page plugin
      // auto-generates an index note titled after the directory itself
      // ("characters"), which would otherwise beat the prettified name.
      const declared = file.frontmatter?.title
      if (declared && declared.toLowerCase() !== segment.replace(/-/g, " ").toLowerCase()) {
        titles.set(segment, declared)
      }
      continue
    }
    if (!isArticle(file)) continue
    counts.set(segment, (counts.get(segment) ?? 0) + 1)
  }

  const rank = (segment) => {
    const index = order.indexOf(segment)
    return index === -1 ? order.length : index
  }

  return [...counts.entries()]
    .map(([segment, count]) => ({
      segment,
      count,
      title: titles.get(segment) ?? prettify(segment),
    }))
    .sort((a, b) => rank(a.segment) - rank(b.segment) || a.segment.localeCompare(b.segment))
}

/** "The Weirwood" -> "THE" / "WEIRWOOD", as two lines in the mockup. */
const splitWordmark = (title) => {
  const words = String(title ?? "")
    .trim()
    .split(/\s+/)
  if (words.length < 2) return [words.join(" ")]
  return [words[0], words.slice(1).join(" ")]
}

export const WeirwoodLanding = (userOpts) => {
  const opts = { ...defaultOptions, ...(userOpts ?? {}) }
  // Composed, not placed in a layout slot. Registered components still have
  // their CSS and scripts emitted, so the real graph works from here.
  const GraphComponent = Graph(graphOptions("overview"))

  const Landing = ({ fileData, allFiles, cfg, ...rest }) => {
    if (fileData.slug !== "index") return null

    const slug = fileData.slug
    const sections = discoverSections(allFiles, opts.order ?? [])
    const wordmark = splitWordmark(cfg.pageTitle)
    const usesOverlay = !opts.ctaLink

    // The landing only ever renders at the site root, so a page-relative path
    // to the static asset is correct in both dev and production.
    const hasWorld = sections.some((section) => section.segment === opts.worldLink)
    // Hidden entirely until something is tagged, on the same principle as the
    // world button: the front door never opens a page that would be empty.
    const hasTags = (allFiles ?? []).some(
      (file) => file?.unlisted !== true && (file?.frontmatter?.tags ?? []).length > 0,
    )

    const hero = h("section", { class: "ww-hero" }, [
      h("img", {
        class: "ww-tree",
        // Vector, so it stays sharp at any size and on any pixel density — the
        // hero renders it near 900px tall, well past what the old 1008px PNG
        // could serve a HiDPI screen. The fill is baked into the file rather
        // than taken from --secondary: an external SVG loaded through <img> is
        // an isolated document, so it cannot see the page's custom properties
        // and `currentColor` would resolve to black. Keep the two in step by
        // hand if the palette ever moves.
        src: "./static/weirwood.svg",
        alt: "",
        "aria-hidden": "true",
        loading: "eager",
        decoding: "async",
      }),
      h("div", { class: "ww-hero-inner" }, [
        h(
          "h1",
          { class: "ww-wordmark" },
          wordmark.map((line, i) => (i === 0 ? line : [h("br"), line])),
        ),
        h("div", { class: "ww-rule" }),
        h("p", { class: "ww-tagline" }, opts.tagline),
        h("div", { class: "ww-actions" }, [
          usesOverlay
            ? h("button", { type: "button", class: "ww-cta", "data-greensight": "" }, opts.ctaLabel)
            : h("a", { class: "ww-cta", href: resolveRelative(slug, opts.ctaLink) }, opts.ctaLabel),
          hasWorld &&
            h(
              "a",
              { class: "ww-cta", href: resolveRelative(slug, opts.worldLink) },
              opts.worldLabel,
            ),
        ]),
      ]),
    ])

    const counts = sections.length
      ? h(
          "nav",
          { class: "ww-counts", "aria-label": "Sections" },
          sections.map((section) =>
            h("a", { class: "ww-count-cell", href: resolveRelative(slug, section.segment) }, [
              h("span", { class: "ww-count-label" }, section.title),
              h("span", { class: "ww-count-value" }, String(section.count)),
            ]),
          ),
        )
      : null

    const threads =
      hasTags && opts.tagsLink
        ? h(
            "a",
            { class: "ww-threads", href: resolveRelative(slug, opts.tagsLink) },
            opts.tagsLabel,
          )
        : null

    return h("div", { class: "ww-landing" }, [
      hero,
      counts,
      threads,
      // Off-screen host for the real graph, so the CTA has a global graph to
      // open. Kept at a real size rather than display:none so d3 can lay the
      // local graph out without dividing by a zero-width container.
      //
      // The wiring lives in weirwood-chrome, which renders on every page but
      // this one and whose script therefore ships site-wide. Attaching a second
      // handler here would open and shut the overlay inside a single press.
      usesOverlay
        ? h(
            "div",
            { class: "ww-graph-host", "aria-hidden": "true" },
            h(GraphComponent, { fileData, allFiles, cfg, ...rest }),
          )
        : null,
    ])
  }

  Landing.css = landingStyles
  return Landing
}
