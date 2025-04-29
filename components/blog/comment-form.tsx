"use client";

import type React from "react";
import { useState } from "react";

interface CommentFormProps {
  postId: string;
  onSubmit: (data: { content: string }) => Promise<boolean>;
}

export function CommentForm({ postId, onSubmit }: CommentFormProps) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!comment.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await onSubmit({ content: comment });

      if (success) {
        setComment(""); // Reset form
      } else {
        setError("Failed to submit comment. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting comment:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="mb-4">
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Your comment
        </label>
        <textarea
          id="comment"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-theme-purple-500 focus:border-theme-purple-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          placeholder="Share your thoughts..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          disabled={isSubmitting}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-theme-purple-600 hover:bg-theme-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50"
      >
        {isSubmitting ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
}
