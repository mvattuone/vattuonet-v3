export function setProjectCarouselSlideState(element, state) {
  if (!element) {
    return;
  }

  element.classList.remove("active", "slide-left", "slide-right");

  if (state === "active") {
    element.classList.add("active");
    element.setAttribute("aria-hidden", "false");
  } else {
    element.classList.add(`slide-${state}`);
    element.setAttribute("aria-hidden", "true");
  }
}

