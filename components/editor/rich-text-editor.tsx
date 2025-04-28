"use client"

import { useState, useEffect, useRef } from "react"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  LinkIcon,
  ImageIcon,
  Code,
  Quote,
  Heading1,
  Heading2,
} from "lucide-react"

interface RichTextEditorProps {
  initialValue?: string
  onChange: (content: string) => void
}

export function RichTextEditor({ initialValue = "", onChange }: RichTextEditorProps) {
  const [content, setContent] = useState(initialValue)
  const editorRef = useRef<HTMLDivElement>(null)
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")
  const [showImageInput, setShowImageInput] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [imageAlt, setImageAlt] = useState("")

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialValue
    }
  }, [initialValue])

  const handleContentChange = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML
      setContent(newContent)
      onChange(newContent)
    }
  }

  const execCommand = (command: string, value: string | boolean = false) => {
    document.execCommand(command, false, value)
    handleContentChange()
    if (editorRef.current) {
      editorRef.current.focus()
    }
  }

  const handleInsertLink = () => {
    if (linkUrl && linkText) {
      execCommand("insertHTML", `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`)
      setShowLinkInput(false)
      setLinkUrl("")
      setLinkText("")
    }
  }

  const handleInsertImage = () => {
    if (imageUrl) {
      execCommand(
        "insertHTML",
        `<img src="${imageUrl}" alt="${imageAlt}" style="max-width: 100%; height: auto; margin: 10px 0;" />`,
      )
      setShowImageInput(false)
      setImageUrl("")
      setImageAlt("")
    }
  }

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
      <div className="bg-gray-100 dark:bg-gray-800 p-2 border-b border-gray-300 dark:border-gray-700 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => execCommand("bold")}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          title="Bold"
        >
          <Bold className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <button
          type="button"
          onClick={() => execCommand("italic")}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          title="Italic"
        >
          <Italic className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <button
          type="button"
          onClick={() => execCommand("underline")}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          title="Underline"
        >
          <Underline className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
        <button
          type="button"
          onClick={() => execCommand("formatBlock", "<h1>")}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          title="Heading 1"
        >
          <Heading1 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <button
          type="button"
          onClick={() => execCommand("formatBlock", "<h2>")}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          title="Heading 2"
        >
          <Heading2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
        <button
          type="button"
          onClick={() => execCommand("insertUnorderedList")}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          title="Bullet List"
        >
          <List className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <button
          type="button"
          onClick={() => execCommand("insertOrderedList")}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          title="Numbered List"
        >
          <ListOrdered className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <button
          type="button"
          onClick={() => execCommand("formatBlock", "<blockquote>")}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          title="Quote"
        >
          <Quote className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <button
          type="button"
          onClick={() => execCommand("formatBlock", "<pre>")}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          title="Code Block"
        >
          <Code className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
        <button
          type="button"
          onClick={() => setShowLinkInput(true)}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          title="Insert Link"
        >
          <LinkIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <button
          type="button"
          onClick={() => setShowImageInput(true)}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          title="Insert Image"
        >
          <ImageIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {showLinkInput && (
        <div className="p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 flex flex-wrap gap-2 items-center">
          <input
            type="text"
            placeholder="Link text"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-theme-purple-500 focus:border-theme-purple-500"
          />
          <input
            type="url"
            placeholder="URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-theme-purple-500 focus:border-theme-purple-500"
          />
          <button
            type="button"
            onClick={handleInsertLink}
            className="px-2 py-1 bg-theme-purple-600 text-white rounded text-sm hover:bg-theme-purple-700"
          >
            Insert
          </button>
          <button
            type="button"
            onClick={() => setShowLinkInput(false)}
            className="px-2 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded text-sm hover:bg-gray-400 dark:hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      )}

      {showImageInput && (
        <div className="p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 flex flex-wrap gap-2 items-center">
          <input
            type="url"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-theme-purple-500 focus:border-theme-purple-500"
          />
          <input
            type="text"
            placeholder="Alt text"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
            className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-theme-purple-500 focus:border-theme-purple-500"
          />
          <button
            type="button"
            onClick={handleInsertImage}
            className="px-2 py-1 bg-theme-purple-600 text-white rounded text-sm hover:bg-theme-purple-700"
          >
            Insert
          </button>
          <button
            type="button"
            onClick={() => setShowImageInput(false)}
            className="px-2 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded text-sm hover:bg-gray-400 dark:hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      )}

      <div
        ref={editorRef}
        contentEditable
        className="w-full p-4 min-h-[300px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none overflow-auto"
        onInput={handleContentChange}
        onBlur={handleContentChange}
      ></div>
    </div>
  )
}
