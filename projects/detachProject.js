export async function detachProject(project, container) {
  if (!project?.handle || typeof project.handle.unmount !== "function") {
    container?.remove();
    return;
  }

  const rootSelectorOrNode = project.root;
  let scopedRoot = null;

  if (rootSelectorOrNode instanceof Element) {
    scopedRoot = rootSelectorOrNode;
  } else if (typeof rootSelectorOrNode === "string" && container) {
    scopedRoot = container.querySelector(rootSelectorOrNode);
  }

  await project.handle.unmount(scopedRoot ?? rootSelectorOrNode);
  container?.remove();
}
