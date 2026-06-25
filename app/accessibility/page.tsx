'use client';

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-[#0A1628] text-white px-6 py-20">
      <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-10 backdrop-blur-xl">
        <h1 className="font-display text-3xl text-golden-400 tracking-[4px] mb-6 text-center">
          Accessibility Statement
        </h1>
        <p className="text-xs text-white/40 text-center mb-10">
          Last updated: June 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-white/80 font-body">

          <section>
            <h2 className="text-golden-300 text-sm tracking-[2px] mb-2">1. Commitment</h2>
            <p>
              Sea Within is committed to creating a sanctuary that is accessible to as many people
              as possible. We aim to provide an inclusive, intuitive experience for all users.
            </p>
          </section>

          <section>
            <h2 className="text-golden-300 text-sm tracking-[2px] mb-2">2. Ongoing Improvements</h2>
            <p>
              Accessibility is an ongoing effort. We continue refining design, navigation, and
              compatibility with assistive technologies.
            </p>
          </section>

          <section>
            <h2 className="text-golden-300 text-sm tracking-[2px] mb-2">3. Known Limitations</h2>
            <p>
              Some areas may not yet fully meet accessibility standards. We are actively improving
              contrast, keyboard navigation, and screen‑reader support.
            </p>
          </section>

          <section>
            <h2 className="text-golden-300 text-sm tracking-[2px] mb-2">4. Feedback</h2>
            <p>
              If you encounter accessibility barriers, contact{' '}
              <span className="text-golden-300">seawithinyourself@gmail.com</span>. Your feedback
              helps us improve.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
