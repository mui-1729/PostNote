"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import PostItem from "../components/PostItem";

type Post = {
  id: number;
  content: string;
  created_at?: string;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newContent, setNewContent] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) console.error(error);
      else setPosts(data);
    };
    fetchPosts();
  }, []);

  const handlePost = async () => {
    if (!newContent) return;
    const { error, data } = await supabase
      .from("posts")
      .insert([{ content: newContent }])
      .select();
    if (error) {
      console.error(error);
      alert(`投稿に失敗しました: ${error.message}`);
    } else if (data) {
      setPosts([data[0], ...posts]);
      setNewContent("");
    }
  };

  const handleEditSave = async (id: number, newContent: string) => {
    const { error } = await supabase
      .from("posts")
      .update({ content: newContent })
      .eq("id", id);
    if (error) console.error(error);
    else
      setPosts(
        posts.map((p) => (p.id === id ? { ...p, content: newContent } : p)),
      );
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) console.error(error);
    else setPosts(posts.filter((p) => p.id !== id));
  };

  return (
    <div>
      <h1>PostNote</h1>
      <input
        type="text"
        value={newContent}
        onChange={(e) => setNewContent(e.target.value)}
        placeholder="新しい投稿"
      />
      <button onClick={handlePost}>投稿</button>
      <ul>
        {posts.map((p) => (
          <PostItem
            key={p.id}
            post={p}
            onEdit={handleEditSave}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  );
}
