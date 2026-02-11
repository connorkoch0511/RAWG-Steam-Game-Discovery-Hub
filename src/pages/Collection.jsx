import { useEffect, useState } from "react";

const STORAGE_KEY = "gdh_collection_v1";

function loadCollection() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export default function Collection() {
  const [data, setData] = useState({ wishlist: [], playing: [], completed: [] });

  useEffect(() => {
    const c = loadCollection();
    setData({
      wishlist: c.wishlist || [],
      playing: c.playing || [],
      completed: c.completed || [],
    });
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Collection</h1>
      <p className="text-sm text-zinc-400">Collections are saved locally in your browser. Account sync coming in a future update.</p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {["wishlist", "playing", "completed"].map((k) => (
          <div key={k} className="rounded-2xl border border-zinc-900 bg-zinc-950 p-4">
            <div className="text-sm font-semibold capitalize">{k}</div>
            <div className="mt-2 text-sm text-zinc-400">
              {data[k].length ? (
                <ul className="space-y-2">
                  {data[k].map((x) => (
                    <li key={x.id} className="flex items-center gap-3">
                      <div className="h-10 w-16 overflow-hidden rounded-lg bg-zinc-900">
                        {x.background_image ? (
                          <img src={x.background_image} alt="" className="h-full w-full object-cover" />
                        ) : null}
                      </div>
                      <div className="text-zinc-200">{x.name}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div>No games yet.</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}