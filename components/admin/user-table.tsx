"use client";

import { useState } from "react";
import { Edit2, Save, X, MoreHorizontal, Trash2 } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  image?: string | null;
}

interface UserTableProps {
  users: User[];
  onRoleChange: (userId: string, role: string) => Promise<void>;
  onDelete: (userId: string) => Promise<void>;
}

export function UserTable({ users, onRoleChange, onDelete }: UserTableProps) {
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<Record<string, string>>(() => {
    const roles: Record<string, string> = {};
    users.forEach((user) => {
      roles[user.id] = user.role;
    });
    return roles;
  });
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handleRoleChange = (userId: string, role: string) => {
    setUserRoles((prev) => ({
      ...prev,
      [userId]: role,
    }));
  };

  const saveRole = async (userId: string) => {
    setIsProcessing(userId);
    try {
      await onRoleChange(userId, userRoles[userId]);
      setEditingUserId(null);
    } catch (error) {
      console.error("Error saving role:", error);
    } finally {
      setIsProcessing(null);
    }
  };

  const cancelEdit = (userId: string) => {
    // Reset to original role
    const originalRole =
      users.find((user) => user.id === userId)?.role || "reader";
    setUserRoles((prev) => ({
      ...prev,
      [userId]: originalRole,
    }));
    setEditingUserId(null);
  };

  const toggleDropdown = (userId: string) => {
    setShowDropdown(showDropdown === userId ? null : userId);
  };

  const handleDeleteUser = async (userId: string) => {
    setIsProcessing(userId);
    try {
      await onDelete(userId);
      setShowDropdown(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setIsProcessing(null);
    }
  };

  if (users.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        No users found. Try adjusting your search criteria.
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
              Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Email
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Role
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Joined
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
          {users.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {user.image && (
                    <img
                      src={user.image || "/placeholder.svg"}
                      alt={user.name}
                      className="h-8 w-8 rounded-full mr-3"
                    />
                  )}
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingUserId === user.id ? (
                  <select
                    value={userRoles[user.id]}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="text-sm rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-theme-purple-500 focus:border-theme-purple-500"
                    disabled={isProcessing === user.id}
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="EDITOR">Editor</option>
                    <option value="READER">Reader</option>
                  </select>
                ) : (
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      userRoles[user.id] === "admin"
                        ? "bg-theme-purple-100 dark:bg-theme-purple-900/30 text-theme-purple-800 dark:text-theme-purple-200"
                        : userRoles[user.id] === "editor"
                        ? "bg-theme-purple-100 dark:bg-theme-purple-900/30 text-theme-purple-800 dark:text-theme-purple-200"
                        : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                    }`}
                  >
                    {userRoles[user.id]}
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {editingUserId === user.id ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => saveRole(user.id)}
                      className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                      title="Save"
                      disabled={isProcessing === user.id}
                    >
                      <Save
                        className={`h-4 w-4 ${
                          isProcessing === user.id ? "animate-spin" : ""
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => cancelEdit(user.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      title="Cancel"
                      disabled={isProcessing === user.id}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown(user.id)}
                      className="text-gray-500 dark:text-gray-400 hover:text-theme-purple-700 dark:hover:text-theme-purple-400"
                      disabled={isProcessing === user.id}
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                    {showDropdown === user.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              setEditingUserId(user.id);
                              setShowDropdown(null);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit Role
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            disabled={isProcessing === user.id}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {isProcessing === user.id
                              ? "Deleting..."
                              : "Delete User"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
