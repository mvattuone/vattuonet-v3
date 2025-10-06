export const initialPressedKeys = {
  Space: false,
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
}

let pressedKeys = initialPressedKeys; 

export function getPressedKeys() {
  return pressedKeys;
}

export function setPressedKeys(updater) {
  pressedKeys = updater(pressedKeys);
  return pressedKeys;
}
