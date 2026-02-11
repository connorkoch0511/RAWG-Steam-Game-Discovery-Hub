const API_BASE = import.meta.env.VITE_API_BASE;

function assertBase() {
  if (!API_BASE) {
    throw new Error("Missing VITE_API_BASE in .env.local (restart dev server after adding).");
  }
}

async function getJson(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API request failed (${res.status}): ${text.slice(0, 200)}`);
  }
  return res.json();
}

function api(path, params = {}) {
  assertBase();
  const url = new URL(`${API_BASE}${path}`);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  }
  return url.toString();
}

export async function getGenres() {
  return getJson(api("/api/rawg/genres", { page_size: 50 }));
}

export async function getPlatforms() {
  return getJson(api("/api/rawg/platforms", { page_size: 50 }));
}

export async function getGames(params = {}) {
  return getJson(
    api("/api/rawg/games", {
      page_size: params.page_size ?? 24,
      page: params.page ?? 1,
      search: params.search || undefined,
      ordering: params.ordering || undefined,
      genres: params.genres || undefined,
      platforms: params.platforms || undefined,
    })
  );
}

export async function getGame(id) {
  return getJson(api(`/api/rawg/games/${id}`));
}

export async function getScreenshots(id) {
  return getJson(api(`/api/rawg/games/${id}/screenshots`));
}