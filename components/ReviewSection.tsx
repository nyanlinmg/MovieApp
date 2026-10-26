"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, PenLine, X } from "lucide-react";
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

// one style for the loading, error and empty boxes
const boxStyle = "rounded-xl border border-white/10 bg-zinc-900/70 p-5 text-sm text-zinc-400";

export default function ReviewSection({ tmdbId, mediaType, mediaTitle }: ReviewSectionProps) {
  const router = useRouter();
  const { auth, authLoading } = useApp();
  const [showForm, setShowForm] = useState(false);

  const { data, isPending, isError, refetch } = useReviews(tmdbId, mediaType);
  const saveReview = useSaveReview(tmdbId, mediaType);

  const reviews = data?.reviews ?? [];
  const myReview = reviews.find((review) => review.user.id === auth?.id);

  // average rating ("0.0" when there are no reviews)
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  const average = reviews.length ? (total / reviews.length).toFixed(1) : "0.0";

  // the text on the button
  const buttonText = !auth ? "Log in to review" : myReview ? "Edit your review" : "Write a review";

  // open or close the form (logged-out visitors go to the login page)
  const toggleForm = () => {
    if (authLoading) return;
    if (!auth) return router.push("/login");
    setShowForm(!showForm);
  };

  const saveAndClose = (rating: number, content: string) => {
    saveReview.mutate(
      { tmdbId, mediaType, rating, content },
      { onSuccess: () => setShowForm(false) }
    );
  };

  return (
    <section className="w-full px-5 py-8 sm:px-10">
      {/* heading and button */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="flex items-center gap-3 text-3xl font-bold">
            Reviews <MessageCircle size={28} className="text-amber-400" />
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            See what viewers think about <span className="text-zinc-200">{mediaTitle}</span>.
          </p>
        </div>

        <button
          type="button"
          onClick={toggleForm}
          disabled={authLoading}
          className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-amber-300 disabled:opacity-60"
        >
          {showForm ? <X size={17} /> : <PenLine size={17} />}
          {showForm ? "Close form" : buttonText}
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* left: community score */}
        <aside className="h-fit rounded-xl border border-white/10 bg-zinc-900/70 p-5">
          <p className="text-sm text-zinc-400">Community score</p>
          <div className="mt-3 flex items-end gap-2">
            <span className="text-5xl font-bold leading-none">{average}</span>
            <span className="pb-1 text-sm text-zinc-500">/ 10</span>
          </div>
          <p className="mt-3 text-xs text-zinc-400">
            {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
          </p>
        </aside>

        {/* right: form and reviews */}
        <div className="space-y-4">
          {showForm && (
            <ReviewForm
              key={myReview?.id ?? "new-review"} // resets the form when switching between new and edit
              review={myReview}
              isSaving={saveReview.isPending}
              error={saveReview.error?.message}
              onClose={() => setShowForm(false)}
              onSubmit={saveAndClose}
            />
          )}

          {isPending && <p className={boxStyle}>Loading reviews...</p>}

          {isError && (
            <div className={boxStyle}>
              We couldn&apos;t load reviews right now.
              <button
                type="button"
                onClick={() => refetch()}
                className="ml-3 cursor-pointer font-medium text-amber-300 hover:text-amber-200"
              >
                Try again
              </button>
            </div>
          )}

          {!isPending && !isError && reviews.length === 0 && (
            <p className={`${boxStyle} text-center`}>No reviews yet. Be the first to share what you thought.</p>
          )}

          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} tmdbId={tmdbId} mediaType={mediaType} />
          ))}
        </div>
      </div>
    </section>
  );
}