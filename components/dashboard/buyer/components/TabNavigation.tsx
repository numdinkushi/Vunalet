import { Package, Clock, CheckCircle } from 'lucide-react';
import { TabItem } from '../types';

interface TabNavigationProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
    const tabs: TabItem[] = [
        { id: 'overview', label: 'Overview', icon: Package },
        { id: 'active', label: 'Active Orders', icon: Clock },
        { id: 'history', label: 'Order History', icon: CheckCircle }
    ];

    return (
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-8">
            {tabs.map(({ id, label, icon: Icon }) => (
                <button
                    key={id}
                    onClick={() => onTabChange(id)}
                    className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${activeTab === id
                        ? 'bg-white text-emerald-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <Icon className="w-4 h-4 mr-2" />
                    {label}
                </button>
            ))}
        </div>
    );
} 