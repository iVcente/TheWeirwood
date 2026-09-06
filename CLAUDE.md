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
house: "..." # optional; omit if N/A
tags: ["..."] # cross-cutting views
era: "..." # in-world period; use this for ASOIAF dates too (e.g. "48 AC")
book: "Fire & Blood" # source work
status: stub # stub | draft | complete
---
```

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
- **`exclude:` in `byPageType` matches the plugin's full `source` string**, so
  `- reader-mode` matches nothing; it must be `- "@quartz-community/reader-mode"`. Some
  entries in the shipped config get this wrong and are silently inert.
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
- **A backtick in a local plugin's CSS silently deletes the component.** That CSS lives
  in a JS template literal (`export const landingStyles = \`...\``), so a stray backtick —
  including one inside a CSS comment, quoting a property name — closes the string early.
  The build still reports success; it just emits two fewer files and the component vanishes
  from the page with no error. Write property names in comments bare, and check
  `grep -c '\`' <file>` returns 2.
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
- `plugins/weirwood-article` — frontmatter-driven metadata boxes and the "roots of this
  page" band (local graph + backlinks) that sits above the prose.
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
