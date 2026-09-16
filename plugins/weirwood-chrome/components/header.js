import { h } from "preact"
import { resolveRelative } from "@quartz-community/utils/path"
import { Graph } from "@quartz-community/graph"
import { Emblem, GreensightMark, TreeMark } from "./emblems.js"
import { sectionOf, sectionTitle } from "./sections.js"
import { graphOptions } from "./graph-config.js"
import { chromeStyles } from "./styles.js"
import { chromeScript } from "./script.js"

const defaultOptions = {
  // Announced to screen readers; the button itself is icon-only, like search.
  greensightLabel: "Greensight",
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

  const Header = ({ fileData, allFiles, cfg, ...rest }) => {
    const slug = fileData.slug
    // The front door states its own name in the wordmark and keeps only the
    // search button, resting over the canopy. It is also excluded in
    // quartz.config.yaml; this guard is what makes that exclusion belt-and-
    // braces rather than the only thing standing between the bar and the hero.
    if (slug === "index") return null

    const section = sectionOf(slug)
    const label = sectionTitle(allFiles, section)

    return h("div", { class: "ww-head" }, [
      h("div", { class: "ww-head-left" }, [
        h("a", { class: "ww-head-brand", href: resolveRelative(slug, "index") }, [
          h(TreeMark, { size: 26, class: "ww-head-tree" }),
          h("span", { class: "ww-head-wordmark" }, cfg.pageTitle),
        ]),
        section && h("span", { class: "ww-head-divider", "aria-hidden": "true" }),
        section &&
          h("a", { class: "ww-head-section", href: resolveRelative(slug, section) }, [
            h(Emblem, { section, size: 17, strokeWidth: 1.8, class: "ww-head-emblem" }),
            h("span", {}, label),
          ]),
      ]),
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
      h(
        "div",
        { class: "ww-graph-host", "aria-hidden": "true" },
        h(slug.endsWith("/index") ? Graphs.overview : Graphs.neighbourhood, {
          fileData,
          allFiles,
          cfg,
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
