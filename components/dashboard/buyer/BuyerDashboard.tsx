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
import { LZC_TOKEN_NAME } from '../../../constants/tokens';
import { useOrderManagement } from '../../../hooks/use-order-management';

export default function BuyerDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { user } = useUser();

    const userProfile = useQuery(api.users.getUserProfile, {
        clerkUserId: user?.id || '',
    });

    // Replace the existing balance query
    const balance = useQuery(api.balances.getUserBalanceWithLedger, {
        clerkUserId: user?.id || '',
        token: LZC_TOKEN_NAME,
        role: 'buyer',
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const upsertBalance = useMutation((api as unknown as any).balances.upsertUserBalance);

    useEffect(() => {
        if (!user?.id || !userProfile?.liskId) return;

        const refreshBalances = async () => {
            try {
                const { walletService } = await import('../../../lib/services/wallet/wallet.service');
                const balances = await walletService.fetchBalances(userProfile.liskId!);

                // Only update wallet balance, preserve existing ledger balance
                const currentBalance = await getCurrentBalance();

                await upsertBalance({
                    clerkUserId: user.id,
                    token: LZC_TOKEN_NAME,
                    walletBalance: balances.walletBalance, // Update from Lisk
                    ledgerBalance: currentBalance?.ledgerBalance || 0, // Keep existing ledger balance
                });
            } catch (error) {
                console.log('Failed to refresh balances:', error);
            }
        };

        refreshBalances();
    }, [user?.id, userProfile?.liskId]);

    // Helper function to get current balance
    const getCurrentBalance = async () => {
        try {
            const balance = await fetch(`/api/balances/${user?.id}`).then(r => r.json());
            return balance;
        } catch (error) {
            return null;
        }
    };

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

    const { confirmDelivery, isProcessing } = useOrderManagement();

    const handleConfirmDelivery = async (order: Order) => {
        // Get farmer profile for payment identifier
        const farmerProfile = await fetch(`/api/users/${order.farmerId}`).then(r => r.json());

        await confirmDelivery(order._id, {
            buyerId: user?.id,
            buyerLiskId: userProfile?.liskId,
            farmerId: order.farmerId,
            farmerPaymentId: farmerProfile.paymentIdentifier,
            totalCost: order.totalCost,
            products: order.products,
        });
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