import { h } from "preact"
import { getAllSegmentPrefixes, resolveRelative } from "@quartz-community/utils/path"
import { htmlToJsx } from "@quartz-community/utils/jsx"
// Shared with the bar, the section index and the article furniture — see the
// note on the same hop in weirwood-article: Node resolves a symlinked module
// against its real path, so this lands in plugins/weirwood-chrome. Keep the
// two directories siblings.
import { Emblem, TagMark } from "../../weirwood-chrome/components/emblems.js"
import { discoverSections, sectionOf } from "../../weirwood-chrome/components/sections.js"
import { tagStyles } from "./styles.js"

const defaultOptions = {
  // Above the tag's name, in 10px mono caps: what kind of page this is. The
  // title is a bare word, so something has to say what the word is doing here,
  // and it cannot be the count line below. Alternatives are in
  // quartz.config.yaml.
  kicker: "A thread through the archive",
  // The same line on /tags, where the title is not one tag but all of them.
  indexKicker: "Every thread in the archive",
  // The hero's title on /tags. The frontmatter title of content/tags/index.md
  // wins over it when that file sets one.
  indexTitle: "All tags",
  // Pages at the repo root belong to no section. Only the colophon is one
  // today, and it carries no tags — but a tagged page could be moved to the
  // root, and it should not vanish from its own tag page.
  unsortedLabel: "Unsorted",
}

const isListed = (file) => file?.unlisted !== true

/** Every tag a page carries, with `a/b` also counting as `a`. */
const tagsOf = (file) => (file?.frontmatter?.tags ?? []).flatMap(getAllSegmentPrefixes)

const titleOf = (file) => file?.frontmatter?.title ?? file?.slug

const pages = (n) => `${n} ${n === 1 ? "page" : "pages"}`

/** "across 5 sections", but "in 1 section" — the preposition changes with the count. */
const sections = (n) => (n === 1 ? "in 1 section" : `across ${n} sections`)

/** The same turn for the index's own count line, which counts pages instead. */
const acrossPages = (n) => (n === 1 ? "in 1 page" : `across ${n} pages`)

const sectionKey = (slug) => sectionOf(slug) ?? ""

/**
 * The tagged pages, split by the section each one lives in and handed back in
 * the site's canonical section order.
 *
 * Canonical here means what the roots tiles and the front door's count boxes
 * already use: discoverSections, alphabetically. Not by count and not by the
 * order the pages happen to arrive in — a tag page should be laid out the same
 * way whichever tag it is, so a reader who knows where Houses sits on one tag
 * page finds it in the same place on the next.
 */
const groupBySection = (allFiles, tagged, unsortedLabel) => {
  const groups = new Map()
  for (const file of tagged) {
    const key = sectionKey(file.slug)
    const group = groups.get(key)
    if (group) group.push(file)
    else groups.set(key, [file])
  }

  const known = discoverSections(allFiles)
  const order = []
  for (const section of known) {
    if (groups.has(section.segment)) order.push({ segment: section.segment, label: section.title })
  }
  // A section discoverSections does not know about — every article in it is
  // unlisted, say — still has to render rather than dropping its pages.
  for (const key of [...groups.keys()].sort()) {
    if (key === "" || order.some((entry) => entry.segment === key)) continue
    order.push({ segment: key, label: key })
  }
  // The rootless pages close the list, under a heading that says so.
  if (groups.has("")) order.push({ segment: "", label: unsortedLabel })

  return order.map((entry) => ({
    ...entry,
    entries: groups
      .get(entry.segment)
      .sort((a, b) => String(titleOf(a)).localeCompare(String(titleOf(b)))),
  }))
}

