"use client";
import { useState } from "react";

type Post = {
  id: number;
  text: string;
};

export default function Home() {
  const [text, setText] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);

  const handlePost = () => {
    setPosts([...posts, { id: Date.now(), text: text }]);
    setText("");
  };

  const handleDelete = (id: number) => {
  setPosts(posts.filter(p => p.id !== id));
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
          <li key={p.id}>{p.text}:<button onClick={() => handleDelete(p.id)}>削除</button></li>
        ))}
      </ul>
    </main>
  );
}