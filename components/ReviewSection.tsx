"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, PenLine, Star, X } from "lucide-react";
import { useApp } from "@/Provider/AppProvider";
import ReviewCard from "@/components/reviews/ReviewCard";
import ReviewForm from "@/components/reviews/ReviewForm";
import { useReviews, useSaveReview } from "@/hooks/reviewhook";
import type { ReviewMediaType } from "@/services/reviewServices";

type ReviewSectionProps = {
  tmdbId: number;
  mediaType: ReviewMediaType;
  mediaTitle: string;
};

function ReviewStars({ rating }: { rating: number }) {
  const filledStars = Math.round(rating / 2);

  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 10`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={15}
          className={index < filledStars ? "fill-amber-400 text-amber-400" : "text-zinc-600"}
        />
      ))}
    </div>
  );
}

export default function ReviewSection({ tmdbId, mediaType, mediaTitle }: ReviewSectionProps) {
  const router = useRouter();
  const { auth, authLoading } = useApp();
  const reviewsQuery = useReviews(tmdbId, mediaType);
  const saveReview = useSaveReview(tmdbId, mediaType);
  const reviews = reviewsQuery.data?.reviews ?? [];
  const myReview = reviews.find((review) => review.user.id === auth?.id);
  const [showForm, setShowForm] = useState(false);

  const averageRating = reviews.length
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  function openReviewForm() {
    if (authLoading) return;
    if (!auth) {
      router.push("/login");
      return;
    }
    setShowForm(true);
  }

  function handleSaveReview(rating: number, content: string) {
    saveReview.mutate(
      { tmdbId, mediaType, rating, content },
      { onSuccess: () => setShowForm(false) },
    );
  }

  return (
    <section className="w-full px-5 py-8 sm:px-10" aria-labelledby="reviews-heading">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-amber-400">
            Community
          </p>
          <h2 id="reviews-heading" className="flex items-center gap-3 text-3xl font-bold">
            Reviews <MessageCircle size={28} className="text-amber-400" />
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            See what viewers think about <span className="text-zinc-200">{mediaTitle}</span>.
          </p>
        </div>

        <button
          type="button"
          onClick={() => (showForm ? setShowForm(false) : openReviewForm())}
          disabled={authLoading}
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-amber-300 disabled:opacity-60"
        >
          {showForm ? <X size={17} /> : <PenLine size={17} />}
          {showForm ? "Close form" : auth ? (myReview ? "Edit your review" : "Write a review") : "Log in to review"}
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="h-fit rounded-xl border border-white/10 bg-zinc-900/70 p-5">
          <p className="text-sm text-zinc-400">Community score</p>
          <div className="mt-3 flex items-end gap-2">
            <span className="text-5xl font-bold leading-none">{averageRating}</span>
            <span className="pb-1 text-sm text-zinc-500">/ 10</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <ReviewStars rating={Number(averageRating)} />
            <span className="text-xs text-zinc-400">
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </span>
          </div>
          <div className="my-5 border-t border-white/10" />
          <p className="text-sm leading-6 text-zinc-400">
            Watched {mediaTitle}? Share your rating and help other viewers decide what to watch.
          </p>
          <button
            type="button"
            onClick={openReviewForm}
            disabled={authLoading}
            className="mt-4 w-full rounded-lg border border-white/15 px-3 py-2 text-sm font-medium text-white hover:border-amber-400/70 hover:text-amber-300 disabled:opacity-60"
          >
            {auth ? (myReview ? "Edit your review" : "Add your review") : "Log in to review"}
          </button>
        </aside>

        <div className="space-y-4">
          {showForm && (
            <ReviewForm
              key={myReview?.id ?? "new-review"}
              review={myReview}
              isSaving={saveReview.isPending}
              error={saveReview.error?.message}
              onClose={() => setShowForm(false)}
              onSubmit={handleSaveReview}
            />
          )}

          {reviewsQuery.isPending ? (
            <p className="rounded-xl border border-white/10 bg-zinc-900/70 p-5 text-sm text-zinc-400">
              Loading reviews...
            </p>
          ) : reviewsQuery.isError ? (
            <div className="rounded-xl border border-white/10 bg-zinc-900/70 p-5">
              <p className="text-sm text-zinc-300">We couldn&apos;t load reviews right now.</p>
              <button
                type="button"
                onClick={() => void reviewsQuery.refetch()}
                className="mt-3 text-sm font-medium text-amber-300 hover:text-amber-200"
              >
                Try again
              </button>
            </div>
          ) : reviews.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/15 bg-zinc-900/40 p-8 text-center">
              <MessageCircle className="mx-auto text-zinc-500" size={28} />
              <h3 className="mt-3 font-semibold">No reviews yet</h3>
              <p className="mt-1 text-sm text-zinc-400">Be the first to share what you thought.</p>
            </div>
          ) : (
            reviews.map((review) => (
              <ReviewCard key={review.id} review={review} tmdbId={tmdbId} mediaType={mediaType} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
