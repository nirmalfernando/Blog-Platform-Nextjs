import Link from "next/link"
import Image from "next/image"
import { SearchBar } from "@/components/blog/search-bar"
import { FilterPanel } from "@/components/blog/filter-panel"
import { Pagination } from "@/components/blog/pagination"

//Dummy data for posts
const DUMMY_POSTS = [
  {
    id: "1",
    title: "Getting Started with Next.js 14",
    slug: "getting-started-with-nextjs-14",
    excerpt: "Learn how to build modern web applications with Next.js 14 and its powerful features.",
    author: {
      name: "Jane Smith",
      image: "/placeholder.svg?height=40&width=40",
    },
    category: "Web Development",
    tags: ["Next.js", "React", "JavaScript"],
    createdAt: "2023-04-15",
  },
  {
    id: "2",
    title: "Mastering Tailwind CSS",
    slug: "mastering-tailwind-css",
    excerpt: "Discover advanced techniques and best practices for building beautiful UIs with Tailwind CSS.",
    author: {
      name: "John Doe",
      image: "/placeholder.svg?height=40&width=40",
    },
    category: "CSS",
    tags: ["Tailwind", "CSS", "Design"],
    createdAt: "2023-04-10",
  },
  {
    id: "3",
    title: "TypeScript Tips and Tricks",
    slug: "typescript-tips-and-tricks",
    excerpt: "Improve your TypeScript skills with these practical tips and tricks for everyday development.",
    author: {
      name: "Alex Johnson",
      image: "/placeholder.svg?height=40&width=40",
    },
    category: "TypeScript",
    tags: ["TypeScript", "JavaScript", "Development"],
    createdAt: "2023-04-05",
  },
  {
    id: "4",
    title: "Building a Blog with Next.js",
    slug: "building-a-blog-with-nextjs",
    excerpt: "Step-by-step guide to creating a full-featured blog using Next.js, Tailwind CSS, and TypeScript.",
    author: {
      name: "Sarah Williams",
      image: "/placeholder.svg?height=40&width=40",
    },
    category: "Web Development",
    tags: ["Next.js", "Blog", "Tutorial"],
    createdAt: "2023-03-28",
  },
  {
    id: "5",
    title: "Introduction to Server Components",
    slug: "introduction-to-server-components",
    excerpt: "Learn about React Server Components and how they can improve your application's performance.",
    author: {
      name: "Michael Brown",
      image: "/placeholder.svg?height=40&width=40",
    },
    category: "React",
    tags: ["React", "Server Components", "Performance"],
    createdAt: "2023-03-20",
  },
  {
    id: "6",
    title: "State Management in React",
    slug: "state-management-in-react",
    excerpt: "Compare different state management solutions for React applications.",
    author: {
      name: "Emily Chen",
      image: "/placeholder.svg?height=40&width=40",
    },
    category: "React",
    tags: ["React", "State Management", "Redux"],
    createdAt: "2023-03-15",
  },
]

// Dummy Categories and tags for filtering
const CATEGORIES = ["All", "Web Development", "CSS", "TypeScript", "React"]
const TAGS = [
  "Next.js",
  "React",
  "JavaScript",
  "TypeScript",
  "Tailwind",
  "CSS",
  "Design",
  "Tutorial",
  "Server Components",
  "Performance",
  "State Management",
  "Redux",
  "Blog",
  "Development",
]
const AUTHORS = ["All", "Jane Smith", "John Doe", "Alex Johnson", "Sarah Williams", "Michael Brown", "Emily Chen"]

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Blog</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
          Explore our latest articles, tutorials, and insights on web development, design, and technology.
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar with filters */}
        <aside className="w-full md:w-64 lg:w-72 shrink-0">
          <div className="sticky top-20 space-y-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <SearchBar />
            <FilterPanel categories={CATEGORIES} tags={TAGS} authors={AUTHORS} />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {DUMMY_POSTS.map((post) => (
              <article
                key={post.id}
                className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-theme-purple-100 text-theme-purple-800 dark:bg-theme-purple-900/50 dark:text-theme-purple-300">
                      {post.category}
                    </span>
                    <span className="mx-2 text-gray-400 dark:text-gray-500">•</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{post.title}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{post.excerpt}</p>
                  <div className="flex items-center mb-4">
                    <Image
                      src={post.author.image || "/placeholder.svg"}
                      alt={post.author.name}
                      width={40}
                      height={40}
                      className="rounded-full mr-3"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{post.author.name}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
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

          {/* Pagination */}
          <div className="mt-12">
            <Pagination currentPage={1} totalPages={5} />
          </div>
        </main>
      </div>
    </div>
  )
}
