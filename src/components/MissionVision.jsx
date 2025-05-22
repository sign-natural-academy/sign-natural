// MissionVision.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Eye } from 'lucide-react';

export default function MissionVision() {
  const cards = [
    {
      title: 'Our Mission',
      icon: <Lightbulb size={40} className="text-amber-600 mb-3" />,
      text: 'To educate, inspire, and empower individuals through hands-on, culturally rooted skincare experiences that nurture creativity, well-being, and connection.',
    },
    {
      title: 'Our Vision',
      icon: <Eye size={40} className="text-amber-600 mb-3" />,
      text: 'To become Africa’s leading natural skincare education and experience hub celebrating the power of indigenous ingredients and artisanal craftsmanship.',
    },
  ];

  return (
    <section className="bg-white py-16 px-6 md:px-20">
      <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
            className="bg-amber-50 p-6 rounded-2xl shadow-lg text-center"
          >
            {card.icon}
            <h3 className="text-xl font-semibold mb-2 text-amber-800">{card.title}</h3>
            <p className="text-gray-700">{card.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
