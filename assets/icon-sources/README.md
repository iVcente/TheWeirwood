# Icon sources

The unaltered originals of every mark on the site, downloaded from
[game-icons.net](https://game-icons.net/) and used under the
[Creative Commons Attribution 3.0 licence](https://creativecommons.org/licenses/by/3.0/).
The credits the licence asks for live on [`/colophon`](../../content/colophon.md);
this folder is provenance, not attribution.

**These files are not build inputs.** Nothing reads them, and they are
deliberately outside `quartz/static/` — that folder is copied wholesale into
`public/static/` and published, so an unused copy there would ship with the
site and give every mark two places to drift apart. What the site actually
draws is:

- the **ten section emblems**, the **greensight glyph** and the **carved
  face**, inlined as path data in `plugins/weirwood-chrome/components/emblems.js`
  — inline because an external SVG in an `<img>` is an isolated document that
  cannot see the page's custom properties, and these are tinted by the palette
  at three different sizes;
- the **heart tree**, as `quartz/static/weirwood.svg`, because the landing hero
  loads it through an `<img>` and bakes its fill in.

Each download is the `transparent` variant, which is the artwork with no black
ground behind it: `https://game-icons.net/icons/ffffff/transparent/1x1/<author>/<icon>.svg`.
Every one is a single filled path on a `0 0 512 512` viewBox. The copies in the
repo differ from these only by having the baked `fill` dropped (so
`fill: currentColor` inherits the palette) and, for the heart tree, a re-cropped
viewBox. The path data itself is identical — which is what makes these useful:
diff an original's `d` against the one in the repo to confirm a mark has not
been mangled, or to re-cut it from source.

| Used for            | File                            | Icon            | Author      |
| ------------------- | ------------------------------- | --------------- | ----------- |
| beasts              | `lorc-beast-eye.svg`            | Beast eye       | Lorc        |
| characters          | `lorc-totem-head.svg`           | Totem head      | Lorc        |
| customs             | `delapouite-ceremonial-mask.svg`| Ceremonial mask | Delapouite  |
| events              | `lorc-sands-of-time.svg`        | Sands of time   | Lorc        |
| faiths              | `lorc-cultist.svg`              | Cultist         | Lorc        |
| houses              | `lorc-stone-throne.svg`         | Stone throne    | Lorc        |
| mysteries           | `lorc-death-note.svg`           | Death note      | Lorc        |
| orders              | `lorc-duality.svg`              | Duality         | Lorc        |
| places              | `delapouite-black-bridge.svg`   | Black bridge    | Delapouite  |
| relics              | `lorc-holy-symbol.svg`          | Holy symbol     | Lorc        |
| greensight glyph    | `delapouite-mesh-network.svg`   | Mesh network    | Delapouite  |
| header mark, favicon| `cathelineau-tree-face.svg`     | Tree face       | Cathelineau |
| landing hero, og    | `lorc-dead-wood.svg`            | Dead wood       | Lorc        |

Adding a section emblem: download its original here, add the row above, add the
`d` to `emblemPaths` with its source URL in a comment, and add the credit line
to `/colophon`.
