import { clamp, degToRad, wrap } from "./helpers/index.js";
import {
  addControlListeners,
} from "./helpers/addControlListeners.js";
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
  MAP_HEIGHT,
  MAP_WIDTH,
  MAX_ALTITUDE,
  MIN_ALTITUDE,
  SPIN_DEGREES_PER_SECOND,
  SKY_WRAP_WIDTH,
} from "./constants.js";
import { getPressedKeys } from "./state/pressedKeys.js";
import { togglePause } from "./helpers/togglePause.js";
import { startDemoScheduler, toggleDemoScheduler } from "./helpers/toggleDemoScheduler.js";
import { resetFpsMeter, updateFpsMeter } from "./helpers/toggleDebugMode.js";
import { getDemoRunning } from "./state/demoRunning.js";


let lastFrameTime = null;
const FRAME_DURATION_MS = 1000 / FRAME_RATE;
const FRAME_DURATION_SECONDS = 1 / FRAME_RATE;

let nextFrameTimeoutId = null;
let accumulator = 0;
let pausedBeforeVisibilityChange = null;



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

  if (pressedKeys.ArrowLeft) {
    spinDirection = 1;
  }
  if (pressedKeys.ArrowRight) {
    spinDirection = -1;
  }
  if (pressedKeys.ArrowUp) {
    altitude -= ALTITUDE_UNITS_PER_SECOND * deltaSeconds;
    setAirshipAltitude(clamp(altitude, MIN_ALTITUDE, MAX_ALTITUDE));
  }
  if (pressedKeys.ArrowDown) {
    altitude += ALTITUDE_UNITS_PER_SECOND * deltaSeconds;
    setAirshipAltitude(clamp(altitude, MIN_ALTITUDE, MAX_ALTITUDE));
  }

  const universePerspective = getUniversePerspective();
  const airshipDepth = getAirshipDepth();

  const parallaxFactor =
    (universePerspective - airshipDepth) / universePerspective;

  direction += spinDirection * SPIN_DEGREES_PER_SECOND * deltaSeconds;
  setAirshipDirection(wrap(direction, 360));

  if (pressedKeys.Space) {
    const angleRad = degToRad(direction);
    const moveDistance = AIRSHIP_SPEED_PER_SECOND * deltaSeconds;
    setAirshipPosition(({ x, y }) => ({
      x: wrap(x - Math.sin(angleRad) * moveDistance, MAP_WIDTH),
      y: wrap(y - Math.cos(angleRad) * moveDistance, MAP_HEIGHT)
    }));
  }

  const slideDown = pressedKeys.Space && pressedKeys.ArrowDown;
  const slideUp = pressedKeys.Space && pressedKeys.ArrowUp;
  if (slideDown) {
    setSkySlideState("SLIDE_DOWN");
  } else if (slideUp) {
    setSkySlideState("SLIDE_UP");
  } else {
    setSkySlideState("DEFAULT");
  }

  const rotateLeft = pressedKeys.Space && pressedKeys.ArrowRight;
  const rotateRight = pressedKeys.Space && pressedKeys.ArrowLeft;
  if (rotateLeft) {
    setSkyRotateState("ROTATE_LEFT");
  } else if (rotateRight) {
    setSkyRotateState("ROTATE_RIGHT");
  } else {
    setSkyRotateState("DEFAULT");
  }

  if (pressedKeys.ArrowLeft || pressedKeys.ArrowRight) {
    const parallaxBoost = pressedKeys.Space ? 1.75 : 1;
    const driftPerSecond =
      AIRSHIP_SPEED_PER_SECOND * parallaxFactor * spinDirection * parallaxBoost;
    setSkyPositionX((x) => wrap(x + driftPerSecond * deltaSeconds, SKY_WRAP_WIDTH));
  }

  updateWorld();
  updateAirship();
  updateAirshipShadow();
  updateUniverse();
  updateSky();
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

  while (accumulator >= FRAME_DURATION_MS) {
    step(FRAME_DURATION_SECONDS);
    accumulator -= FRAME_DURATION_MS;
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


function startMeUp() {
  const pauseButton = document.querySelector("#pause");
  const demoButton = document.querySelector("#demo");

  addControlListeners();
  pauseButton.addEventListener("mousedown", e => e.preventDefault());
  pauseButton.addEventListener("click", togglePause);

  demoButton.addEventListener("mousedown", e => e.preventDefault());
  demoButton.addEventListener("click", toggleDemoScheduler);

  document.addEventListener("visibilitychange", handleVisibilityChange);

  if (getDemoRunning) { startDemoScheduler() }

  requestAnimationFrame(loop);
}

startMeUp();
