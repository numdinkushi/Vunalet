import { Header } from '@/components/layout/Header';
import { DashboardPage } from '@/components/pages/DashboardPage';

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <DashboardPage />
        </div>
    );
} 