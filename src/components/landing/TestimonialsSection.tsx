'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Designer at Stripe',
    avatar: 'SC',
    quote:
      'Meetiqo completely changed how I network. The AI recommendations surfaced design events I would have never found on my own. I have made genuine connections that turned into collaborations.',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Startup Founder',
    avatar: 'MJ',
    quote:
      'As an organizer, the AI event description generator saves me hours every week. Attendance at my tech meetups has doubled since I started using Meetiqo. The platform just works.',
    rating: 5,
  },
  {
    name: 'Aisha Patel',
    role: 'Software Engineer at Google',
    avatar: 'AP',
    quote:
      'The smart recommendations are scarily accurate. Every event I attend through Meetiqo feels like it was handpicked for me. It has become my go-to for finding meaningful tech community events.',
    rating: 5,
  },
  {
    name: 'David Kim',
    role: 'Freelance Developer',
    avatar: 'DK',
    quote:
      'I was tired of scrolling through irrelevant events. Meetiqo understands exactly what I’m looking for. The community features are a game-changer for freelancers trying to build a local network.',
    rating: 5,
  },
  {
    name: 'Elena Rodriguez',
    role: 'Marketing Manager',
    avatar: 'ER',
    quote:
      'Organizing our company’s community meetups used to be a headache. Now, with the automated scheduling and AI descriptions, it takes minutes instead of days. Highly recommended!',
    rating: 5,
  },
  {
    name: 'James Wilson',
    role: 'Community Leader',
    avatar: 'JW',
    quote:
      'The post-event engagement tools are phenomenal. We\'ve managed to keep the conversation going long after the meetup ends, creating a truly vibrant local community.',
    rating: 5,
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const ReviewCard = ({ review }: { review: typeof testimonials[0] }) => {
  const userInitial = review.avatar;

  return (
    <motion.div
      variants={itemVariants}
      className="w-[350px] md:w-[450px] shrink-0 h-full"
    >
      <div className="relative group h-full">
        {/* Card Background Bloom */}
        <div className="absolute -inset-0.5  rounded-[2rem] opacity-0 group-hover:opacity-10 blur-xl transition duration-700" />

        <Card className="relative h-full border-white/20 dark:border-white/10 bg-white/80 dark:bg-black/40 backdrop-blur-2xl shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2rem] overflow-hidden">
          <CardContent className="p-8 flex flex-col h-full relative">
            {/* Quote Icon - subtle background element */}
            {/* <div className="absolute top-0 right-0 text-primary/5 group-hover:text-primary/10 transition-colors duration-500">
              <Quote size={100} fill="currentColor" />
            </div> */}

            {/* Rating */}
            <div className="flex gap-1 mb-5 relative z-10">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={cn(
                    'transition-all duration-300',
                    i < review.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-slate-200 dark:text-slate-800'
                  )}
                />
              ))}
            </div>

            {/* Comment */}
            <div className="flex-grow mb-5 relative z-10">
              <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium line-clamp-4">
                "{review.quote}"
              </p>
            </div>

            {/* Author Section */}
            <div className="flex items-center gap-4 mt-auto pt-5 border-t border-slate-100 dark:border-slate-800/50 relative z-10">
              <div className="relative">
                <Avatar className="h-12 w-12 border-2 border-primary/20 group-hover:border-primary/50 transition-colors duration-500">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-black rounded-full p-0.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-white dark:fill-black" />
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-300 flex items-center gap-1.5">
                  {review.name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500">
                    {review.role}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export function TestimonialsSection() {
  // Marquee Logic
  const duplicateCount = 3; // Triple to ensure seamless loop on large screens
  const marqueeReviews = [...Array(duplicateCount)].flatMap(() => testimonials);

  return (
    <section className="py-16">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl  relative overflow-hidden">
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10%' }}
            variants={containerVariants}
            className="space-y-12"
          >
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto px-4 relative z-10">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">The Wall of Love</h2>
              <p className="text-lg text-muted-foreground">Real stories from our community.</p>
            </div>

            {/* Infinite Marquee Marquee */}
            <div className="relative flex overflow-hidden py-4">
              <motion.div
                animate={{ x: ['0%', '-33.33%'] }} // Match the duplicateCount (1/3rd for 3x)
                transition={{
                  duration: 40,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="flex gap-6 w-max"
                whileHover={{ animationPlayState: 'paused' }}
              >
                {marqueeReviews.map((review, idx) => (
                  <ReviewCard key={`${review.name}-${idx}`} review={review} />
                ))}
              </motion.div>

              {/* Fade Gradients for Marquee Edges */}
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-muted/30 dark:from-slate-900/50 to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-muted/30 dark:from-slate-900/50 to-transparent z-10 pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
