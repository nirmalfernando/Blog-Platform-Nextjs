"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  LinkIcon,
  ImageIcon,
  Code,
  Quote,
  Heading1,
  Heading2,
  Undo,
  Redo,
  Trash2,
} from "lucide-react";
import { useState } from "react";

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function TipTapEditor({
  content,
  onChange,
  placeholder = "Write something...",
}: TipTapEditorProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [showImageForm, setShowImageForm] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
      setLinkUrl("");
      setShowLinkForm(false);
    }
  };

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl("");
      setShowImageForm(false);
    }
  };

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
      <div className="bg-gray-100 dark:bg-gray-800 p-2 border-b border-gray-300 dark:border-gray-700 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded ${
            editor.isActive("bold") ? "bg-gray-200 dark:bg-gray-700" : ""
          }`}
          title="Bold"
        >
          <Bold className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded ${
            editor.isActive("italic") ? "bg-gray-200 dark:bg-gray-700" : ""
          }`}
          title="Italic"
        >
          <Italic className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded ${
            editor.isActive("heading", { level: 1 })
              ? "bg-gray-200 dark:bg-gray-700"
              : ""
          }`}
          title="Heading 1"
        >
          <Heading1 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded ${
            editor.isActive("heading", { level: 2 })
              ? "bg-gray-200 dark:bg-gray-700"
              : ""
          }`}
          title="Heading 2"
        >
          <Heading2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded ${
            editor.isActive("bulletList") ? "bg-gray-200 dark:bg-gray-700" : ""
          }`}
          title="Bullet List"
        >
          <List className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded ${
            editor.isActive("orderedList") ? "bg-gray-200 dark:bg-gray-700" : ""
          }`}
          title="Numbered List"
        >
          <ListOrdered className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded ${
            editor.isActive("blockquote") ? "bg-gray-200 dark:bg-gray-700" : ""
          }`}
          title="Quote"
        >
          <Quote className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded ${
            editor.isActive("codeBlock") ? "bg-gray-200 dark:bg-gray-700" : ""
          }`}
          title="Code Block"
        >
          <Code className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
        <button
          type="button"
          onClick={() => setShowLinkForm(!showLinkForm)}
          className={`p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded ${
            editor.isActive("link") ? "bg-gray-200 dark:bg-gray-700" : ""
          }`}
          title="Insert Link"
        >
          <LinkIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <button
          type="button"
          onClick={() => setShowImageForm(!showImageForm)}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          title="Insert Image"
        >
          <ImageIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-50"
          title="Undo"
        >
          <Undo className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-50"
          title="Redo"
        >
          <Redo className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <button
          type="button"
          onClick={() => editor.commands.clearContent()}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded ml-auto"
          title="Clear Content"
        >
          <Trash2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {showLinkForm && (
        <div className="p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 flex flex-wrap gap-2 items-center">
          <input
            type="url"
            placeholder="Enter URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-theme-purple-500 focus:border-theme-purple-500"
          />
          <button
            type="button"
            onClick={addLink}
            className="px-2 py-1 bg-theme-purple-600 text-white rounded text-sm hover:bg-theme-purple-700"
          >
            Add Link
          </button>
          <button
            type="button"
            onClick={() => setShowLinkForm(false)}
            className="px-2 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded text-sm hover:bg-gray-400 dark:hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      )}

      {showImageForm && (
        <div className="p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 flex flex-wrap gap-2 items-center">
          <input
            type="url"
            placeholder="Enter image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-theme-purple-500 focus:border-theme-purple-500"
          />
          <button
            type="button"
            onClick={addImage}
            className="px-2 py-1 bg-theme-purple-600 text-white rounded text-sm hover:bg-theme-purple-700"
          >
            Add Image
          </button>
          <button
            type="button"
            onClick={() => setShowImageForm(false)}
            className="px-2 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded text-sm hover:bg-gray-400 dark:hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      )}

      <EditorContent
        editor={editor}
        className="prose prose-sm sm:prose lg:prose-lg max-w-none p-4 min-h-[300px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none overflow-auto"
      />
    </div>
  );
}
