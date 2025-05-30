import { getSkySlideState } from "../state/sky/skySlideState.js";
import { getSkyRotateState } from "../state/sky/skyRotateState.js";
import { getSkyPositionX } from "../state/sky/position.js";

export function updateSky() {
  const skySlideState = getSkySlideState();
  const skyRotateState = getSkyRotateState();

  const sky = document.querySelector(".sky");

  // Apply accumulated X to background-position (CSS handles looping via repeat)
  sky.style.setProperty("--skyPositionX", `${getSkyPositionX()}px`);

  if (skySlideState === "DEFAULT") {
    if (sky.classList.contains("slide-down-enter")) {
      sky.classList.remove("slide-down-enter");
      sky.classList.add("slide-down-exit");
      setTimeout(() => {
        sky.classList.remove("slide-down-exit");
      }, 150);
    }

    if (sky.classList.contains("slide-up-enter")) {
      sky.classList.remove("slide-up-enter");
      sky.classList.add("slide-up-exit");
      setTimeout(() => {
        sky.classList.remove("slide-up-exit");
      }, 150);
    }
  }

  if (skyRotateState === "DEFAULT") {
    if (sky.classList.contains("rotate-left-enter")) {
      sky.classList.remove("rotate-left-enter");
      sky.classList.add("rotate-left-exit");
      setTimeout(() => {
        sky.classList.remove("rotate-left-exit");
      }, 150);
    }

    if (sky.classList.contains("rotate-right-enter")) {
      sky.classList.remove("rotate-right-enter");
      sky.classList.add("rotate-right-exit");
      setTimeout(() => {
        sky.classList.remove("rotate-right-exit");
      }, 150);
    }
  }

  if (skySlideState === "SLIDE_DOWN") {
    sky.classList.add("slide-down-enter");
  }

  if (skySlideState === "SLIDE_UP") {
    sky.classList.add("slide-up-enter");
  }

  if (skyRotateState === "ROTATE_LEFT") {
    sky.classList.add("rotate-left-enter");
  }

  if (skyRotateState === "ROTATE_RIGHT") {
    sky.classList.add("rotate-right-enter");
  }
}
