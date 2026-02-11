import { useEffect, useMemo, useState } from "react";
import { getGames, getGenres, getPlatforms } from "../lib/rawg.js";
import { debounce } from "../lib/debounce.js";
import GameCard from "../components/GameCard.jsx";
import Pagination from "../components/Pagination.jsx";
import SkeletonCard from "../components/SkeletonCard.jsx";

const SORTS = [
  { label: "Popular", value: "-added" },
  { label: "Top Rated", value: "-rating" },
  { label: "Newest", value: "-released" },
];

export default function Discover() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [ordering, setOrdering] = useState(SORTS[0].value);

  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [genreId, setGenreId] = useState("");
  const [platformId, setPlatformId] = useState("");

  const [loading, setLoading] = useState(false);
  const [games, setGames] = useState([]);
  const [count, setCount] = useState(0);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [g, p] = await Promise.all([getGenres(), getPlatforms()]);
        setGenres(g.results || []);
        setPlatforms(p.results || []);
      } catch (e) {
        setErr(e.message || "Failed to load filters");
      }
    })();
  }, []);

  const load = async ({
    nextPage = page,
    nextSearch = search,
    nextOrdering = ordering,
    nextGenre = genreId,
    nextPlatform = platformId,
  } = {}) => {
    setLoading(true);
    setErr("");
    try {
      const res = await getGames({
        search: nextSearch || undefined,
        page: nextPage,
        ordering: nextOrdering,
        genres: nextGenre || undefined,
        platforms: nextPlatform || undefined,
        page_size: 24,
      });
      setGames(res.results || []);
      setCount(res.count || 0);
    } catch (e) {
      setErr(e.message || "Failed to load games");
    } finally {
      setLoading(false);
    }
  };

  const debouncedLoad = useMemo(
    () =>
      debounce((value) => {
        setPage(1);
        load({ nextPage: 1, nextSearch: value });
      }, 350),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ordering, genreId, platformId]
  );

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, ordering, genreId, platformId]);

  const canPrev = page > 1;
  const canNext = games.length > 0 && page * 24 < count;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Discover games</h1>
          <p className="text-sm text-zinc-400">Search, filter, and browse titles with a clean, fast UI.</p>
        </div>

        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
          <input
            value={search}
            onChange={(e) => {
              const v = e.target.value;
              setSearch(v);
              debouncedLoad(v);
            }}
            placeholder="Search games… (Halo, Zelda, Elden Ring)"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 md:w-[360px]"
          />

          <select
            value={ordering}
            onChange={(e) => {
              setPage(1);
              setOrdering(e.target.value);
            }}
            className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                Sort: {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2 md:flex-row">
        <select
          value={genreId}
          onChange={(e) => {
            setPage(1);
            setGenreId(e.target.value);
          }}
          className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200"
        >
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        <select
          value={platformId}
          onChange={(e) => {
            setPage(1);
            setPlatformId(e.target.value);
          }}
          className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200"
        >
          <option value="">All Platforms</option>
          {platforms.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            setSearch("");
            setGenreId("");
            setPlatformId("");
            setOrdering(SORTS[0].value);
            setPage(1);
            load({ nextPage: 1, nextSearch: "", nextGenre: "", nextPlatform: "", nextOrdering: SORTS[0].value });
          }}
          className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200"
        >
          Reset
        </button>
      </div>

      {err ? (
        <div className="rounded-2xl border border-red-900/60 bg-red-950/40 p-4 text-sm text-red-200">{err}</div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
          : games.map((g) => <GameCard key={g.id} game={g} />)}
      </div>

      <Pagination
        page={page}
        canPrev={canPrev && !loading}
        canNext={canNext && !loading}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => p + 1)}
      />
    </div>
  );
}