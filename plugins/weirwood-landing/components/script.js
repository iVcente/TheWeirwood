// Wires the "Open the greensight" button to Quartz's global-graph overlay.
//
// The overlay has no URL of its own — it is opened by clicking the small icon
// inside the Graph component, which the landing keeps off-screen. If that icon
// is ever absent the button hides itself rather than sitting there dead.
export const greensightScript = `
document.addEventListener("nav", () => {
  const cta = document.querySelector("[data-greensight]")
  if (!cta) return

  const icon = document.querySelector(".ww-graph-host .global-graph-icon")
  if (!icon) {
    cta.style.display = "none"
    return
  }

  const open = (event) => {
    // The graph closes its overlay from a document-level click on anything
    // that is neither the icon nor the graph container. Without this the CTA's
    // own click finishes bubbling straight after the synthetic one, so the
    // overlay opens and shuts inside a single press and appears dead.
    event.stopPropagation()
    icon.click()
  }
  cta.addEventListener("click", open)
  window.addCleanup(() => cta.removeEventListener("click", open))
})
`
