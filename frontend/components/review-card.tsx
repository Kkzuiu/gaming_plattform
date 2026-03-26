"use client";

import { useState } from "react";
import Link from "next/link";
import { Review } from "@/lib/types";
import { useAuth } from "@/context/auth-context";
import { useReviews } from "@/context/reviews-context";
import UserAvatar from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Star, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewCardProps {
  review: Review;
}

function StarRating({
  rating,
  interactive = false,
  onChange,
}: {
  rating?: number;
  interactive?: boolean;
  onChange?: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating ?? 0} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={cn("focus:outline-none", interactive && "cursor-pointer")}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
        >
          <Star
            className={cn(
              "w-4 h-4 transition-colors",
              (hovered || (rating ?? 0)) >= star
                ? "fill-primary text-primary"
                : "fill-transparent text-muted-foreground"
            )}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const { user } = useAuth();
  const { editReview, deleteReview } = useReviews();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(review.text);
  const [editRating, setEditRating] = useState(review.rating);

  const isOwnReview = user?._id === review.userId;

  function handleSave() {
    editReview(review._id, editText, editRating);
    setIsEditing(false);
  }

  function handleDelete() {
    if (confirm("Delete this review?")) {
      deleteReview(review._id);
    }
  }

  const date = new Date(review.updatedAt ?? review.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <>
      <article className="flex gap-4 p-4 rounded-xl bg-card border border-border">
        {/* Avatar */}
        <Link href={`/profile/${review.userId}`} className="shrink-0">
          <UserAvatar
            user={{
              displayName: review.displayName,
              username: review.username,
              avatarUrl: review.avatarUrl,
              status: "offline",
            }}
            size="md"
            showStatus
          />
        </Link>

        {/* Body */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link
                href={`/profile/${review.userId}`}
                className="font-semibold text-sm text-foreground hover:text-primary transition-colors"
              >
                {review.displayName}
              </Link>
              <span className="text-muted-foreground text-xs ml-2">@{review.username}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {review.rating && <StarRating rating={review.rating} />}
              <span className="text-xs text-muted-foreground">{date}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
          {review.updatedAt && (
            <span className="text-xs text-muted-foreground italic">edited</span>
          )}

          {/* Actions for own review */}
          {isOwnReview && (
            <div className="flex items-center gap-2 mt-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setEditText(review.text);
                  setEditRating(review.rating);
                  setIsEditing(true);
                }}
              >
                <Pencil className="w-3 h-3" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-destructive"
                onClick={handleDelete}
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </article>

      {/* Edit Modal */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-foreground">Edit Review</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rating:</span>
              <StarRating rating={editRating} interactive onChange={setEditRating} />
            </div>
            <Textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={4}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground resize-none"
              placeholder="Write your review..."
            />
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsEditing(false)}
              className="text-muted-foreground"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!editText.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
