# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npx quartz build --serve   # dev server + hot reload at http://localhost:8080
npx quartz build           # one-off production build → public/
git push                   # triggers the GitHub Action that builds + deploys
```

## Architecture

**The Weirwood** — a personal, story-focused _A Song of Ice and Fire_ / _Fire & Blood_
lore archive, built as a Quartz static site deployed to GitHub Pages. No database; Markdown files are the source
of truth and frontmatter is the metadata store.

### Content pipeline

All content lives in Markdown under `/content/`. Quartz parses frontmatter and
`[[wikilinks]]` at build time and emits static HTML with graph view, backlinks, and
full-text search. **To add an article, create a `.md` file in the right subfolder — no
code changes needed.**

```
content/
├─ index.md            # landing page
├─ colophon.md         # attribution; the footer link must keep reaching it
├─ characters/         # people
├─ houses/             # lineages
├─ places/             # castles, cities, regions
├─ events/             # wars, uprisings, councils
├─ beasts/             # dragons and every other named creature
├─ orders/             # bodies under a rule or office
├─ relics/             # made things: thrones, blades, crowns
├─ faiths/             # what is believed
├─ mysteries/          # magic, prophecy, the unweighable
├─ customs/            # rites, laws, observances
└─ attachments/        # images (optimized to WebP)
```

Each folder carries an `index.md` whose prose heads its folder page. Folder name,
`type:` value and the landing count-box label are deliberately **the same word** —
one thing to change, and nothing to remember about where the label comes from. The
label falls out of the directory name automatically, because `weirwood-landing`
ignores an index title that merely restates it.

Two boundaries that come up on nearly every article:

- **Faiths vs Orders.** A faith is what is believed; an order is a body of people
  under a rule or an office. The Faith of the Seven is a faith, the Warrior's Sons
  are an order. Something that is both — the Faceless Men — files as an order and
  links to the faith.
- **Events vs Customs.** A named occasion is an event; the institution behind it is
  a custom. Maegor's trial in 42 AC is part of an event; trial by seven is a custom.

Folders are cheap to change: `markdownLinkResolution: shortest` means moving a file
between them never breaks a `[[wikilink]]`. Prefer moving an article to inventing a
folder for it — a new folder should not be born until it has about three articles.

### Frontmatter fields

```yaml
---
title: "..." # the one name for this page; wikilinks must use it verbatim
type: character # one per folder: character | house | place | event | beast
#              | order | relic | faith | mystery | custom
words: "..." # optional motto, set in italic under the title (house words)
house: "..." # optional; omit if N/A
seat: "..." # optional
region: "..." # optional
tags: ["..."] # cross-cutting views; drawn as chips under the title
era: "..." # in-world period; use this for ASOIAF dates too (e.g. "48 AC")
book: "Fire & Blood" # source work
status: stub # stub | draft | complete
description: "..." # optional; otherwise derived from the opening sentence
facts: # optional open map: one more box per key, in this order
  bearers: "..."
