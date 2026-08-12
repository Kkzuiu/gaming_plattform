"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useReviews } from "@/context/reviews-context";
import ReviewCard from "@/components/review-card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, MessageSquarePlus, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

function StarRating({
  rating,
  onChange,
}: {
  rating: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1" aria-label="Select rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          className="focus:outline-none cursor-pointer"
        >
          <Star
            className={cn(
              "w-6 h-6 transition-colors",
              (hovered || rating) >= star
                ? "fill-primary text-primary"
                : "fill-transparent text-muted-foreground"
            )}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewsSection({ gameId }: { gameId: string }) {
  const { user, isAuthenticated } = useAuth();
  const { reviews, addReview, fetchReviewsForGame } = useReviews();

  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReviewsForGame(gameId);
  }, [gameId, fetchReviewsForGame]);

  const hasReviewed = reviews.some((r) => r.userId === user?._id);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !text.trim()) return;
    setIsSubmitting(true);
    addReview({
      gameId,
      userId: user._id,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      text: text.trim(),
      rating: rating > 0 ? rating : undefined,
    });
    setText("");
    setRating(0);
    setIsSubmitting(false);
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <MessageSquarePlus className="w-5 h-5 text-primary" />
          Reviews
          <span className="text-sm font-normal text-muted-foreground ml-1">
            ({reviews.length})
          </span>
        </h2>
      </div>

      {/* Write review */}
      {!isAuthenticated ? (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary border border-border text-muted-foreground text-sm">
          <Lock className="w-4 h-4 shrink-0" />
          <span>
            <Link href="/auth" className="text-primary hover:underline">
              Sign in
            </Link>{" "}
            to write a review.
          </span>
        </div>
      ) : hasReviewed ? (
        <div className="p-4 rounded-xl bg-secondary border border-border text-muted-foreground text-sm">
          You have already reviewed this game. Edit or delete your review below.
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 p-5 rounded-xl bg-card border border-border"
        >
          <h3 className="font-semibold text-foreground">Write a Review</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Your rating:</span>
            <StarRating rating={rating} onChange={setRating} />
          </div>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="Share your thoughts about this game..."
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground resize-none"
            required
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!text.trim() || isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Submit Review
            </Button>
          </div>
        </form>
      )}

      {/* Review list */}
      {reviews.length > 0 ? (
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      ) : (
        <div className="py-10 text-center text-muted-foreground text-sm">
          No reviews yet. Be the first to share your thoughts!
        </div>
      )}
    </section>
  );
}
