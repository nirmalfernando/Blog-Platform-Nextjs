"use client";

import { useState } from "react";
import { UserTable } from "@/components/admin/user-table";
import { BlogTable } from "@/components/admin/blog-table";
import { Search, Filter, RefreshCw } from "lucide-react";

// This would normally be fetched from your database
const DUMMY_USERS = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    createdAt: "2023-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "editor",
    createdAt: "2023-02-10",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "reader",
    createdAt: "2023-03-05",
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah@example.com",
    role: "editor",
    createdAt: "2023-03-20",
  },
  {
    id: "5",
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "reader",
    createdAt: "2023-04-01",
  },
];

// This would normally be fetched from your database
const DUMMY_POSTS = [
  {
    id: "1",
    title: "Getting Started with Next.js 14",
    author: "Jane Smith",
    status: "published",
    createdAt: "2023-04-15",
  },
  {
    id: "2",
    title: "Mastering Tailwind CSS",
    author: "John Doe",
    status: "published",
    createdAt: "2023-04-10",
  },
  {
    id: "3",
    title: "TypeScript Tips and Tricks",
    author: "Alex Johnson",
    status: "draft",
    createdAt: "2023-04-05",
  },
  {
    id: "4",
    title: "Building a Blog with Next.js",
    author: "Sarah Williams",
    status: "pending",
    createdAt: "2023-03-28",
  },
  {
    id: "5",
    title: "Introduction to Server Components",
    author: "Michael Brown",
    status: "pending",
    createdAt: "2023-03-20",
  },
  {
    id: "6",
    title: "State Management in React",
    author: "Emily Chen",
    status: "draft",
    createdAt: "2023-03-15",
  },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"users" | "posts">("users");
  const [userSearch, setUserSearch] = useState("");
  const [postSearch, setPostSearch] = useState("");
  const [postStatusFilter, setPostStatusFilter] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredUsers = DUMMY_USERS.filter(
    (user) =>
      user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredPosts = DUMMY_POSTS.filter(
    (post) =>
      (post.title.toLowerCase().includes(postSearch.toLowerCase()) ||
        post.author.toLowerCase().includes(postSearch.toLowerCase())) &&
      (postStatusFilter === "all" || post.status === postStatusFilter)
  );

  const refreshData = () => {
    setIsRefreshing(true);
    // This would normally fetch fresh data from your backend
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
          Admin Dashboard
        </h1>
        <button
          onClick={refreshData}
          className="flex items-center px-4 py-2 bg-theme-purple-600 hover:bg-theme-purple-700 text-white font-medium rounded-md transition-colors duration-200"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
          />
          {isRefreshing ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === "users"
                ? "text-theme-purple-600 dark:text-theme-purple-400 border-b-2 border-theme-purple-600 dark:border-theme-purple-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("users")}
          >
            User Management
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === "posts"
                ? "text-theme-purple-600 dark:text-theme-purple-400 border-b-2 border-theme-purple-600 dark:border-theme-purple-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("posts")}
          >
            Blog Post Management
          </button>
        </div>

        {activeTab === "users" && (
          <div>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-theme-purple-500 focus:border-theme-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <UserTable users={filteredUsers} />
          </div>
        )}

        {activeTab === "posts" && (
          <div>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search posts by title or author..."
                    value={postSearch}
                    onChange={(e) => setPostSearch(e.target.value)}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-theme-purple-500 focus:border-theme-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="relative sm:w-48">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={postStatusFilter}
                    onChange={(e) => setPostStatusFilter(e.target.value)}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-theme-purple-500 focus:border-theme-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="pending">Pending</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
            </div>
            <BlogTable posts={filteredPosts} />
          </div>
        )}
      </div>
    </div>
  );
}
