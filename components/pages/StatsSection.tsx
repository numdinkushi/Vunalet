'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Sparkles, TrendingUp, Users, MapPin, Shield } from 'lucide-react';

const stats = [
    {
        number: "500+",
        label: "Active Farmers",
        icon: <Users className="w-8 h-8" />,
        color: "from-emerald-400 to-teal-500",
        description: "Verified sustainable farmers across Nigeria"
    },
    {
        number: "10K+",
        label: "Happy Customers",
        icon: <Sparkles className="w-8 h-8" />,
        color: "from-violet-400 to-purple-500",
        description: "Satisfied customers receiving fresh produce"
    },
    {
        number: "50+",
        label: "Cities Served",
        icon: <MapPin className="w-8 h-8" />,
        color: "from-orange-400 to-pink-500",
        description: "Major cities with direct delivery"
    },
    {
        number: "99%",
        label: "Fresh Guarantee",
        icon: <Shield className="w-8 h-8" />,
        color: "from-blue-400 to-cyan-500",
        description: "Quality assurance on every order"
    }
];

function FloatingElements() {
    // Use deterministic positions to avoid hydration mismatches
    const positions = [
        { left: 10, top: 20, delay: 0 },
        { left: 25, top: 60, delay: 0.5 },
        { left: 45, top: 15, delay: 1 },
        { left: 70, top: 80, delay: 1.5 },
        { left: 85, top: 30, delay: 2 },
        { left: 15, top: 75, delay: 2.5 },
        { left: 55, top: 45, delay: 3 },
        { left: 80, top: 10, delay: 3.5 },
        { left: 30, top: 85, delay: 4 },
        { left: 65, top: 25, delay: 4.5 },
        { left: 90, top: 65, delay: 5 },
        { left: 40, top: 90, delay: 5.5 }
    ];

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {positions.map((pos, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white/10 rounded-full"
                    style={{
                        left: `${pos.left}%`,
                        top: `${pos.top}%`,
                    }}
                    animate={{
                        y: [-20, 20, -20],
                        x: [-10, 10, -10],
                        opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                        duration: 3 + (i % 3),
                        repeat: Infinity,
                        delay: pos.delay,
                    }}
                />
            ))}
        </div>
    );
}

function CountUp({ target, duration = 2 }: { target: string; duration?: number }) {
    const [count, setCount] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
        if (!hasStarted) return;
        
        const numericTarget = parseInt(target.replace(/[^0-9]/g, ''));
        const increment = numericTarget / (duration * 60);
        
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= numericTarget) {
                setCount(numericTarget);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, 1000 / 60);

        return () => clearInterval(timer);
    }, [hasStarted, target, duration]);

    const formatNumber = (num: number) => {
        if (target.includes('%')) return `${num}%`;
        if (target.includes('K')) return `${(num / 1000).toFixed(1)}K+`;
        return `${num}+`;
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            onViewportEnter={() => setHasStarted(true)}
            viewport={{ once: true }}
        >
            {formatNumber(count)}
        </motion.div>
    );
}

export function StatsSection() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <section
            ref={containerRef}
            className="relative py-32 overflow-hidden"
            style={{
                background: `
                    radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.15) 0%, transparent 50%),
                    radial-gradient(circle at 40% 80%, rgba(16, 185, 129, 0.15) 0%, transparent 50%),
                    linear-gradient(135deg, #0f172a 0%, #1e293b 100%)
                `
            }}
        >
            <FloatingElements />

            {/* Mesh Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-transparent to-slate-800/50" />

            <motion.div
                className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
                style={{ y, opacity }}
            >
                {/* Header */}
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <TrendingUp className="w-4 h-4 text-emerald-400 mr-2" />
                        <span className="text-white/90 text-sm font-medium">Growing Impact</span>
                    </motion.div>

                    <h2 className="text-6xl md:text-7xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-white via-emerald-100 to-white bg-clip-text text-transparent">
                            Transforming
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                            Agriculture
                        </span>
                    </h2>

                    <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
                        Connecting farmers and consumers across Nigeria with technology,
                        sustainability, and trust at our core.
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            className="group relative"
                            initial={{ opacity: 0, y: 60 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                delay: index * 0.15,
                                duration: 0.8,
                                type: "spring",
                                stiffness: 100
                            }}
                            whileHover={{ scale: 1.05 }}
                        >
                            {/* Glassmorphism Card */}
                            <div className="relative p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden">
                                {/* Gradient Background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                                {/* Floating Icon */}
                                <motion.div
                                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.color} mb-6 shadow-lg`}
                                    whileHover={{
                                        rotate: [0, -10, 10, -10, 0],
                                        scale: 1.1
                                    }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <div className="text-white">
                                        {stat.icon}
                                    </div>
                                </motion.div>

                                {/* Number with Counter Animation */}
                                <div className="mb-4">
                                    <motion.div
                                        className="text-5xl md:text-6xl font-bold text-white mb-2"
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        whileInView={{ scale: 1, opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            delay: index * 0.2 + 0.3,
                                            type: "spring",
                                            stiffness: 200
                                        }}
                                    >
                                        <CountUp target={stat.number} />
                                    </motion.div>

                                    <motion.h3
                                        className="text-xl font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.2 + 0.5 }}
                                    >
                                        {stat.label}
                                    </motion.h3>
                                </div>

                                {/* Description */}
                                <motion.p
                                    className="text-white/60 text-sm leading-relaxed"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2 + 0.7 }}
                                >
                                    {stat.description}
                                </motion.p>

                                {/* Hover Effect Border */}
                                <motion.div
                                    className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
                                    style={{
                                        background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
                                        transform: 'translateX(-100%)',
                                    }}
                                    animate={{
                                        transform: 'translateX(100%)',
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        repeatDelay: 3,
                                    }}
                                />
                            </div>

                            {/* Bottom glow effect */}
                            <div className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-gradient-to-r ${stat.color} opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500`} />
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    className="text-center mt-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                >
                    <motion.button
                        className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl text-white font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "100%" }}
                            transition={{ duration: 0.6 }}
                        />
                        <span className="relative z-10 flex items-center">
                            Join Our Growing Community
                            <motion.div
                                className="ml-2"
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                →
                            </motion.div>
                        </span>
                    </motion.button>
                </motion.div>
            </motion.div>
        </section>
    );
}