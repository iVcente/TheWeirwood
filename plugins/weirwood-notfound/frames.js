import { Fragment, h } from "preact"

/**
 * The 404 frame: the bar, the notice, the closing bar. No page body.
 *
 * Quartz's 404 is not a page type this site can own. Every other page type here
 * is registered by a local plugin and generates its own virtual pages, because
 * a virtual page is emitted with the body of whichever page type GENERATED it
 * — but the builtin NotFoundPageType is appended by the config loader itself
 * (quartz/plugins/loader/config-loader.ts), not listed in quartz.config.yaml,
 * so there is no entry to disable. A second page type generating slug "404"
 * would simply emit 404.html twice and leave the last write standing.
 *
 * So the page type stays Quartz's and the FRAME is replaced instead. A frame
 * decides what goes inside <div id="quartz-root">, and this one renders the
 * header and beforeBody slots and then stops: `pageBody` — Quartz's NotFound
 * component, with its "404 / Either this page is private or doesn't exist /
 * Return to Homepage" — is never called. The one thing in that body worth
 * keeping, the case-insensitive redirect, is carried by weirwood-lost instead.
 *
 * Everything else is FullWidthFrame's structure verbatim, down to the class
 * names: `.page-header > header` is what custom.scss dresses as the top bar,
 * and `.popover-hint` is what a link preview collects. What is dropped from it
 * is the body, the <hr/> the site hides everywhere anyway, and the empty
 * `.page-footer` slot.
 */
export const NotFoundFrame = {
  name: "notfound",
  // Inlined into <body> on the pages this frame renders, and nowhere else.
  //
  // It is here because the grid that makes a band run edge to edge is keyed to
  // the FRAME NAME: base.scss gives `.page[data-frame="full-width"]` a single
  // auto column, and every other page on this site is that frame. A new name
  // misses those rules and falls back to the stock three-column grid, where
  // `.center` is auto-placed into the 320px left-sidebar column and the page
  // arrives in a gutter. Nothing errors; it just lands wrong, and only on the
  // one page nobody visits on purpose.
  //
  // Longhands only, deliberately: `grid-template-rows` is set by custom.scss
  // ("1fr auto auto", which is what puts the closing bar on the bottom edge of
  // the screen), this block wins over that file on source order, and the
  // `grid-template` SHORTHAND would silently reset the rows it does not name.
  css: `
.page[data-frame="notfound"] > #quartz-body {
  grid-template-columns: auto;
  grid-template-areas:
    "grid-header"
    "grid-center"
    "grid-footer";
}

.page[data-frame="notfound"] > #quartz-body .center.full-width {
  max-width: none;
  min-width: 100%;
  padding: 0;
}
`,
  render({ componentData, header, beforeBody, footer }) {
    return h(Fragment, null, [
      h("div", { class: "center full-width" }, [
        h("div", { class: "page-header" }, [
          // Quartz's own Header component renders nothing when the slot is
          // empty; matched here so a config that clears the bar leaves no bare
          // <header> behind.
          header.length
            ? h(
                "header",
                {},
                header.map((HeaderComponent) => h(HeaderComponent, componentData)),
              )
            : null,
          h(
            "div",
            { class: "popover-hint" },
            beforeBody.map((BodyComponent) => h(BodyComponent, componentData)),
          ),
        ]),
      ]),
      footer.map((FooterComponent) => h(FooterComponent, componentData)),
    ])
  },
}
