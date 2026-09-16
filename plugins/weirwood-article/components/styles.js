// Article furniture: the title block, the frontmatter boxes and the connections
// band. The bands, chips and greensight panel these sit in are shared with the
// folder page and styled by weirwood-chrome, whose stylesheet is emitted on
// every page; only what is particular to an entry is here.
//
// Keep this file at exactly two backticks — see the note in
// weirwood-chrome/components/styles.js for what a third one costs.
export const articleStyles = `
/* The reading measure, narrower than the chrome's. Set on the wrapper so every
   band inside it — title block, boxes, roots — lines up with the prose. */
.ww-article-head {
  --ww-band: var(--ww-measure);
  --ww-band-pad: 24px;
}

/* --- title block -------------------------------------------------------- */
.ww-title-block {
  position: relative;
  overflow: hidden;
  padding: 40px 0 34px;
  text-align: center;
  /* Softer than the section hero's: an entry is a page in the chronicle, not
     the front of a chapter. */
  background-image: radial-gradient(
    70% 90% at 50% 18%,
    rgba(178, 58, 46, 0.13) 0%,
    rgba(178, 58, 46, 0.04) 52%,
    transparent 82%
  );
}

.ww-title-watermark {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -52%);
  width: 200px;
  height: 200px;
  color: var(--secondary);
  opacity: 0.12;
  filter: drop-shadow(0 0 34px rgba(178, 58, 46, 0.5));
  pointer-events: none;
}

.ww-title-inner {
  position: relative;
}

.ww-title {
  font-family: var(--headerFont);
  font-weight: 600;
  font-size: 36px;
  line-height: 1.1;
  letter-spacing: 0.02em;
  color: var(--dark);
  margin: 0;
  text-wrap: balance;
}

/* House words and other mottoes, from the frontmatter key of the same name. */
.ww-words {
  font-family: var(--bodyFont);
  font-style: italic;
  font-size: 18px;
  color: var(--ww-muted);
  margin: 10px 0 0;
}

.ww-title-inner .ww-chips {
  justify-content: center;
  margin-top: 18px;
}

/* --- frontmatter boxes -------------------------------------------------- */
/* One box per key the note actually carries, so the count and the kind of
   boxes vary per entry. auto-fit wraps 4 to 2 to 1 without a media query. */
.ww-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
  text-align: left;
  margin: 24px auto 0;
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

/* --- the roots of this page --------------------------------------------- */
.ww-article-head .ww-roots {
  margin-top: 30px;
}
`
