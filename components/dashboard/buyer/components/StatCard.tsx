import { TrendingUp } from 'lucide-react';
import { StatCardProps } from '../types';

export function StatCard({ icon: Icon, title, value, trend, color }: StatCardProps) {
    return (
        <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                    {trend && (
                        <div className="flex items-center mt-2 text-sm text-emerald-600">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            <span>{trend}</span>
                        </div>
                    )}
                </div>
                <div className={`p-4 rounded-xl ${color} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
    );
} 