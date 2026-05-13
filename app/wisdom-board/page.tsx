'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function WisdomBoardPage() {
  const [session, setSession] = useState<any>(null);
  const [dailyMessage, setDailyMessage] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ⭐ FIXED SESSION LOADING
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setSession({ user });
      } else {
        setSession(null);
      }
    };

    getUser();
  }, []);

  // ⭐ FIXED DAILY MESSAGE LOADING
  useEffect(() => {
    const loadDailyMessage = async () => {
      try {
        const res = await fetch('/api/daily-affirmation');
        const data = await res.json();

        if (data?.message) {
          setDailyMessage(data.message);
        } else {
          setDailyMessage('A new message will arrive soon.');
        }
      } catch {
        setDailyMessage('Unable to load today’s message.');
      }
    };

    loadDailyMessage();
  }, []);

  // ⭐ LOAD COMMUNITY POSTS
  useEffect(() => {
    const loadPosts = async () => {
      setLoadingPosts(true);

      const { data, error } = await supabase
        .from('wisdom_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setPosts(data);
      }

      setLoadingPosts(false);
    };

    loadPosts();
  }, []);

  // ⭐ SUBMIT NEW POST
  const handleSubmit = async () => {
    if (!session) return;
    if (!newPost.trim()) return;

    setSubmitting(true);

    const { data, error } = await supabase
      .from('wisdom_posts')
      .insert({
        user_id: session.user.id,
        content: newPost,
      })
      .select()
      .single();

    if (!error && data) {
      setPosts((prev) => [data, ...prev]);
      setNewPost('');
    }

    setSubmitting(false);
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5ecdd]">
        <p className="text-[#2f1b0f] font-serif text-lg">
          Please sign in to access the Wisdom Board.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1720] flex flex-col items-center py-16 px-6">
      {/* DAILY MESSAGE */}
      <div className="w-full max-w-3xl bg-[#f5ecdd] p-8 rounded-2xl shadow-xl border border-[#d2bfa0] mb-12">
        <h2 className="text-2xl font-serif text-[#2f1b0f] mb-4">
          Today’s Message
        </h2>
        <p className="text-lg font-serif text-[#2f1b0f] opacity-90">
          {dailyMessage || 'loading…'}
        </p>
      </div>

      {/* POST INPUT */}
      <div className="w-full max-w-3xl bg-[#f5ecdd] p-6 rounded-2xl shadow-xl border border-[#d2bfa0] mb-10">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share a thought, a reflection, or a piece of wisdom…"
          className="w-full h-32 bg-transparent outline-none resize-none text-lg font-serif text-[#2f1b0f]"
        />

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="mt-4 px-6 py-2 bg-[#d2bfa0] text-[#2f1b0f] font-serif rounded-lg shadow hover:bg-[#c7b08f] transition"
        >
          {submitting ? 'Sharing…' : 'Share'}
        </button>
      </div>

      {/* POSTS */}
      <div className="w-full max-w-3xl space-y-6">
        {loadingPosts ? (
          <p className="text-[#f5ecdd] font-serif opacity-80">Loading posts…</p>
        ) : posts.length === 0 ? (
          <p className="text-[#f5ecdd] font-serif opacity-80">
            No posts yet — be the first to share something meaningful.
          </p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-[#f5ecdd] p-6 rounded-xl shadow border border-[#d2bfa0]"
            >
              <p className="font-serif text-[#2f1b0f] whitespace-pre-wrap">
                {post.content}
              </p>
              <p className="text-sm text-[#2f1b0f] opacity-60 mt-3">
                {new Date(post.created_at).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
