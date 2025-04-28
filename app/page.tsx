import Link from "next/link";
import Image from "next/image";

const DUMMY_POSTS = [
  {
    id: "1",
    title: "Getting Started with Next.js 14",
    slug: "getting-started-with-nextjs-14",
    excerpt:
      "Learn how to build modern web applications with Next.js 14 and its powerful features.",
    author: {
      name: "Jane Smith",
      image: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2023-04-15",
  },
  {
    id: "2",
    title: "Mastering Tailwind CSS",
    slug: "mastering-tailwind-css",
    excerpt:
      "Discover advanced techniques and best practices for building beautiful UIs with Tailwind CSS.",
    author: {
      name: "John Doe",
      image: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2023-04-10",
  },
  {
    id: "3",
    title: "TypeScript Tips and Tricks",
    slug: "typescript-tips-and-tricks",
    excerpt:
      "Improve your TypeScript skills with these practical tips and tricks for everyday development.",
    author: {
      name: "Alex Johnson",
      image: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2023-04-05",
  },
  {
    id: "4",
    title: "Building a Blog with Next.js",
    slug: "building-a-blog-with-nextjs",
    excerpt:
      "Step-by-step guide to creating a full-featured blog using Next.js, Tailwind CSS, and TypeScript.",
    author: {
      name: "Sarah Williams",
      image: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2023-03-28",
  },
];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Next.js Blog Platform
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          A modern blogging platform built with Next.js, Tailwind CSS, and
          TypeScript.
        </p>
      </header>

      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DUMMY_POSTS.map((post) => (
            <article
              key={post.id}
              className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center mb-4">
                  <Image
                    src={post.author.image || "/placeholder.svg"}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className="rounded-full mr-3"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {post.author.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-block bg-theme-purple-600 hover:bg-theme-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                >
                  Read more
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
