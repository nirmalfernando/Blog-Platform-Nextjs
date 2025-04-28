import { z } from "zod";

// User validations
export const userCreateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const userUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .optional(),
  image: z.string().url("Invalid image URL").optional().nullable(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
});

export const userRoleUpdateSchema = z.object({
  role: z.enum(["ADMIN", "EDITOR", "READER"]),
});

// Post validations
export const postCreateSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  imageUrl: z.string().url("Invalid image URL").optional().nullable(),
  categoryId: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().default(false),
});

export const postUpdateSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").optional(),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters")
    .optional(),
  imageUrl: z.string().url("Invalid image URL").optional().nullable(),
  categoryId: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
});

// Comment validations
export const commentCreateSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
  postId: z.string(),
});

export const commentUpdateSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
});

// Category validations
export const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  description: z.string().optional(),
});

// Tag validations
export const tagSchema = z.object({
  name: z.string().min(2, "Tag name must be at least 2 characters"),
});
