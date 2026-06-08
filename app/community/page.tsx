'use client';

import { useState, useEffect, useRef } from 'react';
import Navigation from '@/components/layout/Navigation';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { createClient } from '@/lib/supabase/client';

interface ChatMsg {
  id: string;
  message: string;
  author: string;
  user_id: string;
  created_at: string;
  is_own?: boolean;
}

export default function CommunityPage() {
  const supabase = createClient();

  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [user, setUser] = useState<any>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* LOAD USER */
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  /* FETCH MESSAGES */
  useEffect(() => {
    if (!user) return;
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [user]);

  /* SCROLL ONLY WHEN YOU SEND */
  useEffect(() => {
    if (isSubmitting) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages?type=chat');
      const data = await res.json();

      if (data.messages) {
        const withOwnership = data.messages.map((msg: ChatMsg) => ({
          ...msg,
          is_own: user && msg.user_id === user.id,
        }));
        setMessages(withOwnership);
      }
    } catch {
      console.error('Failed to fetch messages');
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsSubmitting(true);
    setFeedback('');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage, type: 'chat' }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          setFeedback('Please sign in to share your light with the circle.');
        } else {
          setFeedback(
            data.suggestion ||
              'This space is for uplifting, reflective, and supportive communication.'
          );
        }
        return;
      }

      setNewMessage('');
      fetchMessages();
    } catch {
      setFeedback('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditing = (msg: ChatMsg) => {
    setEditingId(msg.id);
    setEditingContent(msg.message);
  };

  const saveEdit = async () => {
    if (!editingId) return;

    await fetch('/api/messages', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editingId,
        content: editingContent,
        type: 'chat',
      }),
    });

    setEditingId(null);
    setEditingContent('');
    fetchMessages();
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Delete this message?')) return;

    await fetch(`/api/messages?id=${id}&type=chat`, {
      method: 'DELETE',
    });

    fetchMessages();
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-CA', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <main className="min-h-[100dvh] bg-transparent flex flex-col relative overflow-hidden">

      {/* 🌊 BRIGHT CINEMATIC BACKGROUND */}
     <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">

  {/* Bright Jellyfish Image */}
  <img
    src="/images/jellyfish-bg.jpg"
    alt="jellyfish background"
    className="absolute w-full h-full object-cover opacity-[1] animate-slowFloat"
  />

  {/* Ultra-light gradient (almost invisible) */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/5 to-black/10"></div>

  {/* Soft glow to lift brightness */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.25),transparent_70%)]"></div>
</div>

      <Navigation />

      {/* TITLE */}
      <section className="pt-32 md:pt-40 pb-10 px-6 text-center">
        <ScrollReveal>
      <p className="font-whisper text-sm tracking-[6px] uppercase text-[#B8860B] drop-shadow-[0_0_6px_rgba(0,0,0,0.6)] mb-3">
  community circle
</p>




          <h1 className="font-display text-2xl md:text-3xl font-light text-sea-100">
            The Gathering
          </h1>
         <p className="font-body text-sm text-white/75 mt-2">
  A space of warmth, support, and shared light.
</p>

        </ScrollReveal>
      </section>

     {/* CHAT MESSAGES */}
