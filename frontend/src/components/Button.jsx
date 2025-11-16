import React from 'react';
import { motion } from 'framer-motion';
import { Video as LucideIcon } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className = '',
  onClick,
  type = 'button',
  disabled = false,
}) {
  const baseClasses =
    'rounded-lg px-4 py-2 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary:
      'bg-gradient-to-r from-pastel-lavender-500 to-pastel-blue-500 text-white hover:from-pastel-lavender-600 hover:to-pastel-blue-600 focus:ring-pastel-lavender-500 shadow-lg hover:shadow-xl',
    secondary:
      'bg-gradient-to-r from-pastel-mint-400 to-pastel-mint-500 text-white hover:from-pastel-mint-500 hover:to-pastel-mint-600 focus:ring-pastel-mint-400 shadow-lg hover:shadow-xl',
    outline:
      'border-2 border-pastel-lavender-300 text-pastel-lavender-600 hover:bg-pastel-lavender-50 focus:ring-pastel-lavender-500',
    ghost:
      'text-gray-600 hover:text-pastel-lavender-600 hover:bg-pastel-lavender-50 focus:ring-pastel-lavender-500',
  };

  const sizes = {
    sm: 'text-sm space-x-1',
    md: 'text-sm space-x-2',
    lg: 'text-base space-x-2',
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span>{children}</span>
    </motion.button>
  );
}