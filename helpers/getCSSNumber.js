export function getCSSNumber(el, name) {
  return parseFloat(getComputedStyle(el).getPropertyValue(name));
}
