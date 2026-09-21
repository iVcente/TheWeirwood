// The site's chrome: the top bar, the section-index body, and the pieces both
// of those share with the article furniture (bands, chips, the greensight
// panel). Emitted site-wide — component resources are collected from the
// registry, not the layout — so weirwood-article leans on the shared blocks
// here rather than restating them.
//
// The nine palette tokens come from quartz.config.yaml; the --ww-* surfaces and
// the band measures are defined in quartz/styles/custom.scss.
//
// NOTE: this is a JS template literal. A stray backtick anywhere below — inside
// a comment, quoting a property name — closes the string early, and the build
// still reports success while silently emitting two fewer files and dropping
// the component from the page. Write property names bare, and keep this file at
// exactly two backticks.
export const chromeStyles = `
/* --- the measure -------------------------------------------------------- */
/* Bands run edge to edge; only what is inside them is measured. */
.ww-band-inner {
  box-sizing: border-box;
  width: 100%;
  max-width: var(--ww-band);
  margin-inline: auto;
  padding-left: calc(var(--ww-band-pad) + env(safe-area-inset-left, 0px));
  padding-right: calc(var(--ww-band-pad) + env(safe-area-inset-right, 0px));
}

/* --- the top bar -------------------------------------------------------- */
.ww-head {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-width: 0;
}

.ww-head-left {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.ww-head-brand {
  display: flex;
  align-items: center;
  gap: 11px;
  background-color: transparent;
  text-decoration: none;
  flex-shrink: 0;
}

/* The carved face is one path, not ink strokes with red leaf nodes, so the
   two-token treatment the old hand-drawn tree took is gone: it inherits one
   colour, the same red the front door raises the heart tree in. */
.ww-head-mark {
  flex-shrink: 0;
  color: var(--secondary);
}

.ww-head-wordmark {
  font-family: var(--headerFont);
  font-weight: 700;
  font-size: 17px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--dark);
  white-space: nowrap;
}

.ww-head-brand:hover .ww-head-wordmark {
  color: var(--tertiary);
}

.ww-head-divider {
  width: 1px;
  height: 26px;
  background: var(--lightgray);
  flex-shrink: 0;
}

/* The bar states the section; the page states the page. There are no
   breadcrumbs anywhere on this site. */
.ww-head-section {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
  background-color: transparent;
  text-decoration: none;
  font-family: var(--codeFont);
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #8a7b67;
}

.ww-head-emblem {
  flex-shrink: 0;
  color: var(--secondary);
}

.ww-head-section > span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ww-head-section:hover {
  color: var(--dark);
}

.ww-head-section:hover .ww-head-emblem {
  color: var(--tertiary);
}

/* --- icon buttons ------------------------------------------------------- */
/* Greensight, then search. Both icon-only, as on the front door. */
.ww-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  padding: 0;
  border: 1px solid var(--lightgray);
  border-radius: 4px;
  background: var(--ww-panel);
  color: var(--secondary);
  cursor: pointer;
}

.ww-icon-button:hover {
  border-color: var(--gray);
  color: var(--tertiary);
  background: var(--highlight);
}

.ww-icon-button:focus {
  outline: none;
}

.ww-icon-button:focus-visible {
  outline: none;
  border-color: var(--tertiary);
}

/* Parked where the greensight buttons can find its icon, and sized rather than
   hidden so d3 can lay the graph out instead of dividing by a zero width.

   Do NOT add pointer-events: none here. The greensight overlay
   (.global-graph-outer) is a position:fixed DESCENDANT of this element, and
   pointer-events inherits — so it silently makes the whole graph
   click-through: no pan, no zoom, no node hover, no labels (labels are only
   ever revealed by a zoom or a hover), no click to navigate. The overlay still
   opens and still closes on Escape or an outside click, because those listen on
   document, which is what makes it look like it is working. */
.ww-graph-host {
  position: absolute;
  left: -10000px;
  top: 0;
  width: 320px;
  height: 320px;
  overflow: hidden;
}

/* --- section hero ------------------------------------------------------- */
.ww-section-hero {
  position: relative;
  overflow: hidden;
  padding: 42px 0 44px;
  text-align: center;
  background-color: var(--light);
  background-image:
    /* Topmost layer: a short veil of the hero's own background colour, so the
       weave fades into flat ground over the last 56px instead of stopping dead
       at the bottom edge.

       A veil rather than a mask on a separate layer: masking a repeating
       gradient needs a pseudo-element (a mask on the hero would take the glow
       and the type with it), and it fades the weave through the four 8-bit
       levels it actually has, which bands. Painting the ground back over the
       top has the same four levels but no second element, no stacking order to
       keep, and nothing here changes size.

       Keep the stops short. A long ramp gives each of those four levels a tall
       band of its own, which reads as banding; compressed to ~56px they land
       close enough together to read as a gradient. And spell the far stop as
       the same colour at zero alpha rather than the transparent keyword, so
       the ramp stays honest anywhere gradients are not premultiplied. */
    linear-gradient(to bottom, rgba(23, 19, 15, 0) calc(100% - 56px), rgb(23, 19, 15) 100%),
    /* Heartglow over the warm pinstripe, as on the front door — narrower here,
       because it lights one emblem rather than a whole canopy. */
    radial-gradient(
        80% 95% at 50% 34%,
        rgba(178, 58, 46, 0.15) 0%,
        rgba(178, 58, 46, 0.045) 50%,
        transparent 80%
      ),
    repeating-linear-gradient(135deg, rgba(255, 220, 180, 0.02) 0 2px, transparent 2px 11px);
}

.ww-section-hero-inner {
  position: relative;
}

.ww-section-title {
  font-family: var(--headerFont);
  font-weight: 700;
  font-size: 42px;
  line-height: 1.1;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--dark);
  margin: 0;
}

.ww-section-rule {
  width: 60px;
  height: 1px;
  background: var(--secondary);
  margin: 20px auto;
}

.ww-section-desc {
  font-family: var(--bodyFont);
  font-style: italic;
  font-size: 18px;
  line-height: 1.5;
  color: var(--ww-muted);
  max-width: 44ch;
  margin: 0 auto;
  text-wrap: pretty;
}

.ww-section-desc p {
  margin: 0;
}

.ww-section-count {
  font-family: var(--codeFont);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--gray);
  margin-top: 20px;
}

/* --- entry cards -------------------------------------------------------- */
/* auto-fit, not auto-fill: a section holding one entry gives that card the
   whole row instead of stranding it in a quarter of one. */
.ww-entries {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 14px;
  margin: 34px auto;
  text-align: left;
}

.ww-entry {
  border: 1px solid var(--lightgray);
  border-radius: 5px;
  padding: 20px 22px 18px;
  background-color: var(--ww-panel);
  text-decoration: none;
  min-width: 0;
}

.ww-entry:hover {
  border-color: var(--ww-glow-edge);
  background-color: var(--highlight);
}

.ww-entry-title {
  font-family: var(--headerFont);
  font-weight: 500;
  font-size: 24px;
  line-height: 1.2;
  letter-spacing: 0.02em;
  color: var(--tertiary);
  margin: 0;
}

.ww-entry:hover .ww-entry-title {
  color: #e0715f;
}

.ww-entry-desc {
  font-family: var(--bodyFont);
  font-size: 16px;
  line-height: 1.62;
  color: var(--darkgray);
  margin: 10px 0 0;
  text-wrap: pretty;
}

/* --- tag chips ---------------------------------------------------------- */
.ww-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.ww-chip {
  font-family: var(--codeFont);
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #8a7b67;
  border: 1px solid var(--lightgray);
  border-radius: 3px;
  padding: 5px 9px;
  background-color: transparent;
  text-decoration: none;
  line-height: 1;
}

a.ww-chip:hover {
  color: var(--dark);
  border-color: var(--gray);
}

/* An entry that has been started and not finished says so. */
.ww-chip--stub {
  color: var(--secondary);
  background: var(--highlight);
  border-color: var(--ww-glow-edge);
}

/* --- roots bands -------------------------------------------------------- */
.ww-roots {
  background: var(--ww-panel);
  border-top: 1px solid var(--lightgray);
  border-bottom: 1px solid var(--lightgray);
  padding: 26px 0 28px;
  text-align: left;
}

.ww-folder > .ww-roots {
  border-bottom: none;
}

.ww-roots-heading {
  font-family: var(--codeFont);
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gray);
  margin-bottom: 16px;
}

/* --- the greensight panel ----------------------------------------------- */
/* A button, not a link: the graph is an overlay with no URL of its own. */
.ww-greensight {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  width: 100%;
  padding: 22px 24px;
  border: 1px solid var(--ww-glow-edge);
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  background-color: var(--highlight);
  background-image: radial-gradient(
    60% 160% at 50% 50%,
    rgba(178, 58, 46, 0.22) 0%,
    transparent 80%
  );
}

.ww-greensight:hover {
  border-color: var(--tertiary);
}

.ww-greensight-mark {
  flex-shrink: 0;
  color: var(--tertiary);
}

.ww-greensight-line {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.ww-greensight-heading {
  font-family: var(--headerFont);
  font-weight: 600;
  font-size: 17px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #f3e8d2;
  /* Tracking is applied after the last letter too, so the word carries 0.14em
     of dead space on its right. Pull it back, or the glyph and the word sit
     visibly left of the sub-label they are supposed to be centred over. */
  margin-right: -0.14em;
}

/* This is the contrast floor against the panel behind it — do not darken it. */
.ww-greensight-sub {
  font-family: var(--codeFont);
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #e0715f;
}

.ww-greensight--article {
  padding: 26px 24px;
}

.ww-greensight--article .ww-greensight-heading {
  font-size: 19px;
}

/* --- the whole tree ----------------------------------------------------- */
/* Every section, including the one being read. That one stays in the row so
   the reader can see the shape of the archive from anywhere inside it, but it
   is marked and it is not a link. */
.ww-tiles {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin-top: 10px;
}

.ww-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 16px 8px 14px;
  border: 1px solid var(--lightgray);
  border-radius: 5px;
  background-color: var(--ww-panel);
  text-decoration: none;
  min-width: 0;
}

.ww-tile-emblem {
  flex-shrink: 0;
  color: var(--secondary);
}

.ww-tile-label {
  font-family: var(--codeFont);
  font-size: 8px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #8a7b67;
  text-align: center;
}

a.ww-tile:hover {
  border-color: var(--ww-glow-edge);
  background-color: var(--highlight);
}

a.ww-tile:hover .ww-tile-emblem {
  color: var(--tertiary);
}

a.ww-tile:hover .ww-tile-label {
  color: var(--dark);
}

.ww-tile--current {
  border-color: var(--ww-glow-edge);
  background-color: var(--highlight);
}

.ww-tile--current .ww-tile-emblem {
  color: #e0715f;
}

.ww-tile--current .ww-tile-label {
  color: #e0d3b8;
}

/* --- narrow ------------------------------------------------------------- */
@media all and (max-width: 800px) {
  .ww-section-title {
    font-size: 32px;
  }

  .ww-section-watermark {
    width: 180px;
    height: 180px;
  }

  .ww-tiles {
    grid-template-columns: repeat(3, 1fr);
  }

  .ww-head-wordmark {
    font-size: 15px;
    letter-spacing: 0.16em;
  }
}

@media all and (max-width: 560px) {
  /* The wordmark and the section label both want the width; the bar keeps the
     brand and drops back to the emblem alone for the section. */
  .ww-head-section > span {
    display: none;
  }

  .ww-greensight {
    padding: 18px 16px;
  }

  /* The button's own gap is now the one between the heading line and the
     sub-label, so it stays as it is; this is the glyph-to-word gap. */
  .ww-greensight-line {
    gap: 11px;
  }

  .ww-greensight-heading {
    font-size: 15px;
  }

  .ww-greensight--article .ww-greensight-heading {
    font-size: 16px;
  }

  .ww-tiles {
    grid-template-columns: repeat(2, 1fr);
  }
}
`
