import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Play, RotateCcw } from 'lucide-react';

interface Obstacle {
  id: number;
  lane: number;
  y: number;
  type: 'car' | 'barrier' | 'cone';
}

interface Billboard {
  id: number;
  y: number;
  side: 'left' | 'right';
  sponsor: { name: string; tagline: string; info: string };
  passed: boolean;
}

interface Notification {
  id: number;
  sponsor: { name: string; tagline: string; info: string };
  timer: number;
}

const SPONSORS = [
  { name: 'PRESTIGE GLOBAL', tagline: 'Building Tomorrow\'s Justice', info: 'India\'s premier legal infrastructure partner, supporting law education since 2005.' },
  { name: 'LEXIS NEXIS', tagline: 'Legal Research Redefined', info: 'The world\'s leading legal research platform powering over 1 million legal professionals.' },
  { name: 'MANUPATRA', tagline: 'India\'s Leading Legal Database', info: 'Comprehensive Indian legal database with case laws, statutes, and expert commentary.' },
  { name: 'SCC ONLINE', tagline: 'Supreme Court Cases', info: 'The most cited legal resource in Indian courts, trusted by judges nationwide.' },
  { name: 'EASTERN BOOK CO.', tagline: 'Since 1940', info: 'Eight decades of publishing excellence in Indian legal literature and resources.' },
  { name: 'CLT INDIA', tagline: 'Legal Excellence', info: 'Committed to fostering legal talent through research grants and scholarships.' },
];

const LANE_POSITIONS = [25, 50, 75]; // percentage positions for 3 lanes

