'use client';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0A1628] text-white px-6 py-20">
      <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-10 backdrop-blur-xl">
        <h1 className="font-display text-3xl text-golden-400 tracking-[4px] mb-6 text-center">
          Terms of Service
        </h1>
        <p className="text-xs text-white/40 text-center mb-10">
          Last updated: June 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-white/80 font-body">
          <section>
            <h2 className="text-golden-300 text-sm tracking-[2px] mb-2">
              1. Acceptance of Terms
            </h2>
            <p>
              By creating an account or using Sea Within, you agree to these
              Terms of Service and our Privacy Policy. If you do not agree, you
              may not use the platform.
            </p>
          </section>

          <section>
            <h2 className="text-golden-300 text-sm tracking-[2px] mb-2">
              2. Use of the Service
            </h2>
            <p>
              Sea Within provides a cinematic sanctuary experience, which may
              include features such as rituals, bloom cycles, reflective
              practices, and community interactions. Some features may evolve
              over time as the platform grows. You agree to use the service
              respectfully and lawfully.
            </p>
          </section>

          <section>
            <h2 className="text-golden-300 text-sm tracking-[2px] mb-2">
              3. Accounts
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your
              login credentials and for all activity under your account. We may
              suspend or terminate accounts that violate these terms or misuse
              the platform.
            </p>
          </section>

          <section>
            <h2 className="text-golden-300 text-sm tracking-[2px] mb-2">
              4. Subscriptions & Payments
            </h2>
            <p>
              Payments are processed securely through Stripe. By subscribing,
              you agree to recurring charges until cancellation and understand
              that access may end if payment fails. Refunds are handled
              according to our refund policy, if applicable.
            </p>
          </section>

          <section>
            <h2 className="text-golden-300 text-sm tracking-[2px] mb-2">
              5. User‑Generated Content
            </h2>
            <p>
              You retain ownership of the content you create. By posting on Sea
              Within, you grant us a non‑exclusive license to display your
              content within the platform and to moderate or remove content that
              violates our guidelines. You agree not to post harmful, abusive,
              hateful, illegal, infringing, or spam content.
            </p>
          </section>

          <section>
            <h2 className="text-golden-300 text-sm tracking-[2px] mb-2">
              6. Intellectual Property
            </h2>
            <p>
              All original Sea Within content — including visuals, rituals,
              text, branding, design, and cinematic experiences — is owned by
              Sea Within and protected by copyright.
            </p>
            <p className="mt-2">
              Sea Within also uses licensed third‑party assets, including
              videos, images, and audio from platforms such as Pixabay. These
              assets remain the property of their respective creators and are
              used under valid licenses. Sea Within does not claim ownership
              over third‑party content.
            </p>
            <p className="mt-2">
              You may not copy, reproduce, distribute, sell, or modify any part
              of the platform or its licensed content without permission.
            </p>
          </section>

          <section>
            <h2 className="text-golden-300 text-sm tracking-[2px] mb-2">
              7. Wellness Disclaimer
            </h2>
            <p>
              Sea Within provides reflective and meditative experiences. It is
              not medical, psychological, or therapeutic advice. Sea Within is
              not a substitute for professional care, and you use the platform
              at your own discretion. We are not liable for decisions made based
              on content within the sanctuary.
            </p>
          </section>

          <section>
            <h2 className="text-golden-300 text-sm tracking-[2px] mb-2">
              8. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, Sea Within is provided “as
              is.” We are not liable for indirect, incidental, or consequential
              damages. Our total liability is limited to the amount you paid in
              the last 12 months.
            </p>
          </section>

          <section>
            <h2 className="text-golden-300 text-sm tracking-[2px] mb-2">
              9. Termination
            </h2>
            <p>
              We may suspend or terminate your account if you violate these
              terms, misuse the platform, or engage in harmful behavior. You may
              delete your account at any time.
            </p>
          </section>

          <section>
            <h2 className="text-golden-300 text-sm tracking-[2px] mb-2">
              10. Governing Law
            </h2>
            <p>
              These terms are governed by the laws of New Brunswick, Canada.
            </p>
          </section>

          <section>
            <h2 className="text-golden-300 text-sm tracking-[2px] mb-2">
              11. Changes to Terms
            </h2>
            <p>
              We may update these Terms from time to time. Continued use of the
              platform means you accept the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-golden-300 text-sm tracking-[2px] mb-2">
              12. Contact
            </h2>
            <p>
              For questions about these Terms, contact us at{' '}
              <span className="text-golden-300">
                seawithinyourself@gmail.com
              </span>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
