'use client';

import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

interface AnimatedLogoProps {
    size?: number;
}

export function AnimatedLogo({ size = 40 }: AnimatedLogoProps) {
    return (
        <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <motion.div
                className={`w-${size / 4} h-${size / 4} bg-primary rounded-lg flex items-center justify-center`}
                style={{ width: size / 4, height: size / 4 }}
                initial={{ opacity: 0, rotate: -180 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
            >
                <Leaf className="text-white" size={size / 2} />
            </motion.div>
        </motion.div>
    );
} 