import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { DashboardContent } from '../../components/dashboard/DashboardContent';
import { CeloAddressDebugger } from '../../components/debug/CeloAddressDebugger';

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold mb-4">Debug CELO Address</h1>
                    <CeloAddressDebugger />
                </div>
                <DashboardContent />
            </div>
            <Footer />
        </div>
    );
}
