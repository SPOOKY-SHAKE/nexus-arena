import React from 'react';

const MandalaFlower = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ animation: 'breathe 8s ease-in-out infinite' }}>
    <div className="relative w-[70vh] h-[70vh] max-w-[90vw] max-h-[90vw]">
      {/* Outer ring */}
      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full" style={{ animation: 'spinSlow 80s linear infinite' }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <ellipse key={i} cx="200" cy="70" rx="22" ry="65" fill="none"
            stroke="hsl(43, 51%, 54%)" strokeWidth="0.8" opacity="0.6"
            transform={`rotate(${i * 30} 200 200)`} />
        ))}
      </svg>
      {/* Middle ring */}
      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full" style={{ animation: 'spinSlowReverse 55s linear infinite' }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <ellipse key={i} cx="200" cy="115" rx="16" ry="45" fill="none"
            stroke="hsl(51, 100%, 50%)" strokeWidth="0.5" opacity="0.4"
            transform={`rotate(${i * 30 + 15} 200 200)`} />
        ))}
      </svg>
      {/* Inner ring */}
      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full" style={{ animation: 'spinSlow 35s linear infinite' }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <ellipse key={i} cx="200" cy="155" rx="10" ry="28" fill="none"
            stroke="hsl(43, 51%, 54%)" strokeWidth="0.6" opacity="0.5"
            transform={`rotate(${i * 45} 200 200)`} />
        ))}
        <circle cx="200" cy="200" r="8" fill="none" stroke="hsl(51, 100%, 50%)" strokeWidth="0.5" opacity="0.4" />
      </svg>
    </div>
  </div>
);

const AnimatedBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-background" />
    <div className="fire-layer" />
    <div className="fog-layer" />
    <div className="fog-layer-2" />
    <MandalaFlower />
  </div>
);

export default AnimatedBackground;
