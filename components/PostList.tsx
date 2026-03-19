import { Post } from "../types";
import PostItem from "./PostItem";

interface Props {
  posts: Post[];
  onEdit: (id: number, content: string) => void;
  onEditLabel: (id: number, label: string) => void;
  onDelete: (id: number) => void;
  loading: boolean;
}

export default function PostList({ posts, onEdit, onEditLabel, onDelete, loading }: Props) {
  if (loading && posts.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        読み込み中...
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100 mt-4">
        <p className="text-gray-500 text-lg">まだ投稿がありません</p>
        <p className="text-gray-400 text-sm mt-2">最初の投稿をしてみましょう！</p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {posts.map((p) => (
        <PostItem
          key={p.id}
          post={p}
          onEdit={onEdit}
          onEditLabel={onEditLabel}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
