"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import { Edit2, Camera } from "lucide-react";

// This would normally be fetched from your backend
const DUMMY_USER = {
  id: "1",
  name: "Jane Smith",
  email: "jane@example.com",
  bio: "Full-stack developer specializing in React and Next.js",
  avatar: "/placeholder.svg?height=200&width=200",
  joinedAt: "2023-01-15",
  location: "San Francisco, CA",
  website: "https://janesmith.dev",
  role: "admin",
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(DUMMY_USER);
  const [newAvatar, setNewAvatar] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would normally save the user data to your backend
    console.log("Saving user data:", userData);

    if (newAvatar) {
      setUserData((prev) => ({
        ...prev,
        avatar: newAvatar,
      }));
      setNewAvatar(null);
    }

    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            My Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your account information and settings
          </p>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-8">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden">
                    <Image
                      src={newAvatar || userData.avatar}
                      alt={userData.name}
                      width={128}
                      height={128}
                      className="object-cover"
                    />
                  </div>
                  {isEditing && (
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 bg-theme-purple-600 text-white p-2 rounded-full cursor-pointer hover:bg-theme-purple-700 transition-colors duration-200"
                    >
                      <Camera className="h-5 w-5" />
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  )}
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center text-theme-purple-600 dark:text-theme-purple-400 hover:text-theme-purple-800 dark:hover:text-theme-purple-300"
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit Profile
                  </button>
                )}
              </div>

              <div className="flex-1">
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={userData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-theme-purple-500 focus:border-theme-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-theme-purple-500 focus:border-theme-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="bio"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows={3}
                        value={userData.bio}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-theme-purple-500 focus:border-theme-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      ></textarea>
                    </div>

                    <div>
                      <label
                        htmlFor="location"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={userData.location}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-theme-purple-500 focus:border-theme-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="website"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Website
                      </label>
                      <input
                        type="url"
                        id="website"
                        name="website"
                        value={userData.website}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-theme-purple-500 focus:border-theme-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-theme-purple-600 hover:bg-theme-purple-700 text-white font-medium rounded-md transition-colors duration-200"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setUserData(DUMMY_USER);
                          setNewAvatar(null);
                        }}
                        className="px-6 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {userData.name}
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400">
                        {userData.role}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        {userData.email}
                      </div>
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {userData.location}
                      </div>
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Joined{" "}
                        {new Date(userData.joinedAt).toLocaleDateString()}
                      </div>
                      {userData.website && (
                        <div className="flex items-center text-theme-purple-600 dark:text-theme-purple-400">
                          <a
                            href={userData.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {userData.website.replace(/^https?:\/\//, "")}
                          </a>
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
                        Bio
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        {userData.bio}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              My Posts
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You have written 8 blog posts.
            </p>
            <div className="flex space-x-4">
              <a
                href="/blog?author=jane-smith"
                className="text-theme-purple-600 dark:text-theme-purple-400 hover:text-theme-purple-800 dark:hover:text-theme-purple-300 font-medium"
              >
                View all my posts →
              </a>
              <a
                href="/editor"
                className="inline-flex items-center px-4 py-2 bg-theme-purple-600 hover:bg-theme-purple-700 text-white font-medium rounded-md transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Create New Post
              </a>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Account Settings
            </h2>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-theme-purple-600 dark:text-theme-purple-400 hover:text-theme-purple-800 dark:hover:text-theme-purple-300 font-medium"
                >
                  Change password
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-theme-purple-600 dark:text-theme-purple-400 hover:text-theme-purple-800 dark:hover:text-theme-purple-300 font-medium"
                >
                  Notification preferences
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-theme-purple-600 dark:text-theme-purple-400 hover:text-theme-purple-800 dark:hover:text-theme-purple-300 font-medium"
                >
                  Connected accounts
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
                >
                  Delete account
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
