"use client";

import { notFound } from "next/navigation";
import { use, useEffect, useState } from "react";
import { getGameById } from "@/lib/api";
import { Game } from "@/lib/types";
import ReviewsSection from "@/components/reviews-section";
import AddToLibraryButton from "@/components/add-to-library-button";
import {
  Calendar,
  Monitor,
  Shield,
  Clock,
  Globe,
  Users,
  Zap,
  Tag,
  ExternalLink,
  Building2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
      <span className="text-primary shrink-0">{icon}</span>
      <span className="text-muted-foreground text-sm w-32 shrink-0">{label}</span>
      <span className="text-foreground text-sm font-medium">{value}</span>
    </div>
  );
}

function TagBadge({ label }: { label: string }) {
  return (
    <span className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground border border-border">
      {label}
    </span>
  );
}

export default function GameDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGameById(id)
      .then((data) => setGame(data))
      .catch((err) => {
        console.error(err);
        setGame(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-muted-foreground animate-pulse text-lg">Loading game details...</p>
      </div>
    );
  }

  if (!game) notFound();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-10">
      {/* Back */}
      <Link
        href="/"
        className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Games
      </Link>

      {/* Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Cover */}
        <div className="lg:col-span-2">
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-secondary">
            {game.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={game.coverImage}
                alt={`${game.title} cover art`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Tag className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
            <div className="absolute top-3 left-3 flex gap-2">
              {game.earlyAccess && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-yellow-500/90 text-black">
                  Early Access
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              {game.genre.map((g) => (
                <span
                  key={g}
                  className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/15 text-primary"
                >
                  {g}
                </span>
              ))}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground text-balance leading-tight">
              {game.title}
            </h1>
            <p className="text-muted-foreground text-sm">{game.studio.name}</p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-foreground">
              {game.priceCHF === 0 ? "Free" : `CHF ${game.priceCHF.toFixed(2)}`}
            </span>
            <AddToLibraryButton game={game} />
          </div>

          <p className="text-muted-foreground leading-relaxed text-pretty">
            {game.description}
          </p>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Release", value: game.releaseYear, icon: <Calendar className="w-4 h-4" /> },
              { label: "Platform", value: game.platform, icon: <Monitor className="w-4 h-4" /> },
              { label: "Age Rating", value: game.ageRating, icon: <Shield className="w-4 h-4" /> },
              { label: "Avg. Playtime", value: `~${game.averagePlaytimeHours}h`, icon: <Clock className="w-4 h-4" /> },
              { label: "Multiplayer", value: game.multiplayer ? "Yes" : "No", icon: <Users className="w-4 h-4" /> },
              { label: "Early Access", value: game.earlyAccess ? "Yes" : "No", icon: <Zap className="w-4 h-4" /> },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col gap-1 p-3 rounded-xl bg-card border border-border"
              >
                <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                  <span className="text-primary">{stat.icon}</span>
                  {stat.label}
                </div>
                <span className="font-semibold text-foreground text-sm">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Tags */}
        <section className="flex flex-col gap-4 p-5 rounded-2xl bg-card border border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Tag className="w-4 h-4 text-primary" />
            Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {game.tags.map((t) => (
              <TagBadge key={t} label={t} />
            ))}
          </div>
        </section>

        {/* Languages */}
        <section className="flex flex-col gap-4 p-5 rounded-2xl bg-card border border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            Supported Languages
          </h2>
          <div className="flex flex-wrap gap-2">
            {game.supportedLanguages.map((lang) => (
              <TagBadge key={lang} label={lang} />
            ))}
          </div>
        </section>

        {/* Studio */}
        <section className="flex flex-col gap-2 p-5 rounded-2xl bg-card border border-border md:col-span-2">
          <h2 className="font-semibold text-foreground flex items-center gap-2 mb-2">
            <Building2 className="w-4 h-4 text-primary" />
            Studio
          </h2>
          <InfoRow icon={<Building2 className="w-4 h-4" />} label="Studio" value={game.studio.name} />
          <InfoRow icon={<Globe className="w-4 h-4" />} label="Country" value={game.studio.country} />
          <InfoRow icon={<Monitor className="w-4 h-4" />} label="HQ City" value={game.studio.hqCity} />
          <InfoRow icon={<Calendar className="w-4 h-4" />} label="Founded" value={game.studio.foundedYear} />
          <InfoRow
            icon={<Zap className="w-4 h-4" />}
            label="Studio Size"
            value={
              <span className="capitalize">{game.studio.sizeCategory}</span>
            }
          />
          <InfoRow
            icon={<ExternalLink className="w-4 h-4" />}
            label="Website"
            value={
              <a
                href={game.studio.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-1"
              >
                {game.studio.website.replace(/^https?:\/\//, "")}
                <ExternalLink className="w-3 h-3" />
              </a>
            }
          />
        </section>
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Reviews */}
      <ReviewsSection gameId={game._id} />
    </main>
  );
}
