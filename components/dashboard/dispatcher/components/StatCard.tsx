import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface StatCardProps {
    icon: React.ComponentType<any>;
    title: string;
    value: string | number;
    trend?: string;
    color: string;
    delay?: number;
}

export function StatCard({ icon: Icon, title, value, trend, color, delay = 0 }: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
        >
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                        <div className={`p-3 ${color} rounded-lg`}>
                            <Icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">{title}</p>
                            <p className="text-2xl font-bold text-gray-900">{value}</p>
                            {trend && (
                                <p className="text-xs text-gray-500">{trend}</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
} 