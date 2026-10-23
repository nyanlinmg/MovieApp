import apiClient from "@/lib/apiClient";

export type ReviewMediaType = "movie" | "tv";

export type Review = {
  id: number;
  content: string;
  rating: number;
  createdAt: string;
  user: { id: number; name: string; username: string };
  helpfulCount: number;
  commentsCount: number;
  isHelpful: boolean;
};

export type SaveReview = {
  tmdbId: number;
  mediaType: ReviewMediaType;
  rating: number;
  content: string;
};

export type ReviewComment = {
  id: number;
  content: string;
  createdAt: string;
  user: { id: number; name: string; username: string };
};

export function getReviewsApi(tmdbId: number, mediaType: ReviewMediaType) {
  const query = new URLSearchParams({ tmdbId: String(tmdbId), mediaType });
  return apiClient(`/api/reviews?${query}`) as Promise<{ reviews: Review[] }>;
}

export function saveReviewApi(review: SaveReview) {
  return apiClient("/api/reviews", { method: "POST", body: review });
}

export function deleteReviewApi(reviewId: number) {
  return apiClient(`/api/reviews/${reviewId}`, { method: "DELETE" });
}

export function toggleHelpfulApi(reviewId: number) {
  return apiClient(`/api/reviews/${reviewId}/helpful`, { method: "POST" });
}

export function getReviewCommentsApi(reviewId: number) {
  return apiClient(`/api/reviews/${reviewId}/comments`) as Promise<{
    comments: ReviewComment[];
  }>;
}

export function addReviewCommentApi(reviewId: number, content: string) {
  return apiClient(`/api/reviews/${reviewId}/comments`, {
    method: "POST",
    body: { content },
  });
}

export function deleteReviewCommentApi(reviewId: number, commentId: number) {
  return apiClient(`/api/reviews/${reviewId}/comments/${commentId}`, {
    method: "DELETE",
  });
}
