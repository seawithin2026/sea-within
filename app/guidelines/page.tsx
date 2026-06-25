'use client';

export default function CommunityGuidelinesPage() {
  return (
    <div className="min-h-screen bg-[#0A1628] text-white px-6 py-20">
      <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-10 backdrop-blur-xl">
        <h1 className="font-display text-3xl text-golden-400 tracking-[4px] mb-6 text-center">
          Community Guidelines
        </h1>
        <p className="text-xs text-white/40 text-center mb-10">
          Last updated: June 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-white/80 font-body">

          <section>
            <h2 className="text-golden-300 text-sm tracking-[2px] mb-2">1. Purpose</h2>
            <p>
              Sea Within is a sanctuary for reflection and expression. These guidelines ensure our
              community remains safe, respectful, and aligned with the spirit of the sanctuary.
            </p>
          </section>

          <section>
            <h2 className="text-golden-300 text-sm tracking-[2px] mb-2">2. Respectful Conduct</h2>
            <p>
              Treat others with kindness. Harassment, bullying, discrimination, or targeted harm is not permitted.
            </p>
          </section>

          <section>
            <h2 className="text-golden-300 text-sm tracking-[2px] mb-2">3. No Harmful Content</h2>
            <p>
              Do not post content encouraging self‑harm, violence, illegal activity, or dangerous behavior.
            </p>
          </section>

          <section>
            <h2 className="text-golden-300 text-sm tracking-[2px] mb-2">4. No Spam or Promotion</h2>
            <p>
              The Wisdom Board is not for advertising or self‑promotion. Posts must be genuine expressions.
            </p>
          </section>

          <section>
            <h2 className="text-golden-300 text-sm tracking-[2px] mb-2">5. Protect Your Privacy</h2>
            <p>
              Do not share sensitive personal information (yours or others’). Keep the sanctuary safe for everyone.
            </p>
          </section>

          <section>
            <h2 className="text-golden-300 text-sm tracking-[2px] mb-2">6. Moderation</h2>
            <p>
              Sea Within may remove content or suspend accounts that violate these guidelines.
            </p>
          </section>

          <section>
            <h2 className="text-golden-300 text-sm tracking-[2px] mb-2">7. Contact</h2>
            <p>
              For concerns or reports, contact{' '}
              <span className="text-golden-300">seawithinyourself@gmail.com</span>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
