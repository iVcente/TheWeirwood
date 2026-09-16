import { h } from "preact"

// ---------------------------------------------------------------------------
// The site's marks, all as inline SVG so `stroke` and `fill` inherit the
// palette. Each is drawn on a 24x24 viewBox with no fills and no baked-in
// colour: the caller sets the size, the stroke weight and the colour.
//
// Do NOT reach for the PNGs in quartz/static for any of this. Those are dark
// ink art that needs a red glow field behind them to read at all (the landing
// hero, the OG card). On the header bar's #100c08 they measure about 2.4:1 and
// vanish.
// ---------------------------------------------------------------------------

/**
 * One emblem per top-level content folder, keyed by directory name — which is
 * also the `type:` value and the label, per the convention in CLAUDE.md. A
 * folder with no entry here falls back to the weirwood leaf, so adding a
 * section never renders a hole; add its emblem when it earns one.
 *
 * Each value is a preact fragment of paths. Geometry only.
 */
const emblemPaths = {
  // A dragon's eye: the slit lens, with the pupil set high in it.
  beasts: () => [
    h("path", { d: "M2.6 13.4c3.2-5.6 10-8.8 18.8-7.5-1.6 6.3-8.5 10.3-18.8 7.5Z" }),
    h("circle", { cx: 15.9, cy: 8.6, r: 1.3, fill: "currentColor", stroke: "none" }),
  ],
  // A person: head and shoulders.
  characters: () => [
    h("circle", { cx: 12, cy: 8, r: 3.4 }),
    h("path", { d: "M5.4 19.6a6.6 6.6 0 0 1 13.2 0" }),
  ],
  // A vessel with a banded rim — the cup a rite is drunk from.
  customs: () => [h("path", { d: "M8 4h8v9.2a4 4 0 0 1-8 0Z" }), h("path", { d: "M8 8.2h8" })],
  // A sword, point down: what turns a year into an occasion worth naming.
  events: () => [h("path", { d: "M12 2.6v18.8" }), h("path", { d: "M7.4 7h9.2" })],
  // The seven-pointed star, drawn as a wheel so it reads at 17px.
  faiths: () => [
    h("circle", { cx: 12, cy: 12, r: 8.2 }),
    h("path", {
      d: "M12 12 12 3.8M12 12 18.41 6.89M12 12 19.99 13.82M12 12 15.56 19.39M12 12 8.44 19.39M12 12 4.01 13.82M12 12 5.59 6.89",
    }),
  ],
  // A crown on its bar.
  houses: () => [
    h("path", { d: "M4.6 15.4V7.6l3.7 3.6L12 5.6l3.7 5.6 3.7-3.6v7.8" }),
    h("path", { d: "M4.2 18.4h15.6" }),
  ],
  // An open eye: what is seen but not weighed.
  mysteries: () => [
    h("path", { d: "M2.4 12s3.9-5.9 9.6-5.9S21.6 12 21.6 12s-3.9 5.9-9.6 5.9S2.4 12 2.4 12Z" }),
    h("circle", { cx: 12, cy: 12, r: 2.4 }),
  ],
  // A shield bearing a single pale — a body under a rule.
  orders: () => [
    h("path", { d: "M12 2.6 20 5.6v6.1c0 5-3.4 8.1-8 9.7-4.6-1.6-8-4.7-8-9.7V5.6Z" }),
    h("path", { d: "M12 8.6v6" }),
  ],
  // A crenellated keep with its gate.
  places: () => [
    h("path", { d: "M4.2 20.6V8h2.8V5h2.8v3h4.4V5h2.8v3h2.8v12.6Z" }),
    h("path", { d: "M9.8 20.6v-4.8a2.2 2.2 0 0 1 4.4 0v4.8" }),
  ],
  // A goblet: a made thing, kept.
  relics: () => [
    h("path", { d: "M7 3.6h10l-1.1 6a3.9 3.9 0 0 1-7.8 0Z" }),
    h("path", { d: "M12 13.6v5.4" }),
    h("path", { d: "M8.4 20.6h7.2" }),
  ],
}

