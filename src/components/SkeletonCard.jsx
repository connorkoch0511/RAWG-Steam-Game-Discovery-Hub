export default function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950">
      <div className="aspect-[16/9] w-full animate-pulse bg-zinc-900" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-900" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-zinc-900" />
      </div>
    </div>
  );
}