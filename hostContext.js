const hostContexts = new Map();

function createCacheStore() {
  const store = new Map();

  return {
    write(key, value) {
      store.set(key, value);
      return value;
    },
    read(key) {
      return store.get(key);
    },
    delete(key) {
      return store.delete(key);
    },
    clear() {
      store.clear();
    },
    has(key) {
      return store.has(key);
    },
    entries() {
      return store.entries();
    },
  };
}

function createHostContext() {
  return {
    cache: createCacheStore(),
  };
}

export function getHostContext(projectId) {
  if (!projectId) {
    return createHostContext();
  }

  if (!hostContexts.has(projectId)) {
    hostContexts.set(projectId, createHostContext());
  }

  return hostContexts.get(projectId);
}
