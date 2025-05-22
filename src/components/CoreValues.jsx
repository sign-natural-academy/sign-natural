// CoreValues.jsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  HeartHandshake,
  Leaf,
  BookOpenCheck,
  Users,
  HandHeart,
  Hammer,
} from 'lucide-react';

const coreValues = [
  {
    title: 'Authenticity',
    icon: <BookOpenCheck size={36} className="text-amber-700 mb-3" />,
    description: 'We honor and preserve traditional knowledge passed down through generations.',
  },
  {
    title: 'Empowerment',
    icon: <Users size={36} className="text-amber-700 mb-3" />,
    description: 'We create opportunities for rural women, students, parents, and global visitors to learn and earn.',
  },
  {
    title: 'Craftsmanship',
    icon: <Hammer size={36} className="text-amber-700 mb-3" />,
    description: 'Every experience and product reflects care, creativity, and commitment to quality.',
  },
  {
    title: 'Sustainability',
    icon: <Leaf size={36} className="text-amber-700 mb-3" />,
    description: 'We use ethically sourced ingredients and promote eco-conscious practices.',
  },
  {
    title: 'Joyful Learning',
    icon: <HeartHandshake size={36} className="text-amber-700 mb-3" />,
    description: 'Whether a solo class or a birthday workshop, we make learning fun, memorable, and hands-on.',
  },
  {
    title: 'Community-Centered',
    icon: <HandHeart size={36} className="text-amber-700 mb-3" />,
    description: 'We support livelihoods, inspire families, and bridge cultures.',
  },
];

export default function CoreValues() {
  return (
    <section className="bg-amber-50 py-16 px-6 md:px-20">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl font-bold text-amber-800 mb-2">Our Core Values</h2>
        <p className="text-gray-700">The pillars that guide every experience and product at Sign Natural Academy.</p>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {coreValues.map((value, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-md text-center"
          >
            {value.icon}
            <h3 className="text-lg font-semibold text-amber-900 mb-2">{value.title}</h3>
            <p className="text-sm text-gray-600">{value.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
