'use client';

import { useState } from 'react';
import { DashboardHeader, StatsGrid, TabNavigation, OrderList, OrderModal } from './components';
import { mockOrderStats, mockOrders } from './data';
import { filterOrdersByStatus } from './utils';
import { Order } from './types';
import { WalletCard } from '../shared/WalletCard';

export default function BuyerDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const stats = {
        totalOrders: mockOrderStats.total,
        activeOrders: mockOrderStats.pending + mockOrderStats.confirmed + mockOrderStats.preparing + mockOrderStats.ready + mockOrderStats.inTransit,
        completedOrders: mockOrderStats.delivered,
        totalSpent: mockOrderStats.totalRevenue,
    };

    const getActiveOrders = () => {
        return filterOrdersByStatus(mockOrders, ['pending', 'confirmed', 'preparing', 'ready', 'in_transit']);
    };

    const getHistoryOrders = () => {
        return filterOrdersByStatus(mockOrders, ['delivered', 'cancelled']);
    };

    const handleRowClick = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardHeader />

            <div className="max-w-7xl mx-auto px-6 py-8">
                <StatsGrid stats={stats} />

                {/* Wallet Card */}
                <WalletCard
                    walletBalance={12500.5}
                    ledgerBalance={15890.0}
                    className="mt-4"
                />
                <div className="mt-8">
                    <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
                </div>

                {/* Content */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <OrderList
                            title="Recent Orders"
                            orders={mockOrders.slice(0, 3)}
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            onRowClick={handleRowClick}
                        />
                    </div>
                )}

                {activeTab === 'active' && (
                    <div className="space-y-6">
                        <OrderList
                            title="Active Orders"
                            orders={getActiveOrders()}
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            onRowClick={handleRowClick}
                        />
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="space-y-6">
                        <OrderList
                            title="Order History"
                            orders={getHistoryOrders()}
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            onRowClick={handleRowClick}
                        />
                    </div>
                )}
            </div>

            {/* Order Modal */}
            <OrderModal
                order={selectedOrder}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </div>
    );
} 