export const WeirwoodTags = (userOpts) => {
  const opts = { ...defaultOptions, ...(userOpts ?? {}) }

  const hero = ({ kicker, title, count, description }) =>
    h("section", { class: "ww-section-hero" }, [
      h(TagMark, { size: 230, class: "ww-tag-mark" }),
      h("div", { class: "ww-band-inner ww-section-hero-inner" }, [
        kicker ? h("div", { class: "ww-tag-kicker" }, kicker) : null,
        h("h1", { class: "ww-tag-title" }, title),
        h("div", { class: "ww-section-rule", "aria-hidden": "true" }),
        description ? h("div", { class: "ww-section-desc ww-tag-desc" }, description) : null,
        h("div", { class: "ww-section-count" }, count),
      ]),
    ])

  const Tags = ({ fileData, allFiles, tree }) => {
    const slug = fileData.slug
    const listed = (allFiles ?? []).filter(isListed)
    const isIndex = slug === "tags" || slug === "tags/index"

    if (isIndex) {
      // Every tag in the archive, each one a card carrying what it holds. The
      // index note's own prose heads the page when it has any, exactly as a
      // section index uses its index.md.
      const counts = new Map()
      const tagged = new Set()
      for (const file of listed) {
        const own = new Set(tagsOf(file))
        if (own.size > 0) tagged.add(file.slug)
        for (const tag of own) {
          const entry = counts.get(tag) ?? { pages: 0, sections: new Set() }
          entry.pages += 1
          entry.sections.add(sectionKey(file.slug))
          counts.set(tag, entry)
        }
      }

      const all = [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]))
      const hasProse = (tree?.children?.length ?? 0) > 0

      return h("div", { class: "ww-tags popover-hint" }, [
        hero({
          kicker: opts.indexKicker,
          title: fileData.frontmatter?.title ?? opts.indexTitle,
          description: hasProse ? htmlToJsx(tree) : fileData.description,
          count: `${all.length} ${all.length === 1 ? "tag" : "tags"} · ${acrossPages(tagged.size)}`,
        }),
        h(
          "div",
          { class: "ww-band-inner ww-entries ww-tag-cards" },
          all.map(([tag, entry]) =>
            h("a", { class: "ww-entry ww-tag-card", href: resolveRelative(slug, `tags/${tag}`) }, [
              h("h2", { class: "ww-entry-title" }, tag),
              h(
                "p",
                { class: "ww-tag-card-count" },
                `${pages(entry.pages)} · ${sections(entry.sections.size)}`,
              ),
            ]),
          ),
        ),
      ])
    }

    const tag = slug.slice("tags/".length)
    const tagged = listed.filter((file) => tagsOf(file).includes(tag))
    const groups = groupBySection(allFiles, tagged, opts.unsortedLabel)

    const body = h(
      "div",
      { class: "ww-band-inner ww-tag-groups" },
      groups.map((group) =>
        h("section", { class: "ww-tag-group" }, [
          h("div", { class: "ww-tag-group-head" }, [
            // An unknown section — including the rootless group — falls back to
            // the weirwood leaf, the same mark a folder with no emblem takes.
            h(Emblem, {
              section: group.segment,
              size: 16,
              strokeWidth: 1.8,
              class: "ww-tag-group-emblem",
            }),
            h("div", { class: "ww-tag-group-label" }, group.label),
            h("div", { class: "ww-tag-group-rule", "aria-hidden": "true" }),
          ]),
          h(
            "div",
            { class: "ww-tag-entries" },
            // No chips on these cards: every one of them carries the tag
            // being read, and the section index already shows an entry's
            // tags. Repeating them here is noise with nowhere new to go.
            group.entries.map((file) =>
              h("a", { class: "ww-entry", href: resolveRelative(slug, file.slug) }, [
                h("h2", { class: "ww-entry-title" }, titleOf(file)),
                file.description ? h("p", { class: "ww-entry-desc" }, file.description) : null,
              ]),
            ),
          ),
        ]),
      ),
    )

    return h("div", { class: "ww-tags popover-hint" }, [
      hero({
        kicker: opts.kicker,
        title: tag,
        count: `${pages(tagged.length)} · ${sections(groups.length)}`,
      }),
      body,
    ])
  }

  Tags.css = tagStyles
  return Tags
}
