import { MAP_HEIGHT, MAP_WIDTH } from "../constants.js";
import { getAirshipPosition } from "../state/airship/position.js";
import { wrap } from "../helpers/index.js";

let minimapElement = null;
let worldElement = null;
let worldHalfHeight = MAP_HEIGHT / 2;
let cachedWorldHeight = null;

function getMinimapElement() {
  if (!minimapElement) {
    minimapElement = document.querySelector(".minimap");
  }
  return minimapElement;
}

function ensureWorldMetrics() {
  if (!worldElement) {
    worldElement = document.querySelector(".world");
  }

  if (!worldElement) {
    return;
  }

  const worldHeight = worldElement.offsetHeight;

  if (Number.isFinite(worldHeight) && worldHeight !== cachedWorldHeight) {
    cachedWorldHeight = worldHeight;
    worldHalfHeight = worldHeight / 2;
  }
}

export function updateMiniMap() {
  const minimap = getMinimapElement();
  if (!minimap) {
    return;
  }

  ensureWorldMetrics();

  const { x, y } = getAirshipPosition();

  const worldX = wrap(x + MAP_WIDTH / 2, MAP_WIDTH);
  const worldY = wrap(y + worldHalfHeight, MAP_HEIGHT);

  const normalizedX = worldX / MAP_WIDTH;
  const normalizedY = worldY / MAP_HEIGHT;

  minimap.style.setProperty("--minimapAirshipX", `${normalizedX}`);
  minimap.style.setProperty("--minimapAirshipY", `${normalizedY}`);
}
