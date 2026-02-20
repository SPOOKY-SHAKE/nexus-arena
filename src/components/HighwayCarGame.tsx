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
          if (!b.passed && updated.y > 70) {
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
        if (Math.abs(obsX - playerX) < 12 && obs.y > 72 && obs.y < 88) {
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
      <button onClick={onClose} className="absolute top-4 right-4 text-foreground/60 hover:text-primary z-50" aria-label="Close game">
        <X className="w-6 h-6" />
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

        {/* Road */}
        <div className="absolute inset-0" style={{
          background: `
            linear-gradient(180deg, hsla(215, 30%, 12%, 1), hsla(218, 67%, 4%, 1)),
            repeating-linear-gradient(0deg, transparent, transparent 40px, hsla(43, 51%, 54%, 0.15) 40px, hsla(43, 51%, 54%, 0.15) 42px)
          `,
        }}>
          {/* Lane dividers */}
          {[37.5, 62.5].map(x => (
            <div key={x} className="absolute top-0 bottom-0" style={{
              left: `${x}%`,
              width: '2px',
              backgroundImage: 'repeating-linear-gradient(180deg, hsla(43, 51%, 54%, 0.4) 0px, hsla(43, 51%, 54%, 0.4) 20px, transparent 20px, transparent 40px)',
              animation: gameState === 'playing' ? `roadScroll ${20 / speedRef.current}s linear infinite` : 'none',
            }} />
          ))}

          {/* Road edges with glow */}
          <div className="absolute top-0 bottom-0 left-[12%] w-[1px]" style={{ background: 'hsla(43, 51%, 54%, 0.25)' }} />
          <div className="absolute top-0 bottom-0 right-[12%] w-[1px]" style={{ background: 'hsla(43, 51%, 54%, 0.25)' }} />

          {/* Streetlights */}
          {gameState === 'playing' && [0, 1, 2, 3].map(i => (
            <div key={`light-${i}`} className="absolute" style={{
              top: `${(i * 25 + (frameRef.current * speedRef.current * 0.3) % 100) % 100}%`,
              left: i % 2 === 0 ? '6%' : '88%',
              width: '4px', height: '4px', borderRadius: '50%',
              background: 'hsl(51, 100%, 50%)',
              boxShadow: '0 0 8px hsla(51, 100%, 50%, 0.6)',
            }} />
          ))}
        </div>

        {/* Billboards */}
        {billboards.map(bb => (
          <div key={bb.id} className="absolute z-10 transition-none" style={{
            top: `${bb.y}%`,
            [bb.side]: '2%',
            width: '18%',
          }}>
            <div className="rounded px-1 py-2 text-center" style={{
              background: 'hsla(43, 51%, 54%, 0.15)',
              border: '1px solid hsla(43, 51%, 54%, 0.4)',
              boxShadow: bb.y > 50 ? '0 0 12px hsla(43, 51%, 54%, 0.3)' : 'none',
            }}>
              <div className="font-bebas text-[8px] text-primary leading-tight truncate">{bb.sponsor.name}</div>
            </div>
          </div>
        ))}

        {/* Obstacles */}
        {obstacles.map(obs => {
          const colors = {
            car: 'hsl(0, 73%, 40%)',
            barrier: 'hsl(33, 100%, 50%)',
            cone: 'hsl(33, 80%, 55%)',
          };
          const shapes = {
            car: { w: '8%', h: '5%', r: '4px' },
            barrier: { w: '10%', h: '2%', r: '2px' },
            cone: { w: '3%', h: '3%', r: '50%' },
          };
          const s = shapes[obs.type];
          return (
            <div key={obs.id} className="absolute z-20" style={{
              top: `${obs.y}%`,
              left: `${LANE_POSITIONS[obs.lane]}%`,
              transform: 'translateX(-50%)',
              width: s.w,
              paddingBottom: s.h,
              borderRadius: s.r,
              background: colors[obs.type],
              boxShadow: `0 0 6px ${colors[obs.type]}`,
            }} />
          );
        })}

        {/* Player car */}
        <div className="absolute z-20 transition-all duration-150 ease-out" style={{
          bottom: '12%',
          left: `${LANE_POSITIONS[playerLane]}%`,
          transform: 'translateX(-50%)',
        }}>
          {/* Headlight glow */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2" style={{
            width: '40px', height: '60px',
            background: 'linear-gradient(0deg, hsla(51, 100%, 50%, 0.15), transparent)',
            clipPath: 'polygon(30% 100%, 70% 100%, 100% 0%, 0% 0%)',
          }} />
          {/* Car body */}
          <div style={{
            width: '28px', height: '44px', borderRadius: '6px 6px 4px 4px',
            background: 'linear-gradient(180deg, hsl(43, 51%, 54%), hsl(43, 40%, 35%))',
            boxShadow: '0 0 12px hsla(43, 51%, 54%, 0.5), 0 4px 8px hsla(0, 0%, 0%, 0.5)',
            position: 'relative',
          }}>
            {/* Windshield */}
            <div style={{
              position: 'absolute', top: '6px', left: '4px', right: '4px', height: '10px',
              borderRadius: '3px 3px 0 0',
              background: 'hsla(215, 55%, 20%, 0.8)',
            }} />
            {/* Tail lights */}
            <div className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full" style={{ background: 'hsl(0, 100%, 50%)' }} />
            <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full" style={{ background: 'hsl(0, 100%, 50%)' }} />
          </div>
        </div>

        {/* Sponsor notification cards */}
        <div className="absolute top-12 right-2 z-40 space-y-2 w-[45%]">
          {notifications.slice(-2).map(n => (
            <div key={n.id} className="rounded-lg p-2" style={{
              background: 'hsla(218, 67%, 4%, 0.92)',
              border: '1px solid hsla(43, 51%, 54%, 0.4)',
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
            <p className="font-bebas text-5xl golden-text mb-1">{score}m</p>
            {score >= highScore && <p className="font-cinzel text-[10px] text-accent tracking-widest mb-4">NEW HIGH SCORE!</p>}
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
