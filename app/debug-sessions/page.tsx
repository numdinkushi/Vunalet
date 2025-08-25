import { SessionManager } from '@/components/debug/SessionManager';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function DebugSessionsPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="container mx-auto py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Session Debug</h1>
                    <SessionManager />
                </div>
            </div>
            <Footer />
        </div>
    );
} 