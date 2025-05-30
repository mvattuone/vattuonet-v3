const _pressedKeys = new Set();

export function getPressedKeys() {
  return _pressedKeys;
}

export function addControlListeners() {
  window.addEventListener("keydown", (e) => _pressedKeys.add(e.code));
  window.addEventListener("keyup", (e) => _pressedKeys.delete(e.code));
}
