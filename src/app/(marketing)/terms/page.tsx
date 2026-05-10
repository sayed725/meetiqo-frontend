'use client';

import { useState } from 'react';

const sections = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    content: `By accessing or using Meetiqo, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.

We reserve the right to modify these terms at any time. We will notify you of any material changes by posting the new terms on the site.`,
  },
  {
    id: 'accounts',
    title: '2. User Accounts',
    content: `To use certain features of Meetiqo, you must register for an account. You agree to provide accurate and complete information and to keep this information updated.

You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.`,
  },
  {
    id: 'content',
    title: '3. User Content',
    content: `You retain ownership of any content you submit, post, or display on Meetiqo. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display that content in connection with our services.

You represent that you have all necessary rights to the content you submit and that it does not violate any third-party rights.`,
  },
  {
    id: 'conduct',
    title: '4. Prohibited Conduct',
    content: `You agree not to:

- Use Meetiqo for any illegal purpose
- Impersonate any person or entity
- Interfere with or disrupt the service
- Collect or store personal data about other users without permission
- Post content that is defamatory, obscene, or threatening
- Attempt to gain unauthorized access to any part of the service`,
  },
  {
    id: 'events',
    title: '5. Event Listings & Tickets',
    content: `Event organizers are responsible for the accuracy of their event listings and for honoring ticket sales. Meetiqo acts as a platform and is not responsible for the quality, safety, or legality of events listed.

All ticket sales are final unless the organizer explicitly offers refunds.`,
  },
  {
    id: 'payments',
    title: '6. Payments & Fees',
    content: `Meetiqo may charge fees for certain features or transactions. These fees will be clearly disclosed before you complete any transaction.

You agree to pay all applicable fees and taxes. Payment processing is handled by third-party providers and is subject to their terms.`,
  },
  {
    id: 'termination',
    title: '7. Termination',
    content: `We may suspend or terminate your account at any time, with or without notice, for conduct that we believe violates these terms or is harmful to other users, us, or third parties.

You may terminate your account at any time by following the instructions in your account settings.`,
  },
  {
    id: 'liability',
    title: '8. Limitation of Liability',
    content: `To the maximum extent permitted by law, Meetiqo shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the services.

Our total liability to you for any claims arising from these terms shall not exceed the amount you paid us in the twelve months preceding the claim.`,
  },
  {
    id: 'contact',
    title: '9. Contact',
    content: `If you have any questions about these Terms, please contact us at legal@meetiqo.com.`,
  },
];

export default function TermsPage() {
  const [active, setActive] = useState('acceptance');

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">Terms of Service</h1>
        <p className="mt-3 text-muted-foreground">Last updated: May 9, 2025</p>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-4">
        {/* Sticky TOC */}
        <div className="lg:col-span-1">
          <nav className="sticky top-24 space-y-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setActive(s.id);
                  document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`block w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                  active === s.id
                    ? 'bg-purple-50 font-medium text-purple-700'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {s.title}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-12">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="text-xl font-semibold">{s.title}</h2>
              <div className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {s.content}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
