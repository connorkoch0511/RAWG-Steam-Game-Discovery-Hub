import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getGame, getScreenshots } from "../lib/rawg.js";

function Chip({ children }) {
  return (
    <span className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1 text-xs text-zinc-200">
      {children}
    </span>
  );
}

export default function GameDetail() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [shots, setShots] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const [g, s] = await Promise.all([getGame(id), getScreenshots(id)]);
        setGame(g);
        setShots(s.results || []);
      } catch (e) {
        setErr(e.message || "Failed to load game");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="text-zinc-300">Loading…</div>;
  if (err) return <div className="text-red-200">{err}</div>;
  if (!game) return <div className="text-zinc-300">No game found.</div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Link to="/games" className="text-sm text-zinc-300 hover:text-white">
          ← Back to Discover
        </Link>
      </div>

      <div className="overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950">
        {game.background_image ? (
          <div className="aspect-[21/9] w-full bg-zinc-900">
            <img src={game.background_image} alt={game.name} className="h-full w-full object-cover" />
          </div>
        ) : null}

        <div className="p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-semibold">{game.name}</h1>
            <div className="text-sm text-zinc-300">
              {game.released ? `Released ${game.released}` : "Release date unknown"}{" "}
              {typeof game.rating === "number" ? `• ★ ${game.rating.toFixed(2)}` : ""}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {(game.genres || []).slice(0, 8).map((g) => (
              <Chip key={g.id}>{g.name}</Chip>
            ))}
            {(game.platforms || []).slice(0, 8).map((p) => (
              <Chip key={p.platform.id}>{p.platform.name}</Chip>
            ))}
          </div>

          {game.description_raw ? (
            <p className="mt-4 whitespace-pre-line text-sm leading-6 text-zinc-300">
              {game.description_raw.slice(0, 900)}
              {game.description_raw.length > 900 ? "…" : ""}
            </p>
          ) : null}
        </div>
      </div>

      {shots.length ? (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Screenshots</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shots.slice(0, 6).map((s) => (
              <a
                key={s.id}
                href={s.image}
                target="_blank"
                rel="noreferrer"
                className="overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950"
              >
                <div className="aspect-[16/9] bg-zinc-900">
                  <img src={s.image} alt="Screenshot" className="h-full w-full object-cover" loading="lazy" />
                </div>
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}