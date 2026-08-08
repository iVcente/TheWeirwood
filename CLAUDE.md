# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npx quartz build --serve   # dev server + hot reload at http://localhost:8080
npx quartz build           # one-off production build → public/
git push                   # triggers the GitHub Action that builds + deploys
```

## Architecture

**The Weirwood** — a personal, story-focused *A Song of Ice and Fire* / *Fire & Blood*
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
aliases: ["..."]       # alternate names → searchable and linkable
type: character        # character | event | house | place | concept
house: "..."           # optional; omit if N/A
tags: ["..."]          # cross-cutting views
era: "..."             # in-world period
date: ""               # events only, e.g. "48 AC"
book: "Fire & Blood"   # source work
status: stub           # stub | draft | complete
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

- Colors, fonts, site title, `baseUrl`: `quartz.config.ts`.
- Component layout (graph, backlinks, search, explorer): `quartz.layout.ts`.
- Custom styles: `quartz/styles/custom.scss`.

### Build & deploy

`.github/workflows/deploy.yml` runs Quartz on push to `main` and publishes to GitHub
Pages (repo Settings → Pages → Source: GitHub Actions). Custom domain is set in
Settings → Pages; a `CNAME` file lives in `quartz/static/` if publishing a custom domain.

## Conventions

- **Quoted book passages:** the published site is public — keep verbatim excerpts short,
  attribute them (book + chapter), and lead each article with your own commentary.
- **Images:** optimize to WebP at reasonable dimensions before committing; embed with
  `![[image.webp]]`.
- **File naming:** lowercase, hyphenated slugs (`the-faith-militant-uprising.md`).
- **Portability:** content stays plain Markdown in Git — every tool here is swappable.
