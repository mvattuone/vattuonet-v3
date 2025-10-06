import { degToRad, wrap } from "./helpers/index.js";
import {
  addControlListeners,
  getPressedKeys,
} from "./helpers/getPressedKeys.js";
import {
  updateAirship,
  updateAirshipShadow,
  updateWorld,
} from "./updaters/index.js";
import { setAirshipPosition } from "./state/airship/position.js";
import { getPaused, setPaused } from "./state/paused.js";
import {
  getAirshipDirection,
  setAirshipDirection,
} from "./state/airship/direction.js";
import {
  getAirshipAltitude,
  setAirshipAltitude,
} from "./state/airship/altitude.js";
import { setSkySlideState } from "./state/sky/skySlideState.js";
import { setSkyRotateState } from "./state/sky/skyRotateState.js";
import { updateUniverse } from "./updaters/updateUniverse.js";
import { updateSky } from "./updaters/updateSky.js";
import { setSkyPositionX } from "./state/sky/position.js";
import { getAirshipDepth } from "./state/airship/depth.js";
import { getUniversePerspective } from "./state/universe/perspective.js";

import {
  AIRSHIP_SPEED_PER_SECOND,
  ALTITUDE_UNITS_PER_SECOND,
  FRAME_RATE,
  SPIN_DEGREES_PER_SECOND,
} from "./constants.js";

const DEBUG = false;

let lastFrameTime = null;
const FRAME_DURATION_MS = 1000 / FRAME_RATE;
const FRAME_DURATION_SECONDS = 1 / FRAME_RATE;
const MAX_FRAME_LOOPS = 5;

let nextFrameTimeoutId = null;
let accumulator = 0;
let pausedBeforeVisibilityChange = null;
let fpsMeter = null;
let framesSinceLastFpsSample = 0;
let fpsSampleTimestamp = null;
let debugMode = DEBUG;

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

