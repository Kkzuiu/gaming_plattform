"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { getUserById, getGamesByIds } from "@/lib/api";
import { User, Game } from "@/lib/types";
import UserAvatar from "@/components/user-avatar";
import {
  Globe,
  Calendar,
  Zap,
  MessageSquare,
  Trophy,
  Clock,
  ArrowLeft,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const statusLabel: Record<string, string> = {
  online: "Online",
  "in-game": "In Game",
  away: "Away",
  offline: "Offline",
};

const statusClass: Record<string, string> = {
  online: "text-green-400",
  "in-game": "text-primary",
  away: "text-yellow-400",
  offline: "text-muted-foreground",
};

function formatDate(iso: string | undefined | null) {
  if (!iso) return "N/A";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "N/A";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [profile, setProfile] = useState<User | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const user = await getUserById(id);
        setProfile(user);
        if (user && user.library && user.library.length > 0) {
          // Extract gameId strings, filter out missing ones
          const gameIds = user.library
            .map((e) => e.gameId)
            .filter((gid): gid is string => !!gid);

          if (gameIds.length > 0) {
            const libGames = await getGamesByIds(gameIds);
            setGames(libGames);
          }
        }
      } catch (err) {
        console.error(err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-muted-foreground animate-pulse text-lg">Loading profile...</p>
      </div>
    );
  }

  if (!profile) notFound();

  // Filter library to only entries that have a matching game
  const validLibrary = profile.library.filter((entry) => {
    if (!entry.gameId) return false;
    return games.some(
      (g) => String(g._id) === String(entry.gameId)
    );
  });

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-10">
      {/* Back */}
      <Link
        href="/"
        className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Games
      </Link>

      {/* Profile header */}
      <section className="relative rounded-2xl overflow-hidden bg-card border border-border p-6 sm:p-8">
        {/* Decorative background */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 0% 0%, oklch(0.62 0.22 250) 0%, transparent 60%)",
          }}
        />

        <div className="relative flex flex-col sm:flex-row gap-6">
          {/* Avatar */}
          <UserAvatar user={profile} size="xl" showStatus />

          {/* Info */}
          <div className="flex flex-col gap-3 flex-1">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">{profile.displayName}</h1>
                <span
                  className={cn(
                    "text-xs font-semibold",
                    statusClass[profile.status] ?? "text-muted-foreground"
                  )}
                >
                  {statusLabel[profile.status] ?? "Offline"}
                </span>
              </div>
              <p className="text-muted-foreground text-sm mt-0.5">@{profile.username}</p>
            </div>

            {profile.bio && (
              <p className="text-muted-foreground text-sm leading-relaxed text-pretty max-w-xl">
                {profile.bio}
              </p>
            )}

            {/* Stats row */}
            <div className="flex flex-wrap gap-4 mt-1">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Zap className="w-4 h-4 text-primary" />
                Level {profile.level}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Globe className="w-4 h-4 text-primary" />
                {profile.country}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 text-primary" />
                Joined {formatDate(profile.joinedAt)}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Globe className="w-4 h-4 text-primary" />
                {profile.preferredLanguage}
              </div>
              {profile.discordTag && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  {profile.discordTag}
                </div>
              )}
            </div>
          </div>

          {/* Level badge */}
          <div className="flex flex-col items-center justify-center gap-1 shrink-0 self-start sm:self-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/30 flex flex-col items-center justify-center">
              <span className="text-primary font-bold text-xl leading-none">{profile.level}</span>
              <span className="text-primary/70 text-xs">LVL</span>
            </div>
          </div>
        </div>
      </section>

      {/* Library */}
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Library
          <span className="text-sm font-normal text-muted-foreground ml-1">
            ({validLibrary.length} {validLibrary.length === 1 ? "game" : "games"})
          </span>
        </h2>

        {validLibrary.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-sm rounded-2xl bg-card border border-border">
            No games in library yet.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {validLibrary.map((entry) => {
              const game = games.find(
                (g) => String(g._id) === String(entry.gameId)
              )!;
              return (
                <article
                  key={entry._id || entry.gameId}
                  className="flex gap-4 p-4 rounded-2xl bg-card border border-border hover:border-primary/40 transition-colors"
                >
                  {/* Thumbnail */}
                  {game.coverImage ? (
                    <Link href={`/games/${game._id}`} className="shrink-0">
                      <div className="w-20 h-14 rounded-xl overflow-hidden bg-secondary">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={game.coverImage}
                          alt={`${game.title} thumbnail`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>
                  ) : (
                    <div className="w-20 h-14 rounded-xl bg-secondary shrink-0 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0 flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          href={`/games/${game._id}`}
                          className="font-semibold text-sm text-foreground hover:text-primary transition-colors"
                        >
                          {game.title}
                        </Link>
                        <div className="flex flex-wrap gap-3 mt-1">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3.5 h-3.5" />
                            {entry.hoursPlayed ?? 0}h played
                          </span>
                          {entry.lastPlayedAt && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="w-3.5 h-3.5" />
                              Last played {formatDate(entry.lastPlayedAt)}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5" />
                            Added {formatDate(entry.addedAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Achievements */}
                    {entry.achievements && entry.achievements.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {entry.achievements.map((ach) => (
                          <span
                            key={ach}
                            className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground"
                          >
                            <Trophy className="w-3 h-3 text-primary" />
                            {ach}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
