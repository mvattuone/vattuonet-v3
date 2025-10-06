import { setPressedKeys } from "../state/pressedKeys.js";
import { toggleDemoScheduler } from "./toggleDemoScheduler.js";
import { toggleDebugMode } from "./toggleDebugMode.js";

function keydownHandler(e) {
    if ((e.ctrlKey || e.metaKey) && e.code === "KeyD" && !e.repeat) {
      e.preventDefault();
      toggleDebugMode();
      return;
    }

    if (e.code === "KeyP" && !e.repeat) {
      setPaused(!getPaused());
      return;
    }

    if (e.code === "Tab" && !e.repeat) {
      toggleDemoScheduler();
      return;
    }

    setPressedKeys(pressedKeys => ({ ...pressedKeys, [e.code]: true }));
  }

function keyupHandler(e) {
    setPressedKeys(pressedKeys => ({ ...pressedKeys, [e.code]: false }));
}

export function addControlListeners() {
  window.addEventListener("keydown", keydownHandler);
  window.addEventListener("keyup", keyupHandler);
}
