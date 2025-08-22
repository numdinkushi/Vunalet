import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface AwaitingConfirmationMessageProps {
    customerName: string;
}

export function AwaitingConfirmationMessage({ customerName }: AwaitingConfirmationMessageProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="pt-3 border-t"
        >
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <motion.div
                    animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.8, 1, 0.8]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="flex items-center justify-center space-x-2 text-blue-700"
                >
                    <Clock className="w-4 h-4 animate-pulse" />
                    <span className="text-sm font-medium">
                        Awaiting confirmation from buyer ({customerName})
                    </span>
                </motion.div>
            </div>
        </motion.div>
    );
} 