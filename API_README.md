# Blog API Documentation
## Base URL

```
http://localhost:3000/api
```

## Authentication

### Register a new user

```
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "clq...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "READER",
    "createdAt": "2023-12-20T12:00:00.000Z"
  }
}
```

### Login

```
POST /auth/signin/credentials
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123",
  "redirect": false
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "clq...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "READER"
  }
}
```

## Posts

### Get all posts

```
GET /posts
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `category` (optional): Filter by category name
- `tag` (optional): Filter by tag name
- `search` (optional): Search in title and content
- `authorId` (optional): Filter by author ID

**Response (200 OK):**
```json
{
  "posts": [
    {
      "id": "clq...",
      "title": "Getting Started with Next.js",
      "slug": "getting-started-with-nextjs",
      "content": "...",
      "published": true,
      "imageUrl": "/uploads/image.jpg",
      "authorId": "clq...",
      "categoryId": "clq...",
      "createdAt": "2023-12-20T12:00:00.000Z",
      "updatedAt": "2023-12-20T12:00:00.000Z",
      "author": {
        "id": "clq...",
        "name": "John Doe",
        "image": "/uploads/avatar.jpg"
      },
      "category": {
        "id": "clq...",
        "name": "Web Development",
        "description": "..."
      },
      "tags": [
        {
          "tag": {
            "id": "clq...",
            "name": "Next.js"
          }
        }
      ],
      "_count": {
        "comments": 5,
        "likes": 10
      }
    }
  ],
  "pagination": {
    "total": 20,
    "pages": 2,
    "page": 1,
    "limit": 10
  }
}
```

### Get a single post by slug

```
GET /posts/{slug}
```

**Response (200 OK):**
```json
{
  "id": "clq...",
  "title": "Getting Started with Next.js",
  "slug": "getting-started-with-nextjs",
  "content": "...",
  "published": true,
  "imageUrl": "/uploads/image.jpg",
  "authorId": "clq...",
  "categoryId": "clq...",
  "createdAt": "2023-12-20T12:00:00.000Z",
  "updatedAt": "2023-12-20T12:00:00.000Z",
  "author": {
    "id": "clq...",
    "name": "John Doe",
    "image": "/uploads/avatar.jpg"
  },
  "category": {
    "id": "clq...",
    "name": "Web Development",
    "description": "..."
  },
  "tags": [
    {
      "tag": {
        "id": "clq...",
        "name": "Next.js"
      }
    }
  ],
  "comments": [
    {
      "id": "clq...",
      "content": "Great article!",
      "userId": "clq...",
      "createdAt": "2023-12-20T12:00:00.000Z",
      "user": {
        "id": "clq...",
        "name": "Jane Smith",
        "image": "/uploads/avatar2.jpg"
      }
    }
  ],
  "_count": {
    "likes": 10,
    "savedBy": 5
  }
}
```

### Create a new post

```
POST /posts
```

**Auth Required:** Yes (ADMIN or EDITOR role)

**Request Body:**
```json
{
  "title": "Getting Started with Next.js",
  "content": "This is a comprehensive guide to Next.js...",
  "imageUrl": "/uploads/image.jpg",
  "categoryId": "clq...",
  "tags": ["Next.js", "React", "JavaScript"],
  "published": false
}
```

**Response (201 Created):**
```json
{
  "id": "clq...",
  "title": "Getting Started with Next.js",
  "slug": "getting-started-with-nextjs",
  "content": "This is a comprehensive guide to Next.js...",
  "published": false,
  "imageUrl": "/uploads/image.jpg",
  "authorId": "clq...",
  "categoryId": "clq...",
  "createdAt": "2023-12-20T12:00:00.000Z",
  "updatedAt": "2023-12-20T12:00:00.000Z",
  "author": {
    "id": "clq...",
    "name": "John Doe",
    "image": "/uploads/avatar.jpg"
  },
  "category": {
    "id": "clq...",
    "name": "Web Development",
    "description": "..."
  },
  "tags": [
    {
      "tag": {
        "id": "clq...",
        "name": "Next.js"
      }
    },
    {
      "tag": {
        "id": "clq...",
        "name": "React"
      }
    },
    {
      "tag": {
        "id": "clq...",
        "name": "JavaScript"
      }
    }
  ]
}
```

### Update a post

```
PATCH /posts/{slug}
```

**Auth Required:** Yes (ADMIN or post author with EDITOR role)

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "published": true,
  "tags": ["Next.js", "React", "TypeScript"]
}
```

