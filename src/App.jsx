import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Discover from "./pages/Discover.jsx";
import GameDetail from "./pages/GameDetail.jsx";
import Collection from "./pages/Collection.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/games" replace />} />
          <Route path="/games" element={<Discover />} />
          <Route path="/games/:id" element={<GameDetail />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="*" element={<div className="text-zinc-300">Not found.</div>} />
        </Routes>
      </main>
    </div>
  );
}