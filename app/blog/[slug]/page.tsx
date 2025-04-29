"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { CommentForm } from "@/components/blog/comment-form";
import { CommentList } from "@/components/blog/comment-list";
import { postAPI, commentAPI, likeAPI, savedPostsAPI } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Bookmark, Heart, Share2 } from "lucide-react";

export default function BlogPost() {
  const { slug } = useParams();
  const router = useRouter();
  const { user, status } = useAuth();

  const [post, setPost] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      if (!slug) {
        router.push("/blog");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const fetchedPost = await postAPI.getPostBySlug(slug as string);
        setPost(fetchedPost);

        // Set initial like and save states
        if (fetchedPost._count) {
          setLikeCount(fetchedPost._count.likes || 0);
        }

        // Check if the current user has liked or saved this post
        if (user && fetchedPost.likes) {
          setIsLiked(
            fetchedPost.likes.some((like: any) => like.userId === user.id)
          );
        }

        if (user && fetchedPost.savedBy) {
          setIsSaved(
            fetchedPost.savedBy.some((saved: any) => saved.userId === user.id)
          );
        }
      } catch (err: any) {
        console.error("Error fetching post:", err);
        setError(err.message || "Failed to fetch post");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPost();
  }, [slug, router, user]);

  const handleCommentSubmit = async (commentData: { content: string }) => {
    if (!post) return false;

    try {
      const newComment = await commentAPI.createComment({
        content: commentData.content,
        postId: post.id,
      });

      // Update the post's comments
      setPost({
        ...post,
        comments: [newComment, ...post.comments],
      });

      return true;
    } catch (error) {
      console.error("Error submitting comment:", error);
      return false;
    }
  };

  const handleLikeToggle = async () => {
    if (!user || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await likeAPI.toggleLike(post.id);
      setIsLiked(result.liked);
      setLikeCount((prev) => (result.liked ? prev + 1 : prev - 1));
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveToggle = async () => {
    if (!user || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await savedPostsAPI.toggleSavePost(post.id);
      setIsSaved(result.saved);
    } catch (error) {
      console.error("Error toggling save:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="mb-8">
            <div className="h-10 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 mr-4"></div>
              <div>
                <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
            <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
          </div>

          <div className="space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center py-12">
          <p className="text-red-500 dark:text-red-400 mb-4">
            {error || "Post not found"}
          </p>
          <Link
            href="/blog"
            className="px-4 py-2 bg-theme-purple-600 text-white rounded hover:bg-theme-purple-700"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            {post.title}
          </h1>
          <div className="flex items-center mb-6">
            <Image
              src={post.author.image || "/placeholder.svg?height=64&width=64"}
              alt={post.author.name}
              width={64}
              height={64}
              className="rounded-full mr-4"
            />
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {post.author.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(post.createdAt)}
                {post.category && ` • ${post.category.name}`}
              </p>
            </div>
          </div>
          {post.imageUrl && (
            <div className="mb-6">
              <Image
                src={post.imageUrl || "/placeholder.svg"}
                alt={post.title}
                width={800}
                height={400}
                className="rounded-lg w-full h-auto"
              />
            </div>
          )}
        </header>

        <div
          className="prose prose-lg dark:prose-invert max-w-none mb-12 prose-a:text-theme-purple-600 dark:prose-a:text-theme-purple-400 prose-headings:text-gray-900 dark:prose-headings:text-white"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Post actions */}
        <div className="flex items-center space-x-6 mb-8 border-t border-b border-gray-200 dark:border-gray-800 py-4">
          <button
            onClick={handleLikeToggle}
            disabled={!user || isSubmitting}
            className={`flex items-center space-x-2 ${
              !user ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Heart
              className={`h-6 w-6 ${
                isLiked
                  ? "fill-red-500 text-red-500"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            />
            <span className="text-gray-700 dark:text-gray-300">
              {likeCount}
            </span>
          </button>

          <button
            onClick={handleSaveToggle}
            disabled={!user || isSubmitting}
            className={`flex items-center space-x-2 ${
              !user ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Bookmark
              className={`h-6 w-6 ${
                isSaved
                  ? "fill-theme-purple-500 text-theme-purple-500"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            />
            <span className="text-gray-700 dark:text-gray-300">Save</span>
          </button>

          <button onClick={handleShare} className="flex items-center space-x-2">
            <Share2 className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">Share</span>
          </button>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(({ tag }: any) => (
                <span
                  key={tag.id}
                  className="bg-theme-purple-100 dark:bg-theme-purple-900/50 text-theme-purple-800 dark:text-theme-purple-300 px-3 py-1 rounded-full text-sm"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <section className="border-t border-gray-200 dark:border-gray-800 pt-8">
          <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
            Comments ({post.comments.length})
          </h3>

          {status === "authenticated" ? (
            <CommentForm postId={post.id} onSubmit={handleCommentSubmit} />
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-8">
              <p className="text-gray-700 dark:text-gray-300">
                Please{" "}
                <Link
                  href="/login"
                  className="text-theme-purple-600 dark:text-theme-purple-400 hover:underline"
                >
                  log in
                </Link>{" "}
                to leave a comment.
              </p>
            </div>
          )}

          <CommentList
            comments={post.comments}
            currentUserId={user?.id}
            onDeleteComment={async (commentId) => {
              try {
                await commentAPI.deleteComment(commentId);

                // Update the post's comments
                setPost({
                  ...post,
                  comments: post.comments.filter(
                    (comment: any) => comment.id !== commentId
                  ),
                });

                return true;
              } catch (error) {
                console.error("Error deleting comment:", error);
                return false;
              }
            }}
            onUpdateComment={async (commentId, content) => {
              try {
                const updatedComment = await commentAPI.updateComment(
                  commentId,
                  content
                );

                // Update the post's comments
                setPost({
                  ...post,
                  comments: post.comments.map((comment: any) =>
                    comment.id === commentId ? updatedComment : comment
                  ),
                });

                return true;
              } catch (error) {
                console.error("Error updating comment:", error);
                return false;
              }
            }}
          />
        </section>
      </article>
    </div>
  );
}
