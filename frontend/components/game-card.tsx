"use client";

import Link from "next/link";
import { Game } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Users, Clock, Tag } from "lucide-react";

interface GameCardProps {
  game: Game;
  className?: string;
}

export default function GameCard({ game, className }: GameCardProps) {
  return (
    <Link href={`/games/${game._id}`} className="block group">
      <article
        className={cn(
          "rounded-xl overflow-hidden bg-card border border-border",
          "transition-all duration-200",
          "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5",
          className
        )}
      >
        {/* Cover Image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
          {game.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={game.coverImage}
              alt={`${game.title} cover`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-4xl">
              <Tag className="w-10 h-10" />
            </div>
          )}
          {/* Overlay badges */}
          <div className="absolute top-2 left-2 flex gap-1.5">
            {game.earlyAccess && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-yellow-500/90 text-black">
                Early Access
              </span>
            )}
            {game.multiplayer && (
              <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-primary/90 text-primary-foreground">
                <Users className="w-3 h-3" />
                Multiplayer
              </span>
            )}
          </div>
          {/* Price badge */}
          <div className="absolute bottom-2 right-2">
            <span className="text-sm font-bold px-2.5 py-1 rounded-lg bg-background/90 text-foreground">
              {game.priceCHF === 0 ? "Free" : `CHF ${game.priceCHF.toFixed(2)}`}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-3">
          {/* Title + Year */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-base text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-1">
              {game.title}
            </h3>
            <span className="text-xs text-muted-foreground shrink-0 mt-0.5">
              {game.releaseYear}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 min-h-12">
            {game.description}
          </p>

          {/* Genre tags */}
          <div className="flex flex-wrap gap-1.5">
            {game.genre.map((g) => (
              <span
                key={g}
                className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
              >
                {g}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1 border-t border-border">
            <span className="text-xs text-muted-foreground">{game.platform}</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              ~{game.averagePlaytimeHours}h
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
