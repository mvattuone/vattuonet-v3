import { getCSSNumber } from "../../helpers/index.js";

const SKY_WRAP_WIDTH = 768; // matches the primary cloud tile width after scaling

let skyPositionX = getCSSNumber(document.documentElement, '--skyPositionX');

function wrapSkyPosition(x) {
  if (!Number.isFinite(SKY_WRAP_WIDTH) || SKY_WRAP_WIDTH <= 0) return x;
  // Keep offset within [0, SKY_WRAP_WIDTH) to avoid precision drift over time.
  return ((x % SKY_WRAP_WIDTH) + SKY_WRAP_WIDTH) % SKY_WRAP_WIDTH;
}

export function getSkyPositionX() {
  return skyPositionX;
}

export function setSkyPositionX(updater) {
  skyPositionX = wrapSkyPosition(updater(skyPositionX));
}
