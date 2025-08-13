import { Header } from '@/components/layout/Header';
import { FarmersPage } from '@/components/pages/farmers/main';
import { Footer } from '@/components/layout/Footer';

export default function Farmers() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <FarmersPage />
      <Footer />
    </div>
  );
} 