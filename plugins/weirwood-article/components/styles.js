// Article furniture: the frontmatter metadata boxes and the connections band.
// Surface tokens (--ww-*) are defined in quartz/styles/custom.scss.
export const articleStyles = `
.ww-article-head {
  margin: 0;
}

/* --- metadata boxes ----------------------------------------------------- */
.ww-meta {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  text-align: left;
  margin: 22px 0 0 0;
}

.ww-meta-box {
  border: 1px solid var(--lightgray);
  border-radius: 5px;
  padding: 11px 13px;
  background: var(--ww-panel);
  min-width: 0;
}

.ww-meta-label {
  font-family: var(--codeFont);
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--gray);
  margin-bottom: 5px;
}

.ww-meta-value {
  font-family: var(--bodyFont);
  font-size: 15px;
  line-height: 1.35;
  color: var(--darkgray);
  overflow-wrap: break-word;
}

.ww-meta-value.ww-meta-accent {
  color: var(--secondary);
}

/* --- "the roots of this page" ------------------------------------------ */
/* Full-bleed band: the article column is padded, but this reaches the edges. */
.ww-roots {
  border-top: 1px solid var(--lightgray);
  border-bottom: 1px solid var(--lightgray);
  background: var(--ww-panel);
  padding: 24px 0 26px;
  margin: 26px 0 0 0;
  text-align: left;
}

.ww-roots-heading {
  font-family: var(--codeFont);
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gray);
  margin-bottom: 16px;
}

.ww-roots-grid {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 26px;
  align-items: start;
}

.ww-roots-label {
  font-family: var(--codeFont);
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #5f5344;
  margin-bottom: 10px;
}

/* --- greensight (the relocated local graph) ---------------------------- */
.ww-greensight-box {
  aspect-ratio: 1;
  border: 1px solid var(--lightgray);
  border-radius: 5px;
  background: var(--ww-graph-bg);
  overflow: hidden;
}

/* Quartz's Graph component carries its own heading and chrome; here the band
   supplies the label, so strip the component back to the canvas itself. */
.ww-greensight-box .graph > h3 {
  display: none;
}

.ww-greensight-box .graph > .graph-outer {
  height: 100%;
  margin: 0;
  border: none;
  border-radius: 0;
  background: transparent;
}

.ww-greensight-box .graph {
  height: 100%;
}

/* --- backlinks ---------------------------------------------------------- */
.ww-backlinks-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px 24px;
}

.ww-backlink {
  padding: 8px 0;
  border-bottom: 1px solid var(--ww-divider);
  min-width: 0;
}

.ww-backlink a {
  font-family: var(--bodyFont);
  font-size: 16px;
  font-weight: 400;
  color: var(--tertiary);
  background-color: transparent;
  padding: 0;
  text-decoration: none;
}

.ww-backlink a:hover {
  color: #e0715f;
}

.ww-backlinks-empty {
  font-family: var(--bodyFont);
  font-style: italic;
  font-size: 15px;
  color: var(--gray);
  margin: 0;
}

@media all and (max-width: 800px) {
  .ww-meta {
    grid-template-columns: repeat(2, 1fr);
  }

  .ww-roots-grid {
    grid-template-columns: 1fr;
  }

  .ww-greensight {
    max-width: 220px;
  }

  .ww-backlinks-grid {
    grid-template-columns: 1fr;
  }
}

@media all and (max-width: 480px) {
  .ww-meta {
    grid-template-columns: 1fr;
  }
}
`
