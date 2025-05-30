import { degToRad } from "./helpers/index.js";
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

function loop() {
  let paused = getPaused();
  const pressedKeys = getPressedKeys();
  if (!paused) {
    let altitude = getAirshipAltitude();
    let direction = getAirshipDirection();
    let spinRate = 0;
    const speed = 4; // shared movement speed

    if (pressedKeys.has("ArrowLeft")) {
      spinRate = 1;
    }
    if (pressedKeys.has("ArrowRight")) {
      spinRate = -1;
    }
    if (pressedKeys.has("ArrowUp")) {
      altitude -= 1;
      setAirshipAltitude(altitude);
    }
    if (pressedKeys.has("ArrowDown")) {
      altitude += 1;
      setAirshipAltitude(altitude);
    }

    const angleRad = degToRad(direction);

    const universePerspective = getUniversePerspective();
    const airshipDepth = getAirshipDepth();

    const parallaxFactor = (universePerspective -  airshipDepth) / universePerspective;
    
    direction += spinRate;
    setAirshipDirection(direction);

    if (pressedKeys.has("Space")) {
      setAirshipPosition((x, y) => ({
        x: x - Math.sin(angleRad) * speed,
        y: y - Math.cos(angleRad) * speed,
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

    const rotateLeft =
      pressedKeys.has("Space") && pressedKeys.has("ArrowRight");
    const rotateRight =
      pressedKeys.has("Space") && pressedKeys.has("ArrowLeft");
    if (rotateLeft) {
      setSkyRotateState("ROTATE_LEFT");
    } else if (rotateRight) {
      setSkyRotateState("ROTATE_RIGHT");
    } else {
      setSkyRotateState("DEFAULT");
    }

    if (pressedKeys.has("ArrowLeft") || pressedKeys.has("ArrowRight")) {
      const parallaxBoost = pressedKeys.has("Space") ? 1.75 : 1;
      const drift = speed * parallaxFactor * spinRate * parallaxBoost;
      setSkyPositionX((x) => x + drift);
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
  requestAnimationFrame(loop);
}

// --- simplest scheduler that writes to pressedKeys ---
// TODO: extract into a separate class or module

const sleep  = (ms) => new Promise(r => setTimeout(r, ms));
const randInt = (min, max) => Math.floor(Math.random()*(max-min+1))+min;

function press(keys) {
  const s = getPressedKeys();
  keys.forEach(k => s.add(k));
}
function release(keys) {
  const s = getPressedKeys();
  keys.forEach(k => s.delete(k));
}
function releaseAll() {
  const s = getPressedKeys();
  s.clear();
}

const PATTERNS = {
  STRAIGHT: { keys: ["Space"],             hold: [800, 2000] },
  STRAIGHT_UP: { keys: ["Space","ArrowDown"],             hold: [800, 2000] },
  STRAIGHT_DOWN: { keys: ["Space","ArrowUp"],             hold: [800, 2000] },
  BANK_R:   { keys: ["Space","ArrowUp","ArrowRight"], hold: [600, 1400] },
  BANK_L:   { keys: ["Space","ArrowUp","ArrowLeft"],  hold: [600, 1400] },
  ASCEND:    { keys: ["ArrowDown"],                      hold: [300, 700] },
  DESCEND:  { keys: ["ArrowUp"],                    hold: [200, 500] },
  ORBIT_R:  { keys: ["ArrowRight"],    hold: [200,500]},
  ORBIT_L:  { keys: ["ArrowLeft"],    hold: [180,320] },
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

const SLEEP_CHANCE = 1/7;

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

function startMeUp() {
  addControlListeners();
  window.addEventListener("keydown", (e) => {
    if (e.code === "KeyP" && !e.repeat) {
      setPaused(!getPaused());
    }
  });

  const pauseButton = document.querySelector('#pause');

  pauseButton.addEventListener('click', () => {
    demoRunning ? stopDemoScheduler() : startDemoScheduler();
    pauseButton.textContent = !demoRunning ? '▶' : '⏸';
    pauseButton.setAttribute('aria-label', !demoRunning ? 'Play' : 'Pause');
  });

  requestAnimationFrame(loop);
}

startMeUp();
