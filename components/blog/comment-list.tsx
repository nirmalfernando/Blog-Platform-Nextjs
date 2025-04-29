"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2, Edit2, Save, X } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
  createdAt: string;
}

interface CommentListProps {
  comments: Comment[];
  currentUserId?: string | null;
  onDeleteComment?: (id: string) => Promise<boolean>;
  onUpdateComment?: (id: string, content: string) => Promise<boolean>;
}

export function CommentList({
  comments,
  currentUserId,
  onDeleteComment,
  onUpdateComment,
}: CommentListProps) {
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (comments.length === 0) {
    return (
      <div className="text-gray-500 dark:text-gray-400 italic">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  const handleEdit = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
    setError(null);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent("");
    setError(null);
  };

  const handleSaveEdit = async (id: string) => {
    if (!onUpdateComment) return;

    if (!editContent.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await onUpdateComment(id, editContent);

      if (success) {
        setEditingCommentId(null);
      } else {
        setError("Failed to update comment. Please try again.");
      }
    } catch (err) {
      console.error("Error updating comment:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!onDeleteComment) return;

    if (confirm("Are you sure you want to delete this comment?")) {
      setIsSubmitting(true);

      try {
        await onDeleteComment(id);
      } catch (err) {
        console.error("Error deleting comment:", err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="flex space-x-4">
          <Image
            src={comment.user.image || "/placeholder.svg?height=40&width=40"}
            alt={comment.user.name}
            width={40}
            height={40}
            className="rounded-full h-10 w-10 flex-shrink-0"
          />
          <div className="flex-1">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {comment.user.name}
                </h4>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>

              {editingCommentId === comment.id ? (
                <div>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-theme-purple-500 focus:border-theme-purple-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white mb-2"
                    rows={3}
                    disabled={isSubmitting}
                  />
                  {error && (
                    <p className="text-sm text-red-600 dark:text-red-400 mb-2">
                      {error}
                    </p>
                  )}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSaveEdit(comment.id)}
                      disabled={isSubmitting}
                      className="flex items-center text-white bg-theme-purple-600 hover:bg-theme-purple-700 px-3 py-1 rounded-md text-sm disabled:opacity-50"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={isSubmitting}
                      className="flex items-center text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1 rounded-md text-sm disabled:opacity-50"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-700 dark:text-gray-300">
                    {comment.content}
                  </p>

                  {currentUserId &&
                    (currentUserId === comment.user.id ||
                      currentUserId === "admin") && (
                      <div className="flex space-x-2 mt-2">
                        {currentUserId === comment.user.id &&
                          onUpdateComment && (
                            <button
                              onClick={() => handleEdit(comment)}
                              className="flex items-center text-gray-500 hover:text-theme-purple-600 dark:text-gray-400 dark:hover:text-theme-purple-400 text-sm"
                            >
                              <Edit2 className="h-4 w-4 mr-1" />
                              Edit
                            </button>
                          )}
                        {onDeleteComment && (
                          <button
                            onClick={() => handleDelete(comment.id)}
                            disabled={isSubmitting}
                            className="flex items-center text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 text-sm disabled:opacity-50"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
