// Thin wrapper around gtag so gameplay code doesn't depend directly
// on Google Analytics (or any specific analytics provider).
//
// If gtag isn't available for any reason (blocked, not yet loaded,
// running in a test/dev environment without index.html's inline
// script), calls become no-ops instead of throwing.

function isGtagAvailable() {
  return typeof gtag === "function";
}

export function trackEvent(eventName, params = {}) {
  if (!isGtagAvailable()) {
    return;
  }

  gtag("event", eventName, params);
}

export function trackWin(score) {
  trackEvent("win", {
    event_category: "game",
    event_label: "win",
    value: score,
  });
}

export function trackLose() {
  trackEvent("lose", {
    event_category: "game",
    event_label: "lose",
  });
}
