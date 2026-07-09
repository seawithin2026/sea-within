"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";


export default function ResetPasswordPage() {
  const supabase = createClient();
  
  const [email, setEmail] = useState("");
 
  const [password, setPassword] = useState("");

  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Read email from URL on client only
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const e = params.get("email");
    if (e) setEmail(e);
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback("");
    setIsSubmitting(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setFeedback("Something went wrong. Please try again.");
      setIsSubmitting(false);
      return;
    }

    setFeedback("Your password has been updated. You may now sign in.");
    setIsSubmitting(false);
  };


  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-20 bg-transparent">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
        <h1 className="font-display text-2xl text-center text-[#E8D7B8] mb-6">
          Reset Password
        </h1>



        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <label className="block text-sm text-[#E8D7B8] mb-2">Email</label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-[#E8D7B8]"
            />
          </div>

          <div>
            <label className="block text-sm text-[#E8D7B8] mb-2">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your new password"
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-[#E8D7B8]"
            />
          </div>

      
          {feedback && (
            <p className="text-center text-sm text-golden-300">{feedback}</p>
          )}

       
          <button
            type="submit"
            disabled={isSubmitting || !password.trim()}
            className="w-full bg-gradient-to-br from-golden-400 to-golden-600 text-sanctuary-dark rounded-lg py-3 font-body text-sm tracking-[2px] uppercase disabled:opacity-40"
          >
            {isSubmitting ? "..." : "Update Password"}
          </button>
        </form>
      </div>
    </main>
  );
}
