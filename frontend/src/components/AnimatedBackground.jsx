import React from 'react';

const emojis = [
  '😊', '🌸', '💫', '🌿', '✨', '🦋', '😌', '🌻', '🌈', '☁️',
  '🌼', '🌺', '🍀', '🍃', '🌞', '🧘‍♂️', '🧘‍♀️', '🌷', '🌠', '🌤️',
  '🥰', '😇', '😴', '🫶', '🤗', '🌹', '🍄', '🌾', '🦄', '🌙'
];

// Predefined positions for 30 emojis to avoid overlap
const positions = [
  { left: '5%', top: '10%' },
  { left: '15%', top: '20%' },
  { left: '25%', top: '8%' },
  { left: '35%', top: '15%' },
  { left: '45%', top: '12%' },
  { left: '55%', top: '18%' },
  { left: '65%', top: '10%' },
  { left: '75%', top: '22%' },
  { left: '85%', top: '15%' },
  { left: '92%', top: '25%' },
  
  { left: '8%', top: '40%' },
  { left: '20%', top: '50%' },
  { left: '35%', top: '45%' },
  { left: '50%', top: '55%' },
  { left: '65%', top: '42%' },
  { left: '78%', top: '50%' },
  { left: '90%', top: '45%' },
  
  { left: '10%', top: '70%' },
  { left: '22%', top: '75%' },
  { left: '32%', top: '68%' },
  { left: '42%', top: '78%' },
  { left: '55%', top: '72%' },
  { left: '68%', top: '75%' },
  { left: '80%', top: '70%' },
  { left: '92%', top: '78%' },
  
  { left: '12%', top: '88%' },
  { left: '28%', top: '92%' },
  { left: '48%', top: '90%' },
  { left: '70%', top: '88%' },
  { left: '88%', top: '92%' }
];

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Bright gradient background */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #f0fff4 100%)',
          opacity: 0.85,
          zIndex: -1,
        }}
      />
      {/* Floating emojis */}
      {emojis.map((emoji, idx) => (
        <span
          key={idx}
          className="absolute text-2xl md:text-3xl opacity-25 animate-float"
          style={{
            ...positions[idx],
            animationDuration: `${12 + Math.random() * 8}s`,
            animationDelay: `${Math.random() * 5}s`,
            filter: 'drop-shadow(0 2px 8px rgba(255,255,255,0.5))',
            userSelect: 'none',
            pointerEvents: 'none'
          }}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}