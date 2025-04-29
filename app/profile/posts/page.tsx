"use client"

import { useState, useEffect } from "react"
import { postAPI } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"

export default function ProfilePostsPage() {
  const { user, status } = useAuth()
  const [posts, setPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUserPosts() {
      if (!user) return

      try {
        setIsLoading(true)
        setError(null)

        // Fetch posts by the current user
        const response = await postAPI.getAllPosts({ authorId: user.id })
        setPosts(response.posts)
      } catch (err: any) {
        console.error("Error fetching posts:", err)
        setError(err.message || "Failed to fetch your posts")
      } finally {
        setIsLoading(false)
      }
    }

    if (status === "authenticated") {
      fetchUserPosts()
    }
  }, [user, status])

  const handleDeletePost = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return
    }

    try {
      await postAPI.deletePost(slug)
      setPosts(posts.filter(post => post.slug !== slug))
    } catch (error) {
      console.error("Error deleting post:", error)
      alert("Failed to delete post. Please try again.")
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Posts</h1>
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="animate-pulse">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border-b border-gray-200 dark:border-gray-700 p-4">
                  <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="flex justify-end space-x-2">
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>\
