"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Send, Trash2 } from "lucide-react";
import { useApp } from "@/Provider/AppProvider";
import {
  useAddReviewComment,
  useDeleteReviewComment,
  useReviewComments,
} from "@/hooks/reviewhook";
import type { Review, ReviewComment, ReviewMediaType } from "@/services/reviewServices";

type CommentThreadProps = {
  review: Review;
  tmdbId: number;
  mediaType: ReviewMediaType;
};

function CommentItem({
  comment,
  reviewOwnerId,
  currentUserId,
  isDeleting,
  onDelete,
}: {
  comment: ReviewComment;
  reviewOwnerId: number;
  currentUserId?: number;
  isDeleting: boolean;
  onDelete: (comment: ReviewComment) => void;
}) {
  const isCommentOwner = comment.user.id === currentUserId;
  const canDelete = isCommentOwner || reviewOwnerId === currentUserId;

  return (
    <li className="rounded-lg bg-zinc-950/70 px-3 py-2.5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className="text-sm font-medium text-zinc-200">
          {comment.user.name}{" "}
          <span className="font-normal text-zinc-500">@{comment.user.username}</span>
        </p>
        <div className="flex items-center gap-3">
          <time dateTime={comment.createdAt} className="text-xs text-zinc-500">
            {new Date(comment.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>
          {canDelete && (
            <button
              type="button"
              onClick={() => onDelete(comment)}
              disabled={isDeleting}
              aria-label={isCommentOwner ? "Delete your comment" : "Delete comment from your review"}
              className="inline-flex items-center gap-1 text-xs text-red-300 transition hover:text-red-200 disabled:opacity-50"
            >
              <Trash2 size={16} className="text-red-400" /> Delete
            </button>
          )}
        </div>
      </div>
      <p className="mt-1 whitespace-pre-wrap text-sm leading-5 text-zinc-300">
        {comment.content}
      </p>
    </li>
  );
}

export default function CommentThread({ review, tmdbId, mediaType }: CommentThreadProps) {
  const router = useRouter();
  const { auth, authLoading } = useApp();
  const commentsQuery = useReviewComments(review.id);
  const addComment = useAddReviewComment(review.id, tmdbId, mediaType);
  const deleteComment = useDeleteReviewComment(review.id, tmdbId, mediaType);
  const [content, setContent] = useState("");
  const comments = commentsQuery.data?.comments ?? [];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanContent = content.trim();
    if (cleanContent) addComment.mutate(cleanContent, { onSuccess: () => setContent("") });
  }

  function handleDelete(comment: ReviewComment) {
    const message = comment.user.id === auth?.id
      ? "Delete your comment?"
      : "Remove this comment from your review?";

    if (window.confirm(message)) deleteComment.mutate(comment.id);
  }

  return (
    <div className="mt-5 border-t border-white/10 pt-4">
      <h4 className="mb-3 text-sm font-semibold text-zinc-200">Comments</h4>

      {commentsQuery.isPending ? (
        <p className="text-sm text-zinc-500">Loading comments...</p>
      ) : commentsQuery.isError ? (
        <div className="text-sm text-zinc-400">
          <p>We couldn&apos;t load the comments.</p>
          <button type="button" onClick={() => void commentsQuery.refetch()} className="mt-1 text-amber-300">
            Try again
          </button>
        </div>
      ) : comments.length === 0 ? (
        <p className="mb-3 text-sm text-zinc-500">No comments yet. Start the conversation.</p>
      ) : (
        <ul className="mb-4 space-y-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              reviewOwnerId={review.user.id}
              currentUserId={auth?.id}
              isDeleting={deleteComment.isPending}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}

      {deleteComment.isError && (
        <p role="alert" className="mb-3 text-sm text-red-300">{deleteComment.error.message}</p>
      )}

      {auth ? (
        <form onSubmit={handleSubmit} className="space-y-2">
          <label htmlFor={`comment-${review.id}`} className="sr-only">Write a comment</label>
          <textarea
            id={`comment-${review.id}`}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Write a comment..."
            rows={2}
            maxLength={1000}
            required
            className="w-full resize-y rounded-lg border border-white/10 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-amber-400/70"
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-zinc-500">Up to 1,000 characters ({content.length}/1000)</span>
            <button
              type="submit"
              disabled={authLoading || addComment.isPending || !content.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-3 py-2 text-sm font-semibold text-zinc-950 disabled:opacity-60"
            >
              <Send size={14} /> {addComment.isPending ? "Posting..." : "Post comment"}
            </button>
          </div>
          {addComment.isError && (
            <p role="alert" className="text-sm text-red-300">{addComment.error.message}</p>
          )}
        </form>
      ) : authLoading ? (
        <p className="text-sm text-zinc-500">Checking your account...</p>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 px-3 py-3">
          <p className="text-sm text-zinc-400">Log in to join the conversation.</p>
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="rounded-lg border border-amber-400/50 px-3 py-1.5 text-sm font-medium text-amber-300"
          >
            Log in
          </button>
        </div>
      )}
    </div>
  );
}
