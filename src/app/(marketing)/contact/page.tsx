'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Twitter, MessageCircle, Send, HelpCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@meetiqo.com',
    href: 'mailto:hello@meetiqo.com',
  },
  {
    icon: Twitter,
    label: 'Twitter / X',
    value: '@meetiqo',
    href: 'https://twitter.com/meetiqo',
  },
  {
    icon: MessageCircle,
    label: 'Discord',
    value: 'discord.gg/meetiqo',
    href: 'https://discord.gg/meetiqo',
  },
];

export default function ContactPage() {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) return;

    setIsSubmitting(true);
    try {
      await api.post('/contact', { name, email, subject, message });
      toast({ message: 'Message sent successfully!', variant: 'default' });
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch {
      toast({ message: 'Failed to send message. Try again.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">Get in Touch</h1>
        <p className="mt-3 text-muted-foreground">
          Have a question, partnership idea, or just want to say hi?
        </p>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-3">
        {/* Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Send us a message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="What's this about?"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us more..."
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info */}
        <div className="space-y-6">
          {contactInfo.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-50">
                  <Icon className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.value}</p>
                </div>
              </a>
            );
          })}

          <Card className="bg-purple-50 border-purple-100">
            <CardContent className="py-6">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 shrink-0 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-purple-900">
                    Looking for help?
                  </p>
                  <p className="mt-1 text-sm text-purple-800">
                    Check our FAQ for quick answers to common questions.
                  </p>
                  <Button asChild variant="link" className="mt-2 h-auto p-0 text-purple-700">
                    <Link href="/help">Visit Help Center</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
