// Landing page only. The --ww-* surface tokens are defined in
// quartz/styles/custom.scss; the nine palette tokens come from quartz.config.yaml.
export const landingStyles = `
.ww-landing {
  margin: 0 0 2.5rem 0;
}

/* --- hero -------------------------------------------------------------- */
.ww-hero {
  position: relative;
  overflow: hidden;
  padding: 70px 48px 56px;
  text-align: center;
  /* A column so the hero can be told to absorb leftover height and keep its
     contents optically centred; see the landing block in custom.scss. */
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: var(--light);
  /* Heartglow first so it sits above the weave: red weirwood leaves lighting
     the top of the page, over a barely-there warm pinstripe. The ellipse is
     deliberately wider and taller than the wordmark so the glow reaches the
     outer branch tips rather than pooling around the trunk. */
  background-image:
    radial-gradient(
      150% 115% at 50% 20%,
      rgba(178, 58, 46, 0.2) 0%,
      rgba(178, 58, 46, 0.07) 46%,
      transparent 80%
    ),
    repeating-linear-gradient(135deg, rgba(255, 220, 180, 0.02) 0 2px, transparent 2px 11px);
}

/* The drawn heart tree, cropped off the top edge so the branches run out of
   frame and the trunk lands behind the wordmark. The drop-shadow is what makes
   it glow into the heartglow instead of sitting flatly on top of it. */
.ww-tree {
  position: absolute;
  left: 50%;
  /* Both of these used to be fixed pixels, which is why the hero fell apart on
     a large monitor: the hero grows with the viewport, the tree did not, so at
     1920px the same 560px tree sat marooned in a much wider frame. Sized and
     cropped in viewport units instead, the wordmark-to-canopy proportion that
     works on a 13" laptop holds at any size.

     Below ~1475px the width resolves to the same 560px it always was — the
     laptop rendering is unchanged — and past that it tracks the screen up to
     1150px, which is as far as the 1008px source can be pushed before the
     upscale shows. 82vw and 88vh are the guards for narrow and short windows;
     without the second, a short wide window would crop the canopy away. */
  top: -7%;
  transform: translateX(-50%);
  width: min(82vw, 88vh, max(560px, min(38vw, 1150px)));
  height: auto;
  opacity: 0.3;
  filter: drop-shadow(0 0 34px rgba(178, 58, 46, 0.5));
  pointer-events: none;
  user-select: none;
  /* base.scss sets content-visibility:auto, border-radius:5px and margin:1rem 0
     on every img. content-visibility applies size containment while it judges
     the element off-screen, which collapses this absolutely-positioned image
     with height:auto to nothing — the file loads, the rules apply, and the tree
     never paints. Undo all three. */
  content-visibility: visible;
  border-radius: 0;
  margin: 0;
}

.ww-hero-inner {
  position: relative;
  padding-top: 36px;
}

.ww-wordmark {
  font-family: var(--headerFont);
  font-weight: 700;
  /* The clamp alone tops out at 66px from 733px upward, so on a wide screen the
     wordmark shrank against a hero that kept growing. The max() branch takes
     over only past ~1435px — every size at or below the laptop is untouched —
     and holds the same ratio to the tree until it stops at 96px. */
  font-size: max(clamp(2.75rem, 9vw, 66px), min(4.6vw, 96px));
  letter-spacing: 0.1em;
  line-height: 0.94;
  color: var(--dark);
  text-transform: uppercase;
  margin: 0;
  border: none;
  /* The tree sits behind the text now, so the wordmark needs its own ground. */
  text-shadow: 0 2px 24px rgba(12, 9, 6, 0.85);
}

.ww-rule {
  width: 60px;
  height: 1px;
  background: var(--secondary);
  margin: 26px auto;
}

.ww-tagline {
  font-family: var(--bodyFont);
  font-style: italic;
  /* Same shape as the wordmark: 19px up to ~1650px, then growing with it so the
     line under a 90px wordmark does not read as fine print. */
  font-size: max(19px, min(1.15vw, 24px));
  line-height: 1.5;
  color: var(--ww-muted);
  max-width: max(440px, 30vw);
  margin: 0 auto 32px;
  text-wrap: pretty;
}

/* Both CTAs are filled red and carry equal weight — there is no secondary
   variant, and they match in width too: 1fr tracks in a shrink-to-fit grid all
   take the width of the widest button, so the pair reads as one object rather
   than as two buttons sized by their word lengths. */
.ww-actions {
  display: inline-grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  gap: 12px;
}

.ww-cta {
  font-family: var(--codeFont);
  font-size: 12px;
  /* base.scss weights every anchor semibold, which would leave whichever CTA is a
     link heavier than the button beside it. */
  font-weight: 400;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-align: center;
  color: #f3e8d2;
  background: var(--secondary);
  border: 1px solid var(--secondary);
  padding: 13px 30px;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.ww-cta:hover {
  background: var(--tertiary);
  border-color: var(--tertiary);
  color: #f3e8d2;
}

/* --- count boxes: the primary navigation ------------------------------- */
.ww-counts {
  display: flex;
  flex-wrap: wrap;
  border-top: 1px solid var(--lightgray);
}

a.ww-count-cell {
  flex: 1 1 160px;
  padding: 18px 8px;
  text-align: center;
  border-right: 1px solid var(--ww-divider);
  text-decoration: none;
  background-color: transparent;
  transition: background-color 0.2s ease;
}

a.ww-count-cell:last-child {
  border-right: none;
}

a.ww-count-cell:hover {
  background-color: var(--highlight);
}

.ww-count-label {
  display: block;
  font-family: var(--headerFont);
  font-size: 18px;
  letter-spacing: 0.03em;
  color: #e0d3b8;
}

.ww-count-value {
  display: block;
  margin-top: 4px;
  font-family: var(--codeFont);
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--secondary);
}

a.ww-count-cell:hover .ww-count-label {
  color: var(--dark);
}

/* The graph the CTA opens. Off-screen rather than display:none so d3 still has
   a real box to lay out in. Only the inert local-graph box is parked here: the
   overlay is position:fixed and nothing in this chain establishes a containing
   block for it, so it opens at the viewport and needs no counter-offset —
   giving it one is what used to push it 10000px off-screen. */
.ww-graph-host {
  position: absolute;
  left: -10000px;
  top: 0;
  width: 320px;
  height: 320px;
  overflow: hidden;
}

@media all and (max-width: 800px) {
  .ww-hero {
    padding: 48px 20px 40px;
  }

  .ww-actions {
    grid-auto-flow: row;
  }

  a.ww-count-cell {
    flex-basis: 50%;
  }

  a.ww-count-cell:nth-child(2n) {
    border-right: none;
  }
}
`
