import { getCSSNumber } from "../../helpers/index.js";

let direction = getCSSNumber(
  document.documentElement,
  "--worldRotateZ",
);

export function getAirshipDirection() {
  return direction;
}

export function setAirshipDirection(newDirection) {
  direction = newDirection; 
}
