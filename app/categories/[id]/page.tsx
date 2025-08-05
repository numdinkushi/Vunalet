import { CategoryPage } from '@/components/pages/CategoryPage';

interface CategoryPageProps {
    params: {
        id: string;
    };
}

export default function Category({ params }: CategoryPageProps) {
    return <CategoryPage categoryId={params.id} />;
} 