"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Post } from "@/types";
import PostForm from "@/components/PostForm";
import PostList from "@/components/PostList";
import { classifyText } from "@/lib/huggingface";
import { PostgrestError } from "@supabase/supabase-js";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newContent, setNewContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) {
          console.error(error);
          alert("エラーが発生しました");
        } else if (data) {
          setPosts(data as Post[]);
        }
      } finally {
        setInitialLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim() || loading) return;
    setLoading(true);
    
    try {
      // 1. Hugging Faceでラベルを取得
      let label = "未分類";
      try {
        console.log("Calling classifyText with:", newContent.trim());
        const hfResult = await classifyText(newContent.trim());
        console.log("Hugging Face result:", hfResult);
        // サーバー側でパース済みのラベルを取得
        label = hfResult?.label || "未分類";
      } catch (hfError: any) {
        console.error("Hugging Face error catching in page.tsx:", hfError);
        alert(`AIとの通信中にエラーが発生しました: ${hfError.message}`);
      }

      // 2. Supabaseに保存
      const { error, data }: { error: PostgrestError | null, data: Post[] | null } = await supabase
        .from("posts")
        .insert([{ content: newContent.trim(), label }])
        .select();

      if (error) {
        console.error(error);
        alert(`投稿に失敗しました: ${error.message}`);
      } else if (data) {
        setPosts([data[0] as Post, ...posts]);
        setNewContent("");
      }
    } finally {
      setLoading(false);
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

  const handleEditLabel = async (id: number, newLabel: string) => {
    const { error } = await supabase
      .from("posts")
      .update({ label: newLabel })
      .eq("id", id);
    if (error) console.error(error);
    else
      setPosts(
        posts.map((p) => (p.id === id ? { ...p, label: newLabel } : p)),
      );
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) console.error(error);
    else setPosts(posts.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">PostNote</h1>
          <p className="text-gray-500 mt-2 text-sm">あなたの思考をシンプルに記録しよう</p>
        </header>

        <PostForm
          newContent={newContent}
          setNewContent={setNewContent}
          handlePost={handlePost}
          loading={loading}
        />

        <PostList
          posts={posts}
          onEdit={handleEditSave}
          onEditLabel={handleEditLabel}
          onDelete={handleDelete}
          loading={initialLoading}
        />
      </div>
    </div>
  );
}
