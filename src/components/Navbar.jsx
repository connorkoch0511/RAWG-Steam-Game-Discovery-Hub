import { NavLink } from "react-router-dom";

function LinkItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-lg px-3 py-2 text-sm transition ${
          isActive ? "bg-zinc-800 text-white" : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-zinc-800" />
          <div>
            <div className="text-sm font-semibold leading-tight">Game Discovery Hub</div>
            <div className="text-xs text-zinc-400">Search + filters + detail pages</div>
          </div>
        </div>
        <nav className="flex items-center gap-2">
          <LinkItem to="/games">Discover</LinkItem>
          <LinkItem to="/collection">Collection</LinkItem>
        </nav>
      </div>
    </header>
  );
}