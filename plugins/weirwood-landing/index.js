import { ContentBody } from "@quartz-community/content-page"

export { WeirwoodLanding } from "./components/index.js"

/**
 * A page type exists purely to give the index its own layout. `frame` is a
 * layout property, not frontmatter — the only ways to set it are a page type
 * declaration (this) or a `byPageType` override, and the override for `content`
 * already applies to every article.
 *
 * Priority beats content-page (0), so this wins for the index; the body is
 * content-page's own, so Markdown below the hero renders exactly as elsewhere.
 */
export const plugin = () => ({
  name: "WeirwoodLandingPage",
  priority: 10,
  match: ({ slug }) => slug === "index",
  layout: "landing",
  frame: "full-width",
  body: ContentBody,
})
