import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * ScrollProgressBar Component
 * Displays an ultra-sleek gradient reading progress bar at the very top of the screen.
 * Uses Framer Motion's useScroll with physics spring for smooth tracking.
 */
export const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-50 pointer-events-none bg-transparent">
      <motion.div
        className="h-full bg-gradient-to-r from-[#6366F1] via-[#3B82F6] to-[#38BDF8] shadow-sm shadow-indigo-500/50 origin-left"
        style={{ scaleX }}
      />
    </div>
  );
};
