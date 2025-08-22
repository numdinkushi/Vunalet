'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Shield } from 'lucide-react';
import Image from 'next/image';

export function Footer() {
  return (
    <motion.footer
      className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative w-12 h-12">
                <Image
                  src="/assets/logo/logo_white.png"
                  alt="Vunalet Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-3xl font-bold">Vunalet</h3>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
              Harvesting the future through sustainable agriculture and direct farmer-consumer connections across South Africa.
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="#"
                className="text-gray-300 hover:text-white transition-colors p-2 bg-gray-800 rounded-full hover:bg-gray-700"
                whileHover={{ scale: 1.2 }}
              >
                <Phone size={20} />
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-300 hover:text-white transition-colors p-2 bg-gray-800 rounded-full hover:bg-gray-700"
                whileHover={{ scale: 1.2 }}
              >
                <Mail size={20} />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {['Products', 'Farmers', 'About', 'Contact'].map((link) => (
                <li key={link}>
                  <motion.a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors flex items-center"
                    whileHover={{ x: 5 }}
                  >
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    {link}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xl font-semibold mb-6">Categories</h4>
            <ul className="space-y-3">
              {['Vegetables', 'Fruits', 'Grains', 'Herbs'].map((category) => (
                <li key={category}>
                  <motion.a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors flex items-center"
                    whileHover={{ x: 5 }}
                  >
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    {category}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <motion.div
          className="mt-16 pt-8 border-t border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center">
              <div className="p-3 bg-green-600 rounded-full mr-4">
                <MapPin className="text-white" size={20} />
              </div>
              <div>
                <h5 className="font-semibold mb-1">Our Location</h5>
                <p className="text-gray-300 text-sm">Cape Town, South Africa</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="p-3 bg-green-600 rounded-full mr-4">
                <Clock className="text-white" size={20} />
              </div>
              <div>
                <h5 className="font-semibold mb-1">Business Hours</h5>
                <p className="text-gray-300 text-sm">Mon - Fri: 8AM - 6PM</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="p-3 bg-green-600 rounded-full mr-4">
                <Shield className="text-white" size={20} />
              </div>
              <div>
                <h5 className="font-semibold mb-1">Quality Assured</h5>
                <p className="text-gray-300 text-sm">100% Fresh Guarantee</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="border-t border-gray-700 mt-12 pt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <p className="text-gray-300">
            © 2024 Vunalet. All rights reserved. Built with ❤️ for South African farmers.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
} 