import {
  MAX_ALTITUDE,
  MAX_WORLD_TILT,
  MIN_ALTITUDE,
  MIN_WORLD_TILT,
} from "../../constants.js";
import { getAirshipPosition } from "../state/airship/position.js";
import { getAirshipAltitude } from "../state/airship/altitude.js";
import { getAirshipDirection } from "../state/airship/direction.js";
import { lerp, unlerp } from "../helpers/index.js";

export function updateWorld() {
  const airshipPosition = getAirshipPosition();
  const airshipAltitude = getAirshipAltitude();
  const airshipDirection = getAirshipDirection();

  const t = unlerp(MIN_ALTITUDE, MAX_ALTITUDE, airshipAltitude);

  const newWorldTilt = lerp(MIN_WORLD_TILT, MAX_WORLD_TILT, t);

  document.documentElement.style.setProperty("--bgX", `${-airshipPosition.x}px`);
  document.documentElement.style.setProperty("--bgY", `${-airshipPosition.y}px`);
  document.documentElement.style.setProperty("--worldTilt", `${newWorldTilt}deg`);
  document.documentElement.style.setProperty("--worldRotateZ", `${airshipDirection}deg`);
}
