import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { postUpdateSchema } from "@/lib/validations";
import { generateSlug } from "@/lib/utils";

// Get a single post by slug
export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    const post = await prisma.post.findUnique({
      where: { slug },
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
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            likes: true,
            savedBy: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Increment view count or other analytics here if needed

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update a post
export async function PATCH(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const slug = params.slug;

    // Find the post
    const post = await prisma.post.findUnique({
      where: { slug },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if user is authorized to update the post
    if (post.authorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = postUpdateSchema.parse(body);

    // Generate new slug if title is updated
    let newSlug = slug;
    if (validatedData.title) {
      newSlug = generateSlug(validatedData.title);

      // Check if new slug already exists (and is not the current post)
      if (newSlug !== slug) {
        const existingPost = await prisma.post.findUnique({
          where: { slug: newSlug },
        });

        if (existingPost) {
          return NextResponse.json(
            { error: "A post with this title already exists" },
            { status: 400 }
          );
        }
      }
    }

    // Update post
    const updatedPost = await prisma.post.update({
      where: { id: post.id },
      data: {
        title: validatedData.title,
        slug: newSlug,
        content: validatedData.content,
        imageUrl: validatedData.imageUrl,
        published: validatedData.published,
        categoryId: validatedData.categoryId,
      },
    });

    // Update tags if provided
    if (validatedData.tags) {
      // Remove existing tags
      await prisma.tagsOnPosts.deleteMany({
        where: { postId: post.id },
      });

      // Add new tags
      for (const tagName of validatedData.tags) {
        // Find or create tag
        let tag = await prisma.tag.findUnique({
          where: { name: tagName },
        });

        if (!tag) {
          tag = await prisma.tag.create({
            data: { name: tagName },
          });
        }

        // Connect tag to post
        await prisma.tagsOnPosts.create({
          data: {
            postId: post.id,
            tagId: tag.id,
          },
        });
      }
    }

    // Return the updated post with tags
    const result = await prisma.post.findUnique({
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
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error updating post:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete a post
export async function DELETE(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const slug = params.slug;

    // Find the post
    const post = await prisma.post.findUnique({
      where: { slug },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if user is authorized to delete the post
    if (post.authorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete post (cascade will handle related records)
    await prisma.post.delete({
      where: { id: post.id },
    });

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