**Response (200 OK):**
```json
{
  "id": "clq...",
  "title": "Updated Title",
  "slug": "updated-title",
  "content": "Updated content...",
  "published": true,
  "imageUrl": "/uploads/image.jpg",
  "authorId": "clq...",
  "categoryId": "clq...",
  "createdAt": "2023-12-20T12:00:00.000Z",
  "updatedAt": "2023-12-20T12:30:00.000Z"
}
```

### Delete a post

```
DELETE /posts/{slug}
```

**Auth Required:** Yes (ADMIN or post author with EDITOR role)

**Response (200 OK):**
```json
{
  "message": "Post deleted successfully"
}
```

## Comments

### Create a comment

```
POST /comments
```

**Auth Required:** Yes (any authenticated user)

**Request Body:**
```json
{
  "content": "Great article! Thanks for sharing.",
  "postId": "clq..."
}
```

**Response (201 Created):**
```json
{
  "id": "clq...",
  "content": "Great article! Thanks for sharing.",
  "postId": "clq...",
  "userId": "clq...",
  "createdAt": "2023-12-20T12:00:00.000Z",
  "updatedAt": "2023-12-20T12:00:00.000Z",
  "user": {
    "id": "clq...",
    "name": "John Doe",
    "image": "/uploads/avatar.jpg"
  }
}
```

### Update a comment

```
PATCH /comments/{id}
```

**Auth Required:** Yes (ADMIN or comment author)

**Request Body:**
```json
{
  "content": "Updated comment content"
}
```

**Response (200 OK):**
```json
{
  "id": "clq...",
  "content": "Updated comment content",
  "postId": "clq...",
  "userId": "clq...",
  "createdAt": "2023-12-20T12:00:00.000Z",
  "updatedAt": "2023-12-20T12:30:00.000Z",
  "user": {
    "id": "clq...",
    "name": "John Doe",
    "image": "/uploads/avatar.jpg"
  }
}
```

### Delete a comment

```
DELETE /comments/{id}
```

**Auth Required:** Yes (ADMIN or comment author)

**Response (200 OK):**
```json
{
  "message": "Comment deleted successfully"
}
```

## Likes

### Toggle like on a post

```
POST /likes
```

**Auth Required:** Yes (any authenticated user)

**Request Body:**
```json
{
  "postId": "clq..."
}
```

**Response (200 OK):**
```json
{
  "liked": true
}
```

or if unliking:

```json
{
  "liked": false
}
```

## Saved Posts

### Get all saved posts for current user

```
GET /saved-posts
```

**Auth Required:** Yes (any authenticated user)

**Response (200 OK):**
```json
[
  {
    "id": "clq...",
    "postId": "clq...",
    "userId": "clq...",
    "createdAt": "2023-12-20T12:00:00.000Z",
    "post": {
      "id": "clq...",
      "title": "Getting Started with Next.js",
      "slug": "getting-started-with-nextjs",
      "content": "...",
      "published": true,
      "imageUrl": "/uploads/image.jpg",
      "authorId": "clq...",
      "categoryId": "clq...",
      "createdAt": "2023-12-20T12:00:00.000Z",
      "updatedAt": "2023-12-20T12:00:00.000Z",
      "author": {
        "id": "clq...",
        "name": "John Doe",
        "image": "/uploads/avatar.jpg"
      },
      "category": {
        "id": "clq...",
        "name": "Web Development",
        "description": "..."
      },
      "tags": [
        {
          "tag": {
            "id": "clq...",
            "name": "Next.js"
          }
        }
      ]
    }
  }
]
```

### Toggle save post

```
POST /saved-posts
```

**Auth Required:** Yes (any authenticated user)

**Request Body:**
```json
{
  "postId": "clq..."
}
```

**Response (200 OK):**
```json
{
  "saved": true
}
```

or if unsaving:

```json
{
  "saved": false
}
```

## Categories

### Get all categories

```
GET /categories
```

**Response (200 OK):**
```json
[
  {
    "id": "clq...",
    "name": "Web Development",
    "description": "Articles about web development"
  },
  {
    "id": "clq...",
    "name": "Data Science",
    "description": "Articles about data science and machine learning"
  }
]
```

### Create a category

```
POST /categories
```

**Auth Required:** Yes (ADMIN role)

**Request Body:**
```json
{
  "name": "Mobile Development",
  "description": "Articles about mobile app development"
}
```

**Response (201 Created):**
```json
{
  "id": "clq...",
  "name": "Mobile Development",
  "description": "Articles about mobile app development"
}
```

## Tags

### Get all tags

```
GET /tags
```

**Response (200 OK):**
```json
[
  {
    "id": "clq...",
    "name": "Next.js"
  },
  {
    "id": "clq...",
    "name": "React"
  },
  {
    "id": "clq...",
    "name": "JavaScript"
  }
]
```

