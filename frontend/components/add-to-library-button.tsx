"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Game } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { BookMarked, Check, Loader2 } from "lucide-react";

export default function AddToLibraryButton({ game }: { game: Game }) {
  const { user, isAuthenticated, addToLibrary, removeFromLibrary } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const inLibrary = user?.library.some(
    (e) => String(e.gameId) === String(game._id)
  );

  async function handleClick() {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }
    setLoading(true);
    if (inLibrary) {
      await removeFromLibrary(game._id);
    } else {
      await addToLibrary(game._id);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <Button disabled className="gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        {inLibrary ? "Removing..." : "Adding..."}
      </Button>
    );
  }

  if (inLibrary) {
    return (
      <Button
        onClick={handleClick}
        variant="outline"
        className="gap-2 bg-secondary text-secondary-foreground border border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/40 transition-colors"
        aria-label={`Remove ${game.title} from library`}
      >
        <Check className="w-4 h-4 text-primary" />
        In Library
      </Button>
    );
  }

  return (
    <Button
      onClick={handleClick}
      className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
      aria-label={`Add ${game.title} to library`}
    >
      <BookMarked className="w-4 h-4" />
      Add to Library
    </Button>
  );
}
