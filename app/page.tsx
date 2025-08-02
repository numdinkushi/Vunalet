import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/pages/HeroSection';
import { FeaturesSection } from '@/components/pages/FeaturesSection';
import { StatsSection } from '@/components/pages/StatsSection';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        {/* <StatsSection /> */}
      </main>
      <Footer />
    </div>
  );
}
