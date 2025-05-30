import { getAirshipPosition } from "../state/airship/position.js";
import { getAirshipDirection } from "../state/airship/direction.js";

export function updateWorld() {
  const airshipPosition = getAirshipPosition();
  const airshipDirection = getAirshipDirection();

  document.documentElement.style.setProperty("--bgX", `${-airshipPosition.x}px`);
  document.documentElement.style.setProperty("--bgY", `${-airshipPosition.y}px`);
  document.documentElement.style.setProperty("--worldRotateZ", `${airshipDirection}deg`);
}
