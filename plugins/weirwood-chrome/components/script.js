// Everything the chrome needs at runtime. Ships from the header component
// because that is the one that renders on every page but the front door;
// component scripts are emitted site-wide regardless, so both behaviours below
// apply everywhere — including the landing, whose own greensight button this
// also wires.
//
// Keep this file at exactly two backticks.
export const chromeScript = `
document.addEventListener("nav", () => {
  // --- greensight ---------------------------------------------------------
  // The overlay has no URL of its own: it is opened by clicking the small icon
  // inside Quartz's Graph component, which every page parks off-screen. One
  // handler for every [data-greensight] control on the page — the button in
  // the bar, the panel in the roots band, and the front door's CTA. Wiring
  // them from two different plugins would open and shut the overlay inside a
  // single press, so this is deliberately the only place it happens.
  const icon = document.querySelector(".ww-graph-host .global-graph-icon")
  const controls = document.querySelectorAll("[data-greensight]")

  for (const control of controls) {
    if (!icon) {
      // Rather than sit there dead.
      control.style.display = "none"
      continue
    }

    const open = (event) => {
      // The graph closes its overlay from a document-level click on anything
      // that is neither the icon nor the graph container. Without this the
      // control's own click finishes bubbling straight after the synthetic
      // one, so the overlay opens and shuts inside a single press.
      event.stopPropagation()
      icon.click()
    }
    control.addEventListener("click", open)
    window.addCleanup(() => control.removeEventListener("click", open))
  }

  // --- search preview -----------------------------------------------------
  // Start the preview at the top of the entry, without scrolling to get there.
  //
  // The search plugin scrolls its preview to the largest .highlight it finds
  // (scrollTop = offsetTop - 50), which both drops you into the middle of the
  // entry and — because macOS flashes its overlay scrollbar on any scroll,
  // even a programmatic one — makes a scrollbar appear every time you hover a
  // result.
  //
  // Undoing the scroll afterwards does not help: that is a second scroll, so
  // the bar still flashes. Instead this stops the plugin finding anything to
  // scroll to. The ordering is what makes it work:
  //
  //   1. the plugin appends .preview-inner, then registers its rAF;
  //   2. this observer runs as a microtask — before that frame — and takes the
  //      highlight class off, so the plugin's lookup comes back empty and it
  //      returns without touching scrollTop;
  //   3. a rAF registered here runs immediately after the plugin's, still
  //      before paint, and puts the class back.
  //
  // The highlights render exactly as they always did, and nothing scrolls.
  const layout = document.querySelector(".search-layout")
  if (!layout || layout.dataset.wwPreviewTop) return
  layout.dataset.wwPreviewTop = "1"

  const observer = new MutationObserver((records) => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node.nodeType !== 1 || !node.classList.contains("preview-inner")) continue

        const marks = node.querySelectorAll(".highlight")
        if (marks.length > 0) {
          marks.forEach((mark) => mark.classList.remove("highlight"))
          requestAnimationFrame(() => {
            marks.forEach((mark) => mark.classList.add("highlight"))
          })
        }

        // Emptying the container already clamps this to zero, so in practice
        // there is nothing to do — guarded so it never becomes a scroll of its
        // own on the rare occasion it is not.
        const container = node.closest(".preview-container")
        if (container && container.scrollTop !== 0) container.scrollTop = 0
      }
    }
  })

  // The container is created lazily when search first opens, so watch the
  // layout rather than the container itself.
  observer.observe(layout, { childList: true, subtree: true })
  window.addCleanup(() => observer.disconnect())
})
`
