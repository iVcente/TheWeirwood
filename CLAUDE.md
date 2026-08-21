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
├─ characters/
├─ events/
├─ houses/
├─ places/
└─ attachments/        # images (optimized to WebP)
```

### Frontmatter fields

```yaml
---
title: "..."
aliases: ["..."] # alternate names → searchable and linkable
type: character # character | event | house | place | concept
house: "..." # optional; omit if N/A
tags: ["..."] # cross-cutting views
era: "..." # in-world period; use this for ASOIAF dates too (e.g. "48 AC")
book: "Fire & Blood" # source work
status: stub # stub | draft | complete
---
```

### Linking conventions

- Link any entity inline with a wikilink: `[[Balerion]]`.
- Alias display text without breaking the link: `[[Balerion|the Black Dread]]`.
- A wikilink to a not-yet-written page becomes a **placeholder** (good for planning).
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
