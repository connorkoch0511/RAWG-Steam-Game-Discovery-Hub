const STORAGE_KEY = "gdh_collection_v1";

function read() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function write(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getCollection() {
  const c = read();
  return {
    wishlist: c.wishlist || [],
    playing: c.playing || [],
    completed: c.completed || [],
  };
}

export function addToList(listName, game) {
  const c = getCollection();
  const item = { id: game.id, name: game.name, background_image: game.background_image || null };

  // remove from all lists first (keeps it clean)
  for (const k of ["wishlist", "playing", "completed"]) {
    c[k] = (c[k] || []).filter((x) => x.id !== item.id);
  }

  c[listName] = [item, ...(c[listName] || [])];
  write(c);
  return c;
}

export function removeFromAll(id) {
  const c = getCollection();
  for (const k of ["wishlist", "playing", "completed"]) {
    c[k] = (c[k] || []).filter((x) => x.id !== id);
  }
  write(c);
  return c;
}

export function findListFor(id) {
  const c = getCollection();
  for (const k of ["wishlist", "playing", "completed"]) {
    if ((c[k] || []).some((x) => x.id === id)) return k;
  }
  return null;
}