'use client';

import { useState, useEffect } from 'react';
import { DashboardHeader, StatsGrid, TabNavigation, OrderList, OrderModal } from './components';
import { mockOrderStats, mockOrders } from './data';
import { filterOrdersByStatus } from './utils';
import { Order } from './types';
import { WalletCard } from '../shared/WalletCard';
import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { walletService } from '../../../lib/services/wallet/wallet.service';
import { LZC_TOKEN_NAME } from '../../../constants/tokens';

export default function BuyerDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { user } = useUser();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const balance = useQuery((api as unknown as any).balances.getUserBalance, {
        clerkUserId: user?.id || '',
        token: LZC_TOKEN_NAME,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const upsertBalance = useMutation((api as unknown as any).balances.upsertUserBalance);

    useEffect(() => {
        if (!user?.id) return;
        walletService
            .fetchBalances(user.id)
            .then(({ walletBalance, ledgerBalance }) => {
                console.log('Fetched balances', { walletBalance, ledgerBalance });
                return upsertBalance({
                    clerkUserId: user.id,
                    token: LZC_TOKEN_NAME,
                    walletBalance,
                    ledgerBalance,
                });
            })
            .catch((err) => console.log('Failed to refresh balances', err));
    }, [user?.id]);

    const walletBalance = balance?.walletBalance ?? 0;
    const ledgerBalance = balance?.ledgerBalance ?? 0;

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
                    walletBalance={walletBalance}
                    ledgerBalance={ledgerBalance}
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

            {/* Modal */}
            {isModalOpen && (
                <OrderModal order={selectedOrder} isOpen={isModalOpen} onClose={handleCloseModal} />
            )}
        </div>
    );
} 