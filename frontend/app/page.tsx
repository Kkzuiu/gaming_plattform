import GameList from "@/components/game-list";
import { Gamepad2, Zap, Globe } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="flex flex-col gap-4 max-w-2xl">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-primary" />
              <span className="text-primary text-sm font-semibold uppercase tracking-widest">
                Gaming Platform
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground text-balance leading-tight">
              Your Next Adventure Starts Here
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed text-pretty">
              Discover, track, and review the best games across all genres and platforms. Build your library and connect with fellow players.
            </p>
            <div className="flex flex-wrap gap-6 pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="w-4 h-4 text-primary" />
                <span>20 curated titles</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="w-4 h-4 text-primary" />
                <span>Multiple platforms</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Gamepad2 className="w-4 h-4 text-primary" />
                <span>All genres</span>
              </div>
            </div>
          </div>
        </div>
        {/* Background decoration */}
        <div
          aria-hidden="true"
          className="absolute right-0 top-0 w-1/3 h-full pointer-events-none opacity-10"
          style={{
            background:
              "radial-gradient(ellipse at 100% 50%, oklch(0.62 0.22 250) 0%, transparent 70%)",
          }}
        />
      </section>

      {/* Game List */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl font-bold text-foreground mb-6">Browse Games</h2>
        <GameList />
      </section>
    </main>
  );
}
