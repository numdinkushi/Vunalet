import { Header } from '@/components/layout/Header';
import { FarmerProductsPage } from '@/components/pages/product/FarmerProductsPage';
import { Footer } from '@/components/layout/Footer';

interface FarmerProductsPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function FarmerProducts({ params }: FarmerProductsPageProps) {
    const { id } = await params;
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <FarmerProductsPage farmerId={id} />
            <Footer />
        </div>
    );
} 