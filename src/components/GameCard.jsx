import { Link } from "react-router-dom";

function platformAbbrev(p) {
  const name = (p?.platform?.name || "").toLowerCase();
  if (name.includes("playstation")) return "PS";
  if (name.includes("xbox")) return "XB";
  if (name.includes("nintendo")) return "NS";
  if (name.includes("pc")) return "PC";
  if (name.includes("ios")) return "iOS";
  if (name.includes("android")) return "And";
  return p?.platform?.name?.slice(0, 3) || "";
}

export default function GameCard({ game }) {
  return (
    <Link
      to={`/games/${game.id}`}
      className="group overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950 transition hover:-translate-y-0.5 hover:border-zinc-700"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-900">
        {game.background_image ? (
          <img
            src={game.background_image}
            alt={game.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : null}
        <div className="absolute bottom-2 left-2 flex gap-1">
          {(game.parent_platforms || []).slice(0, 5).map((p) => (
            <span
              key={p.platform.id}
              className="rounded-lg bg-zinc-950/80 px-2 py-1 text-[10px] text-zinc-200 backdrop-blur"
              title={p.platform.name}
            >
              {platformAbbrev(p)}
            </span>
          ))}
        </div>
        {typeof game.rating === "number" ? (
          <div className="absolute bottom-2 right-2 rounded-lg bg-zinc-950/80 px-2 py-1 text-[10px] text-zinc-200 backdrop-blur">
            ★ {game.rating.toFixed(2)}
          </div>
        ) : null}
      </div>

      <div className="p-4">
        <div className="line-clamp-1 text-sm font-semibold">{game.name}</div>
        <div className="mt-1 text-xs text-zinc-400">
          {game.released ? `Released ${game.released}` : "Release date unknown"}
        </div>
      </div>
    </Link>
  );
}