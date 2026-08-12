"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Review } from "@/lib/types";
import { getReviewsByGameId, addReview as apiAddReview, updateReview as apiUpdateReview, deleteReview as apiDeleteReview } from "@/lib/api";

interface ReviewsContextValue {
  reviews: Review[];
  addReview: (review: Omit<Review, "_id" | "createdAt" | "updatedAt">) => Promise<void>;
  editReview: (id: string, text: string, rating?: number) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  fetchReviewsForGame: (gameId: string) => Promise<void>;
}

const ReviewsContext = createContext<ReviewsContextValue | undefined>(undefined);

export function ReviewsProvider({ children }: { children: React.ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([]);

  const fetchReviewsForGame = useCallback(async (gameId: string) => {
    try {
      const data = await getReviewsByGameId(gameId);
      setReviews(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const addReview = useCallback(async (review: Omit<Review, "_id" | "createdAt" | "updatedAt">) => {
    try {
      const newReview = await apiAddReview(review);
      setReviews((prev) => [newReview, ...prev]);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const editReview = useCallback(async (id: string, text: string, rating?: number) => {
    try {
      const updated = await apiUpdateReview(id, text, rating);
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? updated : r))
      );
    } catch (err) {
      console.error(err);
    }
  }, []);

  const deleteReview = useCallback(async (id: string) => {
    try {
      await apiDeleteReview(id);
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <ReviewsContext.Provider
      value={{ reviews, addReview, editReview, deleteReview, fetchReviewsForGame }}
    >
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  const ctx = useContext(ReviewsContext);
  if (!ctx) throw new Error("useReviews must be used within ReviewsProvider");
  return ctx;
}
