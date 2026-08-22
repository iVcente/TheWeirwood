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

  const open = () => icon.click()
  cta.addEventListener("click", open)
  window.addCleanup(() => cta.removeEventListener("click", open))
})
`
