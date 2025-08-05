import { Header } from '@/components/layout/Header';
import { FarmersPage } from '@/components/pages/FarmersPage';
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