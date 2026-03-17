"use client";
import { useState } from "react";

type Post = {
  id: number;
  text: string;
};

export default function Home() {
  const [text, setText] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const handlePost = () => {
    setPosts([...posts, { id: Date.now(), text: text }]);
    setText("");
  };

  const handleEditStart = (post: Post) => {
    setEditingId(post.id);
    setEditText(post.text);
  };

  const handleEditSave = () => {
    setPosts(
      posts.map((p) => (p.id === editingId ? { ...p, text: editText } : p)),
    );
    setEditingId(null);
    setEditText("");
  };

  const handleDelete = (id: number) => {
    setPosts(posts.filter((p) => p.id !== id));
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>PostNote</h1>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="つぶやく"
      />
      <button onClick={handlePost}>投稿</button>

      <ul>
        {posts.map((p) => (
          <li key={p.id}>
            {editingId === p.id ? (
              <>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={handleEditSave}>保存</button>
                <button onClick={() => setEditingId(null)}>キャンセル</button>
              </>
            ) : (
              <>
                {p.text}:
                <button onClick={() => handleEditStart(p)}>編集</button>
                <button onClick={() => handleDelete(p.id)}>削除</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
