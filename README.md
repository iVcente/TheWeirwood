# The Weirwood

A personal, story-focused *A Song of Ice and Fire* / *Fire & Blood* lore wiki
by Vicente Danzmann. Plain Markdown → [Quartz](https://quartz.jzhao.xyz) →
GitHub Pages. Live at **[theweirwood.boo](https://theweirwood.boo)**.

## Local development

```bash
npx quartz build --serve   # hot-reload preview at http://localhost:8080
npx quartz build           # one-off production build → public/
```

Node 22 is pinned in `.nvmrc` and `.node-version`. Run `nvm use` if you have nvm.

## Adding an article

**Preferred (Foam):** open the repo in VSCode with the recommended Foam
extension installed. Command Palette → **Foam: Create New Note From Template**
→ pick `character` or `event` → enter a title. The new note is created with
frontmatter pre-filled. Move it into the right subfolder under `content/`,
write the body, cross-link with `[[wikilinks]]`.

**Manual:** create a `.md` file under `content/{characters,events,houses,places}/`
using lowercase-hyphenated slugs (e.g., `content/characters/maegor-i-targaryen.md`).
Start with the frontmatter block — see `CLAUDE.md` for the schema.

**Linking:** `[[Maegor I Targaryen]]` links to any article with that title or
matching slug. Pipe-alias to change display text: `[[Balerion|the Black Dread]]`.
A wikilink to a not-yet-written page becomes a *placeholder* — useful for planning.

## Images

Two ways to embed images.

**From a local file (preferred — external links rot).**
Save images under `content/attachments/`. Optimize to WebP at reasonable
dimensions before committing (keeps the repo light):

```bash
# macOS: brew install webp, then:
cwebp -q 80 source.png -o balerion.webp
```

VSCode is configured to auto-route pasted or dragged images into
`content/attachments/` when editing a note under `content/`, and insert the
Markdown link. Embed with either syntax:

```markdown
![[balerion.webp]]              # Obsidian/Foam-style; Quartz resolves by filename
![[balerion.webp|400]]          # width in pixels
![alt text](/attachments/balerion.webp)   # standard Markdown
```

**From an external URL.** Standard Markdown works:

```markdown
![alt text](https://example.com/image.jpg)
```

Use sparingly — external images can disappear, change, or become slow to load.
Hotlinking from other sites is also poor etiquette; download the image
(if licensing permits) and rehost under `content/attachments/` instead.

**Copyright.** Most ASOIAF art is copyrighted. Favour your own maps and
diagrams, licensed or public-domain images, or link out (with attribution)
rather than rehosting.

## Deployment

Every push to `main` triggers `.github/workflows/deploy.yml`:

1. `npm ci` installs dependencies.
2. `npx quartz build` produces `public/`.
3. `CNAME` at the repo root is copied into `public/CNAME` so GitHub Pages
   knows to serve the custom domain.
4. `actions/upload-pages-artifact` bundles `public/`.
5. `actions/deploy-pages` publishes it.

DNS is managed at Cloudflare: apex A records → `185.199.108-111.153`,
`www` CNAME → `ivcente.github.io`. Records are DNS-only (grey cloud) so
Cloudflare doesn't proxy — GitHub's Let's Encrypt cert handles TLS directly.

## Repo structure

```
content/                # source of truth — one .md per entity
├─ characters/
├─ events/
├─ houses/
├─ places/
├─ attachments/         # optimized WebP images
└─ index.md             # landing page

quartz.config.yaml      # Quartz v5 config (site title, theme, plugins)
quartz/                 # Quartz framework code (do not edit)
CNAME                   # custom-domain marker (copied into build output)
.foam/templates/        # note templates for Foam
.vscode/                # workspace settings (Foam, image routing)
.github/workflows/      # CI deploy pipeline
CLAUDE.md               # conventions for future Claude Code sessions
```

## Credits

Built on [Quartz v5](https://quartz.jzhao.xyz) by Jacky Zhao and contributors
(MIT). Content is my own except where quoted and attributed.
