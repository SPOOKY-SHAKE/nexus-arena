import { useState, useEffect, useRef, useCallback } from 'react';

const CustomCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [smoothPos, setSmoothPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [clicks, setClicks] = useState<{ x: number; y: number; id: number }[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const frameRef = useRef<number>(0);
  const posRef = useRef({ x: -100, y: -100 });
  const smoothRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    setIsMobile(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      setPos({ x: e.clientX, y: e.clientY });
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], input, textarea, select, .interactive')) {
        setIsHovering(true);
      }
    };
    const onOut = () => setIsHovering(false);

    const onClick = (e: MouseEvent) => {
      const id = Date.now();
      setClicks(prev => [...prev.slice(-5), { x: e.clientX, y: e.clientY, id }]);
      setTimeout(() => setClicks(prev => prev.filter(c => c.id !== id)), 600);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mouseout', onOut);
    window.addEventListener('click', onClick);

    const animate = () => {
      smoothRef.current = {
        x: smoothRef.current.x + (posRef.current.x - smoothRef.current.x) * 0.12,
        y: smoothRef.current.y + (posRef.current.y - smoothRef.current.y) * 0.12,
      };
      setSmoothPos({ ...smoothRef.current });
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mouseout', onOut);
      window.removeEventListener('click', onClick);
      cancelAnimationFrame(frameRef.current);
    };
  }, [isMobile]);

  if (isMobile) return null;

  const outerSize = isHovering ? 56 : 40;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      {/* Outer ring */}
      <div
        className="absolute rounded-full border transition-[width,height] duration-200"
        style={{
          width: outerSize,
          height: outerSize,
          left: smoothPos.x - outerSize / 2,
          top: smoothPos.y - outerSize / 2,
          borderColor: 'hsl(43, 51%, 54%)',
          backgroundColor: isHovering ? 'hsla(43, 51%, 54%, 0.1)' : 'transparent',
        }}
      />
      {/* Inner dot */}
      <div
        className="absolute rounded-full"
        style={{
          width: 6,
          height: 6,
          left: pos.x - 3,
          top: pos.y - 3,
          backgroundColor: 'hsl(51, 100%, 50%)',
          boxShadow: '0 0 8px hsla(51, 100%, 50%, 0.5)',
        }}
      />
      {/* Click particles */}
      {clicks.map(click => (
        Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`${click.id}-${i}`}
            className="absolute rounded-full"
            style={{
              width: 3,
              height: 3,
              left: click.x,
              top: click.y,
              backgroundColor: 'hsl(51, 100%, 50%)',
              animation: `particle-${i} 0.5s ease-out forwards`,
            }}
          />
        ))
      ))}
      <style>{`
        ${Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          const dist = 30;
          return `@keyframes particle-${i} {
            0% { transform: translate(0, 0); opacity: 1; }
            100% { transform: translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px); opacity: 0; }
          }`;
        }).join('\n')}
      `}</style>
    </div>
  );
};

export default CustomCursor;
