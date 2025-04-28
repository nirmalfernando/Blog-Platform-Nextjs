import Image from "next/image";

interface Comment {
  id: string;
  content: string;
  author: {
    name: string;
    image: string;
  };
  createdAt: string;
}

interface CommentListProps {
  comments: Comment[];
}

export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-gray-500 dark:text-gray-400 italic">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="flex space-x-4">
          <Image
            src={comment.author.image || "/placeholder.svg"}
            alt={comment.author.name}
            width={40}
            height={40}
            className="rounded-full h-10 w-10 flex-shrink-0"
          />
          <div className="flex-1">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {comment.author.name}
                </h4>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {comment.content}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
