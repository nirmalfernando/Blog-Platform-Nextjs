"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Save } from "lucide-react";
import { TipTapEditor } from "@/components/editor/tiptap-editor";
import { ImageUpload } from "@/components/editor/image-upload";
import { postAPI, categoryAPI, uploadAPI } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";

export default function EditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");
  const { user, status } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    categoryId: "",
    tags: "",
  });
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isDraft, setIsDraft] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categoriesData = await categoryAPI.getAllCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    async function fetchPostData() {
      if (postId) {
        setIsEditMode(true);
        try {
          const post = await postAPI.getPostBySlug(postId);
          setFormData({
            title: post.title,
            content: post.content,
            excerpt: post.excerpt || "",
            categoryId: post.category?.id || "",
            tags: post.tags.map((t: any) => t.tag.name).join(", "),
          });
          setFeaturedImage(post.imageUrl);
          setIsDraft(!post.published);
        } catch (error) {
          console.error("Error fetching post:", error);
          router.push("/editor");
        }
      }
      setIsLoading(false);
    }

    fetchCategories();
    fetchPostData();
  }, [postId, router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      content,
    }));

    // Clear error when user types
    if (formErrors.content) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.content;
        return newErrors;
      });
    }

    // Auto-generate excerpt if it's empty
    if (!formData.excerpt.trim()) {
      const textContent = content.replace(/<[^>]+>/g, "");
      const excerpt =
        textContent.substring(0, 150) + (textContent.length > 150 ? "..." : "");
      setFormData((prev) => ({
        ...prev,
        excerpt,
      }));
    }
  };

  const handleImageChange = async (file: File | null) => {
    if (!file) {
      setFeaturedImage(null);
      return;
    }

    try {
      const result = await uploadAPI.uploadFile(file);
      setFeaturedImage(result.url);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.content.trim()) {
      errors.content = "Content is required";
    }

    if (!formData.excerpt.trim()) {
      errors.excerpt = "Excerpt is required";
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent, saveAsDraft = false) => {
    e.preventDefault();
    setIsDraft(saveAsDraft);

    // Only validate if not saving as draft
    if (!saveAsDraft) {
      const errors = validateForm();
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const postData = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        imageUrl: featuredImage,
        categoryId: formData.categoryId || null,
        tags: tagsArray,
        published: !saveAsDraft,
      };

      let result;
      if (isEditMode) {
        result = await postAPI.updatePost(postId as string, postData);
      } else {
        result = await postAPI.createPost(postData);
      }

      // Redirect to the post or admin page
      router.push(saveAsDraft ? "/profile/posts" : `/blog/${result.slug}`);
    } catch (error: any) {
      console.error("Error submitting post:", error);
      alert(`Error: ${error.message || "Failed to save post"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
            <div className="space-y-6">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="flex justify-end space-x-4">
                <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login?callbackUrl=/editor");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          {isEditMode ? "Edit Post" : "Create New Post"}
        </h1>

        <form className="space-y-6" onSubmit={(e) => handleSubmit(e, false)}>
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                formErrors.title
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-700"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-theme-purple-500 focus:border-theme-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
              placeholder="Enter post title"
            />
            {formErrors.title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {formErrors.title}
              </p>
            )}
          </div>

          {/* Excerpt */}
          <div>
            <label
              htmlFor="excerpt"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Excerpt (Short summary)
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={2}
              className={`w-full px-3 py-2 border ${
                formErrors.excerpt
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-700"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-theme-purple-500 focus:border-theme-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
              placeholder="Brief description of your post (will be auto-generated if left empty)"
            />
            {formErrors.excerpt && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {formErrors.excerpt}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Category
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-theme-purple-500 focus:border-theme-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Tags (comma separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-theme-purple-500 focus:border-theme-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="e.g. nextjs, react, typescript"
            />
          </div>

          {/* Featured Image */}
          <ImageUpload
            onImageChange={handleImageChange}
            initialImage={featuredImage}
          />

          {/* Content */}
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Content
            </label>
            <TipTapEditor
              content={formData.content}
              onChange={handleContentChange}
              placeholder="Write your post content here..."
            />
            {formErrors.content && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {formErrors.content}
              </p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting && isDraft ? "Saving..." : "Save as Draft"}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-theme-purple-600 hover:bg-theme-purple-700 text-white font-medium rounded-md transition-colors duration-200 flex items-center"
            >
              {isSubmitting && !isDraft ? "Publishing..." : "Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
