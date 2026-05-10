import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { TrendingEvents } from '@/components/landing/TrendingEvents';
import { CategoriesSection } from '@/components/landing/CategoriesSection';
import { AIFeaturesSection } from '@/components/landing/AIFeaturesSection';
import { UpcomingEvents } from '@/components/landing/UpcomingEvents';
import { StatsSection } from '@/components/landing/StatsSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { Footer } from '@/components/landing/Footer';

export default function MarketingPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TrendingEvents />
        <CategoriesSection />
        <AIFeaturesSection />
        <UpcomingEvents />
        <StatsSection />
        <TestimonialsSection />
        <FAQSection />
      </main>
    
    </>
  );
}
