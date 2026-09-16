// ---------------------------------------------------------------------------
// How the greensight opens.
//
// Quartz's Graph component takes two independent configs. Only one of them is
// ever seen here:
//
//   localGraph  — renders into `.graph-container`, which on this site lives in
//                 the off-screen host and is never displayed. The design's roots
//                 band is a button, not a graph box. It cannot be removed
//                 without forking the plugin, so it is held to a single node:
//                 the PIXI application is still built on every page load, but
//                 the simulation behind it is trivial.
//   globalGraph — renders into `.global-graph-container` inside the fixed
//                 full-viewport overlay. This is the greensight.
//
// Two things worth knowing before touching the numbers, both learned the hard
// way from reading the plugin's script:
//
//   `scale` does NOT set the opening zoom. It only divides the label size
//   (`label.scale.set(1 / scale)`). The stage always opens at zoomIdentity, so
//   the only way to make the graph fill the overlay is to lay it out bigger —
//   which is what `linkDistance` is for here.
//
//   Labels start at alpha 0 and are only recomputed inside the zoom handler, so
//   they stay invisible until the reader zooms or hovers. That is stock
//   behaviour, not a setting.
// ---------------------------------------------------------------------------

const localGraph = {
  depth: 0,
  drag: false,
  zoom: false,
  showTags: false,
}

const shared = {
  drag: true,
  zoom: true,
  repelForce: 0.6,
  scale: 1,
  fontSize: 0.6,
  showTags: true,
  removeTags: [],
  // Dims everything that is not a neighbour of the hovered node.
  focusOnHover: true,
  // OFF, deliberately. forceRadial pins every node towards a ring at
  // min(w,h)/2*0.8; linked nodes resist it because the link force holds them
  // together, but a node with no edges has nothing holding it, so it gets flung
  // out and parked on that ring. That is the arc of small dots along the bottom
  // of the overlay — not a bug, and not a separate cluster: it is this site's
  // unlinked pages (the ten section indexes, the landing, the colophon, the tag
  // listing, and any entry with no wikilinks either way) strung along the
  // circle. Without the radial force they simply drift near the cluster, where
  // they read as what they are: pages nothing links to yet.
  enableRadial: false,
}

/**
 * The whole archive. Used where the label promises it — a section index, and
 * the front door's CTA.
 */
export const overviewGraph = {
  ...shared,
  depth: -1,
  // Stock is 30, which packs 29 nodes into a knot a few hundred pixels wide and
  // leaves the rest of the overlay empty. This is the "zoom" knob.
  linkDistance: 65,
  centerForce: 0.25,
}

/**
 * The current page and everything one hop from it. Used on an entry, where the
 * roots band directly below asks the same question about this page.
 */
export const neighbourhoodGraph = {
  ...shared,
  depth: 1,
  // Fewer nodes, so they have to sit further apart to fill the same overlay.
  linkDistance: 120,
  centerForce: 0.35,
}

/** Options for the composed Graph component. `kind` is "overview" | "neighbourhood". */
export const graphOptions = (kind) => ({
  localGraph,
  globalGraph: kind === "overview" ? overviewGraph : neighbourhoodGraph,
})
