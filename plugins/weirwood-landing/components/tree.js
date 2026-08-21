// The weirwood pressing through the page behind the wordmark: a central trunk
// with branches reaching up into a canopy above the title and roots descending
// below it, red catkins at the branch tips.
//
// Geometry copied verbatim from option 9a in the exploration file. The viewBox
// is 680x520 and the SVG is sliced to fill the hero, so the canopy runs off the
// top edge and the roots off the bottom — that clipping is intentional.
//
// Stroke and fill live in the stylesheet, not in presentation attributes:
// var() is only reliably substituted in CSS properties.

const BRANCHES = [
  "M340 150 L340 370",
  "M340 176 C290 140 256 100 232 40",
  "M340 176 C390 140 424 100 448 44",
  "M340 210 C304 184 274 164 250 124",
  "M340 210 C376 184 406 164 430 126",
  "M232 40 C222 14 214 2 206 -14",
  "M232 40 C252 20 266 10 290 -2",
  "M448 44 C460 18 468 6 476 -10",
  "M448 44 C428 24 414 14 390 2",
  "M250 124 C236 106 228 98 216 84",
  "M430 126 C444 108 452 100 464 86",
  "M340 344 C308 380 282 408 272 462 C266 500 250 520 232 520",
  "M340 344 C372 380 398 408 408 462 C414 500 430 520 448 520",
  "M340 372 C328 420 318 458 306 508",
  "M340 372 C352 420 362 458 374 508",
  "M272 462 C244 480 226 492 208 518",
  "M408 462 C436 480 454 492 472 518",
]

const CATKINS = [
  [206, -14],
  [290, -2],
  [476, -10],
  [390, 2],
  [216, 84],
  [464, 86],
]

export const weirwoodTreeSvg = () =>
  `<svg class="ww-tree" viewBox="0 0 680 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
  <g class="ww-tree-limbs">${BRANCHES.map((d) => `<path d="${d}"/>`).join("")}</g>
  <g class="ww-tree-catkins">${CATKINS.map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="4"/>`).join("")}</g>
</svg>`
