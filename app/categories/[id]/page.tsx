import { Header } from '@/components/layout/Header';
import { CategoryPage } from '@/components/pages/CategoryPage';
import { Footer } from '@/components/layout/Footer';

interface CategoryPageProps {
    params: {
        id: string;
    };
}

export default function Category({ params }: CategoryPageProps) {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <CategoryPage categoryId={params.id} />
            <Footer />
        </div>
    );
} 