import { Hero } from '@/components/landing/Hero';
import { PlatformShowcase } from '@/components/landing/PlatformShowcase';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { TrustBar } from '@/components/landing/TrustBar';
import { FAQ } from '@/components/landing/FAQ';

export default function HomePage() {
  return (
    <>
      <Hero />
      <PlatformShowcase />
      <HowItWorks />
      <TrustBar />
      <FAQ />
    </>
  );
}

