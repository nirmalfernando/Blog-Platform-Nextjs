"use client";

import { useState } from "react";
import {
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal,
} from "lucide-react";

interface Post {
  id: string;
  title: string;
  author: string;
  status: string;
  createdAt: string;
}

interface BlogTableProps {
  posts: Post[];
}

export function BlogTable({ posts }: BlogTableProps) {
  const [postStatuses, setPostStatuses] = useState<Record<string, string>>(
    () => {
      const statuses: Record<string, string> = {};
      posts.forEach((post) => {
        statuses[post.id] = post.status;
      });
      return statuses;
    }
  );
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  const handleStatusChange = (postId: string, status: string) => {
    // This would normally update the status in your backend
    setPostStatuses((prev) => ({
      ...prev,
      [postId]: status,
    }));
  };

  const toggleDropdown = (postId: string) => {
    setShowDropdown(showDropdown === postId ? null : postId);
  };

  const handleAction = (action: string, postId: string) => {
    console.log(`Performing ${action} on post ${postId}`);
    setShowDropdown(null);

    if (action === "approve" && postStatuses[postId] === "pending") {
      handleStatusChange(postId, "published");
    } else if (action === "reject" && postStatuses[postId] === "pending") {
      handleStatusChange(postId, "draft");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Published
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
            <Edit2 className="h-3 w-3 mr-1" />
            Draft
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-theme-purple-100 dark:bg-theme-purple-900/30 text-theme-purple-800 dark:text-theme-purple-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
            {status}
          </span>
        );
    }
  };

  if (posts.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        No posts found. Try adjusting your search criteria.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Title
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Author
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Created
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
          {posts.map((post) => (
            <tr
              key={post.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {post.title}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {post.author}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(postStatuses[post.id])}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {new Date(post.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown(post.id)}
                    className="text-gray-500 dark:text-gray-400 hover:text-theme-purple-700 dark:hover:text-theme-purple-400"
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                  {showDropdown === post.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                      <div className="py-1">
                        <a
                          href={`/editor?id=${post.id}`}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit
                        </a>
                        <a
                          href={`/blog/${post.id}`}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </a>
                        {postStatuses[post.id] === "pending" && (
                          <>
                            <button
                              onClick={() => handleAction("approve", post.id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleAction("reject", post.id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-yellow-600 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleAction("delete", post.id)}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
