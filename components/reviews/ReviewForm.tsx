"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import type { Review } from "@/services/reviewServices";

type ReviewFormProps = {
  review?: Review;
  isSaving: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (rating: number, content: string) => void;
};

export default function ReviewForm({
  review,
  isSaving,
  error,
  onClose,
  onSubmit,
}: ReviewFormProps) {
  const [rating, setRating] = useState(review?.rating ?? 8);
  const [content, setContent] = useState(review?.content ?? "");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanContent = content.trim();
    if (cleanContent) onSubmit(rating, cleanContent);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-amber-400/30 bg-zinc-900/80 p-5"
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold">{review ? "Edit your review" : "Your review"}</h3>
          <p className="mt-1 text-sm text-zinc-400">Choose a score from 1 to 10.</p>
        </div>
        <span className="rounded-lg bg-amber-400/10 px-3 py-2 text-sm font-semibold text-amber-300">
          {rating} / 10
        </span>
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
        maxLength={2000}
        required
        className="w-full resize-y rounded-lg border border-white/10 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-amber-400/70"
      />
      <div className="mt-1 flex justify-between gap-4 text-xs text-zinc-500">
        <span>Up to 2,000 characters</span>
        <span>{content.length}/2000</span>
      </div>

      {error && <p className="mt-3 text-sm text-red-300">{error}</p>}

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white hover:border-white/30"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving || !content.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send size={15} />
          {isSaving ? "Saving..." : review ? "Update review" : "Post review"}
        </button>
      </div>
    </form>
  );
}
