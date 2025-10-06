let paused = false;

export function getPaused() {
  return paused;
}

export function setPaused(updater) {
  paused = typeof updater === 'function' ? updater(paused) : updater;
}
