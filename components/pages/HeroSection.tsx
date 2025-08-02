'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const heroSlides = [
  {
    id: 1,
    image: '/assets/background_images/image3.jpg',
    title: 'Quality Assured',
    subtitle: 'Premium produce with guaranteed freshness',
    description: 'Every product is carefully selected and quality-tested for your satisfaction'
  },
  {
    id: 2,
    image: '/assets/background_images/image6.jpg',
    title: 'Fresh from the Farm',
    subtitle: 'Direct from South African farmers to your table',
    description: 'Experience the freshest produce delivered directly from local farms across South Africa'
  },
  {
    id: 3,
    image: '/assets/background_images/image12.jpg',
    title: 'Sustainable Agriculture',
    subtitle: 'Supporting local farmers and communities',
    description: 'Join us in building a sustainable future for South African agriculture'
  }
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 8000); // Increased from 5000ms to 8000ms
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Slider */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }} // Increased duration and smoother easing
        >
          <Image
            src={heroSlides[currentSlide].image}
            alt={heroSlides[currentSlide].title}
            fill
            className="object-cover"
            priority
          />
          {/* Darker overlay for better text readability */}
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 1.2, ease: "easeInOut" }} // Increased duration and smoother easing
              className="space-y-8"
            >
              <motion.h1
                className="text-5xl md:text-7xl font-black mb-4 font-['Russo_One'] tracking-wider"
                style={{
                  textShadow: '0 0 20px rgba(34, 197, 94, 0.8), 0 0 40px rgba(34, 197, 94, 0.6), 0 0 60px rgba(34, 197, 94, 0.4)',
                  WebkitTextStroke: '1px rgba(34, 197, 94, 0.3)'
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                {heroSlides[currentSlide].title}
              </motion.h1>

              <motion.h2
                className="text-2xl md:text-3xl font-bold mb-6 font-['Bungee'] text-green-300"
                style={{
                  textShadow: '0 0 15px rgba(34, 197, 94, 0.7), 0 0 30px rgba(34, 197, 94, 0.5)',
                  WebkitTextStroke: '0.5px rgba(34, 197, 94, 0.4)'
                }}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                {heroSlides[currentSlide].subtitle}
              </motion.h2>

              <motion.p
                className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 opacity-90 font-['Chakra_Petch'] font-medium"
                style={{
                  textShadow: '0 0 10px rgba(255, 255, 255, 0.6), 0 0 20px rgba(255, 255, 255, 0.4)'
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                {heroSlides[currentSlide].description}
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <motion.a
                  href="/products"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center group font-['Righteous']"
                  style={{
                    boxShadow: '0 0 20px rgba(34, 197, 94, 0.5), inset 0 0 20px rgba(34, 197, 94, 0.2)',
                    textShadow: '0 0 10px rgba(255, 255, 255, 0.8)'
                  }}
                  whileHover={{
                    scale: 1.05,
                    y: -2,
                    boxShadow: '0 0 30px rgba(34, 197, 94, 0.8), inset 0 0 30px rgba(34, 197, 94, 0.3)'
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Shop Fresh Produce
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </motion.a>

                <motion.a
                  href="/farmers"
                  className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-white hover:text-green-800 transition-all duration-300 font-['Righteous']"
                  style={{
                    textShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
                    boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)'
                  }}
                  whileHover={{
                    scale: 1.05,
                    y: -2,
                    boxShadow: '0 0 25px rgba(255, 255, 255, 0.5)'
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Join as Farmer
                </motion.a>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <motion.button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronLeft size={24} />
      </motion.button>

      <motion.button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronRight size={24} />
      </motion.button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {heroSlides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            whileHover={{ scale: 1.2 }}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-8 z-20"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-white rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
} 