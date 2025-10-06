import { getFrameOffset, getMovementSpriteRow, unlerp } from "../helpers/index.js";
import { FRAME_COUNT, MIN_ALTITUDE, MAX_ALTITUDE } from "../constants.js";
import { getAirshipAltitude } from "../state/airship/altitude.js";
import { getPressedKeys } from "../state/pressedKeys.js";

let currentFrame = 0;
let lastFrameTime = 0;

export function updateAirship() {
  const airship = document.querySelector(".airship");
  if (!airship) {
    return;
  }
  const altitude = getAirshipAltitude();
  const timestamp = performance.now();
  const pressedKeys = getPressedKeys();
  const isMoving = pressedKeys.Space;
  const frameInterval = isMoving ? 25 : 100;

  if (timestamp - lastFrameTime > frameInterval) {
    currentFrame = (currentFrame + 1) % FRAME_COUNT;
    lastFrameTime = timestamp;
  }

  const spriteRow = getMovementSpriteRow();
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
}
