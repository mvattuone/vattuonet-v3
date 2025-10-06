import { getCSSNumber } from "../../helpers";

let airshipPosition = {
  x: getCSSNumber(
    document.documentElement,
    "--bgX",
  ),
  y: getCSSNumber(
    document.documentElement,
    "--bgY",
  ),
}

export function getAirshipPosition() {
  return airshipPosition;
}

export function setAirshipPosition(updater) {
  airshipPosition = updater(airshipPosition);
  return airshipPosition;
}
