export default function Pagination({ page, canPrev, canNext, onPrev, onNext }) {
  return (
    <div className="mt-6 flex items-center justify-center gap-3">
      <button
        onClick={onPrev}
        disabled={!canPrev}
        className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-200 disabled:opacity-40"
      >
        Prev
      </button>
      <div className="text-sm text-zinc-400">Page {page}</div>
      <button
        onClick={onNext}
        disabled={!canNext}
        className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-200 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}