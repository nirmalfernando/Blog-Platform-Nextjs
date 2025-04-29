"use client";

import { useState, useEffect } from "react";
import { UserTable } from "@/components/admin/user-table";
import { BlogTable } from "@/components/admin/blog-table";
import { Search, Filter, RefreshCw } from "lucide-react";
import { adminAPI } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { user, status, isAdmin } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"users" | "posts">("users");
  const [users, setUsers] = useState<any[]>([]);
  const [posts, setPosts] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [postSearch, setPostSearch] = useState("");
  const [postStatusFilter, setPostStatusFilter] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not admin
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/admin");
      return;
    }

    if (status === "authenticated" && !isAdmin) {
      router.push("/");
      return;
    }

    fetchData();
  }, [status, isAdmin, router]);

  const fetchData = async () => {
    if (!isAdmin) return;

    setIsRefreshing(true);
    setError(null);

    try {
      // Fetch users
      const usersResponse = await adminAPI.getAllUsers();
      setUsers(Array.isArray(usersResponse) ? usersResponse : []);

      // Fetch posts
      const postsResponse = await adminAPI.getAllAdminPosts();
      setPosts(postsResponse.posts);
    } catch (err: any) {
      console.error("Error fetching admin data:", err);
      setError(err.message || "Failed to fetch data");
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  };

  const handleUserRoleUpdate = async (userId: string, role: string) => {
    try {
      await adminAPI.updateUserRole(userId, role);
      // Update local state
      setUsers(
        users.map((user) => (user.id === userId ? { ...user, role } : user))
      );
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("Failed to update user role");
    }
  };

  const handleUserDelete = async (userId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await adminAPI.deleteUser(userId);
      // Update local state
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  const handlePostPublish = async (postId: string) => {
    try {
      await adminAPI.togglePostPublish(postId);
      // Update local state
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                status: post.status === "published" ? "draft" : "published",
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error toggling post publish status:", error);
      alert("Failed to update post status");
    }
  };

  const handlePostDelete = async (postId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await adminAPI.deletePost(postId);
      // Update local state
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredPosts = posts.filter(
    (post) =>
      (post.title.toLowerCase().includes(postSearch.toLowerCase()) ||
        post.author.name.toLowerCase().includes(postSearch.toLowerCase())) &&
      (postStatusFilter === "all" || post.status === postStatusFilter)
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
            Admin Dashboard
          </h1>
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
          <div className="animate-pulse p-8">
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-gray-200 dark:bg-gray-700 rounded"
                ></div>
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-theme-purple-600 hover:bg-theme-purple-700 text-white font-medium rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
          Admin Dashboard
        </h1>
        <button
          onClick={fetchData}
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
            <UserTable
              users={filteredUsers}
              onRoleChange={handleUserRoleUpdate}
              onDelete={handleUserDelete}
            />
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
            <BlogTable
              posts={filteredPosts}
              onPublishToggle={handlePostPublish}
              onDelete={handlePostDelete}
            />
          </div>
        )}
      </div>
    </div>
  );
}
