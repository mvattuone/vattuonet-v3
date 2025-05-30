import { clamp } from "../../helpers/index.js";
import { MAX_ALTITUDE, MIN_ALTITUDE } from "../../constants.js";

let altitude = (MIN_ALTITUDE + MAX_ALTITUDE) / 2;

export function getAirshipAltitude() {
  return altitude;
}

export function setAirshipAltitude(newAltitude) {
  altitude = clamp(newAltitude, MIN_ALTITUDE, MAX_ALTITUDE);
}
