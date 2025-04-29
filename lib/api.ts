import { getSession } from "next-auth/react";

// Base API URL
const API_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Generic fetch function with authentication
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  // Get the user session for authentication
  const session = await getSession();

  const headers = {
    "Content-Type": "application/json",
    ...(session && { Authorization: `Bearer ${session.user.id}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle errors
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.error || `API error: ${response.status}`);
  }

  return response.json();
}

// Post API functions
export const postAPI = {
  getAllPosts: async (params: Record<string, string> = {}) => {
    const queryParams = new URLSearchParams(params);
    return fetchAPI(`/api/posts?${queryParams}`);
  },

  getPostBySlug: async (slug: string) => {
    return fetchAPI(`/api/posts/${slug}`);
  },

  createPost: async (postData: any) => {
    return fetchAPI("/api/posts", {
      method: "POST",
      body: JSON.stringify(postData),
    });
  },

  updatePost: async (slug: string, postData: any) => {
    return fetchAPI(`/api/posts/${slug}`, {
      method: "PATCH",
      body: JSON.stringify(postData),
    });
  },

  deletePost: async (slug: string) => {
    return fetchAPI(`/api/posts/${slug}`, {
      method: "DELETE",
    });
  },
};

// Comment API functions
export const commentAPI = {
  createComment: async (commentData: any) => {
    return fetchAPI("/api/comments", {
      method: "POST",
      body: JSON.stringify(commentData),
    });
  },

  updateComment: async (id: string, content: string) => {
    return fetchAPI(`/api/comments/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ content }),
    });
  },

  deleteComment: async (id: string) => {
    return fetchAPI(`/api/comments/${id}`, {
      method: "DELETE",
    });
  },
};

// Like API functions
export const likeAPI = {
  toggleLike: async (postId: string) => {
    return fetchAPI("/api/likes", {
      method: "POST",
      body: JSON.stringify({ postId }),
    });
  },
};

// Saved Posts API functions
export const savedPostsAPI = {
  getAllSavedPosts: async () => {
    return fetchAPI("/api/saved-posts");
  },

  toggleSavePost: async (postId: string) => {
    return fetchAPI("/api/saved-posts", {
      method: "POST",
      body: JSON.stringify({ postId }),
    });
  },
};

// Category API functions
export const categoryAPI = {
  getAllCategories: async () => {
    return fetchAPI("/api/categories");
  },

  createCategory: async (categoryData: any) => {
    return fetchAPI("/api/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
  },
};

// Tag API functions
export const tagAPI = {
  getAllTags: async () => {
    return fetchAPI("/api/tags");
  },
};

// User management API functions (admin only)
export const adminAPI = {
  getAllUsers: async (params: Record<string, string> = {}) => {
    const queryParams = new URLSearchParams(params);
    return fetchAPI(`/api/admin/users?${queryParams}`);
  },

  getUserById: async (id: string) => {
    return fetchAPI(`/api/admin/users/${id}`);
  },

  updateUserRole: async (id: string, role: string) => {
    return fetchAPI(`/api/admin/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
  },

  deleteUser: async (id: string) => {
    return fetchAPI(`/api/admin/users/${id}`, {
      method: "DELETE",
    });
  },

  getAllAdminPosts: async (params: Record<string, string> = {}) => {
    const queryParams = new URLSearchParams(params);
    return fetchAPI(`/api/admin/posts?${queryParams}`);
  },

  togglePostPublish: async (id: string) => {
    return fetchAPI(`/api/admin/posts/${id}/publish`, {
      method: "PATCH",
    });
  },
};

// Auth API functions
export const authAPI = {
  register: async (userData: any) => {
    return fetchAPI("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },
};

// Upload API function
export const uploadAPI = {
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const session = await getSession();
    const headers: Record<string, string> = {};
    if (session) {
      headers.Authorization = `Bearer ${session.user.id}`;
    }

    const response = await fetch(`${API_URL}/api/upload`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.error || `Upload error: ${response.status}`);
    }

    return response.json();
  },
};
