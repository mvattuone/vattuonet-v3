import { DEMO_ACTIVE_ON_LOAD } from "../constants.js";

let demoRunning = DEMO_ACTIVE_ON_LOAD;

export function getDemoRunning() {
  return demoRunning;
}

export function setDemoRunning(updater) {
  demoRunning = typeof updater === 'function' ? updater(demoRunning) : updater;
}
