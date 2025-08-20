'use client';

import { motion } from 'framer-motion';
import { Leaf, Users, TrendingUp } from 'lucide-react';

const mission = [
    {
        icon: <Leaf className="w-8 h-8" />,
        title: "Sustainable Agriculture",
        description: "Promoting eco-friendly farming practices that protect our planet for future generations"
    },
    {
        icon: <Users className="w-8 h-8" />,
        title: "Community Connection",
        description: "Building bridges between farmers and consumers to strengthen local food systems"
    },
    {
        icon: <TrendingUp className="w-8 h-8" />,
        title: "Economic Growth",
        description: "Empowering farmers with fair prices and consumers with quality produce"
    }
];

const team = [
    {
        name: "Kushi Numdin",
        role: "Founder",
        image: "/assets/founders/kushi.jpg",
        bio: "Visionary leader passionate about revolutionizing agricultural commerce and empowering local farmers"
    },
    {
        name: "Sophia A. Gabriel",
        role: "Co-founder",
        image: "/assets/founders/sophie.png",
        bio: "Technical expert building cutting-edge solutions to connect farmers and consumers seamlessly"
    }
];

export function AboutPage() {
    return (
        <div className="min-h-screen pt-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Section */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl font-bold text-primary mb-6">About Vunalet</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        We&apos;re revolutionizing the agricultural marketplace by connecting farmers directly
                        with consumers, ensuring fresh produce reaches your table while supporting
                        sustainable farming practices across South Africa.
                    </p>
                </motion.div>

                {/* Mission Section */}
                <section className="mb-16">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl font-bold text-primary mb-4">Our Mission</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Creating a sustainable future where farmers thrive and consumers enjoy
                            the freshest, highest quality produce
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {mission.map((item, index) => (
                            <motion.div
                                key={index}
                                className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all duration-300"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2, duration: 0.6 }}
                                whileHover={{ y: -5, scale: 1.02 }}
                            >
                                <motion.div
                                    className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-white"
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    {item.icon}
                                </motion.div>
                                <h3 className="text-xl font-bold text-primary mb-4">{item.title}</h3>
                                <p className="text-gray-600">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Team Section */}
                <section className="mb-16">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl font-bold text-primary mb-4">Meet Our Team</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Passionate individuals working together to transform agriculture
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {team.map((member, index) => (
                            <motion.div
                                key={index}
                                className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all duration-300"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                whileHover={{ y: -5 }}
                            >
                                <motion.img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.3 }}
                                />
                                <h3 className="text-xl font-bold text-primary mb-2">{member.name}</h3>
                                <p className="text-accent font-semibold mb-3">{member.role}</p>
                                <p className="text-gray-600 text-sm">{member.bio}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Values Section */}
                <motion.section
                    className="bg-primary text-white p-12 rounded-3xl"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="text-center">
                        <h2 className="text-4xl font-bold mb-6">Our Values</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { title: "Transparency", desc: "Open and honest dealings with all stakeholders" },
                                { title: "Quality", desc: "Commitment to the highest standards in everything we do" },
                                { title: "Innovation", desc: "Embracing technology to solve agricultural challenges" },
                                { title: "Community", desc: "Building strong relationships that benefit everyone" }
                            ].map((value, index) => (
                                <motion.div
                                    key={index}
                                    className="text-center"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <h3 className="text-xl font-bold mb-3 text-accent">{value.title}</h3>
                                    <p className="text-sm opacity-90">{value.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.section>
            </div>
        </div>
    );
} 