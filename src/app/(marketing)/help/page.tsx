'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How do I create an event on Meetiqo?',
    answer:
      'Sign up as an Organizer, go to your Dashboard, and click "Create Event." Fill in the details like title, description, date, and location, then publish when ready.',
  },
  {
    question: 'Is Meetiqo free to use?',
    answer:
      'Yes! Creating and browsing events is completely free. We only charge a small fee for paid ticket sales to cover payment processing.',
  },
  {
    question: 'Can I invite people privately?',
    answer:
      'Absolutely. You can set your event type to "Private" and send direct invitations to specific users via email or username.',
  },
  {
    question: 'How do AI recommendations work?',
    answer:
      'Our AI analyzes your past event activity, interests, and preferences to suggest upcoming events you are likely to enjoy.',
  },
  {
    question: 'How do I get a refund for a paid event?',
    answer:
      'Refund policies are set by individual organizers. Contact the event organizer directly or check the event page for their specific policy.',
  },
  {
    question: 'Can I use Meetiqo for corporate events?',
    answer:
      'Yes! Many companies use Meetiqo for team-building, conferences, and workshops. Contact us for enterprise features.',
  },
  {
    question: 'How do I delete my account?',
    answer:
      'Go to Settings → Account, scroll to the bottom, and click "Delete Account." All your data will be permanently removed within 30 days.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'We use industry-standard encryption, secure authentication, and regular audits to keep your data safe. Read our Privacy Policy for details.',
  },
];

export default function HelpPage() {
  const [query, setQuery] = useState('');

  const filtered = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(query.toLowerCase()) ||
      f.answer.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">Help Center</h1>
        <p className="mt-3 text-muted-foreground">
          Search our FAQ or browse common questions below.
        </p>
      </div>

      <div className="relative mt-8">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search questions..."
          className="pl-9"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="mt-8">
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            No questions found. Try a different search term.
          </p>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {filtered.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-sm font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
}
