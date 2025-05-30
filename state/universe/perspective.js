import { getCSSNumber } from "../../helpers/index.js";

let perspective = getCSSNumber(document.documentElement, '--universePerspective');

export function getUniversePerspective() {
  return perspective;
}

export function setUniversePerspective(newPerspective) {
  perspective = newPerspective;
}
