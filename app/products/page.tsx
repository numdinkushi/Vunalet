import { Header } from '@/components/layout/Header';
import { ProductsPage } from '@/components/pages/product/ProductsPage';
import { Footer } from '@/components/layout/Footer';

export default function Products() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <ProductsPage />
      <Footer />
    </div>
  );
} 