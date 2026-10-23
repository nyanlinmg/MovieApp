"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addReviewCommentApi,
  deleteReviewApi,
  deleteReviewCommentApi,
  getReviewCommentsApi,
  getReviewsApi,
  saveReviewApi,
  type ReviewMediaType,
  type SaveReview,
  toggleHelpfulApi,
} from "@/services/reviewServices";

export function useReviews(tmdbId: number, mediaType: ReviewMediaType) {
  return useQuery({
    queryKey: ["reviews", mediaType, tmdbId],
    queryFn: () => getReviewsApi(tmdbId, mediaType),
    enabled: Number.isSafeInteger(tmdbId) && tmdbId > 0,
  });
}

export function useSaveReview(tmdbId: number, mediaType: ReviewMediaType) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (review: SaveReview) => saveReviewApi(review),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["reviews", mediaType, tmdbId] }),
  });
}

export function useDeleteReview(tmdbId: number, mediaType: ReviewMediaType) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: number) => deleteReviewApi(reviewId),
    onSuccess: (_, reviewId) => {
      queryClient.removeQueries({ queryKey: ["review-comments", reviewId] });
      return queryClient.invalidateQueries({ queryKey: ["reviews", mediaType, tmdbId] });
    },
  });
}

export function useToggleHelpful(tmdbId: number, mediaType: ReviewMediaType) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: number) => toggleHelpfulApi(reviewId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["reviews", mediaType, tmdbId] }),
  });
}

export function useReviewComments(reviewId: number) {
  return useQuery({
    queryKey: ["review-comments", reviewId],
    queryFn: () => getReviewCommentsApi(reviewId),
    enabled: Number.isSafeInteger(reviewId) && reviewId > 0,
  });
}

export function useAddReviewComment(
  reviewId: number,
  tmdbId: number,
  mediaType: ReviewMediaType,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => addReviewCommentApi(reviewId, content),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["review-comments", reviewId] }),
        queryClient.invalidateQueries({ queryKey: ["reviews", mediaType, tmdbId] }),
      ]);
    },
  });
}

export function useDeleteReviewComment(
  reviewId: number,
  tmdbId: number,
  mediaType: ReviewMediaType,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => deleteReviewCommentApi(reviewId, commentId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["review-comments", reviewId] }),
        queryClient.invalidateQueries({ queryKey: ["reviews", mediaType, tmdbId] }),
      ]);
    },
  });
}
