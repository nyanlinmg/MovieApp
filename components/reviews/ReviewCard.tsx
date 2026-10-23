"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, MessageCircle, Star, ThumbsUp, Trash2 } from "lucide-react";
import { useApp } from "@/Provider/AppProvider";
import { useDeleteReview, useToggleHelpful } from "@/hooks/reviewhook";
import type { Review, ReviewMediaType } from "@/services/reviewServices";
import CommentThread from "@/components/reviews/CommentThread";

type ReviewCardProps = {
  review: Review;
  tmdbId: number;
  mediaType: ReviewMediaType;
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function ReviewCard({ review, tmdbId, mediaType }: ReviewCardProps) {
  const router = useRouter();
  const { auth, authLoading } = useApp();
  const helpful = useToggleHelpful(tmdbId, mediaType);
  const deleteReview = useDeleteReview(tmdbId, mediaType);
  const [showComments, setShowComments] = useState(false);
  const isOwner = review.user.id === auth?.id;

  function handleHelpful() {
    if (!auth) {
      router.push("/login");
      return;
    }
    helpful.mutate(review.id);
  }

  function handleDelete() {
    if (window.confirm("Delete your review and all comments and helpful votes on it?")) {
      deleteReview.mutate(review.id);
    }
  }

  return (
    <article className="rounded-xl border border-white/10 bg-zinc-900/70 p-5">
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-amber-300 to-orange-600 font-bold text-zinc-950">
          {getInitials(review.user.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <div>
              <h3 className="font-semibold">{review.user.name}</h3>
              <p className="text-xs text-zinc-500">@{review.user.username}</p>
            </div>
            <div className="flex items-center gap-2 rounded-md bg-amber-400/10 px-2.5 py-1.5 text-sm font-semibold text-amber-300">
              <Star size={14} className="fill-amber-400 text-amber-400" /> {review.rating}/10
            </div>
          </div>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-300">{review.content}</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-500">
            <time dateTime={review.createdAt}>
              {new Date(review.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <button
              type="button"
              onClick={handleHelpful}
              disabled={authLoading || helpful.isPending || isOwner}
              aria-pressed={review.isHelpful}
              className={`inline-flex items-center gap-1.5 text-amber-300 hover:text-amber-200 disabled:opacity-60 ${review.isHelpful ? "text-amber-200" : ""}`}
            >
              <ThumbsUp size={16} className="text-amber-400" /> Like ({review.helpfulCount})
            </button>
            {isOwner && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteReview.isPending}
                className="inline-flex items-center gap-1.5 text-red-300 hover:text-red-200 disabled:opacity-50"
              >
                <Trash2 size={16} className="text-red-400" /> {deleteReview.isPending ? "Deleting..." : "Delete review"}
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowComments((open) => !open)}
              aria-expanded={showComments}
              className="inline-flex items-center gap-1.5 hover:text-amber-300"
            >
              <MessageCircle size={14} />
              {review.commentsCount} {review.commentsCount === 1 ? "comment" : "comments"}
              <ChevronDown size={13} className={showComments ? "rotate-180" : ""} />
            </button>
          </div>

          {(helpful.isError || deleteReview.isError) && (
            <p role="alert" className="mt-3 text-sm text-red-300">
              {helpful.error?.message ?? deleteReview.error?.message}
            </p>
          )}
        </div>
      </div>

      {showComments && <CommentThread review={review} tmdbId={tmdbId} mediaType={mediaType} />}
    </article>
  );
}
