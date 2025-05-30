import { MAP_HEIGHT, MAP_WIDTH } from "../../../constants.js";

let posX = 0;
let posY = 0;

export function getAirshipPosition() {
  return { x: posX, y: posY };
}

export function setAirshipPosition(updater) {
  const next = updater(posX, posY);

  // Wrap airship's position around the map boundaries
  posX = ((next.x % MAP_WIDTH) + MAP_WIDTH) % MAP_WIDTH;
  posY = ((next.y % MAP_HEIGHT) + MAP_HEIGHT) % MAP_HEIGHT;
}
