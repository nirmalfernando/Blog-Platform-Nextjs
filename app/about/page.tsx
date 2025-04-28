import Image from "next/image";
import Link from "next/link";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            About Our Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Sharing knowledge and insights about web development and technology.
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Our Mission
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              Welcome to our blog platform! We're passionate about web
              development and dedicated to sharing knowledge, insights, and
              experiences with the developer community.
            </p>
            <p>
              Our mission is to create a space where developers of all skill
              levels can learn, grow, and connect. We believe in the power of
              open knowledge sharing and the importance of building a supportive
              community.
            </p>
            <p>
              Through tutorials, deep dives, and thought-provoking articles, we
              aim to help you navigate the ever-evolving landscape of web
              development technologies and best practices.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Meet the Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="relative w-32 h-32 mb-4 overflow-hidden rounded-full">
                <Image
                  src="/placeholder.svg?height=128&width=128"
                  alt="Jane Smith"
                  width={128}
                  height={128}
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Jane Smith
              </h3>
              <p className="text-theme-purple-600 dark:text-theme-purple-400 mb-2">
                Founder & Lead Developer
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Full-stack developer with 10+ years of experience specializing
                in React and Next.js.
              </p>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="text-theme-purple-600 hover:text-theme-purple-800 dark:text-theme-purple-400 dark:hover:text-theme-purple-300"
                >
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </a>
                <a
                  href="#"
                  className="text-theme-purple-600 hover:text-theme-purple-800 dark:text-theme-purple-400 dark:hover:text-theme-purple-300"
                >
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </a>
                <a
                  href="#"
                  className="text-theme-purple-600 hover:text-theme-purple-800 dark:text-theme-purple-400 dark:hover:text-theme-purple-300"
                >
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </a>
              </div>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="relative w-32 h-32 mb-4 overflow-hidden rounded-full">
                <Image
                  src="/placeholder.svg?height=128&width=128"
                  alt="John Doe"
                  width={128}
                  height={128}
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                John Doe
              </h3>
              <p className="text-theme-purple-600 dark:text-theme-purple-400 mb-2">
                Senior Content Creator
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Technical writer and UI/UX enthusiast with a passion for
                creating educational content.
              </p>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="text-theme-purple-600 hover:text-theme-purple-800 dark:text-theme-purple-400 dark:hover:text-theme-purple-300"
                >
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </a>
                <a
                  href="#"
                  className="text-theme-purple-600 hover:text-theme-purple-800 dark:text-theme-purple-400 dark:hover:text-theme-purple-300"
                >
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </a>
                <a
                  href="#"
                  className="text-theme-purple-600 hover:text-theme-purple-800 dark:text-theme-purple-400 dark:hover:text-theme-purple-300"
                >
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Our Story
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              Our blog started in 2020 as a small personal project to document
              our learning journey in web development. What began as a
              collection of notes and tutorials quickly grew into a
              comprehensive resource for developers around the world.
            </p>
            <p>
              Today, we're proud to host a diverse range of content created by
              our team and guest contributors, covering everything from frontend
              frameworks to backend architecture, DevOps practices, and career
              advice.
            </p>
            <p>
              We're committed to maintaining high-quality, accurate, and
              accessible content that helps developers at all stages of their
              careers.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Get in Touch
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Have questions, feedback, or want to contribute to our blog? We'd
            love to hear from you!
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-theme-purple-600 hover:bg-theme-purple-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200"
            >
              <Mail className="mr-2 h-5 w-5" />
              Contact Us
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 font-medium py-3 px-6 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Explore Our Blog
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
