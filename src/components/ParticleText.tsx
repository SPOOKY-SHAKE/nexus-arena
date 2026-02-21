import { useEffect, useRef } from 'react';

interface ParticleTextProps {
  text: string;
  fontSize?: number;
  color?: string;
  className?: string;
  height?: number;
}

interface Dot {
  x: number; y: number;        // current
  hx: number; hy: number;      // home (letter position)
  vx: number; vy: number;
  size: number;
  alpha: number;
  phase: number;               // oscillation phase
}

// Render text to a hidden canvas, sample pixel positions → dot positions
const sampleTextPositions = (text: string, fontSize: number, W: number, H: number): {x:number;y:number}[] => {
  const offscreen = document.createElement('canvas');
  offscreen.width = W; offscreen.height = H;
  const ctx = offscreen.getContext('2d')!;
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${fontSize}px 'Bebas Neue', sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, W / 2, H / 2);
  const data = ctx.getImageData(0, 0, W, H).data;
  const positions: {x:number;y:number}[] = [];
  const gap = Math.max(3, Math.floor(fontSize / 14));
  for (let y = 0; y < H; y += gap) {
    for (let x = 0; x < W; x += gap) {
      const idx = (y * W + x) * 4;
      if (data[idx + 3] > 128) positions.push({ x, y });
    }
  }
  return positions;
};

const ParticleText = ({ text, fontSize = 64, color = 'hsl(43,51%,54%)', className = '', height = 120 }: ParticleTextProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const frameRef = useRef(0);
  const cursorRef = useRef({ x: -999, y: -999 });
  const clickRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const REPEL_R = 80;
  const REPEL_F = 5000;
  const SPRING = 0.07;
  const DAMP = 0.72;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.width = canvas.offsetWidth || 600;
    const H = canvas.height = height;

    const positions = sampleTextPositions(text, fontSize, W, H);
    if (!positions.length) return;

    // Create dots — start scattered, settle to letter positions
    dotsRef.current = positions.map((p, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      hx: p.x, hy: p.y,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      size: 1.5 + Math.random() * 1.5,
      alpha: 0.6 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2,
    }));

    const ctx = canvas.getContext('2d')!;
    let t = 0;

    // Parse color to RGBA
    const parseColor = (c: string) => {
      const d = document.createElement('div');
      d.style.color = c; document.body.appendChild(d);
      const cs = getComputedStyle(d).color; document.body.removeChild(d);
      const m = cs.match(/\d+/g); return m ? [+m[0],+m[1],+m[2]] : [201,168,76];
    };
    const [r,g,b] = parseColor(color);

    const render = () => {
      t++;
      ctx.clearRect(0, 0, W, H);
      const dots = dotsRef.current;
      const rect = canvas.getBoundingClientRect();
      const cx = cursorRef.current.x - rect.left;
      const cy = cursorRef.current.y - rect.top;

      for (const d of dots) {
        // Repel from cursor
        const dx = d.x - cx, dy = d.y - cy;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if (dist < REPEL_R && dist > 0.1) {
          const f = REPEL_F / (dist*dist*dist);
          d.vx += dx*f; d.vy += dy*f;
        }

        // Explosion on click
        if (clickRef.current) {
          d.vx += (Math.random()-0.5)*20;
          d.vy += (Math.random()-0.5)*20;
        }

        // Spring toward home + oscillation
        d.vx += (d.hx - d.x) * SPRING + Math.sin(t*0.02+d.phase)*0.3;
        d.vy += (d.hy - d.y) * SPRING + Math.cos(t*0.018+d.phase)*0.3;
        d.vx *= DAMP; d.vy *= DAMP;
        d.x += d.vx; d.y += d.vy;

        // Draw dot with glow
        const glowFactor = 1 + 0.4*Math.sin(t*0.04+d.phase);
        ctx.save();
        ctx.globalAlpha = d.alpha;
        ctx.shadowBlur = 6 * glowFactor;
        ctx.shadowColor = `rgba(${r},${g},${b},0.6)`;
        ctx.fillStyle = `rgba(${r},${g},${b},1)`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size * glowFactor * 0.8, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
      }

      clickRef.current = false;
      frameRef.current = requestAnimationFrame(render);
    };
    frameRef.current = requestAnimationFrame(render);

    // Events
    const onMove = (e: MouseEvent) => { cursorRef.current = { x: e.clientX, y: e.clientY }; };
    const onClick = () => { clickRef.current = true; };
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('click', onClick);

    return () => {
      cancelAnimationFrame(frameRef.current);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('click', onClick);
    };
  }, [text, fontSize, color, height]);

  return (
    <div ref={containerRef} className={`w-full relative ${className}`} style={{ height }}>
      <canvas ref={canvasRef} style={{ width:'100%', height:'100%', display:'block', cursor:'none' }} />
    </div>
  );
};

export default ParticleText;
