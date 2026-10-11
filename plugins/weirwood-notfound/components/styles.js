// The 404 page, and nothing else. The band is the section hero's arrangement —
// same ground, same heartglow over the same weave, contents held on the chrome
// measure by .ww-band-inner, which weirwood-chrome's stylesheet ships to every
// page. What differs is that this band is the WHOLE page, so it takes the
// leftover height rather than sitting at the top of it.
//
// The mark is the front door's own heart tree, loaded from
// quartz/static/weirwood.svg the way the landing loads it. Nothing here can
// colour it -- an SVG in an img is an isolated document and its fill is baked
// into the file.
//
// Keep this file at exactly two backticks — see the note in
// weirwood-chrome/components/styles.js for what a third one costs.
export const lostStyles = `
/* --- the band ----------------------------------------------------------- */
.ww-lost {
  position: relative;
  overflow: hidden;
  padding: 72px 0 64px;
  text-align: center;
  background-color: var(--light);
  /* Narrower and dimmer than a section hero's: it lights one small mark in the
     middle of an otherwise empty page, so a wide glow would read as a haze. */
  background-image:
    radial-gradient(60% 70% at 50% 34%, rgba(178, 58, 46, 0.12), transparent 75%),
    repeating-linear-gradient(135deg, rgba(255, 220, 180, 0.02) 0 2px, transparent 2px 11px);
}

.ww-lost-inner {
  position: relative;
}

/* --- the tree ----------------------------------------------------------- */
/* The front door's heart tree, small. It is an external SVG in an img, so it
   is an isolated document: the fill is baked into the file and nothing here can
   recolour it -- only its size and its place on the page are set from this
   side.

   Height in the aspect ratio of the source (506x510) rather than auto, so the
   line below it does not jump as the image decodes. */
.ww-lost-tree {
  display: block;
  width: 150px;
  height: 151px;
  margin: 0 auto;
}

/* --- the notice --------------------------------------------------------- */
/* The only place the number is printed. The sentence below says what happened;
   a 34px "404" over it would say it twice. */
.ww-lost-kicker {
  font-family: var(--codeFont);
  font-size: 10px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--gray);
  margin-top: 26px;
}

.ww-lost-title {
  font-family: var(--headerFont);
  font-weight: 700;
  font-size: 34px;
  line-height: 1.2;
  letter-spacing: 0.06em;
  color: var(--dark);
  margin: 14px 0 0;
  text-wrap: balance;
}

.ww-lost-rule {
  width: 60px;
  height: 1px;
  background: var(--secondary);
  margin: 22px auto;
}

.ww-lost-body {
  font-family: var(--bodyFont);
  font-size: 18px;
  line-height: 1.65;
  color: var(--darkgray);
  max-width: 40ch;
  margin: 0 auto;
  text-wrap: pretty;
}

/* One way out, and it is the only control on the page: the bar above still
   carries search and the greensight, so a list of suggestions here would be a
   third way of saying the same thing.

   The same treatment as the landing's .ww-cta -- dark inset ground, drawn round
   in the palette's red, filling red on hover -- at a smaller size. That pair is
   the front door's one gesture; this is an invitation off a dead end.

   The border is --secondary rather than the dimmer --ww-glow-edge for the
   reason written up beside that rule: on a ground this dark an edge that quiet
   leaves the button with nothing to find it by. */
.ww-lost-cta {
  display: inline-block;
  margin-top: 32px;
  font-family: var(--codeFont);
  /* base.scss weights every anchor semibold. */
  font-weight: 400;
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #f3e8d2;
  background-color: var(--highlight);
  border: 1px solid var(--secondary);
  border-radius: 4px;
  padding: 11px 18px;
  text-decoration: none;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.ww-lost-cta:hover {
  background-color: var(--secondary);
  border-color: var(--secondary);
  color: #f3e8d2;
}

/* --- one screen --------------------------------------------------------- */
/* The page is three things tall — bar, notice, closing bar — on a viewport
   that is far taller, and the grid in custom.scss already hands the slack to
   the row the body sits in. This is the chain that carries it down to the band,
   so the tree rests in the middle of the screen instead of clinging to the bar
   with bare ground underneath. Same arrangement the front door uses.

   Scoped to the slug rather than the frame: the frame is what makes the page,
   but the flex chain is about this page being short. */
body[data-slug="404"] .center.full-width,
body[data-slug="404"] .page-header,
body[data-slug="404"] .page-header > .popover-hint,
body[data-slug="404"] .ww-lost {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

body[data-slug="404"] .page-header,
body[data-slug="404"] .page-header > .popover-hint,
body[data-slug="404"] .ww-lost {
  flex: 1;
}

body[data-slug="404"] .ww-lost {
  justify-content: center;
}

/* --- narrow ------------------------------------------------------------- */
@media all and (max-width: 800px) {
  .ww-lost {
    padding: 52px 0 48px;
  }

  .ww-lost-tree {
    width: 120px;
    height: 121px;
  }

  .ww-lost-title {
    font-size: 27px;
  }
}
`
