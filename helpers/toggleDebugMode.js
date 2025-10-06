import { INITIAL_DEBUG_MODE } from "../constants.js";

let fpsMeter = null;
let framesSinceLastFpsSample = 0;
let fpsSampleTimestamp = null;
let debugMode = INITIAL_DEBUG_MODE;

function initFpsMeter() {
  if (fpsMeter) {
    return;
  }

  const el = document.createElement("div");
  el.id = "fps-meter";
  Object.assign(el.style, {
    position: "fixed",
    top: "12px",
    right: "16px",
    padding: "4px 8px",
    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: "12px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    background: "rgba(0, 0, 0, 0.6)",
    color: "#9be7ff",
    borderRadius: "4px",
    pointerEvents: "none",
    zIndex: "1000",
  });
  el.textContent = "-- fps";

  document.body.appendChild(el);
  fpsMeter = el;
  applyDebugMode();
}

export function updateFpsMeter(timestamp) {
  if (!fpsMeter || !debugMode) {
    return;
  }

  if (fpsSampleTimestamp === null) {
    fpsSampleTimestamp = timestamp;
    framesSinceLastFpsSample = 0;
    return;
  }

  framesSinceLastFpsSample += 1;
  const elapsed = timestamp - fpsSampleTimestamp;

  if (elapsed >= 500) {
    const fps = Math.round((framesSinceLastFpsSample / elapsed) * 1000);
    fpsMeter.textContent = `${fps} fps`;
    fpsSampleTimestamp = timestamp;
    framesSinceLastFpsSample = 0;
  }
}

function resetFpsMeter() {
  fpsSampleTimestamp = null;
  framesSinceLastFpsSample = 0;
  if (fpsMeter) {
    fpsMeter.textContent = "-- fps";
  }
}

function applyDebugMode() {
  const root = document.documentElement;
  if (debugMode) {
    root.classList.add("debug-mode");
  } else {
    root.classList.remove("debug-mode");
  }

  if (fpsMeter) {
    fpsMeter.style.display = debugMode ? "block" : "none";
  }
}

export function toggleDebugMode() {
  debugMode = !debugMode;
  if (debugMode) {
    initFpsMeter()
  } else {
    resetFpsMeter();
  }
  applyDebugMode();
}
