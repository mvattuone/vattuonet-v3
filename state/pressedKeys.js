export const initialPressedKeys = {
  Space: false,
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};

let pressedKeys = { ...initialPressedKeys };

export function getPressedKeys() {
  return pressedKeys;
}

export function setPressedKeys(updater) {
  const next = typeof updater === "function" ? updater({ ...pressedKeys }) : updater;
  if (!next || typeof next !== "object") {
    return pressedKeys;
  }

  pressedKeys = {
    Space: Boolean(next.Space),
    ArrowUp: Boolean(next.ArrowUp),
    ArrowDown: Boolean(next.ArrowDown),
    ArrowLeft: Boolean(next.ArrowLeft),
    ArrowRight: Boolean(next.ArrowRight),
  };

  return pressedKeys;
}

export function resetPressedKeys() {
  pressedKeys = { ...initialPressedKeys };
  return pressedKeys;
}
