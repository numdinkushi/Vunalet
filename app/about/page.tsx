import { Header } from '@/components/layout/Header';
import { AboutPage } from '@/components/pages/AboutPage';
import { Footer } from '@/components/layout/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <AboutPage />
      <Footer />
    </div>
  );
} 