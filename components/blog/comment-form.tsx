"use client";

import type React from "react";

import { useState } from "react";

interface CommentFormProps {
  postId: string;
}

export function CommentForm({ postId }: CommentFormProps) {
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would normally submit the comment to your backend
    console.log("Submitting comment:", { postId, comment });
    setComment("");
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
        />
      </div>
      <button
        type="submit"
        className="bg-theme-purple-600 hover:bg-theme-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
      >
        Post Comment
      </button>
    </form>
  );
}
