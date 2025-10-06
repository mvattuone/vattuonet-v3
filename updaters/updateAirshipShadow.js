import { unlerp } from '../helpers/index.js'
import { getAirshipAltitude } from '../state/airship/altitude.js';
import { MAX_ALTITUDE, MIN_ALTITUDE } from '../constants.js';

export function updateAirshipShadow() {
  const altitude = getAirshipAltitude();
  const altitudeRaw = unlerp(MIN_ALTITUDE, MAX_ALTITUDE, altitude);

  document.documentElement.style.setProperty(
    "--shadowScale",
    1 - (altitudeRaw / 2),
  );
}
