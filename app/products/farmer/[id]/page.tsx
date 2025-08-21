import { Header } from '@/components/layout/Header';
import { FarmerProductsPage } from '@/components/pages/product/FarmerProductsPage';
import { Footer } from '@/components/layout/Footer';

interface FarmerProductsPageProps {
    params: {
        id: string;
    };
}

export default function FarmerProducts({ params }: FarmerProductsPageProps) {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <FarmerProductsPage farmerId={params.id} />
            <Footer />
        </div>
    );
} 