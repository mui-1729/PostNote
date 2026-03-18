import { useState } from "react";

interface Post {
  id: number;
  content: string;
}

interface Props {
  post: Post;
  onEdit: (id: number, content: string) => void;
  onDelete: (id: number) => void;
}

export default function PostItem({ post, onEdit, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(post.content);

  return (
    <li>
      {editing ? (
        <>
          <input value={content} onChange={(e) => setContent(e.target.value)} />
          <button
            onClick={() => {
              onEdit(post.id, content);
              setEditing(false);
            }}
          >
            保存
          </button>
        </>
      ) : (
        <>
          <span>{post.content}</span>
          <button onClick={() => setEditing(true)}>編集</button>
        </>
      )}
      <button onClick={() => onDelete(post.id)}>削除</button>
    </li>
  );
}
