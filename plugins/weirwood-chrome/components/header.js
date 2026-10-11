import { h } from "preact"
import { resolveRelative } from "@quartz-community/utils/path"
import { Graph } from "@quartz-community/graph"
import { Emblem, FaceMark, GreensightMark, TagMark } from "./emblems.js"
import { sectionOf, sectionTitle } from "./sections.js"
import { graphOptions } from "./graph-config.js"
import { chromeStyles } from "./styles.js"
import { chromeScript } from "./script.js"

const defaultOptions = {
  // Announced to screen readers; the button itself is icon-only, like search.
  greensightLabel: "Greensight",
  // What the bar's context slot says on a tag page. A tag belongs to no
  // section, so the slot names the kind of page rather than a place in the
  // tree — and deliberately NOT the tag itself, which the title below states.
  //
  // "Thread" is what a tag is called in the site's own voice; the frontmatter
  // key, the URL and every ww-tag-* class still say tag. See the note in
  // weirwood-tags.
  tagLabel: "Thread",
}

export const WeirwoodHeader = (userOpts) => {
  const opts = { ...defaultOptions, ...(userOpts ?? {}) }
  // Composed rather than placed in a layout slot. A registered component still
  // has its CSS and its d3 script emitted — componentResources collects from
  // the registry, not from the layout — so this is Quartz's real interactive
  // graph, parked off-screen where the greensight buttons can open it. Every
  // [data-greensight] control on the page reaches for the icon inside it.
  //
  // One instance per shape rather than one for the site: there is a single
  // overlay per page, configured by the data-cfg the component serialises, so
  // this is the only place a section index and an entry can be told to open the
  // greensight differently. See graph-config.js.
  const Graphs = {
    overview: Graph(graphOptions("overview")),
    neighbourhood: Graph(graphOptions("neighbourhood")),
  }

  const Header = ({ fileData, allFiles, cfg, ctx, ...rest }) => {
    const slug = fileData.slug
    // The front door states its own name in the wordmark and keeps only the
    // search button, resting over the canopy. It is also excluded in
    // quartz.config.yaml; this guard is what makes that exclusion belt-and-
    // braces rather than the only thing standing between the bar and the hero.
    if (slug === "index") return null

    const section = sectionOf(slug)
    const label = sectionTitle(allFiles, section)
    const greensight = fileData.frontmatter?.greensight !== false

    // A tag page has no section — sectionOf declines every tags/ slug — so the
    // slot carries the tag mark and the word instead. On the tag index itself
    // it is a plain span rather than a link back to the page being read, the
    // same treatment the current section takes in a roots tile.
    const isTag = slug === "tags" || slug.startsWith("tags/")
    const isTagIndex = slug === "tags" || slug === "tags/index"
    const tagSlot = isTag
      ? h(
          isTagIndex ? "span" : "a",
          isTagIndex
            ? { class: "ww-head-section", "aria-current": "page" }
            : { class: "ww-head-section", href: resolveRelative(slug, "tags/index") },
          [h(TagMark, { size: 16, class: "ww-head-emblem" }), h("span", {}, opts.tagLabel)],
        )
      : null

    // Page-relative everywhere but the 404, which is the one page served at a
    // URL that is not its own: the host hands 404.html back for whatever path
    // failed, so "./index" would resolve against /a/deep/path/ and lead
    // nowhere. Root-relative is what Quartz's own NotFound body uses, and the
    // dev server strips the base path itself, which is why serve mode is "/".
    const home =
      slug === "404"
        ? (ctx?.argv?.serve ? "/" : new URL(`https://${cfg.baseUrl ?? "example.com"}`).pathname)
        : resolveRelative(slug, "index")

    return h("div", { class: "ww-head" }, [
      h("div", { class: "ww-head-left" }, [
        h("a", { class: "ww-head-brand", href: home }, [
          h(FaceMark, { size: 26, class: "ww-head-mark" }),
          h("span", { class: "ww-head-wordmark" }, cfg.pageTitle),
        ]),
        (section || tagSlot) && h("span", { class: "ww-head-divider", "aria-hidden": "true" }),
        section
          ? h("a", { class: "ww-head-section", href: resolveRelative(slug, section) }, [
              h(Emblem, { section, size: 17, strokeWidth: 1.8, class: "ww-head-emblem" }),
              h("span", {}, label),
            ])
          : tagSlot,
      ]),
      // `greensight: false` in the frontmatter drops the button — and, below,
      // the graph it would open. For a page that is not a node in the graph,
      // the overlay opens on a neighbourhood with nothing at its centre. The
      // same key takes the roots band off the body, in weirwood-article.
      greensight &&
        h(
          "button",
          {
            type: "button",
            class: "ww-icon-button",
            "data-greensight": "",
            "aria-label": opts.greensightLabel,
          },
          h(GreensightMark, { size: 18 }),
        ),
      // Off-screen host for the real graph. Kept at a real size rather than
      // display:none so d3 can lay it out without dividing by a zero-width
      // container.
      //
      // A section index opens the whole archive, which is what its roots strip
      // promises; an entry opens its own neighbourhood, which is what the band
      // above the prose asks about. The bar's button opens whichever the page
      // it sits on would.
      //
      // The 404 takes the overview for the same reason a section index does,
      // arrived at from the other end: it is not a node in the graph at all, so
      // a neighbourhood of it is an empty well. The whole wood is also the more
      // useful thing to hand someone who has just landed nowhere.
      greensight &&
        h(
          "div",
          { class: "ww-graph-host", "aria-hidden": "true" },
          h(slug.endsWith("/index") || slug === "404" ? Graphs.overview : Graphs.neighbourhood, {
            fileData,
            allFiles,
            cfg,
            ctx,
            ...rest,
          }),
        ),
    ])
  }

  // Both resources ship from this component because it is the one that renders
  // on every page but the front door. Component resources are emitted site-wide
  // regardless, so the stylesheet also dresses the folder and article bodies.
  Header.css = chromeStyles
  Header.afterDOMLoaded = chromeScript
  return Header
}
