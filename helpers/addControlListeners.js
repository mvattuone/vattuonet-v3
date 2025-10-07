import { setPressedKeys } from "../state/pressedKeys.js";
import { toggleDemoScheduler } from "./toggleDemoScheduler.js";
import { toggleDebugMode } from "./toggleDebugMode.js";
import { getPaused, setPaused } from "../state/paused.js";

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

  const hasTouchSupport =
    "ontouchstart" in window ||
    (window.navigator && window.navigator.maxTouchPoints > 0);

  if (!hasTouchSupport) {
    return;
  }

  let joystickActive = false;
  let originX = 0;
  let originY = 0;

  const TOUCH_DRIFT_THRESHOLD = 30;

  const updateFromTouch = (deltaX, deltaY) => {
    setPressedKeys(prev => ({
      ...prev,
      Space: true,
      ArrowLeft: deltaX < -TOUCH_DRIFT_THRESHOLD,
      ArrowRight: deltaX > TOUCH_DRIFT_THRESHOLD,
      ArrowUp: deltaY < -TOUCH_DRIFT_THRESHOLD,
      ArrowDown: deltaY > TOUCH_DRIFT_THRESHOLD,
    }));
  };

  const beginTouch = (x, y) => {
    joystickActive = true;
    originX = x;
    originY = y;
    updateFromTouch(0, 0);
  };

  const moveTouch = (x, y) => {
    if (!joystickActive) {
      return;
    }
    const deltaX = x - originX;
    const deltaY = y - originY;
    updateFromTouch(deltaX, deltaY);
  };

  const endTouch = () => {
    if (!joystickActive) {
      return;
    }
    joystickActive = false;
    setPressedKeys(prev => ({
      ...prev,
      Space: false,
      ArrowLeft: false,
      ArrowRight: false,
      ArrowUp: false,
      ArrowDown: false,
    }));
  };

  const handleTouchStart = (event) => {
    if (joystickActive) {
      return;
    }
    const touch = event.changedTouches && event.changedTouches[0];
    if (!touch) {
      return;
    }
    if (event.target && event.target.closest && event.target.closest("button, a")) {
      return;
    }
    beginTouch(touch.clientX, touch.clientY);
    event.preventDefault();
  };

  const handleTouchMove = (event) => {
    if (!joystickActive) {
      return;
    }
    const touch = event.changedTouches && event.changedTouches[0];
    if (!touch) {
      return;
    }
    moveTouch(touch.clientX, touch.clientY);
    event.preventDefault();
  };

  const handleTouchEnd = (event) => {
    if (!joystickActive) {
      return;
    }
    endTouch();
    event.preventDefault();
  };

  window.addEventListener("touchstart", handleTouchStart, { passive: false });
  window.addEventListener("touchmove", handleTouchMove, { passive: false });
  window.addEventListener("touchend", handleTouchEnd, { passive: false });
  window.addEventListener("touchcancel", handleTouchEnd, { passive: false });
}
