import { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number; vx: number; vy: number;
  alpha: number; size: number; color: string;
  phase: 'trail' | 'burst' | 'ember';
  age: number; maxAge: number;
}

const COLS = [
  'hsl(51,100%,62%)','hsl(43,51%,72%)','hsl(33,100%,62%)',
  'hsl(0,73%,62%)','hsl(43,51%,90%)','hsl(51,100%,82%)',
];

const ExplosionEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const parts = useRef<Particle[]>([]);
  const frameRef = useRef(0);
  const mousePos = useRef({ x: window.innerWidth/2, y: window.innerHeight/2 });
  const stillTimer = useRef<ReturnType<typeof setTimeout>|null>(null);

  const explode = (ox: number, oy: number) => {
    const rockets = 2;
    for (let r = 0; r < rockets; r++) {
      setTimeout(() => {
        const bx = ox + (Math.random()-0.5)*130;
        const by = oy - 180 - Math.random()*160;
        const col = COLS[Math.floor(Math.random()*COLS.length)];
        const steps = 30;
        parts.current.push({
          x: ox+(Math.random()-0.5)*18, y: oy,
          vx:(bx-ox)/steps, vy:(by-oy)/steps,
          alpha:1, size:2.5, color:col,
          phase:'trail', age:0, maxAge:steps,
        });
        setTimeout(() => {
          const burstN = 16 + Math.floor(Math.random() * 6);
          for (let b=0; b<burstN; b++) {
            const ang = (b/burstN)*Math.PI*2;
            const spd = 2.5 + Math.random()*3.5;
            parts.current.push({
              x:bx, y:by, vx:Math.cos(ang)*spd, vy:Math.sin(ang)*spd*0.72,
              alpha:1, size:1.8+Math.random()*1.8, color:col,
              phase:'burst', age:0, maxAge:55+Math.floor(Math.random()*25),
            });
          }
          for (let e=0; e<12; e++) {
            const ang = Math.random()*Math.PI*2;
            parts.current.push({
              x:bx+(Math.random()-0.5)*28, y:by+(Math.random()-0.5)*18,
              vx:Math.cos(ang)*0.5, vy:-0.4+Math.random()*0.3,
              alpha:0.9, size:1+Math.random()*1.5,
              color:COLS[Math.floor(Math.random()*COLS.length)],
              phase:'ember', age:0, maxAge:90+Math.floor(Math.random()*42),
            });
          }
        }, 300);
      }, r*120);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => { canvas.width=window.innerWidth; canvas.height=window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const rearm = () => {
      if (stillTimer.current) clearTimeout(stillTimer.current);
      stillTimer.current = setTimeout(() => {
        explode(mousePos.current.x, mousePos.current.y);
        stillTimer.current = setTimeout(()=>explode(mousePos.current.x, mousePos.current.y), 2200);
      }, 2400);
    };

    const onMove = (e: MouseEvent|TouchEvent) => {
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
      mousePos.current = { x, y };
      rearm();
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove as EventListener, { passive:true });

    const ctx = canvas.getContext('2d')!;
    const G = 0.055;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (parts.current.length > 60) parts.current = parts.current.slice(-60);
      parts.current = parts.current.filter(p => p.alpha > 0.02 && p.age < p.maxAge);

      for (const p of parts.current) {
        p.age++;
        if (p.phase === 'trail') {
          p.x += p.vx; p.y += p.vy;
          p.alpha = 1 - p.age/p.maxAge;
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.shadowBlur = 8; ctx.shadowColor = p.color;
          ctx.fillStyle = p.color;
          ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill();
          ctx.strokeStyle = p.color; ctx.lineWidth = 1;
          ctx.globalAlpha = p.alpha*0.4;
          ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(p.x-p.vx*5,p.y-p.vy*5); ctx.stroke();
          ctx.restore();
        } else if (p.phase === 'burst') {
          p.vy += G; p.vx *= 0.97; p.vy *= 0.97;
          p.x += p.vx; p.y += p.vy;
          p.alpha = Math.max(0, 1 - Math.pow(p.age/p.maxAge,1.4));
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.shadowBlur = 10; ctx.shadowColor = p.color;
          ctx.fillStyle = p.color;
          ctx.beginPath(); ctx.arc(p.x,p.y,p.size*(1-p.age/p.maxAge*0.5),0,Math.PI*2); ctx.fill();
          if (p.age < 14) {
            ctx.globalAlpha = p.alpha*0.45; ctx.strokeStyle = p.color; ctx.lineWidth = 0.8;
            const s = p.size*2;
            ctx.beginPath(); ctx.moveTo(p.x-s,p.y); ctx.lineTo(p.x+s,p.y);
            ctx.moveTo(p.x,p.y-s); ctx.lineTo(p.x,p.y+s); ctx.stroke();
          }
          ctx.restore();
        } else {
          p.vy += G*0.38;
          p.x += p.vx + Math.sin(p.age*0.2)*0.28; p.y += p.vy;
          p.alpha = Math.max(0, 0.9 - Math.pow(p.age/p.maxAge,1.2));
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.shadowBlur = 6; ctx.shadowColor = p.color;
          ctx.fillStyle = p.color;
          ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill();
          ctx.restore();
        }
      }
      frameRef.current = requestAnimationFrame(render);
    };
    frameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove as EventListener);
      cancelAnimationFrame(frameRef.current);
      if (stillTimer.current) clearTimeout(stillTimer.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex:5 }} aria-hidden="true" />;
};

export default ExplosionEffect;
