import { Header } from '@/components/layout/Header';
import { CategoryPage } from '@/components/pages/CategoryPage';
import { Footer } from '@/components/layout/Footer';

interface CategoryPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function Category({ params }: CategoryPageProps) {
    const { id } = await params;
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <CategoryPage categoryId={id} />
            <Footer />
        </div>
    );
} 