import { FormEvent } from "react";

type Props = {
  newContent: string;
  setNewContent: (content: string) => void;
  handlePost: (e: FormEvent) => void;
  loading: boolean;
};

export default function PostForm({
  newContent,
  setNewContent,
  handlePost,
  loading,
}: Props) {
  return (
    <form onSubmit={handlePost} className="flex gap-2 mb-8">
      <input
        type="text"
        value={newContent}
        onChange={(e) => setNewContent(e.target.value)}
        placeholder="新しい投稿"
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !newContent.trim()}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {loading ? "投稿中..." : "投稿"}
      </button>
    </form>
  );
}
