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
  top: -46px;
  transform: translateX(-50%);
  width: min(560px, 82vw);
  height: auto;
  opacity: 0.3;
  filter: drop-shadow(0 0 34px rgba(178, 58, 46, 0.5));
  pointer-events: none;
  user-select: none;
}

.ww-hero-inner {
  position: relative;
  padding-top: 36px;
}

.ww-wordmark {
  font-family: var(--headerFont);
  font-weight: 700;
  font-size: clamp(2.75rem, 9vw, 66px);
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
  font-size: 19px;
  line-height: 1.5;
  color: var(--ww-muted);
  max-width: 440px;
  margin: 0 auto 32px;
  text-wrap: pretty;
}

/* Both CTAs are filled red and carry equal weight — there is no secondary
   variant. */
.ww-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.ww-cta {
  display: inline-block;
  font-family: var(--codeFont);
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
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
   a real box to lay out in; the overlay it opens is position:fixed. */
.ww-graph-host {
  position: absolute;
  left: -10000px;
  top: 0;
  width: 320px;
  height: 320px;
  overflow: hidden;
}

.ww-graph-host .global-graph-outer {
  left: 10000px;
}

@media all and (max-width: 800px) {
  .ww-hero {
    padding: 48px 20px 40px;
  }

  a.ww-count-cell {
    flex-basis: 50%;
  }

  a.ww-count-cell:nth-child(2n) {
    border-right: none;
  }
}
`
