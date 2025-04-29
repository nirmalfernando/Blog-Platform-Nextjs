"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal,
} from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  author: {
    id: string;
    name: string;
    image?: string | null;
  };
  status: string;
  createdAt: string;
}

interface BlogTableProps {
  posts: Post[];
  onPublishToggle: (postId: string) => Promise<void>;
  onDelete: (postId: string) => Promise<void>;
}

export function BlogTable({
  posts,
  onPublishToggle,
  onDelete,
}: BlogTableProps) {
  const [postStatuses, setPostStatuses] = useState<Record<string, string>>(
    () => {
      const statuses: Record<string, string> = {};
      posts.forEach((post) => {
        statuses[post.id] = post.status;
      });
      return statuses;
    }
  );
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const toggleDropdown = (postId: string) => {
    setShowDropdown(showDropdown === postId ? null : postId);
  };

  const handlePublishToggle = async (postId: string) => {
    setIsProcessing(postId);
    try {
      await onPublishToggle(postId);
      // Update local state
      setPostStatuses((prev) => ({
        ...prev,
        [postId]: prev[postId] === "published" ? "draft" : "published",
      }));
      setShowDropdown(null);
    } catch (error) {
      console.error("Error toggling publish status:", error);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleDeletePost = async (postId: string) => {
    setIsProcessing(postId);
    try {
      await onDelete(postId);
      setShowDropdown(null);
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setIsProcessing(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Published
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
            <Edit2 className="h-3 w-3 mr-1" />
            Draft
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-theme-purple-100 dark:bg-theme-purple-900/30 text-theme-purple-800 dark:text-theme-purple-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
            {status}
          </span>
        );
    }
  };

  if (posts.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        No posts found. Try adjusting your search criteria.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Title
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Author
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Created
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
          {posts.map((post) => (
            <tr
              key={post.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {post.title}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {post.author.image && (
                    <img
                      src={post.author.image || "/placeholder.svg"}
                      alt={post.author.name}
                      className="h-6 w-6 rounded-full mr-2"
                    />
                  )}
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {post.author.name}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(postStatuses[post.id])}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {new Date(post.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown(post.id)}
                    className="text-gray-500 dark:text-gray-400 hover:text-theme-purple-700 dark:hover:text-theme-purple-400"
                    disabled={isProcessing === post.id}
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </button>

                  {showDropdown === post.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                      <div className="py-1">
                        <Link
                          href={`/editor?id=${post.slug}`}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                        <button
                          onClick={() => handlePublishToggle(post.id)}
                          className="flex items-center w-full px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                          disabled={isProcessing === post.id}
                        >
                          {postStatuses[post.id] === "published" ? (
                            <>
                              <XCircle className="h-4 w-4 mr-2" />
                              {isProcessing === post.id
                                ? "Unpublishing..."
                                : "Unpublish"}
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              {isProcessing === post.id
                                ? "Publishing..."
                                : "Publish"}
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                          disabled={isProcessing === post.id}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {isProcessing === post.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
