// Search preview: start at the top of the entry, without scrolling to get there.
//
// The search plugin scrolls its preview to the largest `.highlight` it finds
// (`scrollTop = offsetTop - 50`), which both drops you into the middle of the
// entry and — because macOS flashes its overlay scrollbar on any scroll, even a
// programmatic one — makes a scrollbar appear every time you hover a result.
//
// Undoing the scroll afterwards does not help: that is a second scroll, so the
// bar still flashes. Instead this stops the plugin finding anything to scroll
// to. The ordering is what makes it work:
//
//   1. the plugin appends `.preview-inner`, then registers its rAF;
//   2. this observer runs as a microtask — before that frame — and takes the
//      `highlight` class off, so the plugin's lookup comes back empty and it
//      returns without touching scrollTop;
//   3. a rAF registered here runs immediately after the plugin's, still before
//      paint, and puts the class back.
//
// The highlights render exactly as they always did, and nothing ever scrolls.
//
// This ships from weirwood-article only because it needs a home; component
// resources are emitted for every page regardless of where the component
// renders, so the behaviour applies site-wide.
export const previewTopScript = `
document.addEventListener("nav", () => {
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
