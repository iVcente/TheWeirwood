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
  background-color: var(--light);
  /* Heartglow first so it sits above the weave: red weirwood leaves lighting
     the top of the page, over a barely-there warm pinstripe. */
  background-image:
    radial-gradient(
      90% 85% at 50% 26%,
      rgba(178, 58, 46, 0.16) 0%,
      rgba(178, 58, 46, 0.06) 42%,
      transparent 74%
    ),
    repeating-linear-gradient(135deg, rgba(255, 220, 180, 0.02) 0 2px, transparent 2px 11px);
}

.ww-tree-host {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.ww-tree {
  width: 100%;
  height: 100%;
  opacity: 0.16;
}

.ww-tree-limbs {
  stroke: var(--secondary);
  stroke-width: 2;
  stroke-linecap: round;
  fill: none;
}

.ww-tree-catkins {
  fill: var(--secondary);
}

.ww-hero-inner {
  position: relative;
}

.ww-kicker {
  font-family: var(--codeFont);
  font-size: 10px;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  color: var(--gray);
  margin-bottom: 26px;
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

.ww-cta {
  display: inline-block;
  font-family: var(--codeFont);
  font-size: 12px;
  letter-spacing: 0.08em;
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