---
```

The frontmatter **is** the article's metadata boxes. `weirwood-article` renders
one box per key it finds, from a named list (`type`, `house`, `era`, `book`,
`seat`, `region`, `founded`) and then from `facts:`, in that order — so the
number and the kind of boxes vary per entry and an absent key simply has no box.
Adding a box means adding a frontmatter key, not editing a component.

Two keys do not become boxes. `tags:` is the chip row under the title, and
`status: stub` (or `stub: true`) raises a **stub badge** at the end of that row
— which is why `status` is deliberately absent from the box list.

A third, `greensight: false`, is not metadata at all: it takes the greensight
off a page that is not in the graph to begin with — both the bar's button and
the "roots of this page" band, which would otherwise open the overlay on a
neighbourhood with no node at its centre. `/colophon` is the only page that
carries it, and `unlisted: true` is the reason. Note that `unlisted` alone
cannot stand in for it: every section `index.md` is unlisted too, and those
pages keep their greensight because the overview graph they open is the whole
archive, not themselves.

**There are no dates anywhere on the site.** `created-modified-date` stays
enabled because other plugins read it, but nothing renders it: no date line, no
dated folder listing, no "last modified".

### Linking conventions

- Link any entity inline with a wikilink: `[[Balerion]]`.
- Change the words on the page without changing the target: `[[Balerion|the Black
Dread]]`. The left side is always the article's exact title; the right side is
  whatever the sentence needs.
- A wikilink to a not-yet-written page becomes a **placeholder** (good for planning).
- **There is no `aliases:` field, deliberately.** It bought one thing here — a short
  redirect URL — and cost two. Aliases are absent from `contentIndex.json`
  (`content, filePath, links, slug, tags, title`), so they never fed search; and a
  wikilink written by alias resolves to the redirect stub's slug, which is not an
  indexed page, so the graph drops the edge and the backlink with it. The link still
  renders and still clicks through, which is what makes it dangerous: the page looks
  correctly wired and quietly is not, on a site whose whole design is the graph. The
  `[[Title|display text]]` form gives the same words with the edge intact.
  `@quartz-community/alias-redirects` stays enabled — with no aliases it emits
  nothing, and it also handles case-preserving redirects on the case-sensitive
  filesystem the CI builds run on.
- The **graph** is the network of wikilinks; **backlinks** are that same data shown as a
  "mentioned in" list on each page. Nothing to hand-maintain — just link as you write.
- Prefer many small linked articles over few large ones.

### Authoring

Written in VSCode + the Foam extension (open source). New articles start from templates
in `.foam/templates/` (`character.md`, `event.md`). Foam's `[[...]]` syntax matches
Quartz's, so the local graph/backlinks and the published site stay in sync.

### Page structure

Three page types, and each one runs the same way: **bands run edge to edge and
paint their own background; only what is inside them is measured.** That is why
`.center.full-width` is deliberately _not_ capped in `custom.scss` — capping the
column is what would strand a band's background in mid-air on a wide screen. The
measure lives on `.ww-band-inner` (via `--ww-band` / `--ww-band-pad`) and on the
prose.

There are two measures. `--ww-band: 1120px` is the chrome column — the top bar,
the section hero, the entry grid, the roots strips. `--ww-measure: 780px` is the
reading column, about 68ch; `weirwood-article` re-points `--ww-band` at it so an
entry's boxes and its roots band line up with the paragraph beneath them.

- **The bar** (every page but the front door): carved face, wordmark, then the
  section being read. **No breadcrumbs anywhere** — the bar states the section,
  the page states the page. Two 32px icon buttons on the right: greensight, then
  search.
- **A section index** (`content/<folder>/index.md`): hero with the section's
  emblem behind the title and the index note's own prose as the description,
  then a card per entry, then the "roots of the tree" strip — one greensight
  panel and a tile for every section, the current one marked and not a link.
- **An entry**: title block over the section emblem, the frontmatter boxes, then
  "the roots of this page" — a single greensight panel carrying the inbound-link
  count. **There is deliberately no backlink list**: the connections live in the
  graph, which keeps that band one height whether seven pages lead here or
  twenty-five, which is the only reason it can sit above the prose at all.

**Section emblems** are one inline SVG per top-level folder, keyed by folder
name, in `plugins/weirwood-chrome/components/emblems.js`. They come from
game-icons.net under CC BY 3.0 — each a single filled path on a 512 viewBox,
with the black ground and the baked `fill` stripped so `fill: currentColor`
inherits the palette. They are used at three sizes (17px in the bar, 26px in a
tile, 200–230px as a watermark) and carry no strokes, so nothing needs tuning
per size. **Every icon used on the site must be credited on `/colophon`** —
that page is the only place the CC BY notice appears, and the licence requires
it stay reachable. To add one: take the `d` from
`https://game-icons.net/icons/ffffff/transparent/1x1/<author>/<icon>.svg` (the
`transparent` segment is what drops the background rect), add the entry with
its source URL in a comment, and add the credit line.

A folder with no emblem falls back to a weirwood leaf, so adding a section
never renders a hole. That leaf is the one mark still drawn by hand — line art
on a 24 viewBox — which is the only reason `Emblem` still takes a
`strokeWidth`: it reaches the fallback and nothing else. The same source and
the same rules cover the **greensight glyph** (`GreensightMark`), used at 18px
in the header button and 26–32px in the greensight panels.

### Theming

This is **Quartz v5**, configured in YAML. Guides and handoffs written for Quartz v4
(`quartz.config.ts`, `quartz.layout.ts`, `Component.Darkmode()`, `quartz.layout` component
arrays) describe files that do not exist here. Translate before following them.

- Colors, fonts, site title, `baseUrl`, and every plugin: `quartz.config.yaml`.
- Component placement: each plugin's own `layout:` block (`position`, `priority`,
  `condition`), plus the `layout.byPageType` section at the end of that file.
- Custom styles: `quartz/styles/custom.scss`. Leave `variables.scss` and `base.scss`
  alone — they are core files that conflict on upgrade.
- **One core file is knowingly modified:** `quartz/components/Head.tsx` carries two
  additions, each marked with a `LOCAL MODIFICATION` comment. A Quartz upgrade will revert
  them silently.
  - `theme-color`, **landing only** — and note that **Safari 26 ignores it**: the tag
    parses and the value is dropped. It is kept for Chrome and Android, which still
    honour it. What actually tints the strip behind the status bar on current Safari is
    the `body[data-slug="index"]` background-color in the "browser's own chrome" section
    of `custom.scss`; keep the two values the same. Safari samples a fixed or sticky
    element near the top of the viewport in preference to `body`, so introducing one on
    the landing would silently take the tint over.
  - `viewport-fit=cover` on the viewport meta. This does **not** put the hero under the
    status bar in normal Safari browsing (that strip is unreachable; the top inset is 0
    there). It earns its place in landscape, where the notch would otherwise bar one side,
    and in standalone mode below. The `env(safe-area-inset-*)` rules in the "safe areas"
    section of `custom.scss` exist only to hold chrome clear of the strips this flag opens
    up — keep the two in step.

