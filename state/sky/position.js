import { getCSSNumber } from "../../helpers/index.js";

let skyPositionX = getCSSNumber(document.documentElement, '--skyPositionX');

export function getSkyPositionX() {
  return skyPositionX;
}

export function setSkyPositionX(updater) {
  skyPositionX = updater(skyPositionX);
  return skyPositionX;
}
