'use client';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0A1628] text-white px-6 py-20">
      <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-10 backdrop-blur-xl">
        <h1 className="font-display text-3xl text-golden-400 tracking-[4px] mb-6 text-center">
          Refund Policy
        </h1>
        <p className="text-xs text-white/40 text-center mb-10">
          Last updated: June 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-white/80 font-body">

          <section>
            <h2 className="text-golden-300 text-sm tracking-[2px] mb-2">
              1. Overview
            </h2>
            <p>
              Sea Within offers a cinematic sanctuary experience through digital
              membership access. Because our content is delivered instantly and
              digitally, all membership sales are considered final unless
              required by applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-golden-300 text-sm tracking-[2px] mb-2">
              2. Non‑Refundable Services
            </h2>
            <p>
              Membership fees, subscription renewals, and digital access
              purchases are non‑refundable once processed. By subscribing, you
              acknowledge that access to Sea Within begins immediately and is
              therefore not eligible for return.
            </p>
          </section>

          <section>
            <h2 className="text-golden-300 text-sm tracking-[2px] mb-2">
              3. Billing Issues
            </h2>
            <p>
              If you believe a payment was made in error, contact us within 7
              days at{' '}
              <span className="text-golden-300">
                seawithinyourself@gmail.com
              </span>
              . We will review the situation and determine whether an exception
              is appropriate.
            </p>
          </section>

          <section>
            <h2 className="text-golden-300 text-sm tracking-[2px] mb-2">
              4. Subscription Cancellation
            </h2>
            <p>
              You may cancel your subscription at any time. Your membership will
              remain active until the end of the current billing cycle. No
              partial refunds are provided for unused time.
            </p>
          </section>

          <section>
            <h2 className="text-golden-300 text-sm tracking-[2px] mb-2">
              5. Contact
            </h2>
            <p>
              For billing or refund questions, contact us at{' '}
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