function updateFpsMeter(timestamp) {
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

function toggleDebugMode() {
  debugMode = !debugMode;
  resetFpsMeter();
  applyDebugMode();
}

function scheduleNextFrame() {
  if (nextFrameTimeoutId !== null) {
    clearTimeout(nextFrameTimeoutId);
  }

  nextFrameTimeoutId = setTimeout(() => {
    nextFrameTimeoutId = null;
    requestAnimationFrame(loop);
  }, FRAME_DURATION_MS);
}

function step(deltaSeconds) {
  if (getPaused()) {
    return;
  }

  const pressedKeys = getPressedKeys();
  let altitude = getAirshipAltitude();
  let direction = getAirshipDirection();
  let spinDirection = 0;

  if (pressedKeys.has("ArrowLeft")) {
    spinDirection = 1;
  }
  if (pressedKeys.has("ArrowRight")) {
    spinDirection = -1;
  }
  if (pressedKeys.has("ArrowUp")) {
    altitude -= ALTITUDE_UNITS_PER_SECOND * deltaSeconds;
    setAirshipAltitude(altitude);
  }
  if (pressedKeys.has("ArrowDown")) {
    altitude += ALTITUDE_UNITS_PER_SECOND * deltaSeconds;
    setAirshipAltitude(altitude);
  }

  const angleRad = degToRad(direction);

  const universePerspective = getUniversePerspective();
  const airshipDepth = getAirshipDepth();

  const parallaxFactor =
    (universePerspective - airshipDepth) / universePerspective;

  direction += spinDirection * SPIN_DEGREES_PER_SECOND * deltaSeconds;
  setAirshipDirection(wrap(direction, 360));

  if (pressedKeys.has("Space")) {
    const moveDistance = AIRSHIP_SPEED_PER_SECOND * deltaSeconds;
    setAirshipPosition((x, y) => ({
      x: x - Math.sin(angleRad) * moveDistance,
      y: y - Math.cos(angleRad) * moveDistance,
    }));
  }

  const slideDown = pressedKeys.has("Space") && pressedKeys.has("ArrowDown");
  const slideUp = pressedKeys.has("Space") && pressedKeys.has("ArrowUp");
  if (slideDown) {
    setSkySlideState("SLIDE_DOWN");
  } else if (slideUp) {
    setSkySlideState("SLIDE_UP");
  } else {
    setSkySlideState("DEFAULT");
  }

  const rotateLeft = pressedKeys.has("Space") && pressedKeys.has("ArrowRight");
  const rotateRight = pressedKeys.has("Space") && pressedKeys.has("ArrowLeft");
  if (rotateLeft) {
    setSkyRotateState("ROTATE_LEFT");
  } else if (rotateRight) {
    setSkyRotateState("ROTATE_RIGHT");
  } else {
    setSkyRotateState("DEFAULT");
  }

  if (pressedKeys.has("ArrowLeft") || pressedKeys.has("ArrowRight")) {
    const parallaxBoost = pressedKeys.has("Space") ? 1.75 : 1;
    const driftPerSecond =
      AIRSHIP_SPEED_PER_SECOND * parallaxFactor * spinDirection * parallaxBoost;
    setSkyPositionX((x) => x + driftPerSecond * deltaSeconds);
  }

  updateWorld();
  updateAirship();
  updateAirshipShadow();
  updateUniverse();
  updateSky();

  if (demoRunOnLoad) {
    startDemoScheduler();
    demoRunOnLoad = false;
  }
}

function loop(timestamp) {
  if (lastFrameTime === null) {
    lastFrameTime = timestamp;
    scheduleNextFrame();
    return;
  }

  const deltaMillis = timestamp - lastFrameTime;
  lastFrameTime = timestamp;

  accumulator += deltaMillis;

  const maxAccumulated = FRAME_DURATION_MS * MAX_FRAME_LOOPS;
  if (accumulator > maxAccumulated) {
    accumulator = maxAccumulated; // prevent runaway catch-up after tab focus change
  }

  let steps = 0;
  while (accumulator >= FRAME_DURATION_MS && steps < MAX_FRAME_LOOPS) {
    step(FRAME_DURATION_SECONDS);
    accumulator -= FRAME_DURATION_MS;
    steps += 1;
  }

  updateFpsMeter(timestamp);
  scheduleNextFrame();
}

function handleVisibilityChange() {
  if (document.visibilityState === "hidden") {
    pausedBeforeVisibilityChange = getPaused();
    if (!pausedBeforeVisibilityChange) {
      setPaused(true);
    }
    if (nextFrameTimeoutId !== null) {
      clearTimeout(nextFrameTimeoutId);
      nextFrameTimeoutId = null;
    }
    resetFpsMeter();
    accumulator = 0;
    lastFrameTime = null;
    return;
  }

  if (pausedBeforeVisibilityChange !== null) {
    setPaused(pausedBeforeVisibilityChange);
    pausedBeforeVisibilityChange = null;
  }
  resetFpsMeter();
  accumulator = 0;
  lastFrameTime = null;
  scheduleNextFrame();
}

// --- simplest scheduler that writes to pressedKeys ---
// TODO: extract into a separate class or module

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function press(keys) {
  const s = getPressedKeys();
  keys.forEach((k) => s.add(k));
}
function release(keys) {
  const s = getPressedKeys();
  keys.forEach((k) => s.delete(k));
}
function releaseAll() {
  const s = getPressedKeys();
  s.clear();
}

const PATTERNS = {
  STRAIGHT: { keys: ["Space"], hold: [800, 2000] },
  STRAIGHT_UP: { keys: ["Space", "ArrowDown"], hold: [800, 2000] },
  STRAIGHT_DOWN: { keys: ["Space", "ArrowUp"], hold: [800, 2000] },
  BANK_R: { keys: ["Space", "ArrowUp", "ArrowRight"], hold: [600, 1400] },
  BANK_L: { keys: ["Space", "ArrowUp", "ArrowLeft"], hold: [600, 1400] },
  ASCEND: { keys: ["ArrowDown"], hold: [300, 700] },
  DESCEND: { keys: ["ArrowUp"], hold: [200, 500] },
  ORBIT_R: { keys: ["ArrowRight"], hold: [200, 500] },
  ORBIT_L: { keys: ["ArrowLeft"], hold: [180, 320] },
};

function pickPatternName() {
  const d = randInt(0, 9);
  if (d === 1) return "STRAIGHT";
  if (d === 2) return "STRAIGHT_UP";
  if (d === 3) return "STRAIGHT_DOWN";
  if (d === 4) return "BANK_R";
  if (d === 5) return "BANK_L";
  if (d === 6) return "ASCEND";
  if (d === 7) return "DESCEND";
  if (d === 8) return "ORBIT_R";
  if (d === 9) return "ORBIT_L";
  return "STRAIGHT";
}

const SLEEP_CHANCE = 1 / 7;

async function maybeSleep(msMin = 200, msMax = 600) {
  if (Math.random() < SLEEP_CHANCE) {
    await sleep(randInt(msMin, msMax));
  }
}

async function runOnePattern() {
  const name = pickPatternName();
  const p = PATTERNS[name];

  press(p.keys);
  await sleep(randInt(p.hold[0], p.hold[1]));
  release(p.keys);

  await maybeSleep(0, 500);
}

let demoRunOnLoad = true;
let demoRunning = false;

async function startDemoScheduler() {
  if (demoRunning) return;
  demoRunning = true;
  releaseAll();
  while (demoRunning) await runOnePattern();
}

function stopDemoScheduler() {
  demoRunning = false;
  releaseAll();
}

const pauseButton = document.querySelector("#pause");

function toggleDemoScheduler() {
  demoRunning ? stopDemoScheduler() : startDemoScheduler();
  pauseButton.textContent = !demoRunning ? "▶" : "⏸";
  pauseButton.setAttribute("aria-label", !demoRunning ? "Play" : "Pause");
}

function startMeUp() {
  addControlListeners();
  initFpsMeter();
  resetFpsMeter();
  applyDebugMode();
  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.code === "KeyD" && !e.repeat) {
      e.preventDefault();
      toggleDebugMode();
      return;
    }

    if (e.code === "KeyP" && !e.repeat) {
      setPaused(!getPaused());
    }

    if (e.code === "Tab" && !e.repeat) {
      toggleDemoScheduler();
    }
  });


  pauseButton.addEventListener("click", toggleDemoScheduler);

  document.addEventListener("visibilitychange", handleVisibilityChange);

  requestAnimationFrame(loop);
}

startMeUp();

window.toggleDebugMode = toggleDebugMode;
