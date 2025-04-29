"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bookmark, Clock, Tag, Folder } from "lucide-react";
import { savedPostsAPI } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/utils";

export default function SavedPostsPage() {
  const { user, status } = useAuth();
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSavedPosts() {
      if (!user) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await savedPostsAPI.getAllSavedPosts();
        setSavedPosts(response?.posts || []);
      } catch (err: any) {
        console.error("Error fetching saved posts:", err);
        setError(err.message || "Failed to fetch your saved posts");
      } finally {
        setIsLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchSavedPosts();
    }
  }, [user, status]);

  const handleUnsavePost = async (postId: string) => {
    try {
      await savedPostsAPI.toggleSavePost(postId);
      setSavedPosts(savedPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error unsaving post:", error);
      alert("Failed to unsave post. Please try again.");
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Saved Posts
            </h1>
          </div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse"
              >
                <div className="flex justify-between mb-4">
                  <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                </div>
                <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full mr-2"></div>
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                  <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
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
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            Saved Posts
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Your reading list of saved articles for later
          </p>
        </header>

        {savedPosts?.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
            <Bookmark className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No saved posts yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              When you find interesting articles, save them to read later.
            </p>
            <Link
              href="/blog"
              className="px-4 py-2 bg-theme-purple-600 hover:bg-theme-purple-700 text-white font-medium rounded-md"
            >
              Browse Articles
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {savedPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-theme-purple-100 text-theme-purple-800 dark:bg-theme-purple-900/50 dark:text-theme-purple-300 flex items-center">
                        <Folder className="h-3 w-3 mr-1" />
                        {post.category?.name || "Uncategorized"}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(post.createdAt)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleUnsavePost(post.id)}
                      className="text-theme-purple-600 dark:text-theme-purple-400 hover:text-theme-purple-800 dark:hover:text-theme-purple-300"
                      title="Unsave post"
                    >
                      <Bookmark className="h-5 w-5 fill-current" />
                    </button>
                  </div>

                  <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-theme-purple-600 dark:hover:text-theme-purple-400"
                    >
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {post.excerpt}
                  </p>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Image
                        src={
                          post.author.image ||
                          "/placeholder.svg?height=32&width=32"
                        }
                        alt={post.author.name}
                        width={32}
                        height={32}
                        className="rounded-full mr-2"
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {post.author.name}
                      </span>
                    </div>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-theme-purple-600 dark:text-theme-purple-400 hover:text-theme-purple-800 dark:hover:text-theme-purple-300 font-medium text-sm"
                    >
                      Read article →
                    </Link>
                  </div>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                      {post.tags.map((tagItem: any) => (
                        <span
                          key={tagItem.tag.id}
                          className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tagItem.tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
