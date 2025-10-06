const ROTATE_LEFT_CLASSES = ["rotate-left-enter", "rotate-left-exit"];
const ROTATE_RIGHT_CLASSES = ["rotate-right-enter", "rotate-right-exit"];
const SLIDE_UP_CLASSES = ["slide-up-enter", "slide-up-exit"];
const SLIDE_DOWN_CLASSES = ["slide-down-enter", "slide-down-exit"];

function hasAny(classList, classNames) {
  for (const className of classNames) {
    if (classList.contains(className)) {
      return true;
    }
  }
  return false;
}

// Determine sprite row based on motion/rotation classes applied to the sky.
export function getMovementSpriteRow() {
  const sky = document.querySelector('.sky');
  const { classList } = sky;
  const right = hasAny(classList, ROTATE_LEFT_CLASSES);
  const left = hasAny(classList, ROTATE_RIGHT_CLASSES);
  const up = hasAny(classList, SLIDE_UP_CLASSES);
  const down = hasAny(classList, SLIDE_DOWN_CLASSES);

  if (up && left) return 7;
  if (up && right) return 8;
  if (down && left) return 4;
  if (down && right) return 5;
  if (up) return 6;
  if (down) return 3;
  if (left) return 1;
  if (right) return 2;

  return 0;
}
