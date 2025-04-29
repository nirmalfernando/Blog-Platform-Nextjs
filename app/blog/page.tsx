"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SearchBar } from "@/components/blog/search-bar";
import { FilterPanel } from "@/components/blog/filter-panel";
import { Pagination } from "@/components/blog/pagination";
import { postAPI, categoryAPI, tagAPI } from "@/lib/api";
import { formatDate } from "@/lib/utils";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  imageUrl: string | null;
  createdAt: string;
  author: {
    id: string;
    name: string;
    image: string | null;
  };
  category: {
    id: string;
    name: string;
  } | null;
  tags: Array<{
    tag: {
      id: string;
      name: string;
    };
  }>;
}

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch posts with filters
        const params: Record<string, string> = {
          page: currentPage.toString(),
          limit: "10",
        };

        if (searchQuery) {
          params.search = searchQuery;
        }

        if (selectedCategory !== "All") {
          params.category = selectedCategory;
        }

        if (selectedTags.length > 0) {
          // We can only filter by one tag at a time in the API
          params.tag = selectedTags[0];
        }

        const postsResponse = await postAPI.getAllPosts(params);
        setPosts(postsResponse.posts);
        setTotalPages(postsResponse.pagination.pages);

        // Fetch categories
        const categoriesResponse = await categoryAPI.getAllCategories();
        setCategories([{ id: "all", name: "All" }, ...categoriesResponse]);

        // Fetch tags
        const tagsResponse = await tagAPI.getAllTags();
        setTags(tagsResponse);

        // Extract unique authors
        const uniqueAuthors = [
          "All",
          ...new Set(postsResponse.posts.map((post: Post) => post.author.name)),
        ];
        setAuthors(uniqueAuthors);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [currentPage, searchQuery, selectedCategory, selectedTags]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          Blog
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
          Explore our latest articles, tutorials, and insights on web
          development, design, and technology.
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar with filters */}
        <aside className="w-full md:w-64 lg:w-72 shrink-0">
          <div className="sticky top-20 space-y-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
            <FilterPanel
              categories={categories.map((cat) => cat.name)}
              tags={tags.map((tag) => tag.name)}
              authors={authors}
              onCategoryChange={handleCategoryChange}
              onTagToggle={handleTagToggle}
              selectedCategory={selectedCategory}
              selectedTags={selectedTags}
            />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm animate-pulse"
                >
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="mx-2 text-gray-400 dark:text-gray-500">
                        •
                      </div>
                      <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="h-7 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-3"></div>
                      <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {[...Array(3)].map((_, j) => (
                        <div
                          key={j}
                          className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"
                        ></div>
                      ))}
                    </div>
                    <div className="h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 dark:text-red-400 mb-2">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-theme-purple-600 hover:bg-theme-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-purple-500"
              >
                Try Again
              </button>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                No posts found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setSelectedTags([]);
                  setCurrentPage(1);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-theme-purple-600 hover:bg-theme-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-purple-500"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-theme-purple-100 text-theme-purple-800 dark:bg-theme-purple-900/50 dark:text-theme-purple-300">
                        {post.category?.name || "Uncategorized"}
                      </span>
                      <span className="mx-2 text-gray-400 dark:text-gray-500">
                        •
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(post.createdAt)}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
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
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map(({ tag }) => (
                        <span
                          key={tag.id}
                          className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        >
                          {tag.name}
                        </span>
                      ))}
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

          {/* Pagination */}
          {!isLoading && !error && posts.length > 0 && (
            <div className="mt-12">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
