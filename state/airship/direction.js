import { getCSSNumber } from "../../helpers/index.js";

const initialDirection = getCSSNumber(
  document.documentElement,
  "--worldRotateZ",
);

let direction = Number.isFinite(initialDirection) ? initialDirection : 0;

export function getAirshipDirection() {
  return direction;
}

export function setAirshipDirection(newDirection) {
  direction = newDirection; 
}
