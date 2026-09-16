import { h } from "preact"
import { GreensightMark } from "./emblems.js"

/**
 * The wide greensight panel that closes both a folder page and an article. It
 * is a button, not a link: the graph is an overlay with no URL of its own, so
 * the script wires every [data-greensight] control on the page to the icon
 * inside the off-screen graph the header parks there.
 *
 * `size` picks the two treatments the handoff specifies — a folder's is
 * slightly smaller than an article's.
 */
export const GreensightBox = ({ heading = "Greensight", sub, size = "folder" }) =>
  h(
    "button",
    {
      type: "button",
      class: `ww-greensight ww-greensight--${size}`,
      "data-greensight": "",
    },
    [
      // The glyph rides on the heading's own line, and the sub-label centres
      // under the pair rather than under the words alone.
      h("span", { class: "ww-greensight-line" }, [
        h(GreensightMark, {
          size: size === "article" ? 32 : 26,
          class: "ww-greensight-mark",
        }),
        h("span", { class: "ww-greensight-heading" }, heading),
      ]),
      sub ? h("span", { class: "ww-greensight-sub" }, sub) : null,
    ],
  )
