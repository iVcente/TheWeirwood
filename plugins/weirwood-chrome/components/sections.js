// ---------------------------------------------------------------------------
// Sections are discovered from the content tree, never listed. Every top-level
// folder holding at least one article is a section; add a folder and it appears
// in the bar and in the roots tiles on its own.
//
// This is deliberately the same rule the landing's count boxes use, so the ten
// tiles at the foot of a folder page and the ten cells on the front door can
// never disagree about what the site contains.
// ---------------------------------------------------------------------------

/** Pages a reader can land on — excludes the index, folder indexes and tag pages. */
export const isArticle = (file) => {
  const slug = file?.slug
  if (!slug || file.unlisted === true) return false
  if (slug === "index" || slug.endsWith("/index")) return false
  return !(slug === "tags" || slug.startsWith("tags/"))
}

export const prettify = (segment) =>
  String(segment ?? "")
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

/** The top-level folder a slug belongs to, or null for a page at the root. */
export const sectionOf = (slug) => {
  if (!slug || !slug.includes("/")) return null
  const segment = slug.split("/")[0]
  if (!segment || segment === "tags") return null
  return segment
}

/**
 * Every section, alphabetically, with its label and article count.
 *
 * A section's label comes from its own index note's title when one was chosen
 * deliberately (content/houses/index.md). The folder-page plugin auto-fills a
 * missing title with the directory name, so a title that merely restates the
 * directory is ignored in favour of the prettified name — otherwise a folder
 * called `houses` would be labelled "houses" rather than "Houses".
 */
export const discoverSections = (allFiles) => {
  const counts = new Map()
  const titles = new Map()

  for (const file of allFiles ?? []) {
    const slug = file?.slug
    const segment = sectionOf(slug)
    if (!segment) continue

    if (slug === `${segment}/index`) {
      const declared = file.frontmatter?.title
      if (declared && declared.toLowerCase() !== segment.replace(/-/g, " ").toLowerCase()) {
        titles.set(segment, declared)
      }
      continue
    }
    if (!isArticle(file)) continue
    counts.set(segment, (counts.get(segment) ?? 0) + 1)
  }

  return [...counts.entries()]
    .map(([segment, count]) => ({
      segment,
      count,
      title: titles.get(segment) ?? prettify(segment),
    }))
    .sort((a, b) => a.segment.localeCompare(b.segment))
}

/**
 * The label for one section, without walking the whole tree twice. Falls back
 * to the prettified folder name, which is what the convention in CLAUDE.md
 * makes correct in every ordinary case.
 */
export const sectionTitle = (allFiles, segment) => {
  if (!segment) return null
  const index = (allFiles ?? []).find((file) => file?.slug === `${segment}/index`)
  const declared = index?.frontmatter?.title
  if (declared && declared.toLowerCase() !== segment.replace(/-/g, " ").toLowerCase()) {
    return declared
  }
  return prettify(segment)
}
