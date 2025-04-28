import Image from "next/image";
import Link from "next/link";
import { CommentForm } from "@/components/blog/comment-form";
import { CommentList } from "@/components/blog/comment-list";

// Dummy data for a single post
const DUMMY_POST = {
  id: "1",
  title: "Getting Started with Next.js 14",
  slug: "getting-started-with-nextjs-14",
  content: `
    <h2>Introduction to Next.js 14</h2>
    <p>Next.js is a React framework that enables server-side rendering, static site generation, and more. Version 14 introduces several new features and improvements.</p>
    <h2>Key Features</h2>
    <ul>
      <li>App Router</li>
      <li>Server Components</li>
      <li>Server Actions</li>
      <li>Improved Image Optimization</li>
    </ul>
    <p>In this post, we'll explore these features in depth and show you how to use them in your projects.</p>
  `,
  image: "/placeholder.svg?height=400&width=800",
  tags: ["Next.js", "React", "Web Development"],
  author: {
    name: "Jane Smith",
    image: "/placeholder.svg?height=64&width=64",
    bio: "Full-stack developer specializing in React and Next.js",
  },
  createdAt: "2023-04-15",
};

// Dummy comments
const DUMMY_COMMENTS = [
  {
    id: "1",
    content: "Great article! I learned a lot about Next.js 14.",
    author: {
      name: "John Doe",
      image: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2023-04-16",
  },
  {
    id: "2",
    content:
      "I've been using Next.js for a while, but I didn't know about some of these new features. Thanks for sharing!",
    author: {
      name: "Sarah Williams",
      image: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2023-04-17",
  },
];

const isLoggedIn = true;

export default function BlogPost({ params }: { params: { slug: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            {DUMMY_POST.title}
          </h1>
          <div className="flex items-center mb-6">
            <Image
              src={DUMMY_POST.author.image || "/placeholder.svg"}
              alt={DUMMY_POST.author.name}
              width={64}
              height={64}
              className="rounded-full mr-4"
            />
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {DUMMY_POST.author.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(DUMMY_POST.createdAt).toLocaleDateString()} •
                {DUMMY_POST.author.bio}
              </p>
            </div>
          </div>
          <div className="mb-6">
            <Image
              src={DUMMY_POST.image || "/placeholder.svg"}
              alt={DUMMY_POST.title}
              width={800}
              height={400}
              className="rounded-lg w-full h-auto"
            />
          </div>
        </header>

        <div
          className="prose prose-lg dark:prose-invert max-w-none mb-12 prose-a:text-theme-purple-600 dark:prose-a:text-theme-purple-400 prose-headings:text-gray-900 dark:prose-headings:text-white"
          dangerouslySetInnerHTML={{ __html: DUMMY_POST.content }}
        />

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {DUMMY_POST.tags.map((tag) => (
              <span
                key={tag}
                className="bg-theme-purple-100 dark:bg-theme-purple-900/50 text-theme-purple-800 dark:text-theme-purple-300 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <section className="border-t border-gray-200 dark:border-gray-800 pt-8">
          <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
            Comments ({DUMMY_COMMENTS.length})
          </h3>

          {isLoggedIn ? (
            <CommentForm postId={DUMMY_POST.id} />
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

          <CommentList comments={DUMMY_COMMENTS} />
        </section>
      </article>
    </div>
  );
}