### Quartz v5 gotchas

Each of these fails silently or misleadingly. They are mechanical facts about this
Quartz version, independent of whatever visual design is in place.

- **`@quartz-community/note-properties` is the frontmatter parser**, not just the
  properties table its name suggests — it is categorised `["transformer", "component"]`
  and runs at `order: 5`. Disabling it strips frontmatter from every page: titles become
  "Untitled" and anything reading `fileData.frontmatter` renders nothing, with no warning.
  To hide the properties table, keep the plugin enabled and set
  `options.hidePropertiesView: true`.
- **Fonts are declared twice.** `configuration.theme.typography` and the
  `@quartz-community/quartz-fonts` plugin each emit a `--bodyFont`/`--headerFont` block,
  and the plugin's loads last. It does _not_ read the theme block — it falls back to
  stock Quartz fonts. Set fonts in **both** places or the change does nothing.
- **`frame` is a layout property, not frontmatter.** Putting `frame:` in a `.md` file has
  no effect. A page needs its own frame (e.g. `full-width`) via a page type registered by
  a plugin, or a `byPageType` override — which applies to every page of that type.
- **`exclude:` in `byPageType` matches `extractPluginName(source)`, which is not the same
  string for both kinds of plugin.** For an npm plugin it is the whole source, so
  `- reader-mode` matches nothing and it must be `- "@quartz-community/reader-mode"`. For
  a **local** plugin it is only the **basename**, so `- ./plugins/weirwood-article`
  matches nothing and it must be `- weirwood-article`. Each form is wrong the other way
  round, and a wrong one is silently inert. Some entries in the shipped config get this
  wrong; this repo's local-plugin exclusions were inert until the folder/article rework.
- **Disabling `@quartz-community/darkmode` means `:root[saved-theme="dark"]` is never
  set**, so the `lightMode` palette becomes the only one that ever applies, whatever the
  visitor's OS preference. That plugin also supplies `color-scheme`.
- **`textHighlight` is painted opaque.** Stock tokens carry their own 8-digit alpha; a
  v4-era value that assumed ~50% alpha will render muddy.
