import React from 'react';
import { motion } from 'framer-motion';
import { Sparkle, Users, Leaf, School, Heart, Globe2 } from 'lucide-react';

const beaconValues = [
  {
    letter: 'B',
    title: 'Beauty in Authenticity',
    description:
      'We stay true to traditional, indigenous knowledge and let it shine through everything we do.',
    icon: <Sparkle className="w-8 h-8 text-green-700" />, 
  },
  {
    letter: 'E',
    title: 'Empowerment for All',
    description:
      'We create spaces where women, children, students, and global guests feel valued, skilled, and inspired.',
    icon: <Users className="w-8 h-8 text-green-700" />,
  },
  {
    letter: 'A',
    title: 'Artisan Craftsmanship',
    description:
      'Every product and experience reflects care, quality, and handmade excellence.',
    icon: <Sparkle className="w-8 h-8 text-green-700" />,
  },
  {
    letter: 'C',
    title: 'Care for the Earth',
    description:
      'We practice sustainability through ethical sourcing, eco-friendly methods, and respect for nature.',
    icon: <Leaf className="w-8 h-8 text-green-700" />,
  },
  {
    letter: 'O',
    title: 'Open, Joyful Learning',
    description:
      'We make learning fun, hands-on, and memorable — for every age and every background.',
    icon: <School className="w-8 h-8 text-green-700" />,
  },
  {
    letter: 'N',
    title: 'Nurturing Communities',
    description:
      'We build impact by supporting livelihoods, celebrating culture, and strengthening families.',
    icon: <Heart className="w-8 h-8 text-green-700" />,
  },
];

export default function BeaconAcronynm() {
  return (
    <section className="py-16 bg-white text-gray-800">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold mb-4"
        >
          BEACON: Lighting the Way with Purpose
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-gray-600 mb-10"
        >
          Each letter in BEACON reflects a guiding principle of our mission and vision.
        </motion.p>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {beaconValues.map((item, index) => (
            <motion.div
              key={item.letter}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-green-50 p-6 rounded-2xl shadow hover:shadow-md transition"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="text-2xl font-bold text-green-800">{item.letter}</div>
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold text-green-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <h3 className="text-2xl font-semibold text-green-900 mb-4">Join the Movement</h3>
          <p className="text-gray-700 max-w-2xl mx-auto mb-6">
            Be a part of Sign Natural Academy’s journey. Enroll in a workshop, book a community experience, or partner with us to empower lives and preserve tradition.
          </p>
          <button className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-full font-semibold transition">
            Explore Workshops
          </button>
        </motion.div>
      </div>
    </section>
  );
}
