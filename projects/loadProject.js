const moduleCache = new Map();

export async function loadProject(entryUrl) {
  if (!entryUrl) {
    throw new Error("No entry URL supplied for project");
  }

  if (!moduleCache.has(entryUrl)) {
    const promise = import(/* @vite-ignore */ entryUrl);
    moduleCache.set(entryUrl, promise);
  }

  try {
    return await moduleCache.get(entryUrl);
  } catch (error) {
    moduleCache.delete(entryUrl);
    throw error;
  }
}
