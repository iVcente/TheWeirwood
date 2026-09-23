// The tag page: hero, then the entries grouped by section. The hero's geometry,
// the mark over it and the entry card are weirwood-chrome's, whose stylesheet is
// emitted on every page; only what a tag page does differently is here.
//
// Where this file narrows one of those shared blocks it does so through a
// descendant selector (.ww-tag-entries .ww-entry), never by restating the bare
// class. Component stylesheets are concatenated in registry order, which is not
// a thing to rely on — the extra specificity is what makes the cascade order
// irrelevant.
//
// Keep this file at exactly two backticks — see the note in
// weirwood-chrome/components/styles.js for what a third one costs.
export const tagStyles = `
/* --- the hero ----------------------------------------------------------- */
/* The section hero's own band, unchanged — same ground, glow and weave, and the
   mark standing over the title in the same place. The only thing a tag hero
   does differently is which mark that is, because a tag has no section to be
   the emblem of.

   The title is the tag exactly as it is written in frontmatter, uppercased by
   the type rather than by the build: a hyphenated slug keeps its hyphen, and
   nothing here prettifies a word somebody chose. */

/* The tag's mark, standing above the title exactly as a section index stands
   its emblem — same size, same parchment, same gap. A mark behind the words is
   the article title block's alone, and that is deliberate: an entry is the one
   page whose title sits in front of an image.

   It is also what stopped the mark being cut. Held behind the title it had to
   be centred on a band shorter than itself, and the band paints
   overflow: hidden, so the bottom of a solid shape came off flat. In the flow
   it sets the band's height instead. */
.ww-tag-mark {
  display: block;
  margin: 0 auto 6px;
  color: var(--darkgray);
}

.ww-tag-kicker {
  font-family: var(--codeFont);
  font-size: 10px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--gray);
  margin-bottom: 14px;
}

.ww-tag-title {
  font-family: var(--headerFont);
  font-weight: 700;
  font-size: 40px;
  line-height: 1;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--dark);
  margin: 0;
  text-wrap: balance;
}

/* Only /tags can carry one, from its own index note. A tag page has no
   frontmatter to write a description into, and an auto-generated line under a
   bare word would be filler. */
.ww-tag-desc {
  margin-top: 4px;
}

/* --- the entries, grouped by section ------------------------------------ */
.ww-tag-groups {
  padding-top: 26px;
  padding-bottom: 10px;
  text-align: left;
}

.ww-tag-group {
  margin-bottom: 24px;
}

.ww-tag-group-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.ww-tag-group-emblem {
  flex-shrink: 0;
  color: var(--secondary);
}

.ww-tag-group-label {
  font-family: var(--codeFont);
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #8a7b67;
  white-space: nowrap;
}

/* Runs out to the measure, so the subhead reads as a rule broken by a name. */
.ww-tag-group-rule {
  flex: 1;
  height: 1px;
  background: var(--lightgray);
}

/* One card per row, unlike the folder grid: the rows are what keep the section
   groups scannable, and a two-up grid would orphan every odd count. */
.ww-tag-entries {
  display: grid;
  gap: 10px;
}

/* Tighter than the same card on a section index — there are more of them here,
   and each one is a row rather than a cell. */
.ww-tag-entries .ww-entry {
  padding: 15px 18px;
}

.ww-tag-entries .ww-entry-title {
  font-size: 20px;
}

.ww-tag-entries .ww-entry-desc {
  margin-top: 6px;
  line-height: 1.6;
}

/* --- the tag index ------------------------------------------------------ */
/* /tags, which the bar's own context slot points at from every tag page: a card
   per tag, in the entry grid the folder pages use. */
.ww-tag-cards {
  margin-top: 30px;
}

.ww-tag-card .ww-entry-title {
  font-size: 20px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.ww-tag-card-count {
  font-family: var(--codeFont);
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--gray);
  margin: 10px 0 0;
}

/* --- narrow ------------------------------------------------------------- */
@media all and (max-width: 800px) {
  .ww-tag-title {
    font-size: 32px;
  }

  .ww-tag-mark {
    width: 180px;
    height: 180px;
  }
}
`
