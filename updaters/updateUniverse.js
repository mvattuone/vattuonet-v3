import { lerp, unlerp } from "../helpers/index.js";
import {
  MAX_ALTITUDE,
  MAX_ALTITUDE_PERSPECTIVE_ORIGIN_Y,
  MIN_ALTITUDE_PERSPECTIVE_ORIGIN_Y,
  MIN_ALTITUDE,
} from "../constants.js";
import { getAirshipAltitude } from "../state/airship/altitude.js";

export function updateUniverse() {
  const airshipAltitude = getAirshipAltitude();

  const t = unlerp(MIN_ALTITUDE, MAX_ALTITUDE, airshipAltitude);

  const newUniversePerspectiveOriginY = lerp(
    MIN_ALTITUDE_PERSPECTIVE_ORIGIN_Y,
    MAX_ALTITUDE_PERSPECTIVE_ORIGIN_Y,
    t,
  );

  document.documentElement.style.setProperty(
    "--universePerspectiveOriginYOffset",
    `${newUniversePerspectiveOriginY}px`,
  );
}
