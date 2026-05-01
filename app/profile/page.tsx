'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/layout/Navigation';
import ScrollReveal from '@/components/ui/ScrollReveal';

// ============================================
// SEA WITHIN — Member Profile
// ============================================

export default function ProfilePage() {
  const [user, setUser] = useState({
    full_name: '',
    email: '',
    bio: '',
    membership_tier: 'free',
    avatar_url: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // TODO: Fetch user profile from Supabase
    // const profile = await getCurrentUser();
    // if (profile) setUser(profile);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Update profile via API
      // await updateProfile(user.id, { full_name, bio, avatar_url });
      setMessage('Your profile has been updated.');
      setIsEditing(false);
    } catch (err) {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const tierLabels: Record<string, string> = {
    free: 'Free Spirit',
    seeker: 'Seeker',
    explorer: 'Explorer',
    guardian: 'Guardian',
  };

  const tierColors: Record<string, string> = {
    free: 'text-white/40',
    seeker: 'text-sea-300',
    explorer: 'text-golden-400',
    guardian: 'text-golden-300',
  };

  return (
    <main className="min-h-screen bg-sanctuary-dark">
      <Navigation />

      <div className="max-w-2xl mx-auto px-6 pt-32 pb-24">
        <ScrollReveal delay={200}>
          <div className="text-center mb-12">
            <p className="font-whisper text-sm tracking-[6px] uppercase text-golden-400/40 mb-4">
              your space
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-light text-sea-100">
              Your Profile
            </h1>
          </div>
        </ScrollReveal>

        {/* Profile Card */}
        <ScrollReveal delay={400}>
          <div className="sanctuary-card p-8 md:p-12">
            {/* Avatar */}
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-sea-400/20 to-golden-400/20 border border-white/10 flex items-center justify-center">
                <span className="font-display text-3xl text-golden-400/60">
                  {user.full_name ? user.full_name[0]?.toUpperCase() : '?'}
                </span>
              </div>
            </div>

            {/* Name */}
            <div className="mb-6">
              <label className="block font-body text-[11px] tracking-[2px] uppercase text-white/40 mb-2">
                Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={user.full_name}
                  onChange={(e) => setUser({ ...user, full_name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3
                           font-body text-sea-100 focus:outline-none focus:border-golden-400/40
                           transition-all duration-300"
                />
              ) : (
                <p className="font-display text-xl text-sea-100 font-light">
                  {user.full_name || 'Beautiful Soul'}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="mb-6">
              <label className="block font-body text-[11px] tracking-[2px] uppercase text-white/40 mb-2">
                Email
              </label>
              <p className="font-body text-sm text-white/50">
                {user.email || 'your@email.com'}
              </p>
            </div>

            {/* Membership Tier */}
            <div className="mb-6">
              <label className="block font-body text-[11px] tracking-[2px] uppercase text-white/40 mb-2">
                Membership
              </label>
              <p className={`font-display text-lg font-light ${tierColors[user.membership_tier]}`}>
                {tierLabels[user.membership_tier] || 'Free Spirit'}
              </p>
            </div>

            {/* Bio */}
            <div className="mb-8">
              <label className="block font-body text-[11px] tracking-[2px] uppercase text-white/40 mb-2">
                About You
              </label>
              {isEditing ? (
                <textarea
                  value={user.bio}
                  onChange={(e) => setUser({ ...user, bio: e.target.value })}
                  placeholder="Share a little about your journey..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3
                           font-body text-sea-100 placeholder:text-white/20 resize-none
                           focus:outline-none focus:border-golden-400/40
                           transition-all duration-300"
                />
              ) : (
                <p className="font-body text-sm text-white/40 leading-relaxed">
                  {user.bio || 'Your story is still being written...'}
                </p>
              )}
            </div>

            {/* Message */}
            {message && (
              <p className="font-body text-sm text-golden-400/80 text-center mb-6">
                {message}
              </p>
            )}

            {/* Actions */}
            <div className="flex justify-center gap-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn-golden text-[11px] disabled:opacity-40"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn-ghost text-[11px]"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-ghost text-[11px]"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* Danger Zone */}
        <ScrollReveal delay={600}>
          <div className="mt-12 text-center">
            <button className="font-body text-[11px] text-white/15 hover:text-white/30 transition-colors tracking-[1px]">
              Sign Out
            </button>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
