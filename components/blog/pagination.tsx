"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are fewer than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of page range
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the beginning or end
      if (currentPage <= 3) {
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }

      // Add ellipsis if needed
      if (start > 2) {
        pages.push(-1); // -1 represents ellipsis
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push(-2); // -2 represents ellipsis
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex justify-center" aria-label="Pagination">
      <ul className="flex items-center space-x-1">
        <li>
          <Link
            href={currentPage === 1 ? "#" : `/blog?page=${currentPage - 1}`}
            className={`flex items-center px-3 py-2 rounded-md ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 dark:text-gray-300 hover:text-theme-purple-700 dark:hover:text-theme-purple-400 hover:bg-theme-purple-50 dark:hover:bg-theme-purple-950/30"
            }`}
            aria-disabled={currentPage === 1}
            onClick={(e) => currentPage === 1 && e.preventDefault()}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Previous</span>
          </Link>
        </li>

        {pageNumbers.map((page, index) => (
          <li key={index}>
            {page === -1 || page === -2 ? (
              <span className="px-3 py-2 text-gray-500 dark:text-gray-400">
                ...
              </span>
            ) : (
              <Link
                href={`/blog?page=${page}`}
                className={`px-3 py-2 rounded-md transition-colors duration-200 ${
                  currentPage === page
                    ? "bg-theme-purple-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-theme-purple-50 dark:hover:bg-theme-purple-950/30 hover:text-theme-purple-700 dark:hover:text-theme-purple-400"
                }`}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </Link>
            )}
          </li>
        ))}

        <li>
          <Link
            href={
              currentPage === totalPages ? "#" : `/blog?page=${currentPage + 1}`
            }
            className={`flex items-center px-3 py-2 rounded-md ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 dark:text-gray-300 hover:text-theme-purple-700 dark:hover:text-theme-purple-400 hover:bg-theme-purple-50 dark:hover:bg-theme-purple-950/30"
            }`}
            aria-disabled={currentPage === totalPages}
            onClick={(e) => currentPage === totalPages && e.preventDefault()}
            aria-label="Next page"
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Next</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
