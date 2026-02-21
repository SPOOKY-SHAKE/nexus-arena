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

const RayLight = ({ x, y, angle, length, color, delay = '0s', duration = '4s' }: {
  x:number; y:number; angle:number; length:number; color:string; delay?:string; duration?:string;
}) => (
  <div style={{ position:'absolute', left:`${x}%`, top:`${y}%`, width:`${length}px`, height:'2px',
    background:`linear-gradient(90deg, ${color}, transparent)`,
    transform:`rotate(${angle}deg)`,
    transformOrigin:'0 50%',
    opacity:0, animation:`rayPulse ${duration} ease-in-out ${delay} infinite alternate`,
    filter:'blur(1px)',
  }} />
);

const VolumetricLayer = () => (
  <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
    {/* God rays from top center */}
    {[...Array(8)].map((_,i) => (
      <RayLight key={i}
        x={42+i*2} y={0}
        angle={95+i*4}
        length={400+i*60}
        color={`hsla(${i%2===0?43:51},${i%2===0?51:100}%,${i%2===0?54:60}%,0.12)`}
        delay={`${i*0.3}s`}
        duration={`${5+i*0.8}s`}
      />
    ))}
    {/* Volumetric orbs — depth spheres */}
    {[
      { x:15, y:30, r:200, c:'hsla(33,100%,50%,0.04)' },
      { x:82, y:65, r:180, c:'hsla(0,73%,40%,0.035)' },
      { x:50, y:80, r:280, c:'hsla(43,51%,54%,0.03)' },
      { x:8,  y:75, r:150, c:'hsla(215,65%,30%,0.06)' },
      { x:92, y:20, r:160, c:'hsla(215,60%,25%,0.05)' },
    ].map((o,i) => (
      <div key={i} style={{ position:'absolute', left:`${o.x}%`, top:`${o.y}%`,
        width:`${o.r}px`, height:`${o.r}px`,
        borderRadius:'50%',
        background:`radial-gradient(circle, ${o.c} 0%, transparent 70%)`,
        transform:'translate(-50%,-50%)',
        animation:`breathe ${8+i*2}s ease-in-out ${i*1.2}s infinite alternate`,
        filter:`blur(${20+i*8}px)`,
      }} />
    ))}
    {/* Caustic light patterns — subtle shimmer grid */}
    <div style={{ position:'absolute', inset:0,
      backgroundImage:`radial-gradient(ellipse at 30% 40%, hsla(43,51%,54%,0.025) 0%, transparent 45%),
        radial-gradient(ellipse at 70% 60%, hsla(51,100%,50%,0.02) 0%, transparent 40%),
        radial-gradient(ellipse at 50% 90%, hsla(33,100%,50%,0.03) 0%, transparent 35%)`,
      animation:'fogDrift 20s ease-in-out infinite alternate',
    }} />
    {/* Depth haze overlay */}
    <div style={{ position:'absolute', inset:0,
      background:'linear-gradient(135deg, hsla(218,67%,4%,0.2) 0%, transparent 50%, hsla(218,67%,4%,0.15) 100%)',
    }} />
    {/* Fine particle dust — 20 tiny floating specks */}
    {[...Array(20)].map((_,i) => (
      <div key={`dust-${i}`} style={{ position:'absolute',
        left:`${Math.random()*100}%`, top:`${Math.random()*100}%`,
        width:'2px', height:'2px', borderRadius:'50%',
        background:`hsla(43,51%,54%,${0.15+i%4*0.05})`,
        animation:`floatUp ${4+i%5}s ease-in-out ${i*0.4}s infinite alternate`,
        filter:'blur(0.5px)',
      }} />
    ))}
  </div>
);

const AnimatedBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-background" />
    {/* Fire + fog layers (existing) */}
    <div className="fire-layer" />
    <div className="fog-layer" />
    <div className="fog-layer-2" />
    {/* Ray-traced enhancement layers */}
    <VolumetricLayer />
    {/* Mandala (existing) */}
    <MandalaFlower />
  </div>
);

export default AnimatedBackground;
