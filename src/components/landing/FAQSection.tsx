import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How does Meetiqo recommend events to me?',
    answer:
      'Our AI analyzes your interests, location, past event attendance, and browsing behavior to suggest events that match your preferences. The more you use Meetiqo, the smarter the recommendations become.',
  },
  {
    question: 'Is Meetiqo free to use?',
    answer:
      'Yes, creating an account and browsing events is completely free. Some events hosted by organizers may have ticket prices, but the platform itself charges no fees for attendees.',
  },
  {
    question: 'Can I host my own events on Meetiqo?',
    answer:
      'Absolutely. Anyone can sign up as an Organizer and start creating events. We provide AI-powered tools to help you write descriptions, choose optimal times, and reach the right audience.',
  },
  {
    question: 'How do I join a private event?',
    answer:
      'For private events, you submit a join request to the organizer. They review your profile and approve or decline your request. Once approved, you will receive a confirmation and event details.',
  },
  {
    question: 'What makes Meetiqo different from other event platforms?',
    answer:
      'Meetiqo uses AI to match you with events you actually care about, not just what is popular. We also provide organizers with intelligent tools to plan, promote, and understand their events better.',
  },
  {
    question: 'Is my data safe on Meetiqo?',
    answer:
      'We take privacy seriously. Your data is encrypted, never sold to third parties, and you can delete your account and data at any time. We comply with GDPR and other global privacy standards.',
  },
];

export function FAQSection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center text-2xl font-bold tracking-tight sm:text-3xl">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