<section className="flex-1 overflow-y-scroll scroll-smooth px-4 md:px-8 py-6 max-w-3xl mx-auto w-full pt-10 md:pt-14 chat-scroll">
  <div className="space-y-4 pb-24">

    {messages.length === 0 && (
      <div className="text-center py-20">
        <p className="font-display text-xl text-white/15 font-light">
          The circle is open.
        </p>
        <p className="font-body text-sm text-white/10 mt-3">
          Be the first to share your light.
        </p>
      </div>
    )}

    {messages.map((msg) => (
      <div
        key={msg.id}
        className={`flex ${msg.is_own ? 'justify-end' : 'justify-start'}`}
      >
        <div className={`chat-bubble ${msg.is_own ? 'own' : ''} bg-white/20 backdrop-blur-xl rounded-2xl px-4 py-3`}>

          {editingId === msg.id ? (
            <>
              <textarea
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                rows={3}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-[#E8D7B8] text-sm"
              />

              <div className="flex gap-4 mt-3">
                <button
                  onClick={saveEdit}
                  className="text-golden-400/70 hover:text-golden-400/90 text-xs transition-colors duration-300"
                >
                  Save
                </button>

                <button
                  onClick={() => setEditingId(null)}
                  className="text-golden-400/40 hover:text-golden-400/70 text-xs transition-colors duration-300"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              {/* USERNAME */}
              {!msg.is_own && (
                <p className="font-body text-[11px] tracking-[1px] uppercase text-[#8B6508] drop-shadow-[0_0_6px_rgba(0,0,0,0.65)] mb-1">
                  {msg.author}
                </p>
              )}

              {/* MESSAGE TEXT */}
              <p className="font-body text-sm text-[#E8D7B8] leading-relaxed drop-shadow-[0_0_4px_rgba(0,0,0,0.55)]">
                {msg.message}
              </p>

              {/* OWN MESSAGE ACTIONS */}
              {msg.is_own && (
                <div className="flex gap-4 mt-3">
                  <button
                    onClick={() => startEditing(msg)}
                    className="text-golden-400/60 hover:text-golden-400/90 text-xs transition-colors duration-300"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="text-golden-400/40 hover:text-golden-400/70 text-xs transition-colors duration-300"
                  >
                    Delete
                  </button>
                </div>
              )}

              {/* TIMESTAMP */}
            <p className="font-body text-[10px] text-[#C6A667] drop-shadow-[0_0_5px_rgba(0,0,0,0.55)] mt-2 text-right">
  {formatTime(msg.created_at)}
</p>

            </>
          )}
        </div>
      </div>
    ))}

    <div ref={messagesEndRef} />
  </div>
</section>


      {/* FEEDBACK */}
      {feedback && (
        <div className="max-w-3xl mx-auto w-full px-4 md:px-8 pb-2">
          <div className="bg-golden-400/10 border border-golden-400/20 rounded-lg p-3 text-sm font-body text-golden-300">
            {feedback}
          </div>
        </div>
      )}

      {/* INPUT BAR */}
      <section className="border-t border-white/5 px-4 md:px-8 py-4 sticky bottom-0 bg-[rgba(255,200,150,0.25)] backdrop-blur-xl">
        <div className="max-w-3xl mx-auto">
        <p className="font-body text-[10px] text-white/70 text-center mb-3 tracking-wide">
  This space is for uplifting, reflective, and supportive communication.
</p>


          <form onSubmit={handleSend} className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Share something uplifting..."
              maxLength={300}
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3
                       font-body text-sm text-sea-100 placeholder:text-white/80
                       focus:outline-none focus:border-golden-400/30 focus:bg-white/[0.08]
                       transition-all duration-300"
            />
            <button
              type="submit"
              disabled={isSubmitting || !newMessage.trim()}
              className="bg-gradient-to-br from-golden-400 to-golden-600 text-sanctuary-dark
                       rounded-full px-6 py-3 font-body text-[11px] font-medium tracking-[2px]
                       uppercase transition-all duration-300 hover:shadow-[0_5px_20px_rgba(229,173,67,0.3)]
                       disabled:opacity-40"
            >
              {isSubmitting ? '...' : 'Send'}
            </button>
          </form>
        </div>
      </section>

      {/* STYLES */}
      <style>{`
        /* HIDE SCROLLBAR */
        .chat-scroll::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
        .chat-scroll {
          scrollbar-width: none;
        }

        .chat-bubble {
          max-width: 75%;
          padding: 14px 18px;
          border-radius: 18px 18px 18px 4px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .chat-bubble:hover {
          background: rgba(255, 255, 255, 0.07);
          border-color: rgba(229, 173, 67, 0.1);
        }

        .chat-bubble.own {
          border-radius: 18px 18px 4px 18px;
          background: rgba(229, 173, 67, 0.08);
          border: 1px solid rgba(229, 173, 67, 0.12);
        }

        .chat-bubble.own:hover {
          background: rgba(229, 173, 67, 0.12);
          border-color: rgba(229, 173, 67, 0.2);
        }

        @keyframes slowFloat {
          0% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-18px) scale(1.015); }
          100% { transform: translateY(0px) scale(1); }
        }

        .animate-slowFloat {
          animation: slowFloat 22s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}
