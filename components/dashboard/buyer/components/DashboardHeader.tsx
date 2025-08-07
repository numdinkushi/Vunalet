import { ShoppingCart } from 'lucide-react';

export function DashboardHeader() {
    return (
        <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
                        <p className="text-gray-600 mt-1">Track your fresh produce deliveries</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center">
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            New Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 