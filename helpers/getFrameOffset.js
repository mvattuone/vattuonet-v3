import { SPRITE_SIZE } from "../constants.js";

// Returns the [x, y] offset in pixels for a given direction/frame
export function getFrameOffset(directionIndex, frame) {
  return [-frame * SPRITE_SIZE, -directionIndex * SPRITE_SIZE];
}
