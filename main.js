import { SLIDE_TRANSITION_DURATION, PROJECTS as slides } from './constants.js';
import {
  createProjectCarouselSlideContainer,
  detachProject,
  loadProject,
  setProjectCarouselSlideState,
} from './projects/index.js';
import { forceReflow, getComputedTranslateX } from './utils/index.js';

const carousel = document.querySelector(".project-carousel");
const nextButton = carousel.querySelector(".carousel-button.next");
const prevButton = carousel.querySelector(".carousel-button.prev");
const siteHeader = document.querySelector('.site-header');
const appContainer = document.querySelector('#container');

let activeIndex = 0;

carousel.style.setProperty("--carousel-slide-count", String(slides.length));
carousel.style.setProperty("--carousel-nav-display", slides.length > 1 ? "grid" : "none");

const project = await loadProject(slides[activeIndex].remote);
const element = createProjectCarouselSlideContainer(slides[activeIndex].id, 'active');
setProjectCarouselSlideState(element, 'active');
await project.mount({container: element, root: slides[activeIndex].root});
slides[activeIndex].handle = project;

function getAdjacentIndex(delta) {
  if (slides.length === 0) {
    return 0;
  }
  const nextIndex = (activeIndex + delta + slides.length) % slides.length;
  return nextIndex;
}

function goToNext() {
  const targetIndex = getAdjacentIndex(1);
  goToSlide(targetIndex, "right");
}

function goToPrev() {
  const targetIndex = getAdjacentIndex(-1);
  goToSlide(targetIndex, "left");
}

async function goToSlide(targetIndex, direction) {
  const currentProject = slides[activeIndex];
  const nextProject = slides[targetIndex];

  if (!nextProject) {
    return;
  }

  const currentElement = document.querySelector('.project.active');
  const normalizedDirection = direction === 'left' ? 'left' : 'right';
  const outgoingState = normalizedDirection === 'right' ? 'left' : 'right';
  const incomingPlacement = normalizedDirection;
  const currentTranslateX = currentElement ? getComputedTranslateX(currentElement) : 0;
  const translateOffset = Number.isFinite(currentTranslateX) ? currentTranslateX : 0;
  const offsetValue = `${translateOffset}px`;

  let nextElement = null;

  try {
    const project = await loadProject(nextProject.remote);
    const previousOffsettedElements = carousel.querySelectorAll('.project.with-slide-offset');
    previousOffsettedElements.forEach((node) => {
      node.style.removeProperty("--slide-transition-offset-x");
      node.classList.remove("with-slide-offset");
    });

    nextElement = createProjectCarouselSlideContainer(nextProject.id, incomingPlacement);
    nextElement.style.setProperty("--slide-transition-offset-x", offsetValue);
    nextElement.classList.add("with-slide-offset");
    forceReflow(nextElement);
    slides[targetIndex].handle = project;

    await project.mount({container: nextElement, root: nextProject.root});
    if (currentElement) {
      setProjectCarouselSlideState(currentElement, outgoingState);
    }
    setProjectCarouselSlideState(nextElement, "active");
    activeIndex = targetIndex;

    const outgoingElement = currentElement;
    const incomingElement = nextElement;

    setTimeout(async () => {
      if (outgoingElement) {
        await detachProject(currentProject, outgoingElement);
      }
      if (incomingElement) {
        incomingElement.style.removeProperty("--slide-transition-offset-x");
        incomingElement.classList.remove("with-slide-offset");
      }
    }, SLIDE_TRANSITION_DURATION);
  } catch (error) {
    console.error(`Failed to mount project "${nextProject.id}"`, error);
    if (currentElement) {
      setProjectCarouselSlideState(currentElement, "active");
    }
    if (nextElement) {
      await detachProject(nextProject, nextElement);
      nextElement.style.removeProperty("--slide-transition-offset-x");
      nextElement.classList.remove("with-slide-offset");
    }
  } 
}

nextButton?.addEventListener("click", goToNext);
prevButton?.addEventListener("click", goToPrev);

function updateStageMetrics() {
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
  const headerHeight = siteHeader?.offsetHeight ?? 0;
  const availableHeight = Math.max(viewportHeight - headerHeight, 0);

  document.documentElement.style.setProperty('--stage-top', `${headerHeight}px`);

  if (appContainer) {
    appContainer.style.setProperty('--root-slot-height', `${availableHeight}px`);
    appContainer.style.setProperty('--root-slot-width', `${viewportWidth}px`);
  }
}

const scheduleStageMetrics = () => {
  requestAnimationFrame(updateStageMetrics);
};

updateStageMetrics();
window.addEventListener('resize', scheduleStageMetrics);
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', scheduleStageMetrics);
  window.visualViewport.addEventListener('scroll', scheduleStageMetrics);
}
