import path from "path"
import fs from "fs/promises"
import sharp from "sharp"
import { joinSegments } from "@quartz-community/utils/path"

/**
 * The home-screen icon, emitted at the site root under the two names WebKit
 * guesses.
 *
 * Head.tsx declares one icon and no <link rel="apple-touch-icon">. When a
 * WebKit browser wants a high-resolution icon and finds none declared, the
 * rule is to probe the site root: apple-touch-icon-precomposed.png first, then
 * apple-touch-icon.png. Both missed, which is the pair of 404s the dev server
 * logs whenever Safari goes looking — on a bookmark, a tab preview, or an
 * "add to home screen".
 *
 * Answering the probe is deliberately done HERE rather than with a link tag,
 * because a link tag would mean a third LOCAL MODIFICATION in Head.tsx for a
 * Quartz upgrade to revert silently. The guess path is the whole point of the
 * convention: a file at the root needs nothing in the document to be found.
 * Both names are written — the precomposed one is asked for first, and
 * "precomposed" has meant nothing since iOS 7 stopped adding the gloss, so the
 * same bytes serve both and neither request misses.
 *
 * `source` defaults to the same file @quartz-community/favicon reads, so the
 * touch icon follows whenever icon.png is swapped between icon-face.png and
 * icon-tree.png (see the favicon note in CLAUDE.md) with nothing to remember
 * here. `background` matters because icon.png carries an alpha channel and iOS
 * composites a transparent home-screen icon onto black; flattening onto the
 * landing's own #2b1813 — the theme-color in Head.tsx — keeps the carved face
 * on the ground the rest of the site gives it.
 */
const DEFAULTS = {
  source: "quartz/static/icon.png",
  size: 180,
  background: "#2b1813",
}

const NAMES = ["apple-touch-icon-precomposed.png", "apple-touch-icon.png"]

export const plugin = (opts) => {
  const { source, size, background } = { ...DEFAULTS, ...(opts ?? {}) }

  const write = async (outputDir, name, content) => {
    const out = joinSegments(outputDir, name)
    await fs.mkdir(path.dirname(out), { recursive: true })
    await fs.writeFile(out, content)
    return out
  }

  return {
    name: "WeirwoodTouchIcon",
    async *emit({ argv }) {
      const icon = await sharp(source)
        .resize(size, size, { fit: "cover" })
        .flatten({ background })
        .png()
        .toBuffer()

      for (const name of NAMES) {
        yield write(argv.output, name, icon)
      }
    },
    // Nothing here depends on content, so a partial rebuild has nothing to redo.
    async *partialEmit() {},
  }
}
