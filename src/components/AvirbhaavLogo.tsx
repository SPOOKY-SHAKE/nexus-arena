interface AvirbhaavLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const AvirbhaavLogo = ({ size = 'md' }: AvirbhaavLogoProps) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-4xl md:text-5xl',
    lg: 'text-5xl md:text-7xl lg:text-8xl',
  };

  return (
    <div className="flex flex-col items-center" style={{ animation: 'glitchFlicker 4s ease-in-out infinite' }}>
      {/* Flame crown */}
      <svg viewBox="0 0 100 40" className="w-16 md:w-24 mb-2 opacity-80">
        <defs>
          <linearGradient id="flameGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="hsl(0, 100%, 27%)" />
            <stop offset="50%" stopColor="hsl(33, 100%, 50%)" />
            <stop offset="100%" stopColor="hsl(51, 100%, 50%)" />
          </linearGradient>
        </defs>
        <path d="M50 5 C45 15, 35 10, 30 20 C28 25, 32 30, 35 28 C33 32, 38 35, 42 30 C40 35, 45 38, 50 32 C55 38, 60 35, 58 30 C62 35, 67 32, 65 28 C68 30, 72 25, 70 20 C65 10, 55 15, 50 5Z"
          fill="url(#flameGrad)" opacity="0.9" />
      </svg>

      {/* Main text */}
      <h1 className={`font-cinzel font-black ${sizeClasses[size]} golden-text tracking-[0.15em] leading-none`}
        style={{
          textShadow: '0 0 30px hsla(43, 51%, 54%, 0.3), 0 4px 8px hsla(218, 67%, 4%, 0.8)',
          filter: 'drop-shadow(0 2px 4px hsla(25, 76%, 31%, 0.4))',
        }}>
        AVIRBHAAV
      </h1>

      {/* Ornamental line */}
      <div className="flex items-center gap-3 mt-3">
        <svg viewBox="0 0 30 12" className="w-8 opacity-60">
          <ellipse cx="8" cy="6" rx="5" ry="3" fill="none" stroke="hsl(43, 51%, 54%)" strokeWidth="0.8" />
          <ellipse cx="15" cy="6" rx="4" ry="5" fill="none" stroke="hsl(43, 51%, 54%)" strokeWidth="0.6" />
        </svg>
        <div className="w-24 md:w-40 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, hsl(43, 51%, 54%), transparent)' }} />
        <svg viewBox="0 0 30 12" className="w-8 opacity-60 scale-x-[-1]">
          <ellipse cx="8" cy="6" rx="5" ry="3" fill="none" stroke="hsl(43, 51%, 54%)" strokeWidth="0.8" />
          <ellipse cx="15" cy="6" rx="4" ry="5" fill="none" stroke="hsl(43, 51%, 54%)" strokeWidth="0.6" />
        </svg>
      </div>
    </div>
  );
};

export default AvirbhaavLogo;