const HighwayCarGame = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'over'>('idle');
  const [playerLane, setPlayerLane] = useState(1);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(sessionStorage.getItem('highwayHighScore') || '0');
  });
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [speed, setSpeed] = useState(3);

  const frameRef = useRef(0);
  const obstacleIdRef = useRef(0);
  const billboardIdRef = useRef(0);
  const notifIdRef = useRef(0);
  const lastObstacleRef = useRef(0);
  const lastBillboardRef = useRef(0);
  const gameLoopRef = useRef<number | null>(null);
  const speedRef = useRef(3);
  const scoreRef = useRef(0);
  const playerLaneRef = useRef(1);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const billboardsRef = useRef<Billboard[]>([]);
  const gameStateRef = useRef<'idle' | 'playing' | 'over'>('idle');

  const startGame = useCallback(() => {
    setGameState('playing');
    gameStateRef.current = 'playing';
    setPlayerLane(1);
    playerLaneRef.current = 1;
    setScore(0);
    scoreRef.current = 0;
    setSpeed(3);
    speedRef.current = 3;
    setObstacles([]);
    obstaclesRef.current = [];
    setBillboards([]);
    billboardsRef.current = [];
    setNotifications([]);
    frameRef.current = 0;
    lastObstacleRef.current = 0;
    lastBillboardRef.current = 0;
  }, []);

  const endGame = useCallback(() => {
    setGameState('over');
    gameStateRef.current = 'over';
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    const finalScore = scoreRef.current;
    if (finalScore > highScore) {
      setHighScore(finalScore);
      sessionStorage.setItem('highwayHighScore', String(finalScore));
    }
  }, [highScore]);

  const changeLane = useCallback((dir: number) => {
    if (gameStateRef.current !== 'playing') return;
    const newLane = Math.max(0, Math.min(2, playerLaneRef.current + dir));
    playerLaneRef.current = newLane;
    setPlayerLane(newLane);
  }, []);

  // Keyboard controls
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') changeLane(-1);
      else if (e.key === 'ArrowRight') changeLane(1);
      else if (e.key === ' ' && gameStateRef.current !== 'playing') startGame();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, changeLane, startGame]);

  // Touch controls
  const touchStartRef = useRef(0);
  useEffect(() => {
    if (!open) return;
    const onTouchStart = (e: TouchEvent) => { touchStartRef.current = e.touches[0].clientX; };
    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchStartRef.current;
      if (Math.abs(dx) > 30) changeLane(dx > 0 ? 1 : -1);
    };
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchend', onTouchEnd);
    return () => { window.removeEventListener('touchstart', onTouchStart); window.removeEventListener('touchend', onTouchEnd); };
  }, [open, changeLane]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const loop = () => {
      if (gameStateRef.current !== 'playing') return;
      frameRef.current++;
      const frame = frameRef.current;

      // Increase speed over time
      const newSpeed = 3 + frame * 0.002;
      speedRef.current = newSpeed;
      if (frame % 60 === 0) setSpeed(newSpeed);

      // Score
      scoreRef.current = Math.floor(frame / 3);
      if (frame % 9 === 0) setScore(scoreRef.current);

      // Spawn obstacles
      if (frame - lastObstacleRef.current > Math.max(40, 100 - frame * 0.05)) {
        const types: Obstacle['type'][] = ['car', 'barrier', 'cone'];
        const newObs: Obstacle = {
          id: obstacleIdRef.current++,
          lane: Math.floor(Math.random() * 3),
          y: -10,
          type: types[Math.floor(Math.random() * 3)],
        };
        obstaclesRef.current = [...obstaclesRef.current, newObs];
        lastObstacleRef.current = frame;
      }

      // Spawn billboards
      if (frame - lastBillboardRef.current > 180 + Math.random() * 120) {
        const newBb: Billboard = {
          id: billboardIdRef.current++,
          y: -10,
          side: Math.random() > 0.5 ? 'left' : 'right',
          sponsor: SPONSORS[billboardIdRef.current % SPONSORS.length],
          passed: false,
        };
        billboardsRef.current = [...billboardsRef.current, newBb];
        lastBillboardRef.current = frame;
      }

      // Move obstacles
      obstaclesRef.current = obstaclesRef.current
        .map(o => ({ ...o, y: o.y + speedRef.current }))
        .filter(o => o.y < 110);

      // Move billboards + check passed
      const newNotifs: Notification[] = [];
      billboardsRef.current = billboardsRef.current
        .map(b => {
          const updated = { ...b, y: b.y + speedRef.current * 0.8 };
          if (!b.passed && updated.y > 60) {
            updated.passed = true;
            newNotifs.push({ id: notifIdRef.current++, sponsor: b.sponsor, timer: 240 });
          }
          return updated;
        })
        .filter(b => b.y < 120);

      if (newNotifs.length) {
        setNotifications(prev => [...prev, ...newNotifs]);
      }

      // Collision detection (player at ~80% y, car body ~8% height)
      const playerX = LANE_POSITIONS[playerLaneRef.current];
      for (const obs of obstaclesRef.current) {
        const obsX = LANE_POSITIONS[obs.lane];
        if (Math.abs(obsX - playerX) < 12 && obs.y > 75 && obs.y < 92) {
          endGame();
          return;
        }
      }

      setObstacles([...obstaclesRef.current]);
      setBillboards([...billboardsRef.current]);

      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);
    return () => { if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current); };
  }, [gameState, endGame]);

  // Notification timer
  useEffect(() => {
    if (notifications.length === 0) return;
    const interval = setInterval(() => {
      setNotifications(prev => prev.map(n => ({ ...n, timer: n.timer - 1 })).filter(n => n.timer > 0));
    }, 16);
    return () => clearInterval(interval);
  }, [notifications.length]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center" style={{ background: 'hsla(218, 67%, 4%, 0.95)' }}>
      <button
        onClick={onClose}
        className="absolute top-3 right-3 z-50 flex items-center gap-1.5 rounded-full px-3 py-1.5 font-cinzel text-[9px] tracking-widest transition-all hover:scale-105"
        style={{
          background: 'hsla(0,73%,40%,0.3)',
          border: '1px solid hsla(0,73%,40%,0.6)',
          color: 'hsl(0,73%,60%)',
          boxShadow: '0 0 12px hsla(0,73%,40%,0.3)',
        }}
        aria-label="Close game"
      >
        <X className="w-3.5 h-3.5" />
        EXIT
      </button>

      <div className="relative w-full max-w-md h-[85vh] mx-4 overflow-hidden rounded-xl" style={{
        background: 'linear-gradient(180deg, hsl(215, 55%, 6%) 0%, hsl(218, 67%, 4%) 100%)',
        border: '1px solid hsla(43, 51%, 54%, 0.3)',
      }}>
        {/* Score HUD */}
        <div className="absolute top-0 left-0 right-0 z-30 flex justify-between items-center px-4 py-2"
          style={{ background: 'linear-gradient(180deg, hsla(218, 67%, 4%, 0.9), transparent)' }}>
          <div className="font-bebas text-lg text-primary">{scoreRef.current}m</div>
          <div className="font-cinzel text-[9px] tracking-widest text-primary/50">HIGHWAY DRIVE</div>
          <div className="font-bebas text-xs text-muted-foreground">HI: {highScore}m</div>
        </div>

        {/* 3D ROAD with perspective vanishing point */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Sky / horizon background */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(180deg, hsl(218,70%,3%) 0%, hsl(215,55%,8%) 45%, hsl(215,45%,11%) 60%, hsl(218,67%,4%) 100%)',
          }} />

          {/* HORIZON GLOW */}
          <div className="absolute left-0 right-0" style={{
            top: '42%', height: '4px',
            background: 'radial-gradient(ellipse at 50% 50%, hsla(43,51%,54%,0.35) 0%, transparent 70%)',
            filter: 'blur(4px)',
          }} />

          {/* ROAD SURFACE — perspective trapezoid using clip-path */}
          <div className="absolute bottom-0 left-0 right-0" style={{
            height: '100%',
            background: 'linear-gradient(180deg, hsl(215,30%,10%) 0%, hsl(215,25%,14%) 50%, hsl(215,20%,16%) 100%)',
            clipPath: 'polygon(20% 42%, 80% 42%, 100% 100%, 0% 100%)',
          }} />

          {/* ROAD CENTER LINE — perspective */}
          <div className="absolute bottom-0 left-1/2 -translate-x-[1px]" style={{
            width: '2px', height: '58%',
            backgroundImage: 'repeating-linear-gradient(0deg, hsla(43,51%,54%,0.5) 0px, hsla(43,51%,54%,0.5) 14px, transparent 14px, transparent 28px)',
            clipPath: 'polygon(50% 0%, 50% 0%, 100% 100%, 0% 100%)',
            animation: gameState === 'playing' ? `roadScroll ${16 / Math.max(speedRef.current,1)}s linear infinite` : 'none',
          }} />

          {/* LEFT LANE DIVIDER — angled perspective */}
          <div className="absolute bottom-0" style={{
            left: '35%', width: '1px', height: '58%',
            backgroundImage: 'repeating-linear-gradient(0deg, hsla(43,51%,54%,0.35) 0px, hsla(43,51%,54%,0.35) 12px, transparent 12px, transparent 24px)',
            transform: 'skewX(12deg)',
            transformOrigin: 'bottom center',
            animation: gameState === 'playing' ? `roadScroll ${16/Math.max(speedRef.current,1)}s linear infinite` : 'none',
          }} />

          {/* RIGHT LANE DIVIDER — angled */}
          <div className="absolute bottom-0" style={{
            right: '35%', width: '1px', height: '58%',
            backgroundImage: 'repeating-linear-gradient(0deg, hsla(43,51%,54%,0.35) 0px, hsla(43,51%,54%,0.35) 12px, transparent 12px, transparent 24px)',
            transform: 'skewX(-12deg)',
            transformOrigin: 'bottom center',
            animation: gameState === 'playing' ? `roadScroll ${16/Math.max(speedRef.current,1)}s linear infinite` : 'none',
          }} />

          {/* ROAD EDGE LINES */}
          <div className="absolute bottom-0" style={{ left:'12%', width:'2px', height:'58%',
            background:'hsla(43,51%,54%,0.3)', transform:'skewX(28deg)', transformOrigin:'bottom center' }} />
          <div className="absolute bottom-0" style={{ right:'12%', width:'2px', height:'58%',
            background:'hsla(43,51%,54%,0.3)', transform:'skewX(-28deg)', transformOrigin:'bottom center' }} />

          {/* LEFT SIDE ENVIRONMENT — trees/buildings */}
          {gameState === 'playing' && [0,1,2,3,4,5].map(i => {
            const yPos = ((i * 16.7 + (frameRef.current * speedRef.current * 0.15)) % 100);
            const scale = 0.4 + yPos * 0.006; // grows as it approaches bottom (perspective)
            const opacity = 0.3 + yPos * 0.006;
            return (
              <div key={`tree-l-${i}`} className="absolute pointer-events-none" style={{
                bottom: `${100 - yPos}%`,
                left: `${3 + (i % 2) * 3}%`,
                transform: `scaleY(${scale})`,
                transformOrigin: 'bottom center',
                opacity,
              }}>
                {/* Tree trunk */}
                <div style={{ width:'4px', height:'20px', background:'hsl(25,40%,18%)', margin:'0 auto' }} />
                {/* Tree canopy */}
                <div style={{ width:'18px', height:'24px', background:'hsl(134,35%,12%)',
                  borderRadius:'50% 50% 30% 30%', marginTop:'-8px', marginLeft:'-7px',
                  boxShadow:'0 0 6px hsla(134,40%,10%,0.5)' }} />
              </div>
            );
          })}

          {/* RIGHT SIDE ENVIRONMENT */}
          {gameState === 'playing' && [0,1,2,3,4,5].map(i => {
            const yPos = ((i * 16.7 + 8.35 + (frameRef.current * speedRef.current * 0.15)) % 100);
            const scale = 0.4 + yPos * 0.006;
            const opacity = 0.3 + yPos * 0.006;
            return (
              <div key={`tree-r-${i}`} className="absolute pointer-events-none" style={{
                bottom: `${100 - yPos}%`,
                right: `${3 + (i % 2) * 3}%`,
                transform: `scaleY(${scale})`,
                transformOrigin: 'bottom center',
                opacity,
              }}>
                <div style={{ width:'4px', height:'20px', background:'hsl(25,40%,18%)', margin:'0 auto' }} />
                <div style={{ width:'18px', height:'24px', background:'hsl(134,35%,12%)',
                  borderRadius:'50% 50% 30% 30%', marginTop:'-8px', marginLeft:'-7px',
                  boxShadow:'0 0 6px hsla(134,40%,10%,0.5)' }} />
              </div>
            );
          })}

          {/* DISTANT BUILDINGS on horizon */}
          <div className="absolute pointer-events-none" style={{ top:'30%', left:'5%', opacity:0.15 }}>
            {[12,20,15,22,10].map((h,i) => (
              <div key={i} style={{ display:'inline-block', width:'8px', height:`${h}px`,
                background:'hsl(215,40%,18%)', marginRight:'2px', verticalAlign:'bottom' }} />
            ))}
          </div>
          <div className="absolute pointer-events-none" style={{ top:'28%', right:'5%', opacity:0.15 }}>
            {[14,10,18,12,16].map((h,i) => (
              <div key={i} style={{ display:'inline-block', width:'8px', height:`${h}px`,
                background:'hsl(215,40%,18%)', marginRight:'2px', verticalAlign:'bottom' }} />
            ))}
          </div>

          {/* STREETLIGHTS with glow cones */}
          {gameState === 'playing' && [0,1,2,3].map(i => {
            const yPct = ((i * 25 + (frameRef.current * speedRef.current * 0.3)) % 100);
            const isSide = i % 2 === 0;
            return (
              <div key={`sl-${i}`} className="absolute" style={{ top:`${yPct}%`, [isSide?'left':'right']:'5%', pointerEvents:'none' }}>
                {/* Lamp post */}
                <div style={{ width:'2px', height:'12px', background:'hsl(215,30%,30%)', margin:'0 auto' }} />
                {/* Lamp head */}
                <div style={{ width:'8px', height:'4px', background:'hsl(51,100%,50%)', borderRadius:'2px',
                  boxShadow:'0 0 10px hsla(51,100%,50%,0.8)', marginLeft:isSide?'-6px':'0' }} />
                {/* Light cone */}
                <div style={{
                  width:'20px', height:'25px', marginLeft: isSide ? '-14px' : '-6px',
                  background: 'linear-gradient(180deg, hsla(51,100%,50%,0.12) 0%, transparent 100%)',
                  clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
                }} />
              </div>
            );
          })}
        </div>

        {/* Billboards */}
        {billboards.map(bb => {
          const distFactor = Math.max(0, (70 - bb.y) / 70); // closer = larger
          const scale = 0.6 + distFactor * 0.6;
          return (
            <div key={bb.id} className="absolute z-10 pointer-events-none" style={{
              top: `${bb.y}%`,
              [bb.side]: `${3 + (1 - distFactor) * 2}%`,
              width: `${14 + distFactor * 8}%`,
              transform: `scale(${scale})`,
              transformOrigin: bb.side === 'left' ? 'left center' : 'right center',
              transition: 'none',
            }}>
              {/* Billboard post */}
              <div style={{ width:'2px', height:'12px', background:'hsl(215,30%,28%)', margin:'0 auto 0' }} />
              {/* Billboard panel */}
              <div className="rounded px-2 py-1.5 text-center" style={{
                background: 'linear-gradient(135deg, hsla(218,67%,6%,0.95), hsla(215,50%,10%,0.95))',
                border: '1px solid hsla(43,51%,54%,0.5)',
                boxShadow: `0 0 ${10 + distFactor * 14}px hsla(43,51%,54%,${0.2 + distFactor * 0.3})`,
              }}>
                {/* Gold top bar */}
                <div style={{ height:'2px', background:'linear-gradient(90deg,transparent,hsl(43,51%,54%),transparent)', marginBottom:'3px' }} />
                <div className="font-bebas text-[7px] text-primary leading-tight truncate">{bb.sponsor.name}</div>
                <div className="font-cormorant text-[6px] text-accent/80 italic truncate">{bb.sponsor.tagline}</div>
              </div>
            </div>
          );
        })}

        {/* Obstacles */}
        {obstacles.map(obs => {
          const carColors: Record<string, string> = {
            car: 'hsl(0,73%,35%)',
            barrier: 'hsl(33,100%,45%)',
            cone: 'hsl(33,80%,50%)',
          };
          if (obs.type === 'cone') return (
            <div key={obs.id} className="absolute z-20" style={{
              top:`${obs.y}%`, left:`${LANE_POSITIONS[obs.lane]}%`, transform:'translateX(-50%)',
            }}>
              <div style={{ width:0, height:0,
                borderLeft:'7px solid transparent', borderRight:'7px solid transparent',
                borderBottom:'18px solid hsl(33,100%,50%)',
                filter:'drop-shadow(0 0 6px hsla(33,100%,50%,0.8))' }} />
              <div style={{ width:'16px', height:'3px', background:'hsl(42,42%,87%)', opacity:0.7, marginTop:'1px' }} />
            </div>
          );
          if (obs.type === 'barrier') return (
            <div key={obs.id} className="absolute z-20" style={{
              top:`${obs.y}%`, left:`${LANE_POSITIONS[obs.lane]}%`, transform:'translateX(-50%)',
              width:'40px', height:'12px', borderRadius:'3px',
              background:'repeating-linear-gradient(90deg, hsl(33,100%,45%) 0px, hsl(33,100%,45%) 8px, hsl(42,42%,87%) 8px, hsl(42,42%,87%) 16px)',
              boxShadow:'0 0 8px hsla(33,100%,45%,0.6)',
            }} />
          );
          // Oncoming car
          return (
            <div key={obs.id} className="absolute z-20" style={{
              top:`${obs.y}%`, left:`${LANE_POSITIONS[obs.lane]}%`, transform:'translateX(-50%)',
            }}>
              <div style={{ width:'24px', height:'40px', borderRadius:'3px 3px 5px 5px',
                background:`linear-gradient(0deg, ${carColors[obs.type]}, hsl(0,60%,25%))`,
                boxShadow:`0 0 10px ${carColors[obs.type]}`, position:'relative' }}>
                {/* Headlights */}
                <div style={{ position:'absolute', top:'4px', left:'2px', width:'6px', height:'3px',
                  background:'hsl(51,100%,70%)', boxShadow:'0 0 8px hsl(51,100%,70%)', borderRadius:'1px' }} />
                <div style={{ position:'absolute', top:'4px', right:'2px', width:'6px', height:'3px',
                  background:'hsl(51,100%,70%)', boxShadow:'0 0 8px hsl(51,100%,70%)', borderRadius:'1px' }} />
                {/* Windshield */}
                <div style={{ position:'absolute', bottom:'6px', left:'3px', right:'3px', height:'10px',
                  background:'hsla(215,55%,25%,0.7)', borderRadius:'1px' }} />
              </div>
            </div>
          );
        })}

        {/* Player car */}
        <div className="absolute z-20 transition-all duration-150 ease-out" style={{
          bottom: '10%',
          left: `${LANE_POSITIONS[playerLane]}%`,
          transform: 'translateX(-50%)',
        }}>
          {/* Headlight beam */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2" style={{
            width: '50px', height: '80px',
            background: 'linear-gradient(0deg, hsla(51,100%,50%,0.18), hsla(51,100%,50%,0.04), transparent)',
            clipPath: 'polygon(25% 100%, 75% 100%, 100% 0%, 0% 0%)',
            filter: 'blur(2px)',
          }} />
          {/* Car shadow */}
          <div style={{ width:'30px', height:'6px', background:'hsla(0,0%,0%,0.4)', borderRadius:'50%',
            filter:'blur(4px)', marginBottom:'-2px', marginLeft:'-1px' }} />
          {/* Car body */}
          <div style={{ width:'30px', height:'50px', borderRadius:'6px 6px 3px 3px', position:'relative',
            background: 'linear-gradient(160deg, hsl(43,55%,60%) 0%, hsl(43,51%,54%) 40%, hsl(43,35%,35%) 100%)',
            boxShadow: '0 0 16px hsla(43,51%,54%,0.6), -3px 0 8px hsla(0,0%,0%,0.4), 3px 0 8px hsla(0,0%,0%,0.4)',
          }}>
            {/* Roof cabin */}
            <div style={{ position:'absolute', top:'4px', left:'4px', right:'4px', height:'16px',
              borderRadius:'4px 4px 0 0',
              background: 'linear-gradient(180deg, hsl(215,55%,22%), hsl(215,45%,15%))',
              border: '1px solid hsla(43,51%,54%,0.2)' }} />
            {/* Windshield glare */}
            <div style={{ position:'absolute', top:'5px', left:'5px', width:'8px', height:'10px',
              borderRadius:'2px', background:'hsla(215,80%,70%,0.15)' }} />
            {/* Hood line */}
            <div style={{ position:'absolute', top:'20px', left:'0', right:'0', height:'1px',
              background:'hsla(43,51%,54%,0.3)' }} />
            {/* Left wheel */}
            <div style={{ position:'absolute', bottom:'4px', left:'-3px', width:'5px', height:'12px',
              borderRadius:'2px', background:'hsl(218,30%,12%)', border:'1px solid hsla(43,51%,54%,0.3)' }} />
            {/* Right wheel */}
            <div style={{ position:'absolute', bottom:'4px', right:'-3px', width:'5px', height:'12px',
              borderRadius:'2px', background:'hsl(218,30%,12%)', border:'1px solid hsla(43,51%,54%,0.3)' }} />
            {/* Tail lights */}
            <div style={{ position:'absolute', bottom:'6px', left:'2px', width:'5px', height:'3px',
              borderRadius:'1px', background:'hsl(0,100%,50%)', boxShadow:'0 0 5px hsl(0,100%,50%)' }} />
            <div style={{ position:'absolute', bottom:'6px', right:'2px', width:'5px', height:'3px',
              borderRadius:'1px', background:'hsl(0,100%,50%)', boxShadow:'0 0 5px hsl(0,100%,50%)' }} />
            {/* Exhaust pipe */}
            <div style={{ position:'absolute', bottom:'8px', left:'10px', width:'6px', height:'2px',
              borderRadius:'1px', background:'hsl(215,30%,20%)' }} />
          </div>
        </div>

        {/* Sponsor notification cards */}
        <div className="absolute top-12 right-2 z-40 space-y-2 w-[45%]">
          {notifications.slice(-2).map(n => (
            <div key={n.id} className="rounded-lg p-2" style={{
              background: 'hsla(218,67%,4%,0.92)',
              border: '1px solid hsla(43,51%,54%,0.4)',
              animation: 'fadeInUp 0.3s ease-out',
            }}>
              <div className="font-bebas text-xs text-primary">{n.sponsor.name}</div>
              <div className="font-cormorant text-[9px] text-accent italic">{n.sponsor.tagline}</div>
              <div className="font-cormorant text-[8px] text-muted-foreground mt-1 leading-tight">{n.sponsor.info}</div>
              <button onClick={() => setNotifications(prev => prev.filter(x => x.id !== n.id))} className="font-cinzel text-[7px] text-primary/40 mt-1">DISMISS</button>
            </div>
          ))}
        </div>

        {/* Start screen */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center" style={{ background: 'hsla(218, 67%, 4%, 0.85)' }}>
            <h3 className="font-bebas text-4xl golden-text mb-2">HIGHWAY DRIVE</h3>
            <p className="font-cormorant text-sm text-muted-foreground mb-6 text-center px-8">
              Dodge obstacles on the golden highway. Discover our sponsors along the way!
            </p>
            <button onClick={startGame} className="flex items-center gap-2 px-8 py-3 rounded-full font-cinzel text-xs tracking-widest text-primary-foreground"
              style={{ background: 'linear-gradient(135deg, hsl(43, 51%, 54%), hsl(51, 100%, 50%))', boxShadow: '0 0 20px hsla(43, 51%, 54%, 0.4)' }}>
              <Play className="w-4 h-4" /> START
            </button>
            <p className="font-cormorant text-[10px] text-muted-foreground mt-4">← → or Swipe to steer</p>
          </div>
        )}

        {/* Game over screen */}
        {gameState === 'over' && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center" style={{ background: 'hsla(218, 67%, 4%, 0.9)' }}>
            <h3 className="font-bebas text-3xl text-destructive mb-1">CRASH!</h3>
            <p className="font-bebas text-5xl golden-text mb-1">{scoreRef.current}m</p>
            {scoreRef.current >= highScore && <p className="font-cinzel text-[10px] text-accent tracking-widest mb-4">NEW HIGH SCORE!</p>}
            <p className="font-cormorant text-sm text-muted-foreground mb-6 text-center px-8">
              THANKS TO OUR SPONSORS
            </p>
            <div className="grid grid-cols-2 gap-2 px-6 mb-6 w-full max-w-xs">
              {SPONSORS.map((s, i) => (
                <div key={i} className="rounded p-2 text-center" style={{ border: '1px solid hsla(43, 51%, 54%, 0.2)', background: 'hsla(218, 67%, 4%, 0.6)' }}>
                  <div className="font-bebas text-[10px] text-primary">{s.name}</div>
                </div>
              ))}
            </div>
            <button onClick={startGame} className="flex items-center gap-2 px-8 py-3 rounded-full font-cinzel text-xs tracking-widest text-primary-foreground"
              style={{ background: 'linear-gradient(135deg, hsl(43, 51%, 54%), hsl(51, 100%, 50%))' }}>
              <RotateCcw className="w-4 h-4" /> PLAY AGAIN
            </button>
          </div>
        )}

        {/* Mobile lane tap zones */}
        {gameState === 'playing' && (
          <>
            <button className="absolute left-0 top-0 bottom-0 w-1/2 z-25 opacity-0" onClick={() => changeLane(-1)} aria-label="Move left" />
            <button className="absolute right-0 top-0 bottom-0 w-1/2 z-25 opacity-0" onClick={() => changeLane(1)} aria-label="Move right" />
          </>
        )}
      </div>
    </div>
  );
};

export default HighwayCarGame;
