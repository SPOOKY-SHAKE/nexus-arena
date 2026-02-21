import React, { useEffect, useRef, useCallback } from 'react';

interface BubbleTextProps {
  children: string;
  className?: string;
  style?: React.CSSProperties;
  tag?: 'h1'|'h2'|'h3'|'h4'|'p'|'span'|'div';
}

const BubbleText = ({ children, className='', style, tag:Tag='div' }: BubbleTextProps) => {
  const containerRef = useRef<HTMLElement>(null);
  const homes = useRef<{x:number;y:number}[]>([]);
  const positions = useRef<{x:number;y:number;vx:number;vy:number}[]>([]);
  const spans = useRef<HTMLSpanElement[]>([]);
  const cursor = useRef({x:-999,y:-999});
  const attract = useRef(false);
  const attractPt = useRef({x:0,y:0});
  const holdTimer = useRef<ReturnType<typeof setTimeout>|null>(null);
  const frameRef = useRef(0);
  const oscOff = useRef<number[]>([]);
  const frameCount = useRef(0);

  const REPEL_R = 88;
  const REPEL_F = 4800;
  const SPRING = 0.062;
  const DAMP = 0.74;
  const ATTRACT_F = 0.13;

  const init = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const els = Array.from(el.querySelectorAll<HTMLSpanElement>('.bc'));
    spans.current = els;
    homes.current = [];
    positions.current = [];
    els.forEach((s, i) => {
      const r = s.getBoundingClientRect();
      const cx = r.left + r.width/2, cy = r.top + r.height/2;
      homes.current[i] = {x:cx, y:cy};
      positions.current[i] = {x:cx, y:cy, vx:0, vy:0};
      oscOff.current[i] = Math.random()*Math.PI*2;
      s.style.transform = 'translate(0px,0px)';
    });
  }, []);

  useEffect(() => {
    const t = setTimeout(init, 420);
    window.addEventListener('resize', init);
    return () => { clearTimeout(t); window.removeEventListener('resize', init); };
  }, [init]);

  useEffect(() => {
    const onMM = (e:MouseEvent) => cursor.current = {x:e.clientX, y:e.clientY};
    const onTM = (e:TouchEvent) => cursor.current = {x:e.touches[0].clientX, y:e.touches[0].clientY};
    const onDown = (e:MouseEvent) => {
      attractPt.current = {x:e.clientX, y:e.clientY};
      holdTimer.current = setTimeout(() => {
        attract.current = true;
        setTimeout(() => { attract.current = false; }, 2600);
      }, 2000);
    };
    const onTStart = (e:TouchEvent) => {
      attractPt.current = {x:e.touches[0].clientX, y:e.touches[0].clientY};
      holdTimer.current = setTimeout(() => {
        attract.current = true;
        setTimeout(() => { attract.current = false; }, 2600);
      }, 2000);
    };
    const clearHold = () => { if (holdTimer.current) clearTimeout(holdTimer.current); };
    window.addEventListener('mousemove', onMM);
    window.addEventListener('touchmove', onTM, {passive:true});
    window.addEventListener('mousedown', onDown);
    window.addEventListener('touchstart', onTStart, {passive:true});
    window.addEventListener('mouseup', clearHold);
    window.addEventListener('touchend', clearHold);
    return () => {
      window.removeEventListener('mousemove', onMM);
      window.removeEventListener('touchmove', onTM);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('touchstart', onTStart);
      window.removeEventListener('mouseup', clearHold);
      window.removeEventListener('touchend', clearHold);
    };
  }, []);

  useEffect(() => {
    const animate = () => {
      frameCount.current++;
      spans.current.forEach((span, i) => {
        if (!homes.current[i]) return;
        let {x, y, vx, vy} = positions.current[i];
        const home = homes.current[i];

        if (attract.current) {
          // ATTRACT toward hold point — bubbles collapse inward
          vx += (attractPt.current.x - x) * ATTRACT_F;
          vy += (attractPt.current.y - y) * ATTRACT_F;
          span.style.boxShadow = '0 0 14px 5px hsla(51,100%,50%,0.85)';
          span.style.background = 'radial-gradient(circle at 35% 35%,hsl(51,100%,82%),hsl(43,51%,54%))';
        } else {
          // REPEL from cursor
          const dx = x - cursor.current.x;
          const dy = y - cursor.current.y;
          const dist = Math.sqrt(dx*dx+dy*dy);
          if (dist < REPEL_R && dist > 0.1) {
            const f = REPEL_F / (dist*dist*dist);
            vx += dx*f; vy += dy*f;
          }
          // Spring back to home
          vx += (home.x - x) * SPRING;
          vy += (home.y - y) * SPRING;
          // Ambient oscillation when near rest
          if (Math.abs(home.x-x) < 4 && Math.abs(home.y-y) < 4) {
            vx += Math.sin(frameCount.current*0.025+oscOff.current[i])*0.28;
            vy += Math.cos(frameCount.current*0.022+oscOff.current[i])*0.28;
          }
          span.style.boxShadow = '0 0 4px 1px hsla(43,51%,54%,0.22),inset 0 0 4px hsla(51,100%,50%,0.12)';
          span.style.background = 'radial-gradient(circle at 35% 35%,hsla(51,100%,72%,0.88),hsla(43,51%,54%,0.72) 60%,hsla(25,76%,31%,0.38))';
        }

        vx *= DAMP; vy *= DAMP;
        const spd = Math.sqrt(vx*vx+vy*vy);
        if (spd > 22) { vx=(vx/spd)*22; vy=(vy/spd)*22; }
        x += vx; y += vy;
        positions.current[i] = {x, y, vx, vy};
        span.style.transform = `translate(${(x-home.x).toFixed(1)}px,${(y-home.y).toFixed(1)}px)`;
      });
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  const chars = children.split('');

  return (
    <Tag
      ref={containerRef as React.RefObject<any>}
      className={`bubble-text-wrap ${className}`}
      style={{ display:'inline-flex', flexWrap:'wrap', gap:0, position:'relative', ...style }}
    >
      {chars.map((ch, i) => (
        <span key={i} className="bc" style={{
          display:'inline-flex', alignItems:'center', justifyContent:'center',
          width: ch===' ' ? '0.38em' : '1.05em',
          height: ch===' ' ? '1em' : '1.05em',
          borderRadius: ch===' ' ? '0' : '50%',
          background: ch===' ' ? 'transparent' : 'radial-gradient(circle at 35% 35%,hsla(51,100%,72%,0.88),hsla(43,51%,54%,0.72) 60%,hsla(25,76%,31%,0.38))',
          border: ch===' ' ? 'none' : '1px solid hsla(43,51%,54%,0.32)',
          boxShadow: ch===' ' ? 'none' : '0 0 4px 1px hsla(43,51%,54%,0.22),inset 0 0 4px hsla(51,100%,50%,0.12)',
          color: 'hsl(51,100%,90%)',
          fontSize: 'inherit', fontFamily: 'inherit', fontWeight: 'inherit',
          letterSpacing: 0,
          willChange: 'transform',
          transition: 'background 0.3s,box-shadow 0.3s',
          userSelect: 'none',
        }}>
          {ch}
        </span>
      ))}
    </Tag>
  );
};

export default BubbleText;
