'use client';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0A1628] text-white px-6 py-20">
      <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-10 backdrop-blur-xl">
        <h1 className="font-display text-3xl text-golden-400 tracking-[4px] mb-6 text-center">
          Privacy Policy
        </h1>
        <p className="text-xs text-white/40 text-center mb-10">
          Last updated: June 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-white/80 font-body">
          <section>
            <h2 className="text-golden-300 text-sm tracking-[2px] mb-2">
              1. Introduction
            </h2>
            <p>
              Sea Within (“we”, “us”, “our”) is committed to protecting your
              privacy. This Privacy Policy explains how we collect, use, store,
              and protect your personal information when you visit our website,
              create an account, or use our services. By using Sea Within, you
              consent to the practices described in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-golden-300 text-sm tracking-[2px] mb-2">
              2. Information We Collect
            </h2>
            <p className="mb-2">
              We collect the following types of information:
            </p>
            <p className="mt-1">
              <span className="text-golden-300">Account Information:</span>{' '}
              email address, encrypted password, and profile details you choose
              to share.
            </p>
            <p className="mt-1">
              <span className="text-golden-300">Usage Information:</span> pages
              visited, interactions within the sanctuary, device and browser
              information, and IP address (for security and fraud prevention).
            </p>
            <p className="mt-1">
              <span className="text-golden-300">Payment Information:</span>{' '}
              handled exclusively by Stripe. We do not store or access your
              credit card details.
            </p>
            <p className="mt-1">
              <span className="text-golden-300">User‑Generated Content:</span>{' '}
              posts on the Wisdom Board and reflections or entries you create.
            </p>
          </section>

          <section>
            <h2 className="text-golden-300 text-sm tracking-[2px] mb-2">
              3. How We Use Your Information
            </h2>
            <p>
              We use your information to create and manage your account, provide
              access to sanctuary features, process payments and subscriptions,
              improve the experience and performance of the site, protect
              against fraud or misuse, and send essential service emails (such
              as password resets, receipts, and important updates).
            </p>
            <p className="mt-2">
              We do not sell your data and we do not share your data with
              advertisers.
            </p>
          </section>

          <section>
            <h2 className="text-golden-300 text-sm tracking-[2px] mb-2">
              4. Legal Basis (GDPR)
            </h2>
            <p>
              If you are in the EU, we process your data under contractual
              necessity (account creation and subscription access), legitimate
              interest (security and fraud prevention), and consent (where
              applicable for communication).
            </p>
          </section>

          <section>
            <h2 className="text-golden-300 text-sm tracking-[2px] mb-2">
              5. Data Storage
            </h2>
            <p>
              Your data is stored securely using Supabase (authentication and
              database) and Stripe (billing and payments). Both providers meet
              industry‑standard security and compliance requirements.
            </p>
          </section>

          <section>
            <h2 className="text-golden-300 text-sm tracking-[2px] mb-2">
              6. Sharing of Information
            </h2>
            <p>
              We only share your data with service providers essential to
              operating Sea Within, including Stripe and Supabase. We never sell
              or rent your information.
            </p>
          </section>

          <section>
            <h2 className="text-golden-300 text-sm tracking-[2px] mb-2">
              7. Your Rights
            </h2>
            <p>
              Depending on your location, you may have the right to access,
              correct, delete, or export your data, withdraw consent, or request
              account deletion. To exercise these rights, contact us at{' '}
              <span className="text-golden-300">
                seawithinyourself@gmail.com
              </span>
              .
            </p>
          </section>

          <section>
            <h2 className="text-golden-300 text-sm tracking-[2px] mb-2">
              8. Cookies
            </h2>
            <p>
              Sea Within uses cookies for authentication, session management,
              performance, and security. You may disable cookies in your
              browser, but some features may not function properly.
            </p>
          </section>

          <section>
            <h2 className="text-golden-300 text-sm tracking-[2px] mb-2">
              9. Children’s Privacy
            </h2>
            <p>
              Sea Within is not intended for children under 13. We do not
              knowingly collect information from children.
            </p>
          </section>

          <section>
            <h2 className="text-golden-300 text-sm tracking-[2px] mb-2">
              10. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. Updates will
              be posted on this page with a new “Last updated” date.
            </p>
          </section>

          <section>
            <h2 className="text-golden-300 text-sm tracking-[2px] mb-2">
              11. Contact
            </h2>
            <p>
              For privacy questions or requests, contact us at{' '}
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
