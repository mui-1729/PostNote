import { useState } from "react";
import { Post } from "../types";

interface Props {
  post: Post;
  onEdit: (id: number, content: string) => void;
  onDelete: (id: number) => void;
}

export default function PostItem({ post, onEdit, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(post.content);

  const handleSave = () => {
    if (!content.trim()) return;
    onEdit(post.id, content);
    setEditing(false);
  };

  const formattedDate = post.created_at
    ? new Date(post.created_at).toLocaleString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <li className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4 transition-shadow hover:shadow-md">
      {editing ? (
        <div className="flex flex-col gap-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-y"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setContent(post.content);
                setEditing(false);
              }}
              className="px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              disabled={!content.trim() || content === post.content}
              className="px-4 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              保存
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <p className="text-gray-800 text-base whitespace-pre-wrap mb-4">
            {post.content}
          </p>
          <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">{formattedDate}</span>
            <div className="flex gap-3">
              <button
                onClick={() => setEditing(true)}
                className="text-sm text-blue-500 hover:text-blue-700 font-medium transition-colors"
              >
                編集
              </button>
              <button
                onClick={() => onDelete(post.id)}
                className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
              >
                削除
              </button>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}
