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
    const [isHomePage, setIsHomePage] = useState(false);

    useEffect(() => {
        // Check if we're on the homepage
        setIsHomePage(window.location.pathname === '/');

        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.header
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${isHomePage
                ? (isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-transparent')
                : 'bg-white/95 backdrop-blur-lg shadow-lg'
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
                                src={
                                    isHomePage
                                        ? (isScrolled ? "/assets/logo/logo.png" : "/assets/logo/logo_white.png")
                                        : "/assets/logo/logo.png"
                                }
                                alt="Vunalet Logo"
                                width={40}
                                height={40}
                                className="rounded-lg"
                            />
                        </motion.div>
                        <motion.h1
                            className={`text-2xl font-bold ${isHomePage
                                ? (isScrolled ? 'text-green-600' : 'text-white')
                                : 'text-green-600'
                                }`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            Vunalet
                        </motion.h1>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navItems.map((item, index) => (
                            <motion.a
                                key={item.name}
                                href={item.href}
                                className={`px-3 py-2 text-sm font-medium transition-colors ${isHomePage
                                    ? (isScrolled ? 'text-gray-700 hover:text-green-600' : 'text-white/90 hover:text-white')
                                    : 'text-gray-700 hover:text-green-600'
                                    }`}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                whileHover={{ y: -2 }}
                            >
                                {item.name}
                            </motion.a>
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center space-x-4">
                        <motion.button
                            className={`p-2 rounded-full transition-all duration-300 ${isHomePage
                                    ? (isScrolled ? 'text-gray-700 hover:text-green-600 hover:bg-green-50' : 'text-white/90 hover:text-white hover:bg-white/10')
                                    : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
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
                                        className={`px-4 py-2 rounded-lg transition-all duration-300 ${isHomePage
                                                ? (isScrolled ? 'text-gray-700 hover:text-green-600' : 'text-white/90 hover:text-white')
                                                : 'text-gray-700 hover:text-green-600'
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
                        className={`md:hidden p-2 rounded-lg transition-all duration-300 ${isHomePage
                                ? (isScrolled ? 'text-gray-700 hover:bg-green-50' : 'text-white hover:bg-white/10')
                                : 'text-gray-700 hover:bg-green-50'
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
                                {navItems.map((item) => (
                                    <motion.a
                                        key={item.name}
                                        href={item.href}
                                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 w-full text-left rounded-lg hover:bg-green-50 transition-all duration-300"
                                        onClick={() => setIsMenuOpen(false)}
                                        whileHover={{ x: 10 }}
                                    >
                                        {item.name}
                                    </motion.a>
                                ))}

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