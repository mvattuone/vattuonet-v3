import { getCSSNumber } from "../../helpers/index.js";

let altitude = getCSSNumber(
  document.documentElement,
  "--airshipAltitude",
);

export function getAirshipAltitude() {
  return altitude;
}

export function setAirshipAltitude(newAltitude) {
  altitude = newAltitude;
}
