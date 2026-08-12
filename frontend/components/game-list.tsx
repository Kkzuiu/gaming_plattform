"use client";

import { useState, useMemo, useEffect } from "react";
import GameCard from "@/components/game-card";
import { getGames } from "@/lib/api";
import { Game } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

type SortKey = "title" | "price" | "releaseYear";

export default function GameList() {
  const [allGenres, setAllGenres] = useState<string[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("title");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [filterGenre, setFilterGenre] = useState<string>("all");
  const [filterMultiplayer, setFilterMultiplayer] = useState<boolean | null>(null);
  const [filterEarlyAccess, setFilterEarlyAccess] = useState<boolean | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function loadGames() {
      try {
        const data = await getGames();
        setGames(data);
        const genres = Array.from(new Set(data.flatMap((g) => g.genre))).sort();
        setAllGenres(genres);
      } catch (err) {
        console.error("Failed to load games:", err);
      } finally {
        setLoading(false);
      }
    }
    loadGames();
  }, []);

  const filtered = useMemo<Game[]>(() => {
    let list = [...games];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.genre.some((x) => x.toLowerCase().includes(q)) ||
          g.tags.some((x) => x.toLowerCase().includes(q)) ||
          g.studio.name.toLowerCase().includes(q)
      );
    }

    if (filterGenre !== "all") {
      list = list.filter((g) => g.genre.includes(filterGenre));
    }

    if (filterMultiplayer !== null) {
      list = list.filter((g) => g.multiplayer === filterMultiplayer);
    }

    if (filterEarlyAccess !== null) {
      list = list.filter((g) => g.earlyAccess === filterEarlyAccess);
    }

    list.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "title") comparison = a.title.localeCompare(b.title);
      else if (sortBy === "price") comparison = a.priceCHF - b.priceCHF;
      else if (sortBy === "releaseYear") comparison = a.releaseYear - b.releaseYear;
      return sortDir === "asc" ? comparison : -comparison;
    });

    return list;
  }, [games, search, sortBy, sortDir, filterGenre, filterMultiplayer, filterEarlyAccess]);

  function clearFilters() {
    setSearch("");
    setSortBy("title");
    setSortDir("asc");
    setFilterGenre("all");
    setFilterMultiplayer(null);
    setFilterEarlyAccess(null);
  }

  const hasActiveFilters =
    search ||
    filterGenre !== "all" ||
    filterMultiplayer !== null ||
    filterEarlyAccess !== null;

  return (
    <div className="flex flex-col gap-6">
      {/* Search + Sort + Filter toggle bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search games, genres, studios..."
            className="pl-9 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            aria-label="Search games"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          {/* Sort */}
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
            <SelectTrigger className="w-40 bg-secondary border-border text-foreground">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="title">Alphabetical</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="releaseYear">Release Year</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort direction */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
            className="border-border bg-secondary text-foreground hover:bg-card shrink-0"
            aria-label={`Sort ${sortDir === "asc" ? "descending" : "ascending"}`}
            title={sortDir === "asc" ? "Switch to descending" : "Switch to ascending"}
          >
            {sortDir === "asc" ? (
              <span className="text-xs font-bold">A↑</span>
            ) : (
              <span className="text-xs font-bold">Z↓</span>
            )}
          </Button>

          {/* Filter toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters((v) => !v)}
            className={cn(
              "gap-1.5 border-border bg-secondary text-foreground hover:bg-card min-h-9",
              showFilters && "border-primary text-primary"
            )}
            aria-expanded={showFilters}
            aria-label="Toggle filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </Button>
        </div>
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-3 p-4 rounded-xl bg-card border border-border">
          {/* Genre */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Genre</label>
            <Select value={filterGenre} onValueChange={setFilterGenre}>
              <SelectTrigger className="w-44 bg-secondary border-border text-foreground">
                <SelectValue placeholder="All genres" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border max-h-52">
                <SelectItem value="all">All genres</SelectItem>
                {allGenres.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Multiplayer */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Mode</label>
            <div className="flex gap-2">
              {[null, true, false].map((v) => (
                <button
                  key={String(v)}
                  onClick={() => setFilterMultiplayer(v)}
                  className={cn(
                    "text-xs px-3 py-1.5 rounded-lg border transition-colors",
                    filterMultiplayer === v
                      ? "border-primary text-primary bg-primary/10"
                      : "border-border text-muted-foreground bg-secondary hover:border-primary/50"
                  )}
                >
                  {v === null ? "Any" : v ? "Multiplayer" : "Single Player"}
                </button>
              ))}
            </div>
          </div>

          {/* Early Access */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Access</label>
            <div className="flex gap-2">
              {[null, true, false].map((v) => (
                <button
                  key={String(v)}
                  onClick={() => setFilterEarlyAccess(v)}
                  className={cn(
                    "text-xs px-3 py-1.5 rounded-lg border transition-colors",
                    filterEarlyAccess === v
                      ? "border-primary text-primary bg-primary/10"
                      : "border-border text-muted-foreground bg-secondary hover:border-primary/50"
                  )}
                >
                  {v === null ? "Any" : v ? "Early Access" : "Full Release"}
                </button>
              ))}
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex items-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
                Clear all
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "game" : "games"} found
        </p>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-primary hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Game grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <p className="text-muted-foreground animate-pulse text-lg">Loading games...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((game) => (
            <GameCard key={game._id} game={game} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <Search className="w-12 h-12 text-muted-foreground" />
          <div>
            <p className="text-lg font-semibold text-foreground">No games found</p>
            <p className="text-muted-foreground text-sm mt-1">
              Try adjusting your search or filters
            </p>
          </div>
          <Button variant="outline" onClick={clearFilters} className="border-border text-foreground">
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
