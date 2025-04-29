"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { postAPI } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeaturedPosts() {
      try {
        setIsLoading(true);
        setError(null);

        // Get the latest 4 posts
        const response = await postAPI.getAllPosts({ limit: "4" });
        setPosts(response.posts);
      } catch (err: any) {
        console.error("Error fetching posts:", err);
        setError(err.message || "Failed to fetch posts");
      } finally {
        setIsLoading(false);
      }
    }

    fetchFeaturedPosts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Next.js Blog Platform
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          A modern blogging platform built with Next.js, Tailwind CSS, and
          TypeScript.
        </p>
      </header>

      <main>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm animate-pulse"
              >
                <div className="p-6">
                  <div className="h-7 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-3"></div>
                    <div>
                      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                      <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                  <div className="h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 dark:text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-theme-purple-600 text-white rounded hover:bg-theme-purple-700"
            >
              Try Again
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">No posts found.</p>
            <Link
              href="/editor"
              className="mt-4 px-4 py-2 bg-theme-purple-600 text-white rounded hover:bg-theme-purple-700 inline-block"
            >
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center mb-4">
                    <Image
                      src={
                        post.author.image ||
                        "/placeholder.svg?height=40&width=40"
                      }
                      alt={post.author.name}
                      width={40}
                      height={40}
                      className="rounded-full mr-3"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {post.author.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(post.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-block bg-theme-purple-600 hover:bg-theme-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                  >
                    Read more
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-block px-6 py-3 bg-theme-purple-600 hover:bg-theme-purple-700 text-white font-medium rounded-md transition-colors duration-200"
          >
            View All Posts
          </Link>
        </div>
      </main>
    </div>
  );
}