// Stands in for any folder without an emblem of its own: a weirwood leaf.
const fallbackEmblem = () => [
  h("path", { d: "M12 21.4V9.6" }),
  h("path", { d: "M12 12.6C12 7 15.4 3.4 20.4 2.6c.6 5.6-3 9.4-8.4 10Z" }),
  h("path", { d: "M12 15.4C12 10.6 9 7.4 4.6 6.6c-.6 4.8 2.6 8.2 7.4 8.8Z" }),
]

export const hasEmblem = (section) => Boolean(emblemPaths[section])

/**
 * @param section  top-level folder name, e.g. "houses"
 * @param size     rendered px (17 in the bar, 26 in a roots tile, ~230 as the
 *                 hero watermark)
 * @param strokeWidth  in viewBox units. A mark blown up to 230px wants a much
 *                 finer line than the same mark at 17px, so this does not
 *                 scale with `size` — pass it deliberately.
 */
export const Emblem = ({ section, size = 24, strokeWidth = 1.6, class: className }) =>
  h(
    "svg",
    {
      class: className,
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": strokeWidth,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      focusable: "false",
    },
    (emblemPaths[section] ?? fallbackEmblem)(),
  )

/**
 * The wordmark's tree: trunk, two branches to red leaf nodes, a third leaf at
 * the crown, and two roots. Warm ink with blood leaves, so it holds its own on
 * the dark bar without any glow behind it.
 */
export const TreeMark = ({ size = 26, class: className }) =>
  h(
    "svg",
    {
      class: className,
      width: size,
      height: size,
      viewBox: "0 0 100 100",
      fill: "none",
      "aria-hidden": "true",
      focusable: "false",
    },
    [
      h(
        "g",
        {
          stroke: "var(--ww-mark-ink, #e0d3b8)",
          "stroke-width": 6.5,
          "stroke-linecap": "round",
        },
        [
          h("path", { d: "M50 26V86" }),
          h("path", { d: "M50 57 26 35" }),
          h("path", { d: "M50 57 74 35" }),
          h("path", { d: "M50 70C41 71 33 76 30 87" }),
          h("path", { d: "M50 70c9 1 17 6 20 17" }),
        ],
      ),
      h("g", { fill: "var(--ww-mark-leaf, #b23a2e)" }, [
        h("circle", { cx: 50, cy: 22, r: 7 }),
        h("circle", { cx: 23, cy: 32, r: 7 }),
        h("circle", { cx: 77, cy: 32, r: 7 }),
      ]),
    ],
  )

/**
 * The greensight glyph: an off-centre hub with four fat nodes and no crossing
 * diagonals. The symmetry matters — a balanced X-shaped graph reads as a
 * "close" button at 18px, which is the last thing this button should look like.
 */
export const GreensightMark = ({ size = 26, class: className }) =>
  h(
    "svg",
    {
      class: className,
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "currentColor",
      "aria-hidden": "true",
      focusable: "false",
    },
    [
      h(
        "g",
        { stroke: "currentColor", "stroke-width": 1.9, "stroke-linecap": "round", fill: "none" },
        [
          h("path", { d: "M11 11 6.6 8.2" }),
          h("path", { d: "M11 11 17 6.6" }),
          h("path", { d: "M11 11 17.4 14.6" }),
          h("path", { d: "M11 11 8.6 17.4" }),
        ],
      ),
      h("circle", { cx: 11, cy: 11, r: 3.1 }),
      h("circle", { cx: 6.1, cy: 7.9, r: 2.4 }),
      h("circle", { cx: 17.4, cy: 6.3, r: 2.4 }),
      h("circle", { cx: 17.8, cy: 14.9, r: 2.4 }),
      h("circle", { cx: 8.4, cy: 17.7, r: 2.4 }),
    ],
  )
