const API_BASE = import.meta.env.VITE_RAWG_API_BASE || "https://api.rawg.io/api";
const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

function assertKey() {
  if (!API_KEY) throw new Error("Missing VITE_RAWG_API_KEY in .env.local (restart dev server after adding).");
}

async function getJson(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`RAWG request failed (${res.status}): ${text.slice(0, 200)}`);
  }
  return res.json();
}

export async function getGenres() {
  assertKey();
  const url = new URL(`${API_BASE}/genres`);
  url.searchParams.set("key", API_KEY);
  url.searchParams.set("page_size", "50");
  return getJson(url.toString());
}

export async function getPlatforms() {
  assertKey();
  const url = new URL(`${API_BASE}/platforms`);
  url.searchParams.set("key", API_KEY);
  url.searchParams.set("page_size", "50");
  return getJson(url.toString());
}

export async function getGames(params = {}) {
  assertKey();
  const url = new URL(`${API_BASE}/games`);
  url.searchParams.set("key", API_KEY);
  url.searchParams.set("page_size", String(params.page_size ?? 24));
  url.searchParams.set("page", String(params.page ?? 1));

  if (params.search) url.searchParams.set("search", params.search);
  if (params.ordering) url.searchParams.set("ordering", params.ordering);
  if (params.genres) url.searchParams.set("genres", params.genres);
  if (params.platforms) url.searchParams.set("platforms", params.platforms);

  return getJson(url.toString());
}

export async function getGame(id) {
  assertKey();
  const url = new URL(`${API_BASE}/games/${id}`);
  url.searchParams.set("key", API_KEY);
  return getJson(url.toString());
}

export async function getScreenshots(id) {
  assertKey();
  const url = new URL(`${API_BASE}/games/${id}/screenshots`);
  url.searchParams.set("key", API_KEY);
  return getJson(url.toString());
}