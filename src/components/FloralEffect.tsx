import { useEffect, useRef } from 'react';

interface Petal {
  x: number; y: number; size: number;
  rotation: number; rotSpeed: number;
  vx: number; vy: number;
  sineOff: number; sineAmp: number;
  alpha: number; colorIdx: number;
  flipAngle: number; flipSpeed: number;
}

const PCOLS = [
  'hsla(43,51%,54%,', 'hsla(51,100%,50%,',
  'hsla(33,100%,50%,', 'hsla(43,51%,72%,', 'hsla(25,76%,42%,',
];

const mkPetal = (W: number, scatterY = false): Petal => ({
  x: Math.random()*W, y: scatterY ? Math.random()*window.innerHeight : -20-Math.random()*80,
  size: 6+Math.random()*10, rotation: Math.random()*Math.PI*2,
  rotSpeed: (Math.random()-0.5)*0.04, vx: (Math.random()-0.5)*0.55,
  vy: 0.8+Math.random()*1.2, sineOff: Math.random()*Math.PI*2,
  sineAmp: 30+Math.random()*52, alpha: 0.55+Math.random()*0.38,
  colorIdx: Math.floor(Math.random()*PCOLS.length),
  flipAngle: Math.random()*Math.PI*2, flipSpeed: (Math.random()-0.5)*0.05,
});

const drawPetal = (ctx: CanvasRenderingContext2D, p: Petal) => {
  const scaleX = Math.cos(p.flipAngle);
  const eff = p.alpha*(0.5+0.5*Math.abs(scaleX));
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.scale(scaleX, 1);
  const col = PCOLS[p.colorIdx];
  const g = ctx.createRadialGradient(0,-p.size*0.3,0,0,0,p.size);
  g.addColorStop(0, `${col}${eff})`);
  g.addColorStop(0.6, `${col}${eff*0.65})`);
  g.addColorStop(1, `${col}0)`);
  ctx.fillStyle = g;
  ctx.shadowBlur = 4; ctx.shadowColor = `${col}0.25)`;
  ctx.beginPath();
  ctx.moveTo(0,-p.size);
  ctx.bezierCurveTo(p.size*0.55,-p.size*0.5,p.size*0.55,p.size*0.3,0,p.size*0.5);
  ctx.bezierCurveTo(-p.size*0.55,p.size*0.3,-p.size*0.55,-p.size*0.5,0,-p.size);
  ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(0,-p.size*0.88); ctx.lineTo(0,p.size*0.33);
  ctx.strokeStyle = `${col}${eff*0.35})`; ctx.lineWidth = 0.5; ctx.stroke();
  ctx.restore();
};

const drawMandala = (ctx: CanvasRenderingContext2D, cx: number, cy: number, t: number) => {
  const rings = [
    { n:12, R:162, sz:72, spd:0.003, ca:'hsla(43,51%,54%,', cb:'hsla(51,100%,50%,', ph:0 },
    { n:10, R:96,  sz:50, spd:-0.005, ca:'hsla(33,100%,50%,', cb:'hsla(43,51%,54%,', ph:Math.PI/10 },
    { n:8,  R:55,  sz:32, spd:0.008, ca:'hsla(51,100%,62%,', cb:'hsla(43,51%,54%,', ph:0 },
  ];
  rings.forEach(ring => {
    const angle = t * ring.spd;
    for (let i=0; i<ring.n; i++) {
      const theta = angle + ring.ph + (i/ring.n)*Math.PI*2;
      const pulse = 0.85 + 0.15*Math.sin(t*0.02 + i*(Math.PI*2/ring.n));
      const sz = ring.sz * pulse;
      const tx = cx + Math.cos(theta)*ring.R*pulse;
      const ty = cy + Math.sin(theta)*ring.R*pulse;
      const al = 0.11 + 0.055*Math.sin(t*0.015+i);
      ctx.save();
      ctx.translate(tx, ty); ctx.rotate(theta+Math.PI/2);
      const g = ctx.createLinearGradient(0,-sz,0,sz*0.5);
      g.addColorStop(0, `${ring.ca}${al})`);
      g.addColorStop(0.5, `${ring.cb}${al*0.78})`);
      g.addColorStop(1, `${ring.ca}0)`);
      ctx.fillStyle = g;
      ctx.shadowBlur = 8; ctx.shadowColor = `${ring.ca}0.12)`;
      ctx.beginPath();
      ctx.moveTo(0,-sz);
      ctx.bezierCurveTo(sz*0.5,-sz*0.4,sz*0.5,sz*0.3,0,sz*0.5);
      ctx.bezierCurveTo(-sz*0.5,sz*0.3,-sz*0.5,-sz*0.4,0,-sz);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = `${ring.ca}${al*0.45})`; ctx.lineWidth = 0.5; ctx.stroke();
      ctx.restore();
    }
  });
  const jp = 0.7 + 0.3*Math.sin(t*0.025);
  const jg = ctx.createRadialGradient(cx,cy,0,cx,cy,18*jp);
  jg.addColorStop(0,'hsla(51,100%,72%,0.38)');
  jg.addColorStop(0.5,'hsla(43,51%,54%,0.18)');
  jg.addColorStop(1,'hsla(43,51%,54%,0)');
  ctx.beginPath(); ctx.arc(cx,cy,18*jp,0,Math.PI*2);
  ctx.fillStyle = jg; ctx.fill();
};

const FloralEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const petalsRef = useRef<Petal[]>([]);
  const frameRef = useRef(0);
  const t = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => { canvas.width=window.innerWidth; canvas.height=window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    // Scatter initial petals across screen
    for (let i=0; i<24; i++) petalsRef.current.push(mkPetal(canvas.width, true));

    const ctx = canvas.getContext('2d')!;
    const render = () => {
      t.current++;
      ctx.clearRect(0,0,canvas.width,canvas.height);
      drawMandala(ctx, canvas.width/2, canvas.height/2, t.current);

      if (t.current % 20 === 0 && petalsRef.current.length < 32)
        petalsRef.current.push(mkPetal(canvas.width));

      petalsRef.current = petalsRef.current.filter(p => p.y < canvas.height+30 && p.alpha > 0.04);

      for (const p of petalsRef.current) {
        p.x += p.vx + Math.sin(t.current*0.018+p.sineOff)*0.58;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.flipAngle += p.flipSpeed;
        const distBot = canvas.height - p.y;
        if (distBot < 80) p.alpha *= 0.975;
        drawPetal(ctx, p);
      }
      frameRef.current = requestAnimationFrame(render);
    };
    frameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex:2 }} aria-hidden="true" />;
};

export default FloralEffect;
