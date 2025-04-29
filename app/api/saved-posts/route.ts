import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Get all saved posts for the current user
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const savedPosts = await prisma.savedPost.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        post: {
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
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(savedPosts);
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Toggle save post
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await req.json();

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if user already saved the post
    const existingSave = await prisma.savedPost.findFirst({
      where: {
        postId,
        userId: session.user.id,
      },
    });

    if (existingSave) {
      // Unsave the post
      await prisma.savedPost.delete({
        where: { id: existingSave.id },
      });

      return NextResponse.json({ saved: false });
    } else {
      // Save the post
      await prisma.savedPost.create({
        data: {
          postId,
          userId: session.user.id,
        },
      });

      return NextResponse.json({ saved: true });
    }
  } catch (error) {
    console.error("Error toggling saved post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
