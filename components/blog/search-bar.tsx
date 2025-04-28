"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"

export function SearchBar() {
  const [query, setQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search action logic placeholder
    console.log("Searching for:", query)
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">Search</h3>
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          placeholder="Search articles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-theme-purple-500 focus:border-theme-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
        <button type="submit" className="absolute inset-y-0 left-0 pl-3 flex items-center">
          <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </button>
      </form>
    </div>
  )
}
