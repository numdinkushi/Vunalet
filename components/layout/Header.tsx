
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingCart,
    Menu,
    X
} from 'lucide-react';
import {
    SignInButton,
    SignUpButton,
    UserButton,
    SignedIn,
    SignedOut
} from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Farmers', href: '/farmers' },
    { name: 'About', href: '/about' },
    { name: 'Dashboard', href: '/dashboard' },
];

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    // Prevent hydration mismatch by only rendering after mount
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        // Only apply scroll effects on the home page
        const isHomePage = window.location.pathname === '/';

        if (isHomePage) {
            const handleScroll = () => setIsScrolled(window.scrollY > 50);
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        } else {
            // For non-home pages, always show the scrolled state
            setIsScrolled(true);
        }
    }, [mounted]);

    // Show a loading state during SSR to prevent hydration mismatch
    if (!mounted) {
        return (
            <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-lg shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                            ))}
                        </div>
                        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <motion.header
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'
                }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <motion.div
                        className="flex items-center space-x-3 cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <motion.div
                            className="relative"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Image
                                src={isScrolled ? "/assets/logo/logo.png" : "/assets/logo/logo_white.png"}
                                alt="Vunalet Logo"
                                width={40}
                                height={40}
                                className="rounded-lg"
                            />
                        </motion.div>
                        <motion.h1
                            className={`text-2xl font-bold ${isScrolled ? 'text-green-600' : 'text-white'}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            Vunalet
                        </motion.h1>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navItems.map((item, index) => {
                            const isActive = pathname === item.href ||
                                (item.href !== '/' && pathname?.startsWith(item.href));

                            return (
                                <motion.div
                                    key={item.name}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    whileHover={{ y: -2 }}
                                >
                                    <Link
                                        href={item.href}
                                        className={`px-3 py-2 text-sm font-medium transition-colors relative ${isActive
                                            ? isScrolled
                                                ? 'text-green-600 font-semibold'
                                                : 'text-white font-semibold'
                                            : isScrolled
                                                ? 'text-gray-700 hover:text-green-600'
                                                : 'text-white/90 hover:text-white'
                                            }`}
                                    >
                                        {item.name}
                                        {isActive && (
                                            <motion.div
                                                className={`absolute bottom-0 left-0 right-0 h-0.5 ${isScrolled ? 'bg-green-600' : 'bg-white'
                                                    }`}
                                                layoutId="activeTab"
                                                initial={false}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            />
                                        )}
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </nav>

                    <div className="hidden md:flex items-center space-x-4">
                        <motion.button
                            className={`p-2 rounded-full transition-all duration-300 ${isScrolled
                                ? 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                                : 'text-white/90 hover:text-white hover:bg-white/10'
                                }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <ShoppingCart size={20} />
                        </motion.button>

                        <SignedOut>
                            <motion.div className="flex items-center space-x-2">
                                <SignInButton mode="modal">
                                    <motion.button
                                        className={`px-4 py-2 rounded-lg transition-all duration-300 ${isScrolled
                                            ? 'text-gray-700 hover:text-green-600'
                                            : 'text-white/90 hover:text-white'
                                            }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Sign In
                                    </motion.button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <motion.button
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Sign Up
                                    </motion.button>
                                </SignUpButton>
                            </motion.div>
                        </SignedOut>

                        <SignedIn>
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "w-8 h-8"
                                    }
                                }}
                            />
                        </SignedIn>
                    </div>

                    {/* Mobile menu button */}
                    <motion.button
                        className={`md:hidden p-2 rounded-lg transition-all duration-300 ${isScrolled
                            ? 'text-gray-700 hover:bg-green-50'
                            : 'text-white hover:bg-white/10'
                            }`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        whileTap={{ scale: 0.9 }}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </motion.button>
                </div>

                {/* Mobile Navigation */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            className="md:hidden"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg rounded-lg mt-2">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href ||
                                        (item.href !== '/' && pathname?.startsWith(item.href));

                                    return (
                                        <motion.div
                                            key={item.name}
                                            whileHover={{ x: 10 }}
                                        >
                                            <Link
                                                href={item.href}
                                                className={`block px-3 py-2 text-base font-medium w-full text-left rounded-lg transition-all duration-300 ${isActive
                                                    ? 'text-green-600 bg-green-50 font-semibold'
                                                    : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                                                    }`}
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                {item.name}
                                            </Link>
                                        </motion.div>
                                    );
                                })}

                                <SignedOut>
                                    <div className="pt-4 space-y-2">
                                        <SignInButton mode="modal">
                                            <button className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 rounded-lg hover:bg-green-50 transition-all duration-300">
                                                Sign In
                                            </button>
                                        </SignInButton>
                                        <SignUpButton mode="modal">
                                            <button className="block w-full text-left px-3 py-2 text-base font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300">
                                                Sign Up
                                            </button>
                                        </SignUpButton>
                                    </div>
                                </SignedOut>

                                <SignedIn>
                                    <div className="pt-4">
                                        <UserButton />
                                    </div>
                                </SignedIn>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.header>
    );
} 