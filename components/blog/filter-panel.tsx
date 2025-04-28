"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface FilterPanelProps {
  categories: string[]
  tags: string[]
  authors: string[]
}

export function FilterPanel({ categories, tags, authors }: FilterPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedAuthor, setSelectedAuthor] = useState("All")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showTags, setShowTags] = useState(false)

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const applyFilters = () => {
    // Placeholder for filter application logic
    console.log("Filtering by:", { selectedCategory, selectedAuthor, selectedTags })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">Categories</h3>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-theme-purple-500 focus:border-theme-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">Authors</h3>
        <select
          value={selectedAuthor}
          onChange={(e) => setSelectedAuthor(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-theme-purple-500 focus:border-theme-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          {authors.map((author) => (
            <option key={author} value={author}>
              {author}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tags</h3>
          <button
            type="button"
            onClick={() => setShowTags(!showTags)}
            className="text-gray-500 dark:text-gray-400 hover:text-theme-purple-700 dark:hover:text-theme-purple-400"
          >
            <ChevronDown className={`h-5 w-5 transform ${showTags ? "rotate-180" : ""}`} />
          </button>
        </div>

        {showTags && (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {tags.map((tag) => (
              <div key={tag} className="flex items-center">
                <input
                  type="checkbox"
                  id={`tag-${tag}`}
                  checked={selectedTags.includes(tag)}
                  onChange={() => handleTagToggle(tag)}
                  className="h-4 w-4 text-theme-purple-600 focus:ring-theme-purple-500 border-gray-300 rounded"
                />
                <label htmlFor={`tag-${tag}`} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  {tag}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={applyFilters}
        className="w-full bg-theme-purple-600 hover:bg-theme-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
      >
        Apply Filters
      </button>
    </div>
  )
}
