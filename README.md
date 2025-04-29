# Next.js Blog Platform

A full-featured blog platform built with Next.js, Prisma, and PostgreSQL with authentication, user roles, content management, and more.

## Features

- User authentication (email/password and OAuth providers)
- User roles (Admin, Editor, Reader)
- Rich text editor for content creation
- Post categories and tags
- Comments on posts
- Like/save posts functionality
- Search and filtering capabilities
- Admin dashboard
- Responsive design with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 13+ (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **UI Components**: shadcn/ui
- **Content Editing**: TipTap editor

## Setup Instructions

### Prerequisites

- Node.js 18.x or newer
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/nextjs-blog-platform.git
   cd Blog-Platform-Nextjs
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your database and authentication settings:
   ```
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/blog_platform?schema=public"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret-key-at-least-32-chars"
   
   # OAuth Providers
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   
   # App
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. Generate Prisma client and push schema to database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

The project follows a standard Next.js 13+ App Router structure with the Prisma schema located at:
```
/prisma/schema.prisma
```

## Database Schema

The application uses Prisma ORM with PostgreSQL. Here's an overview of the main models:

### User
- Authentication and profile information
- Relation to posts, comments, likes, saved posts
- Role-based authorization (ADMIN, EDITOR, READER)

### Post
- Blog post content with title, content, image
- Slugs for SEO-friendly URLs
- Published/draft status
- Relations to category, tags, comments, likes

### Category
- Classification for posts
- Name and description

### Tag
- Keywords for posts
- Many-to-many relation with posts through TagsOnPosts

### Comment
- User comments on posts
- Content and timestamp

### Like
- User likes on posts
- Unique constraint on post and user

### SavedPost
- User bookmarks for posts
- Unique constraint on post and user

### Complete Schema (schema.prisma)

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../lib/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  name          String?
  username      String?   @unique
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?
  role          Role      @default(READER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  accounts      Account[]
  sessions      Session[]
  posts         Post[]
  comments      Comment[]
  likes         Like[]
  savedPosts    SavedPost[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model Post {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  content     String    @db.Text
  published   Boolean   @default(false)
  imageUrl    String?
  authorId    String
  categoryId  String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Relations
  author      User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  category    Category? @relation(fields: [categoryId], references: [id])
  tags        TagsOnPosts[]
  comments    Comment[]
  likes       Like[]
  savedBy     SavedPost[]
}

model Category {
  id          String    @id @default(cuid())
  name        String    @unique
  description String?
  posts       Post[]
}

model Tag {
  id          String    @id @default(cuid())
  name        String    @unique
  posts       TagsOnPosts[]
}

model TagsOnPosts {
  postId      String
  tagId       String
  assignedAt  DateTime  @default(now())
  
  post        Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  tag         Tag       @relation(fields: [tagId], references: [id], onDelete: Cascade)
  
  @@id([postId, tagId])
}

model Comment {
  id          String    @id @default(cuid())
  content     String    @db.Text
  postId      String
  userId      String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  post        Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Like {
  id          String    @id @default(cuid())
  postId      String
  userId      String
  createdAt   DateTime  @default(now())

  post        Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([postId, userId])
}

model SavedPost {
  id          String    @id @default(cuid())
  postId      String
  userId      String
  createdAt   DateTime  @default(now())

  post        Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([postId, userId])
}

enum Role {
  ADMIN
  EDITOR
  READER
}
```

## API Endpoints

The API documentation is comprehensive and can be found in [API_README.md](API_README.md). Here's a summary of the main endpoints:

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/[...nextauth]` - NextAuth.js authentication routes

### Posts
- `GET /api/posts` - Get all posts with filtering and pagination
- `GET /api/posts/{slug}` - Get a single post by slug
- `POST /api/posts` - Create a new post (ADMIN/EDITOR)
- `PATCH /api/posts/{slug}` - Update a post (ADMIN/post author)
- `DELETE /api/posts/{slug}` - Delete a post (ADMIN/post author)

### Comments
- `POST /api/comments` - Create a comment on a post
- `PATCH /api/comments/{id}` - Update a comment (ADMIN/comment author)
- `DELETE /api/comments/{id}` - Delete a comment (ADMIN/comment author)

### Likes & Saved Posts
- `POST /api/likes` - Toggle like on a post
- `GET /api/saved-posts` - Get all saved posts for current user
- `POST /api/saved-posts` - Toggle save post

### Categories & Tags
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a category (ADMIN)
- `GET /api/tags` - Get all tags

### Admin Endpoints
- `GET /api/admin/users` - Get all users (ADMIN)
- `GET /api/admin/users/{id}` - Get a single user (ADMIN)
- `PATCH /api/admin/users/{id}` - Update user role (ADMIN)
- `DELETE /api/admin/users/{id}` - Delete a user (ADMIN)
- `GET /api/admin/posts` - Get all posts for admin (ADMIN/EDITOR)
- `PATCH /api/admin/posts/{id}/publish` - Toggle publish status (ADMIN/post author)

## User Roles

The application supports three user roles with increasing privileges:

### READER
- Base role assigned to all new users
- Can read posts, create comments, like posts, and save posts
- Can update their own profile and manage their saved content

### EDITOR
- Can create new posts (drafts)
- Can edit and delete their own posts
- Can publish/unpublish their own posts (if granted by admin)
- Has all READER privileges

### ADMIN
- Full access to all content and features
- Can manage users (view, change roles, delete)
- Can manage all posts regardless of author
- Can create, edit, and delete categories
- Can moderate comments
- Has full control over the platform

Role-based access control is implemented throughout the application to ensure users can only access and modify content according to their privileges.

## Folder Structure

The project follows a standard Next.js 13+ App Router structure:

- `/app` - Next.js application routes and pages
- `/app/api` - API routes
- `/components` - React components
- `/contexts` - React context providers
- `/hooks` - Custom React hooks
- `/lib` - Utility functions and shared code
- `/prisma` - Database schema and migrations
- `/public` - Static assets
- `/styles` - Global CSS files