## Admin Endpoints

### Get all users (admin only)

```
GET /admin/users
```

**Auth Required:** Yes (ADMIN role)

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search in name, email, or username
- `role` (optional): Filter by role

**Response (200 OK):**
```json
{
  "users": [
    {
      "id": "clq...",
      "name": "John Doe",
      "email": "john@example.com",
      "username": "johndoe",
      "image": "/uploads/avatar.jpg",
      "role": "ADMIN",
      "createdAt": "2023-12-20T12:00:00.000Z",
      "_count": {
        "posts": 10,
        "comments": 25
      }
    }
  ],
  "pagination": {
    "total": 50,
    "pages": 5,
    "page": 1,
    "limit": 10
  }
}
```

### Get a single user (admin only)

```
GET /admin/users/{id}
```

**Auth Required:** Yes (ADMIN role)

**Response (200 OK):**
```json
{
  "id": "clq...",
  "name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "image": "/uploads/avatar.jpg",
  "role": "ADMIN",
  "createdAt": "2023-12-20T12:00:00.000Z",
  "posts": [
    {
      "id": "clq...",
      "title": "Getting Started with Next.js",
      "slug": "getting-started-with-nextjs",
      "published": true,
      "createdAt": "2023-12-20T12:00:00.000Z"
    }
  ],
  "_count": {
    "posts": 10,
    "comments": 25,
    "likes": 50,
    "savedPosts": 15
  }
}
```

### Update user role (admin only)

```
PATCH /admin/users/{id}
```

**Auth Required:** Yes (ADMIN role)

**Request Body:**
```json
{
  "role": "EDITOR"
}
```

**Response (200 OK):**
```json
{
  "id": "clq...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "EDITOR"
}
```

### Delete a user (admin only)

```
DELETE /admin/users/{id}
```

**Auth Required:** Yes (ADMIN role)

**Response (200 OK):**
```json
{
  "message": "User deleted successfully"
}
```

### Get all posts for admin (admin only)

```
GET /admin/posts
```

**Auth Required:** Yes (ADMIN or EDITOR role)

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search in title or content
- `status` (optional): Filter by status (published, draft)
- `authorId` (optional): Filter by author ID

**Response (200 OK):**
```json
{
  "posts": [
    {
      "id": "clq...",
      "title": "Getting Started with Next.js",
      "slug": "getting-started-with-nextjs",
      "content": "...",
      "published": true,
      "imageUrl": "/uploads/image.jpg",
      "authorId": "clq...",
      "categoryId": "clq...",
      "createdAt": "2023-12-20T12:00:00.000Z",
      "updatedAt": "2023-12-20T12:00:00.000Z",
      "author": {
        "id": "clq...",
        "name": "John Doe",
        "image": "/uploads/avatar.jpg"
      },
      "category": {
        "id": "clq...",
        "name": "Web Development",
        "description": "..."
      },
      "tags": [
        {
          "tag": {
            "id": "clq...",
            "name": "Next.js"
          }
        }
      ],
      "_count": {
        "comments": 5,
        "likes": 10
      }
    }
  ],
  "pagination": {
    "total": 20,
    "pages": 2,
    "page": 1,
    "limit": 10
  }
}
```

### Toggle publish status of a post (admin only)

```
PATCH /admin/posts/{id}/publish
```

**Auth Required:** Yes (ADMIN or post author with EDITOR role)

**Response (200 OK):**
```json
{
  "message": "Post published",
  "post": {
    "id": "clq...",
    "title": "Getting Started with Next.js",
    "slug": "getting-started-with-nextjs",
    "published": true,
    "authorId": "clq...",
    "author": {
      "id": "clq...",
      "name": "John Doe",
      "image": "/uploads/avatar.jpg"
    }
  }
}
```

## Error Handling

The API uses standard HTTP status codes:

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request (validation error)
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Testing with Postman

1. **Set up Environment Variable:**
   - Create a new environment in Postman
   - Add variable `baseUrl` with value `http://localhost:3000/api`

2. **Authentication Flow:**
   - Register a new user
   - Login with the registered credentials
   - Postman will automatically store the session cookies

3. **Testing Protected Routes:**
   - Ensure you're logged in
   - Make requests to protected endpoints
   - Check response status codes and bodies

4. **Admin Operations:**
   - Login with an admin account
   - Test admin-only endpoints

## User Roles

The API supports the following user roles with increasing privileges:

- **READER**: Can read posts, create comments, like posts, and save posts
- **EDITOR**: Can create and edit their own posts, plus all READER privileges
- **ADMIN**: Has full access to all endpoints and can manage users and content