export function getComputedTranslateX(element) {
  let transform = window.getComputedStyle(element).transform;

  if (!transform || transform === "none") {
    return 0;
  }

  try {
    const matrix = new DOMMatrixReadOnly(transform);
    return matrix.e;
  } catch (error) {
    return 0;
  }
}
