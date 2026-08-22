import { h } from "preact"
import { readFileSync } from "fs"
import { join } from "path"

// The bar is one sentence with the Quartz credit set into the middle of it:
// `blessing` runs up to the link, `coda` picks up after it. No copyright and no
// year — the notice that the MIT licence actually asks for lives in LICENSE.txt.
const defaultOptions = {
  // Stands in for the stock plugin's "Created with". Keep it short: the bar is
  // 10px mono, uppercase and letterspaced, and a long line wraps to two rows on
  // a phone. Alternatives are listed in quartz.config.yaml.
  blessing: "Warded by the Old Gods, raised with",
  // Trails the link, full stop included — the sentence ends here. "" ends the
  // line at the version instead.
  coda: "blessing.",
  // Same shape as the stock footer's option: label → URL.
  links: {},
}

// The version of the local Quartz, read the way the stock footer reads it: from
// the site's own package.json at build time. Empty string if anything goes
// wrong, which renders a bare "Quartz" rather than breaking the build.
const quartzVersion = () => {
  try {
    const pkg = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf-8"))
    return pkg.version ?? ""
  } catch {
    return ""
  }
}

export const WeirwoodFooter = (userOpts) => {
  const opts = { ...defaultOptions, ...(userOpts ?? {}) }
  const version = quartzVersion()

  const Footer = ({ displayClass }) => {
    const links = Object.entries(opts.links ?? {})

    return h("footer", { class: `ww-footer ${displayClass ?? ""}` }, [
      h("p", {}, [
        `${opts.blessing} `,
        h("a", { href: "https://quartz.jzhao.xyz/" }, `Quartz${version ? ` v${version}` : ""}`),
        opts.coda ? ` ${opts.coda}` : null,
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
