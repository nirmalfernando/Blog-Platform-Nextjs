"use client";

import type React from "react";

import { useState } from "react";
import { ImageUpload } from "@/components/editor/image-upload";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { AlertCircle, Save } from "lucide-react";

// This would normally be fetched from your database for edit mode
const DUMMY_CATEGORIES = [
  { id: "1", name: "Web Development" },
  { id: "2", name: "Mobile Development" },
  { id: "3", name: "DevOps" },
  { id: "4", name: "Data Science" },
  { id: "5", name: "Design" },
];

export default function EditorPage() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    tags: "",
    content: "",
  });
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isDraft, setIsDraft] = useState(false);

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
  };

  const handleImageChange = (imageUrl: string | null) => {
    setFeaturedImage(imageUrl);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.category) {
      errors.category = "Category is required";
    }

    if (!formData.content.trim()) {
      errors.content = "Content is required";
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
      // This would normally submit the post data to your backend
      console.log("Submitting post:", {
        ...formData,
        featuredImage,
        status: saveAsDraft ? "draft" : "published",
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to blog or admin page after successful submission
      // window.location.href = saveAsDraft ? "/admin" : `/blog/${slug}`;
    } catch (error) {
      console.error("Error submitting post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Create New Post
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

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                formErrors.category
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-700"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-theme-purple-500 focus:border-theme-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
            >
              <option value="">Select a category</option>
              {DUMMY_CATEGORIES.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {formErrors.category && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {formErrors.category}
              </p>
            )}
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
          <ImageUpload onImageChange={handleImageChange} />

          {/* Content */}
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Content
            </label>
            <RichTextEditor
              initialValue={formData.content}
              onChange={handleContentChange}
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
