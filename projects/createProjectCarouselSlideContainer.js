import { setProjectCarouselSlideState } from "./setProjectCarouselSlideState.js";

const projectInstanceCounters = new Map();

const getNextInstanceId = (id) => {
  const nextCount = (projectInstanceCounters.get(id) ?? 0) + 1;
  projectInstanceCounters.set(id, nextCount);
  return `${id}-${nextCount}`;
};

export function createProjectCarouselSlideContainer(id, placement) {
  const container = document.querySelector("#container");
  const element = document.createElement("div");
  element.classList.add("project");
  const instanceId = getNextInstanceId(id);
  element.dataset.projectId = instanceId;
  element.dataset.projectKey = id;
  element.setAttribute("aria-hidden", "true");

  if (placement === 'active') {
    setProjectCarouselSlideState(element, 'active');
  } else {
    const initialState = placement === "left" ? "left" : "right";
    setProjectCarouselSlideState(element, initialState);
  }
  container.appendChild(element);

  return element;
}
