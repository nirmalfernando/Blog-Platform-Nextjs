"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit2, Trash2, Eye, Plus, CheckCircle, Clock } from "lucide-react";
import { postAPI } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/utils";

export default function ProfilePostsPage() {
  const { user, status } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserPosts() {
      if (!user) return;

      try {
        setIsLoading(true);
        setError(null);

        // Fetch posts by the current user
        const response = await postAPI.getAllPosts({ authorId: user.id });
        setPosts(response.posts);
      } catch (err: any) {
        console.error("Error fetching posts:", err);
        setError(err.message || "Failed to fetch your posts");
      } finally {
        setIsLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchUserPosts();
    }
  }, [user, status]);

  const handleDeletePost = async (slug: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await postAPI.deletePost(slug);
      setPosts(posts.filter((post) => post.slug !== slug));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
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

  if (status === "loading" || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Posts
            </h1>
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="animate-pulse">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="border-b border-gray-200 dark:border-gray-700 p-4"
                >
                  <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="flex justify-end space-x-2">
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
            <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-theme-purple-600 hover:bg-theme-purple-700 text-white font-medium rounded-md"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Posts
          </h1>
          <Link
            href="/editor"
            className="inline-flex items-center px-4 py-2 bg-theme-purple-600 hover:bg-theme-purple-700 text-white font-medium rounded-md transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Post
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
            <Edit2 className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No posts yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven't created any posts yet. Start writing your first blog
              post!
            </p>
            <Link
              href="/editor"
              className="px-4 py-2 bg-theme-purple-600 hover:bg-theme-purple-700 text-white font-medium rounded-md"
            >
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {posts.map((post, index) => (
              <div
                key={post.id}
                className={`p-4 ${
                  index < posts.length - 1
                    ? "border-b border-gray-200 dark:border-gray-700"
                    : ""
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-2 sm:mb-0">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                      {post.title}
                    </h2>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="mr-3">{formatDate(post.createdAt)}</span>
                      {getStatusBadge(post.status)}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      href={`/editor?id=${post.slug}`}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-theme-purple-700 dark:hover:text-theme-purple-400 rounded-full"
                      title="Edit"
                    >
                      <Edit2 className="h-5 w-5" />
                    </Link>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-theme-purple-700 dark:hover:text-theme-purple-400 rounded-full"
                      title="View"
                    >
                      <Eye className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDeletePost(post.slug)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-full"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
