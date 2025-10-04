import { clamp, getCSSNumber } from "../../helpers/index.js";
import { MAX_ALTITUDE, MIN_ALTITUDE } from "../../constants.js";

const initialAltitude = getCSSNumber(
  document.documentElement,
  "--airshipAltitude",
);

let altitude = clamp(initialAltitude, MIN_ALTITUDE, MAX_ALTITUDE);

export function getAirshipAltitude() {
  return altitude;
}

export function setAirshipAltitude(newAltitude) {
  altitude = clamp(newAltitude, MIN_ALTITUDE, MAX_ALTITUDE);
}