- **The favicon path is hardcoded, not configurable.** `@quartz-community/favicon` reads
  `quartz/static/icon.png`, resizes it to 48x48 and writes `favicon.ico` (PNG bytes under
  an `.ico` name); the `<link rel="icon">` in the head points at the full-size
  `static/icon.png`. The plugin exposes no options, so **changing the favicon means
  changing that file**. This repo keeps the candidates alongside it —
  `icon-tree.png` (Lorc's dead wood, also the hero and the og-image) and `icon-face.png`
  (Cathelineau's carved face, the current favicon) — and `icon.png` is a copy of whichever
  is in use. Both are CC BY 3.0 and credited at `/colophon`; see README.md.
  `plugins/weirwood-touch-icon` reads the same `icon.png`, so a swap moves both marks.
- **A backtick in a local plugin's CSS silently deletes the component.** That CSS lives
  in a JS template literal (`export const landingStyles = \`...\``), so a stray backtick —
including one inside a CSS comment, quoting a property name — closes the string early.
The build still reports success; it just emits two fewer files and the component vanishes
from the page with no error. Write property names in comments bare, and check
`grep -c '\`' <file>` returns 2.
- **A plugin can only have ONE of its components placed by the layout loader.**
  `buildLayoutForEntries` looks a plugin's component up by its kebab name or by the
  PascalCase of that name, and `loadComponentsFromPackage` only registers under the bare
  plugin name when the manifest declares **exactly one** component. Declare two and
  neither the `layout:` block in `quartz.config.yaml` nor the manifest's
  `defaultPosition` can place the second one — it is registered, so its CSS and scripts
  still ship, but it never renders. This is why the top bar and the article furniture are
  two plugins rather than one, and why `weirwood-chrome` can still own the folder page
  type: a page type's `body` is called directly and never goes through the registry.
- **A page type's `generate` runs even when its `match` never wins, and a virtual page is
  emitted with the layout of the page type that _generated_ it.** So layering a
  higher-priority folder page type over `@quartz-community/folder-page` looks correct —
  it does win `match` for every folder with an `index.md` — while every folder _without_
  one is still emitted by the other plugin, with the stock listing and no hero. Own the
  generation or disable the plugin; do not stack them.
- **`article > p` matches nothing.** Quartz wraps rendered Markdown in
  `div.markdown-preview-view`, so a child combinator from `article` to a paragraph is a
  dead selector. This is not a build error and not visible in the CSS — the rule simply
  never applies. The drop cap in `custom.scss` was written this way and never rendered
  until it was fixed; keep the `.markdown-preview-view` step in any prose selector.
- **Popovers stack every `.popover-hint` on the target page into one small card**, and on
  this site that is the whole block above the prose: title block, glow, watermark,
  frontmatter boxes, roots band. Anything added there needs a matching rule in the
  `--- previews ---` section of `custom.scss` or it turns up inside every link preview.
- **Favicons cache hard.** A changed icon can keep showing the old one — or a different
  project's, on `localhost:8080` — long after a normal reload. Confirm the file itself by
  opening `/static/icon.png` directly, then check the tab in a private window.

### Custom components

Components must come from a plugin — Quartz v5's component registry is populated only by
the plugin loader, so a `.tsx` file dropped into `quartz/components/` cannot be placed in
a layout. Local plugins live in `plugins/` and are referenced by path
(`source: ./plugins/<name>`). Quartz **symlinks** local plugins rather than building
them, so there is no build step and no toolchain: write plain ESM (preact `h()`), declare
a `quartz` manifest in `package.json`, and export components from a `./components`
subpath.

A component composed _inside_ another component still has its CSS and scripts emitted —
`componentResources` collects from the registry, not from the layout. That is how
`weirwood-article` relocates Quartz's real interactive graph out of the sidebar and into
the page body. Such a plugin must stay `enabled: true` with no `layout:` block; disabling
it to "remove the sidebar widget" would break the component that borrows it.

This site's own plugins:

- `plugins/weirwood-landing` — the hero, the greensight CTA, and a count-box row whose
  cells are **discovered** from the content tree (every top-level folder holding at least
  one article becomes a cell, labelled and counted automatically).
- `plugins/weirwood-chrome` — the top bar on every page but the front door (carved face,
  wordmark, the section being read, greensight), the **section-index page type** (hero,
  entry cards, "roots of the tree" strip), and the ten section emblems all three page
  types draw. It also ships the site's only `afterDOMLoaded` script.
- `plugins/weirwood-article` — the title block (emblem watermark, title, `words`, chips),
  the frontmatter boxes and the "roots of this page" band, all above the prose.
- `plugins/weirwood-footer` — replaces `@quartz-community/footer`, whose "Created with"
  string is hardcoded and localised (`links` is the only option it exposes), so the credit
  bar can speak in-world. One centred sentence with a link set into it, built from the
  `blessing` / `linkLabel` / `linkHref` / `coda` options in `quartz.config.yaml`; the
  copyright, the year and the Quartz version are all gone. **The link points at
  `/colophon` and must keep pointing somewhere that carries the heart tree's CC BY
  attribution** — that page is the only place the notice appears, and the licence requires
  it stay reachable. Quartz's own credit moved there too; it is courtesy either way, since
  the notice MIT asks for is `LICENSE.txt`. Ships no CSS — the bar is styled by
  `#quartz-body > footer` in `custom.scss`.
- `plugins/weirwood-touch-icon` — an emitter, with no component and no `layout:` block.
  WebKit asks the site **root** for `/apple-touch-icon-precomposed.png` and then
  `/apple-touch-icon.png` whenever it wants a high-resolution icon and the document
  declares none — which `Head.tsx` does not, and which is why those two 404s appear in
  the dev server log the moment Safari goes looking. This writes both files (same bytes;
  "precomposed" has meant nothing since iOS 7 dropped the gloss) at 180x180, flattened
  onto `background` because iOS backs a transparent home-screen icon with black. It is
  deliberately **not** a `<link rel="apple-touch-icon">` in `Head.tsx`: that would be a
  third `LOCAL MODIFICATION` for an upgrade to revert silently, and the root-path guess
  needs nothing in the document. `background` must stay in step with the landing
  `theme-color` and the `body[data-slug="index"]` background-color.

### Build & deploy

`.github/workflows/deploy.yml` runs Quartz on push to `main` and publishes to GitHub
Pages (repo Settings → Pages → Source: GitHub Actions). Custom domain is set in
Settings → Pages; the `CNAME` file lives at the repo root and the workflow copies it into
the build output.

## Conventions

- **Quoted book passages:** the published site is public — keep verbatim excerpts short,
  attribute them (book + chapter), and lead each article with your own commentary.
- **Images:** optimize to WebP at reasonable dimensions before committing; embed with
  `![[image.webp]]`.
- **File naming:** lowercase, hyphenated slugs (`the-faith-militant-uprising.md`).
- **Portability:** content stays plain Markdown in Git — every tool here is swappable.
