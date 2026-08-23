import { h } from "preact"

// The bar is one sentence with a link set into the middle of it: `blessing`
// runs up to the link, `coda` picks up after it. No copyright and no year — the
// notice the MIT licence actually asks for lives in LICENSE.txt.
//
// The link used to be a hardcoded credit to Quartz. It now points at the
// colophon, which pays that courtesy in full and, more importantly, carries the
// CC BY attribution the heart tree's licence requires. That makes this sentence
// the only route to the notice from an ordinary page — see README.md.
const defaultOptions = {
  // Stands in for the stock plugin's "Created with". Keep the whole line short:
  // the bar is 10px mono, uppercase and letterspaced, and a long sentence wraps
  // to two rows on a phone. Alternatives are listed in quartz.config.yaml.
  blessing: "Warded by the Old Gods, raised by",
  // The words that carry the link, and where it goes. An empty `linkHref`
  // renders the label as plain text, which keeps the sentence intact if the
  // destination is ever dropped.
  linkLabel: "many hands",
  linkHref: "/colophon",
  // Trails the link and closes the sentence.
  coda: ".",
  // Same shape as the stock footer's option: label → URL. Rendered as a list
  // after the sentence; empty here, since the colophon is in the sentence
  // itself.
  links: {},
}

export const WeirwoodFooter = (userOpts) => {
  const opts = { ...defaultOptions, ...(userOpts ?? {}) }

  const Footer = ({ displayClass }) => {
    const links = Object.entries(opts.links ?? {})

    // Punctuation closes up against the link; a word gets a space in front of
    // it. Doing this here rather than asking the config for a leading space
    // keeps significant trailing whitespace out of quartz.config.yaml, where a
    // formatter would strip it and silently glue two words together.
    const coda = opts.coda ? (/^[.,;:!?]/.test(opts.coda) ? opts.coda : ` ${opts.coda}`) : null

    return h("footer", { class: `ww-footer ${displayClass ?? ""}` }, [
      h("p", {}, [
        `${opts.blessing} `,
        opts.linkHref ? h("a", { href: opts.linkHref }, opts.linkLabel) : opts.linkLabel,
        coda,
      ]),
      links.length
        ? h(
            "ul",
            {},
            links.map(([text, link]) => h("li", {}, h("a", { href: link }, text))),
          )
        : null,
    ])
  }

  return Footer
}
