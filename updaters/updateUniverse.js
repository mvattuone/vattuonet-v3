import { lerp, unlerp } from "../helpers/index.js";
import {
  MAX_ALTITUDE,
  MAX_PERSPECTIVE_ORIGIN,
  MIN_PERSPECTIVE_ORIGIN,
  MIN_ALTITUDE,
} from "../constants.js";
import { getAirshipAltitude } from "../state/airship/altitude.js";

export function updateUniverse() {
  const airshipAltitude = getAirshipAltitude();

  const t = unlerp(MIN_ALTITUDE, MAX_ALTITUDE, airshipAltitude);

  const newUniversePerspectiveOrigin = lerp(
    MIN_PERSPECTIVE_ORIGIN,
    MAX_PERSPECTIVE_ORIGIN,
    t,
  );

  const universe = document.querySelector(".universe");
  // universe.style.setProperty("--universePerspective", `${newUniversePerspective}px`);
  universe.style.setProperty(
    "--perspective-origin",
    `50% calc(50% + ${newUniversePerspectiveOrigin}px)`,
  );
}
