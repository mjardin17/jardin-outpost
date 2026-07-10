import NavBar from "@/components/NavBar";

export default function OnTrackPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <NavBar />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-6xl font-bold mb-4">OnTrack</h1>
        <p className="text-2xl text-zinc-400 mb-8">Workout accountability that actually works.</p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-semibold mb-6">Core Features</h2>
            <ul className="space-y-4 text-lg">
              <li>✅ One-Tap Check-In</li>
              <li>✅ Forgiving Streaks</li>
              <li>✅ Adaptive Nudges</li>
              <li>✅ Wearable Sync + Path Tracking</li>
            </ul>
          </div>
          <div className="bg-zinc-900 p-8 rounded-2xl">
            <h3 className="text-xl mb-4">Ready to build unbreakable habits?</h3>
            <a href="#" className="block bg-white text-black text-center py-4 rounded-xl font-semibold">Download OnTrack</a>
          </div>
        </div>

        <p className="text-center text-zinc-500">Part of Jardin's Outpost — Built with love for real workouts.</p>
      </main>
    </div>
  );
}
