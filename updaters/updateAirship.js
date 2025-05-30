import { getFrameOffset, getMovementSpriteRow, unlerp } from "../helpers/index.js";
import { getPressedKeys } from "../helpers/getPressedKeys.js";
import { FRAME_COUNT, MIN_ALTITUDE, MAX_ALTITUDE } from "../constants.js";
import { getAirshipAltitude } from "../state/airship/altitude.js";

const SKY_MOTION_CLASSES = [
  "slide-up-enter",
  "slide-up-exit",
  "slide-down-enter",
  "slide-down-exit",
  "rotate-left-enter",
  "rotate-left-exit",
  "rotate-right-enter",
  "rotate-right-exit",
];

function syncAirshipMotionClasses(airship, sky) {
  if (!sky) {
    for (const className of SKY_MOTION_CLASSES) {
      airship.classList.remove(className);
    }
    return;
  }

  const skyClassList = sky.classList;
  for (const className of SKY_MOTION_CLASSES) {
    airship.classList.toggle(className, skyClassList.contains(className));
  }
}

let currentFrame = 0;
let lastFrameTime = 0;

export function updateAirship() {
  const airship = document.querySelector(".airship");
  if (!airship) {
    return;
  }
  const sky = document.querySelector(".sky");
  const altitude = getAirshipAltitude();
  const timestamp = performance.now();
  const pressedKeys = getPressedKeys();
  const isMoving = pressedKeys.has("Space");
  const frameInterval = isMoving ? 25 : 100;

  syncAirshipMotionClasses(airship, sky);

  if (timestamp - lastFrameTime > frameInterval) {
    currentFrame = (currentFrame + 1) % FRAME_COUNT;
    lastFrameTime = timestamp;
  }

  const spriteRow = getMovementSpriteRow(airship);
  const [x, y] = getFrameOffset(spriteRow, currentFrame);
  airship.style.backgroundPosition = `${x}px ${y}px`;

  const altitudeRaw = unlerp(MIN_ALTITUDE, MAX_ALTITUDE, altitude);

  document.documentElement.style.setProperty(
    "--airshipAltitude",
    `${altitude}px`,
  );
  document.documentElement.style.setProperty(
    "--airshipAltitudeRaw",
    `${altitudeRaw}`,
  );

  // Depth stays fixed; no translateZ adjustment here.
}
