import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { postCreateSchema } from "@/lib/validation"
import { generateSlug } from "@/lib/utils"

// Get all posts (public)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category")
    const tag = searchParams.get("tag")
    const search = searchParams.get("search")
    const authorId = searchParams.get("authorId")

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      published: true,
    }

    if (category) {
      where.category = {
        name: category,
      }
    }

    if (tag) {
      where.tags = {
        some: {
          tag: {
            name: tag,
          },
        },
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ]
    }

    if (authorId) {
      where.authorId = authorId
    }

    // Get posts
    const posts = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    })

    // Get total count for pagination
    const totalPosts = await prisma.post.count({ where })

    return NextResponse.json({
      posts,
      pagination: {
        total: totalPosts,
        pages: Math.ceil(totalPosts / limit),
        page,
        limit,
      },
    })
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Create a new post (authenticated, admin/editor only)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const validatedData = postCreateSchema.parse(body)

    // Generate slug from title
    const slug = generateSlug(validatedData.title)

    // Check if slug already exists
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    })

    if (existingPost) {
      return NextResponse.json({ error: "A post with this title already exists" }, { status: 400 })
    }

    // Create post
    const post = await prisma.post.create({
      data: {
        title: validatedData.title,
        slug,
        content: validatedData.content,
        imageUrl: validatedData.imageUrl,
        published: validatedData.published,
        authorId: session.user.id,
        categoryId: validatedData.categoryId,
      },
    })

    // Add tags if provided
    if (validatedData.tags && validatedData.tags.length > 0) {
      for (const tagName of validatedData.tags) {
        // Find or create tag
        let tag = await prisma.tag.findUnique({
          where: { name: tagName },
        })

        if (!tag) {
          tag = await prisma.tag.create({
            data: { name: tagName },
          })
        }

        // Connect tag to post
        await prisma.tagsOnPosts.create({
          data: {
            postId: post.id,
            tagId: tag.id,
          },
        })
      }
    }

    // Return the created post with tags
    const createdPost = await prisma.post.findUnique({
      where: { id: post.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    return NextResponse.json(createdPost, { status: 201 })
  } catch (error: any) {
    console.error("Error creating post:", error)

    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
