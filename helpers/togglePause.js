import { getPaused, setPaused } from "../state/paused.js";

export function togglePause() {
  const pauseButton = document.querySelector("#pause");
  setPaused(paused => !paused);
  pauseButton.classList.toggle('paused', getPaused());
  pauseButton.setAttribute("aria-label", getPaused() ? "Play" : "Pause");
}
