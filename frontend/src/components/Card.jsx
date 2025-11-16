import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  gradient = false 
}) => {
  const baseClasses = `rounded-2xl shadow-lg transition-all duration-300 ${
    gradient 
      ? 'bg-gradient-to-br from-white via-pastel-blue-50/30 to-pastel-lavender-50/30' 
      : 'bg-white/70 backdrop-blur-sm'
  }`;
  
  const hoverClasses = hover ? 'hover:shadow-xl hover:-translate-y-1' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -4, scale: 1.02 } : {}}
      className={`${baseClasses} ${hoverClasses} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;