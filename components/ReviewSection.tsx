"use client";

import { useState, type FormEvent } from "react";
import { MessageCircle, PenLine, Send, Star, ThumbsUp, X } from "lucide-react";

type Review = {
  id: number;
  name: string;
  username: string;
  rating: number;
  content: string;
  date: string;
  helpfulCount: number;
  commentsCount: number;
  isHelpful: boolean;
};

interface ReviewSectionProps {
  mediaTitle: string;
}

// Example reviews for the UI. These can be replaced with reviews from the API later.
const exampleReviews: Review[] = [
  {
    id: 1,
    name: "Maya Chen",
    username: "mayawatches",
    rating: 9,
    content:
      "A beautifully paced story with performances that stay with you. I especially loved how the smaller character moments made the bigger scenes feel earned.",
    date: "October 12, 2026",
    helpfulCount: 24,
    commentsCount: 3,
    isHelpful: false,
  },
  {
    id: 2,
    name: "Jordan Lee",
    username: "jordanlee",
    rating: 8,
    content:
      "Strong atmosphere from start to finish. The middle could be a little tighter, but the ending brought everything together in a satisfying way.",
    date: "October 8, 2026",
    helpfulCount: 12,
    commentsCount: 1,
    isHelpful: false,
  },
  {
    id: 3,
    name: "Alex Rivera",
    username: "alexr",
    rating: 7,
    content:
      "I had a good time with it. The cast has great chemistry, and there are a few scenes I already want to revisit.",
    date: "September 29, 2026",
    helpfulCount: 8,
    commentsCount: 0,
    isHelpful: false,
  },
];

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

export default function ReviewSection({ mediaTitle }: ReviewSectionProps) {
  const [reviews, setReviews] = useState(exampleReviews);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(8);
  const [content, setContent] = useState("");

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((total, review) => total + review.rating, 0) / reviews.length).toFixed(1)
      : "0.0";

  function toggleHelpful(reviewId: number) {
    setReviews((currentReviews) =>
      currentReviews.map((review) => {
        if (review.id !== reviewId) return review;

        return {
          ...review,
          isHelpful: !review.isHelpful,
          helpfulCount: review.helpfulCount + (review.isHelpful ? -1 : 1),
        };
      }),
    );
  }

  function addReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!content.trim()) return;

    const newReview: Review = {
      id: Date.now(),
      name: "You",
      username: "your review",
      rating,
      content: content.trim(),
      date: "Just now",
      helpfulCount: 0,
      commentsCount: 0,
      isHelpful: false,
    };

    setReviews((currentReviews) => [newReview, ...currentReviews]);
    setContent("");
    setRating(8);
    setShowForm(false);
  }

  return (
    <section className="w-full px-5 py-8 sm:px-10" aria-labelledby="reviews-heading">
      <div className="mx-auto">
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
            onClick={() => setShowForm((isOpen) => !isOpen)}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-amber-300"
          >
            {showForm ? <X size={17} /> : <PenLine size={17} />}
            {showForm ? "Close form" : "Write a review"}
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
              <span className="text-xs text-zinc-400">{reviews.length} reviews</span>
            </div>
            <div className="my-5 border-t border-white/10" />
            <p className="text-sm leading-6 text-zinc-400">
              Watched {mediaTitle}? Share your rating and help other viewers decide what to watch.
            </p>
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="mt-4 w-full rounded-lg border border-white/15 px-3 py-2 text-sm font-medium text-white transition hover:border-amber-400/70 hover:text-amber-300"
            >
              Add your review
            </button>
          </aside>

          <div className="space-y-4">
            {showForm && (
              <form
                id="write-review"
                onSubmit={addReview}
                className="rounded-xl border border-amber-400/30 bg-zinc-900/80 p-5"
              >
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">Your review</h3>
                    <p className="mt-1 text-sm text-zinc-400">Choose a score from 1 to 10.</p>
                  </div>
                  <div className="rounded-lg bg-amber-400/10 px-3 py-2 text-sm font-semibold text-amber-300">
                    {rating} / 10
                  </div>
                </div>

                <div className="mb-4 flex flex-wrap gap-2" aria-label="Choose a rating">
                  {Array.from({ length: 10 }, (_, index) => index + 1).map((score) => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => setRating(score)}
                      aria-pressed={rating === score}
                      className={`size-9 rounded-lg border text-sm transition ${
                        rating === score
                          ? "border-amber-400 bg-amber-400 text-zinc-950"
                          : "border-white/10 bg-zinc-950 text-zinc-300 hover:border-amber-400/60"
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>

                <label htmlFor="review-content" className="mb-2 block text-sm font-medium">
                  What did you think?
                </label>
                <textarea
                  id="review-content"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder="Share your thoughts about the story, performances, or anything that stood out..."
                  rows={4}
                  required
                  className="w-full resize-y rounded-lg border border-white/10 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-amber-400/70"
                />
                <div className="mt-4 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-amber-300"
                  >
                    <Send size={15} />
                    Post review
                  </button>
                </div>
              </form>
            )}

            {reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-xl border border-white/10 bg-zinc-900/70 p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-amber-300 to-orange-600 font-bold text-zinc-950">
                    {review.name
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                      <div>
                        <h3 className="font-semibold">{review.name}</h3>
                        <p className="text-xs text-zinc-500">@{review.username}</p>
                      </div>
                      <div className="flex items-center gap-2 rounded-md bg-amber-400/10 px-2.5 py-1.5 text-sm font-semibold text-amber-300">
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                        {review.rating}/10
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-zinc-300">{review.content}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-500">
                      <span>{review.date}</span>
                      <button
                        type="button"
                        onClick={() => toggleHelpful(review.id)}
                        aria-pressed={review.isHelpful}
                        className={`inline-flex items-center gap-1.5 transition hover:text-amber-300 ${
                          review.isHelpful ? "text-amber-300" : ""
                        }`}
                      >
                        <ThumbsUp size={14} className={review.isHelpful ? "fill-current" : ""} />
                        Helpful · {review.helpfulCount}
                      </button>
                      <span className="inline-flex items-center gap-1.5">
                        <MessageCircle size={14} />
                        {review.commentsCount} comments
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
