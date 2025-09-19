import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { DashboardContent } from '../../components/dashboard/DashboardContent';

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <DashboardContent />
            </div>
            <Footer />
        </div>
    );
}
