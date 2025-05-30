import { getPressedKeys } from "./getPressedKeys.js";

// Determine sprite row based on currently pressed keys (movement state)
export function getMovementSpriteRow() {
  const pressedKeys = getPressedKeys();
  const left = pressedKeys.has("ArrowLeft");
  const right = pressedKeys.has("ArrowRight");
  const up = pressedKeys.has("ArrowUp");
  const down = pressedKeys.has("ArrowDown");

  // Priority order: vertical movement + horizontal, then horizontal, then forward/default
  if (up && left) return 7; // row 4: up-left
  if (up && right) return 8; // row 5: up-right
  if (down && left) return 4; // row 7: down-left
  if (down && right) return 5; // row 8: down-right
  if (up) return 6; // row 3: up
  if (down) return 3; // row 6: down
  if (left) return 1; // row 1: left
  if (right) return 2; // row 2: right

  return 0; // row 0: straight ahead (forward or idle)
}
