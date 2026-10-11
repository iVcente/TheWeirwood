import { h } from "preact"
import { joinSegments } from "@quartz-community/utils/path"
import { lostStyles } from "./styles.js"

const defaultOptions = {
  // The mono line above the title, uppercased by the type. It is the only place
  // the number itself is printed: the sentence below says what happened, and a
  // 34px "404" would say it twice.
  kicker: "404 · no such root",
  // The whole page in one line. Alternatives are in quartz.config.yaml.
  title: "The trees do not remember this page.",
  // Both ways a page can be missing — never written, or taken down — and then
  // the reassurance, which is what the one button below acts on.
  body: "Either it was never planted, or it has been cut down. The rest of the wood still stands.",
  homeLabel: "Back to the heart tree",
}

/**
 * Quartz's own NotFound body carries this and nothing else worth keeping: the
 * site is built on a case-sensitive filesystem in CI, so /Characters 404s where
 * /characters does not. It reads the search index the browser already has and
 * redirects when the lowercased path is a real page.
 *
 * Ported verbatim because the frame this plugin ships drops that body entirely.
 * If Quartz ever changes the rule, this copy will not know — it is behaviour,
 * though, not markup, so a stale copy still only ever redirects to a page that
 * exists.
 */
const caseRedirect = `
if (typeof fetchData !== "undefined") {
  fetchData.then(function(index) {
    var basePath = document.body.dataset.basepath || "";
    if (basePath.length > 1 && basePath.endsWith("/")) {
      basePath = basePath.slice(0, -1);
    }
    var pathname = window.location.pathname;
    var hasBasePrefix = basePath.length > 1 && pathname.startsWith(basePath);
    if (hasBasePrefix) {
      pathname = pathname.slice(basePath.length);
    }
    if (pathname.startsWith("/")) {
      pathname = pathname.slice(1);
    }
    if (pathname.endsWith("/")) {
      pathname = pathname.slice(0, -1);
    }
    if (pathname.endsWith(".html")) {
      pathname = pathname.slice(0, -5);
    }
    if (pathname.endsWith("/index")) {
      pathname = pathname.slice(0, -6);
    }
    var lowered = pathname.toLowerCase();
    if (lowered !== pathname && index[lowered] != null) {
      var prefix = hasBasePrefix ? basePath : "";
      var target = prefix + (prefix.endsWith("/") ? "" : "/") + lowered;
      window.location.replace(target);
    }
  });
}
`

export const WeirwoodLost = (userOpts) => {
  const opts = { ...defaultOptions, ...(userOpts ?? {}) }

  const Lost = ({ fileData, cfg, ctx }) => {
    // Placed in beforeBody like the landing and the article furniture, and
    // guarded the same way. The 404 page type clears nothing else out of that
    // slot, so this guard is what keeps the tree off every other page.
    if (fileData.slug !== "404") return null

    // Root-relative, NOT page-relative. This one page is served at whatever
    // path failed, so "./index" from a slug of "404" would resolve against
    // /a/deep/path/ and lead nowhere. Quartz's own NotFound body computes the
    // way home exactly like this, and the dev server strips the base path
    // itself, which is why serve mode is plain "/".
    const home = ctx?.argv?.serve
      ? "/"
      : new URL(`https://${cfg.baseUrl ?? "example.com"}`).pathname

    return h("section", { class: "ww-lost" }, [
      h("div", { class: "ww-band-inner ww-lost-inner" }, [
        // The heart tree itself: the same drawing the front door stands in its
        // hero and the browser tab carries, loaded through an img exactly as
        // the landing loads it. One copy of the artwork, and one baked fill to
        // keep in step with the palette by hand -- inlining the path here would
        // have made a second of each. See the note inside the file.
        //
        // Root-relative, unlike the landing's "./static/...", for the same
        // reason the two links on this page are.
        h("img", {
          class: "ww-lost-tree",
          src: joinSegments(home, "static/weirwood.svg"),
          alt: "",
          "aria-hidden": "true",
          loading: "eager",
          decoding: "async",
        }),
        h("div", { class: "ww-lost-kicker" }, opts.kicker),
        h("h1", { class: "ww-lost-title" }, opts.title),
        h("div", { class: "ww-lost-rule", "aria-hidden": "true" }),
        h("p", { class: "ww-lost-body" }, opts.body),
        h("a", { class: "ww-lost-cta", href: home }, opts.homeLabel),
      ]),
      h("script", { dangerouslySetInnerHTML: { __html: caseRedirect } }),
    ])
  }

  Lost.css = lostStyles
  return Lost
}
