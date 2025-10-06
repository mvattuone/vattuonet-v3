import { initialPressedKeys, setPressedKeys } from "../state/pressedKeys.js";
import { getDemoRunning, setDemoRunning } from "../state/demoRunning.js";

// TODO: extract into a separate module
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const demoButton = document.querySelector('#demo');

function press(keys) {
  const newPressedKeys = {}
  keys.forEach(key => {
    newPressedKeys[key] = true;
  });
  setPressedKeys((pressedKeys) => ({ ...pressedKeys, ...newPressedKeys }));
}

function release(keys) {
  const newPressedKeys = {}
  keys.forEach(key => {
    newPressedKeys[key] = false;
  });
  setPressedKeys((pressedKeys) => ({ ...pressedKeys, ...newPressedKeys }));
}

function releaseAll() {
  setPressedKeys(() => initialPressedKeys);
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

function stopDemoScheduler() {
  setDemoRunning(false);
  demoButton.classList.remove('active');
  releaseAll();
}

export async function startDemoScheduler() {
  setDemoRunning(true);
  releaseAll();
  demoButton.classList.add('active');
  while (getDemoRunning()) await runOnePattern();
}

export function toggleDemoScheduler() {
  const demoButton = document.querySelector("#demo");
  getDemoRunning() ? stopDemoScheduler() : startDemoScheduler();
  demoButton.setAttribute("aria-label", getDemoRunning() ? "Stop Demo" : "Start Demo");
}
