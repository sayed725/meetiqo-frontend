'use client';

import { useState } from 'react';

const sections = [
  {
    id: 'collect',
    title: '1. Information We Collect',
    content: `We collect information you provide directly to us, such as when you create an account, update your profile, create or RSVP to an event, or contact us. This includes your name, email address, profile photo, and event details.

We also automatically collect certain information when you use Meetiqo, including your IP address, device type, browser type, and usage data.`,
  },
  {
    id: 'use',
    title: '2. How We Use Information',
    content: `We use the information we collect to:

- Provide, maintain, and improve our services
- Process transactions and send related information
- Send technical notices, updates, and support messages
- Respond to your comments and questions
- Personalize your experience and deliver content relevant to your interests
- Monitor and analyze trends and usage`,
  },
  {
    id: 'share',
    title: '3. Sharing of Information',
    content: `We do not sell your personal information. We may share information with:

- Event organizers when you RSVP or participate in their events
- Service providers who perform services on our behalf
- Other users in accordance with your privacy settings
- Law enforcement or other parties when required by law

All shared data is limited to what is necessary for the specific purpose.`,
  },
  {
    id: 'security',
    title: '4. Data Security',
    content: `We implement reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. However, no internet transmission is ever completely secure or error-free.`,
  },
  {
    id: 'cookies',
    title: '5. Cookies & Tracking',
    content: `We use cookies and similar technologies to analyze trends, administer the website, track users' movements around the website, and gather demographic information about our user base. You can control the use of cookies at the browser level.`,
  },
  {
    id: 'rights',
    title: '6. Your Rights',
    content: `Depending on your location, you may have the right to:

- Access the personal information we hold about you
- Request correction or deletion of your personal information
- Object to processing of your personal information
- Request restriction of processing
- Request portability of your personal information

To exercise these rights, contact us at privacy@meetiqo.com.`,
  },
  {
    id: 'changes',
    title: '7. Changes to This Policy',
    content: `We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy and, in some cases, we may provide you with additional notice.`,
  },
  {
    id: 'contact',
    title: '8. Contact Us',
    content: `If you have any questions about this Privacy Policy, please contact us at privacy@meetiqo.com or through our Contact page.`,
  },
];

export default function PrivacyPage() {
  const [active, setActive] = useState('collect');

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">Privacy Policy</h1>
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
