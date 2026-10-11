export { WeirwoodLost } from "./components/index.js"

const defaultOptions = {
  // What the browser tab says. Quartz's own answer is the i18n string
  // "Not Found", which is the only page on the site whose tab is an error
  // message rather than a name.
  tabTitle: "No such root",
}

/** Never rendered. A page type must hand back a body, and this one has no page. */
const Nothing = () => null

/**
 * A page type that owns no page.
 *
 * The 404's <title> comes from the virtual page's frontmatter, which Quartz's
 * own NotFoundPageType fills with `i18n(cfg.locale).pages.error.title`. That
 * page type is appended by the config loader and cannot be replaced (see
 * frames.js), the head is not a slot any layout or frame can reach, and the
 * only knob in quartz.config.yaml — `pageTitleSuffix` — would append to all 23
 * pages to rename one.
 *
 * `treeTransforms` is the way in. The dispatcher collects them from EVERY page
 * type, not only the one rendering, and renderPage runs them against the live
 * `componentData` immediately before it renders <Head>. So a page type that
 * matches nothing and generates nothing still gets one hook on every page, and
 * on the 404 it rewrites the frontmatter the head is about to read.
 *
 * `match` returns false always, so nothing here can ever claim a real file, and
 * there is deliberately no `generate` — a second page type emitting slug "404"
 * would write 404.html twice and leave the last write standing.
 *
 * The alternative was a one-line LOCAL MODIFICATION to quartz/i18n or to
 * quartz/plugins/pageTypes/404.ts. This keeps Head.tsx the only core file an
 * upgrade can quietly undo.
 */
export const plugin = (userOpts) => {
  const opts = { ...defaultOptions, ...(userOpts ?? {}) }

  return {
    name: "WeirwoodNotFoundTitle",
    priority: -100,
    match: () => false,
    layout: "404",
    body: () => Nothing,
    treeTransforms: () => [
      (_root, slug, componentData) => {
        if (slug !== "404") return
        const frontmatter = componentData.fileData?.frontmatter
        if (!frontmatter) return
        frontmatter.title = opts.tabTitle
        // The same string the notice on the page carries. It is what a search
        // engine, a chat client or a link preview quotes, and Quartz's default
        // has it quoting "Not Found" twice over.
        if (opts.body) frontmatter.description = opts.body
      },
    ],
  }
}
