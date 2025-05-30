import { getCSSNumber } from "../../helpers/index.js";

let depth = getCSSNumber(document.documentElement, '--airshipTranslateZ');

export function getAirshipDepth() {
  return depth;
}

export function setAirshipDepth(newDepth) {
  depth = newDepth;
}
