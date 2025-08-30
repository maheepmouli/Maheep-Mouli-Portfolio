import React from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Portfolio from '@/components/Portfolio';

const PortfolioPage = () => {
  // Page transition variants with size morphing
  const pageVariants = {
    initial: {
      opacity: 0,
      scale: 0.95,
      y: 20
    },
    in: {
      opacity: 1,
      scale: 1,
      y: 0
    },
    out: {
      opacity: 0,
      scale: 1.05,
      y: -20
    }
  };

  const pageTransition = {
    type: "tween" as const,
    ease: "anticipate" as const,
    duration: 0.6
  };

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={{ 
        cursor: 'default',
        pointerEvents: 'auto'
      }}
    >
      <Navigation />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.8, 
          delay: 0.2,
          ease: "easeOut"
        }}
        style={{ 
          cursor: 'default',
          pointerEvents: 'auto'
        }}
      >
        <Portfolio />
      </motion.div>
    </motion.div>
  );
};

export default PortfolioPage; 