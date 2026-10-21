
'use client';

import { useState, type ReactNode } from 'react';

type FAQItem = {
  question: string;
  answer: ReactNode;
};

const faqSections: { title: string; items: FAQItem[] }[] = [
  {
    title: 'Getting Started',
    items: [
      {
        question: 'Do I need previous meditation or wellness experience?',
        answer:
          "Not at all. Sea Within is designed for everyone, whether you're just beginning your wellness journey or already have an established mindfulness practice.",
      },
      {
        question: 'Can I access Sea Within on my phone?',
        answer:
          'Yes. Sea Within is designed to work on modern mobile phones and desktop devices, allowing you to access your experience wherever you are.',
      },
      {
        question: 'What happens if I miss a day?',
        answer:
          'Nothing is lost. Your journey will be waiting for you when you return. You can continue where you left off without worrying about missing a reflection.',
      },
    ],
  },
  {
    title: 'Privacy & Community',
    items: [
      {
        question: 'How is my personal information protected?',
        answer: (
          <>
            We take your privacy seriously. Your personal information is handled
            in accordance with our{' '}
            <a
              href="/legal#privacy"
              className="text-golden-300 underline underline-offset-4"
            >
              Privacy Policy
            </a>{' '}
            and used as necessary to provide, maintain, and improve the service.
          </>
        ),
      },
      {
        question: 'Who can see the content I create?',
        answer:
          'Content you submit to shared community areas will be visible to other members. Your username and the date will be shown.',
      },
      {
        question: 'What kind of community behavior is expected?',
        answer:
          'We ask all members to communicate with kindness, respect, and compassion. Harassment, discrimination, bullying, and abusive behavior are not permitted. We want Sea Within to be a welcoming and respectful space for everyone.',
      },
      {
        question: 'Is Sea Within a medical or mental health service?',
        answer:
          'No. Sea Within is intended to support personal growth, reflection, and well-being. It is not a substitute for professional medical advice, diagnosis, treatment, or mental health care.',
      },
    ],
  },
  {
    title: 'Membership & Billing',
    items: [
      {
        question: 'How does the Sea Within subscription work?',
        answer:
          'Sea Within is offered through a recurring monthly subscription with no long-term commitment. Your membership fee is automatically charged each month until you cancel your subscription.',
      },
      {
        question: 'How do I cancel my subscription?',
        answer: (
          <>
            You can cancel your subscription at any time:
            <ol className="mt-3 list-decimal space-y-2 pl-5">
              <li>
                Go to <strong>Account → Manage Subscription</strong>.
              </li>
              <li>Log in to your customer portal.</li>
              <li>
                Locate the cancellation option and select{' '}
                <strong>Cancel Subscription</strong>.
              </li>
            </ol>
          </>
        ),
      },
      {
        question: 'Will I lose access immediately if I cancel?',
        answer:
          'No. You will continue to have access to your membership benefits until the end of your current subscription period.',
      },
      {
        question: 'Do you offer refunds?',
        answer: (
          <>
            Membership payments are generally non-refundable. Canceling your
            subscription prevents future renewals but does not refund payments
            that have already been processed, except where required by
            applicable law. Please also review our{' '}
            <a
              href="/legal#refund"
              className="text-golden-300 underline underline-offset-4"
            >
              Refund Policy
            </a>.
          </>
        ),
      },
      {
        question: 'How do I update my payment method?',
        answer:
          'You can update your billing information through Account → Manage Subscription → Customer Portal.',
      },
      {
        question: 'Can I view my invoices?',
        answer:
          'Your invoice is sent to your email after your payment has been processed. You can also view your invoices through Account → Manage Subscription → Customer Portal.',
      },
    ],
  },
  {
    title: 'Account Management',
    items: [
      {
        question: 'Can I delete my account?',
        answer: (
          <>
            Yes. You may request account deletion at any time. Once your
            request has been processed, your personal account data will be
            handled in accordance with our Privacy Policy and applicable legal
            obligations. To request account deletion, email{' '}
            <a
              href="mailto:seawithinyourself@gmail.com"
              className="text-golden-300 underline underline-offset-4"
            >
              seawithinyourself@gmail.com
            </a>.
          </>
        ),
      },
    ],
  },
];

function FAQAccordion({ item }: { item: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10 last:border-b-0">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((previous) => !previous)}
        className="flex w-full items-center justify-between gap-5 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden-300"
      >
        <span className="font-display text-sm tracking-wide text-white sm:text-base">
          {item.question}
        </span>

        <span
          aria-hidden="true"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-golden-300/40 text-lg text-golden-300"
        >
          {isOpen ? '−' : '+'}
        </span>
      </button>

      {isOpen && (
        <div className="max-w-2xl pb-5 pr-2 text-sm leading-7 text-white/70">
          {item.answer}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-[#0A1628] px-5 py-16 text-white sm:px-8 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <header className="mb-14 text-center sm:mb-16">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-golden-300">
            SEA WITHIN
          </p>

          <h1 className="font-display text-3xl tracking-[0.12em] text-golden-400 sm:text-5xl">
            Frequently Asked Questions
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
            A little clarity for your journey. Find answers about getting
            started, community, membership, and your account.
          </p>

          <div className="mx-auto mt-8 h-px w-24 bg-gradient-to-r from-transparent via-golden-300/80 to-transparent" />
        </header>

        <div className="space-y-10">
          {faqSections.map((section) => (
            <section
              key={section.title}
              className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.12)] backdrop-blur-xl sm:p-8"
            >
              <h2 className="mb-2 font-display text-xs uppercase tracking-[0.24em] text-golden-300 sm:text-sm">
                {section.title}
              </h2>

              <div>
                {section.items.map((item) => (
                  <FAQAccordion key={item.question} item={item} />
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-14 text-center sm:mt-16">
          <p className="text-sm text-white/65">
            Still have a question?
          </p>

          <a
            href="mailto:seawithinyourself@gmail.com"
            className="mt-3 inline-flex items-center justify-center rounded-full border border-golden-300/50 px-6 py-3 text-xs uppercase tracking-[0.18em] text-golden-300 transition hover:border-golden-200 hover:bg-golden-300/10 hover:text-golden-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden-300"
          >
            Contact Sea Within
          </a>

          <p className="mt-8 text-xs text-white/35">
            <a
              href="/"
              className="transition hover:text-white/70"
            >
              Return to homepage
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
