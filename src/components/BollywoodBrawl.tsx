import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Volume2, VolumeX } from 'lucide-react';

/* ─── CHARACTER DATA ─────────────────────────────────── */
const HEROES = [
  {
    id: 'amitabh',
    name: 'VIJAY',
    film: 'Sholay (1975)',
    color: 'hsl(33,100%,50%)',
    bodyColor: 'hsl(25,60%,30%)',
    power: 'Deewar Smash',
    desc: '"Mere paas maa hai" — The Angry Young Man',
    emoji: '👊',
  },
  {
    id: 'srk',
    name: 'RAJ',
    film: 'DDLJ (1995)',
    color: 'hsl(215,70%,60%)',
    bodyColor: 'hsl(215,50%,25%)',
    power: 'Arms Spread Strike',
    desc: '"Bade bade deshon mein..." — King Khan',
    emoji: '🤗',
  },
  {
    id: 'salman',
    name: 'TIGER',
    film: 'Tiger Zinda Hai (2017)',
    color: 'hsl(134,60%,38%)',
    bodyColor: 'hsl(134,45%,20%)',
    power: 'Shirtless Suplex',
    desc: 'Raw power, no explanation needed.',
    emoji: '🐯',
  },
  {
    id: 'akshay',
    name: 'ROHIT',
    film: 'Khiladi (1992)',
    color: 'hsl(51,100%,50%)',
    bodyColor: 'hsl(43,60%,22%)',
    power: 'Stunt Master Kick',
    desc: 'The action king. No stunt doubles.',
    emoji: '🥋',
  },
  {
    id: 'krish',
    name: 'KRRISH',
    film: 'Krrish (2006)',
    color: 'hsl(270,70%,55%)',
    bodyColor: 'hsl(270,50%,20%)',
    power: 'Supersonic Fly-Punch',
    desc: 'India\'s first superhero. Desi cape included.',
    emoji: '🦸',
  },
  {
    id: 'priyanka',
    name: 'SUNEHRI',
    film: 'Don (2006)',
    color: 'hsl(330,70%,55%)',
    bodyColor: 'hsl(330,50%,22%)',
    power: 'Don\'s Deception Whirl',
    desc: 'Faster, deadlier, more stylish.',
    emoji: '💃',
  },
  {
    id: 'raveena',
    name: 'SEEMA',
    film: 'Mohra (1994)',
    color: 'hsl(43,80%,55%)',
    bodyColor: 'hsl(33,55%,22%)',
    power: 'Tu Cheez Badi Spin',
    desc: 'Rain dance warrior. Unstoppable.',
    emoji: '🌟',
  },
];

const LEVELS = [
  {
    level: 1,
    title: 'THE DACOIT VALLEY',
    bg: 'linear-gradient(180deg, hsl(25,40%,8%) 0%, hsl(25,50%,12%) 60%, hsl(25,35%,6%) 100%)',
    enemyName: 'Dacoit',
    enemyColor: 'hsl(0,60%,35%)',
    enemyCount: 6,
    bossName: 'GABBAR SINGH',
    bossColor: 'hsl(0,70%,28%)',
    bossHealth: 100,
    bgTone: [130, 164, 196], // Musical note frequencies
    tune: 'sholay',
  },
  {
    level: 2,
    title: 'MUMBAI UNDERWORLD',
    bg: 'linear-gradient(180deg, hsl(218,50%,5%) 0%, hsl(215,40%,9%) 60%, hsl(218,60%,4%) 100%)',
    enemyName: 'Henchman',
    enemyColor: 'hsl(215,50%,25%)',
    enemyCount: 8,
    bossName: 'DON',
    bossColor: 'hsl(215,60%,20%)',
    bossHealth: 120,
    bgTone: [110, 147, 165],
    tune: 'don',
  },
  {
    level: 3,
    title: 'THE TIGER\'S LAIR',
    bg: 'linear-gradient(180deg, hsl(134,30%,5%) 0%, hsl(134,35%,10%) 60%, hsl(134,25%,4%) 100%)',
    enemyName: 'ISI Agent',
    enemyColor: 'hsl(134,40%,18%)',
    enemyCount: 10,
    bossName: 'COLONEL ZAHIR',
    bossColor: 'hsl(134,50%,14%)',
    bossHealth: 140,
    bgTone: [98, 123, 147],
    tune: 'tiger',
  },
  {
    level: 4,
    title: 'KRRISH\'S DIMENSION',
    bg: 'linear-gradient(180deg, hsl(270,35%,5%) 0%, hsl(270,40%,10%) 60%, hsl(270,30%,4%) 100%)',
    enemyName: 'Drone Guard',
    enemyColor: 'hsl(270,40%,22%)',
    enemyCount: 12,
    bossName: 'DR SIDDHANT',
    bossColor: 'hsl(270,55%,18%)',
    bossHealth: 160,
    bgTone: [147, 175, 220],
    tune: 'krrish',
  },
  {
    level: 5,
    title: 'FINAL SHOWDOWN',
    bg: 'linear-gradient(180deg, hsl(0,35%,4%) 0%, hsl(0,40%,9%) 50%, hsl(43,30%,5%) 100%)',
    enemyName: 'Shadow Guard',
    enemyColor: 'hsl(0,30%,20%)',
    enemyCount: 14,
    bossName: 'THE MASTERMIND',
    bossColor: 'hsl(0,0%,15%)',
    bossHealth: 200,
    bgTone: [82, 110, 130],
    tune: 'final',
  },
];

/* ─── WEB AUDIO TONE ENGINE ──────────────────────────── */
class TuneEngine {
  private ctx: AudioContext | null = null;
  private nodes: AudioNode[] = [];
  private running = false;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private tuneKey = '';
  muted = false;

  private getCtx() {
    if (!this.ctx) this.ctx = new AudioContext();
    return this.ctx;
  }

  private playNote(freq: number, duration: number, gain = 0.08, type: OscillatorType = 'square') {
    if (this.muted) return;
    const ctx = this.getCtx();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(gain, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  play(tuneKey: string, tones: number[]) {
    this.stop();
    this.tuneKey = tuneKey;
    this.running = true;
    // Simple repeating arpeggio pattern per level
    const patterns: Record<string, number[]> = {
      sholay:  [0, 2, 1, 4, 0, 3, 2, 4, 1, 0],
      don:     [0, 1, 3, 1, 4, 2, 0, 3, 1, 4],
      tiger:   [3, 0, 2, 4, 1, 3, 0, 2, 4, 1],
      krrish:  [1, 4, 2, 0, 3, 1, 4, 0, 2, 3],
      final:   [4, 3, 2, 1, 0, 4, 3, 2, 1, 0],
    };
    const pat = patterns[tuneKey] || [0, 1, 2, 3, 4];
    let step = 0;
    this.intervalId = setInterval(() => {
      if (!this.running) return;
      const noteIdx = pat[step % pat.length];
      const freq = tones[noteIdx % tones.length];
      this.playNote(freq, 0.22, 0.06, step % 4 === 0 ? 'sawtooth' : 'square');
      if (step % 2 === 1) this.playNote(freq * 0.5, 0.18, 0.04, 'triangle');
      step++;
    }, 260);
  }

  stop() {
    this.running = false;
    if (this.intervalId) { clearInterval(this.intervalId); this.intervalId = null; }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }
}

const tuneEngine = new TuneEngine();

/* ─── CSS CHARACTER RENDERER ─────────────────────────── */
const HeroSprite = ({ hero, action, x, facing }: {
  hero: typeof HEROES[0]; action: 'idle'|'punch'|'kick'|'hit'|'special'; x: number; facing: 1|-1;
}) => {
  const scale = facing === -1 ? 'scaleX(-1)' : 'scaleX(1)';
  const punchArm = action === 'punch' || action === 'special';
  const kick = action === 'kick';
  const hit = action === 'hit';

  return (
    <div style={{ position:'absolute', bottom:'60px', left:`${x}px`, width:'40px', transform: scale,
      filter: hit ? 'brightness(2) saturate(0)' : 'none',
      animation: action === 'idle' ? 'heroIdle 0.8s ease-in-out infinite alternate' : action === 'special' ? 'specialFlash 0.3s ease-out' : 'none',
    }}>
      {/* Shadow */}
      <div style={{ position:'absolute', bottom:'-8px', left:'4px', width:'32px', height:'6px',
        background:'hsla(0,0%,0%,0.4)', borderRadius:'50%', filter:'blur(3px)' }} />
      {/* Head */}
      <div style={{ width:'22px', height:'22px', borderRadius:'50%', background:hero.color,
        margin:'0 auto', border:`2px solid ${hero.bodyColor}`,
        boxShadow: action === 'special' ? `0 0 20px ${hero.color}` : `0 0 8px ${hero.color}44`,
        position:'relative' }}>
        {/* Face eyes */}
        <div style={{ position:'absolute', top:'7px', left:'4px', width:'4px', height:'4px',
          borderRadius:'50%', background:'hsl(218,67%,4%)' }} />
        <div style={{ position:'absolute', top:'7px', right:'4px', width:'4px', height:'4px',
          borderRadius:'50%', background:'hsl(218,67%,4%)' }} />
        {/* Hero emoji badge */}
        <div style={{ position:'absolute', top:'-18px', left:'50%', transform:'translateX(-50%)',
          fontSize:'10px', lineHeight:1 }}>{hero.emoji}</div>
      </div>
      {/* Torso */}
      <div style={{ width:'26px', height:'28px', background:hero.bodyColor, margin:'2px auto 0',
        borderRadius:'4px 4px 6px 6px', border:`1px solid ${hero.color}44`,
        position:'relative', boxShadow:`inset 0 2px 4px ${hero.color}22` }}>
        {/* Belt */}
        <div style={{ position:'absolute', bottom:'6px', left:'0', right:'0', height:'4px',
          background:`${hero.color}88`, borderRadius:'1px' }} />
      </div>
      {/* Left arm */}
      <div style={{ position:'absolute', top:'26px', left: punchArm ? '-8px' : '2px', width: punchArm ? '18px' : '8px', height:'8px',
        background:hero.color, borderRadius:'4px',
        transition:'all 0.1s', transformOrigin:'right center',
        transform: punchArm ? 'rotate(-10deg)' : 'rotate(20deg)' }} />
      {/* Right arm */}
      <div style={{ position:'absolute', top:'26px', right:'2px', width:'8px', height:'8px',
        background:hero.color, borderRadius:'4px', transform:'rotate(-20deg)' }} />
      {/* Legs */}
      <div style={{ display:'flex', gap:'4px', marginTop:'2px', justifyContent:'center' }}>
        <div style={{ width:'10px', height: kick ? '18px' : '22px', background:hero.bodyColor,
          borderRadius:'3px 3px 4px 4px', border:`1px solid ${hero.color}44`,
          transform: kick ? 'rotate(30deg) translateY(-8px)' : 'none', transition:'all 0.1s' }} />
        <div style={{ width:'10px', height:'22px', background:hero.bodyColor,
          borderRadius:'3px 3px 4px 4px', border:`1px solid ${hero.color}44` }} />
      </div>
    </div>
  );
};

const EnemySprite = ({ color, x, health, maxHealth, name, isBoss, action }: {
  color: string; x: number; health: number; maxHealth: number;
  name: string; isBoss: boolean; action: 'idle'|'attack'|'hit'|'dead';
}) => {
  if (action === 'dead') return null;
  const sz = isBoss ? 48 : 32;
  return (
    <div style={{ position:'absolute', bottom:'60px', left:`${x}px`, width:`${sz}px`,
      opacity: health <= 0 ? 0 : 1, transition:'opacity 0.3s',
      filter: action === 'hit' ? 'brightness(3)' : 'none',
      animation: action === 'attack' ? 'enemyAttack 0.3s ease-out' : 'heroIdle 1s ease-in-out infinite alternate',
    }}>
      {/* Health bar */}
      <div style={{ position:'absolute', top:`-${isBoss?28:18}px`, left:'0', right:'0' }}>
        {isBoss && <div style={{ fontFamily:'Cinzel Decorative,serif', fontSize:'7px', color, textAlign:'center', marginBottom:'2px' }}>{name}</div>}
        <div style={{ height: isBoss?5:3, background:'hsl(218,67%,10%)', borderRadius:'2px', overflow:'hidden' }}>
          <div style={{ height:'100%', background:color, borderRadius:'2px', width:`${(health/maxHealth)*100}%`, transition:'width 0.3s' }} />
        </div>
      </div>
      {/* Shadow */}
      <div style={{ position:'absolute', bottom:'-8px', left:'4px', width:`${sz-8}px`, height:'6px',
        background:'hsla(0,0%,0%,0.4)', borderRadius:'50%', filter:'blur(3px)' }} />
      {/* Head */}
      <div style={{ width:`${sz*0.55}px`, height:`${sz*0.55}px`, borderRadius:'50%', background:color,
        margin:'0 auto', border:`2px solid hsl(0,0%,5%)`,
        boxShadow:`0 0 ${isBoss?16:8}px ${color}66` }}>
        <div style={{ display:'flex', gap:'4px', justifyContent:'center', paddingTop:`${sz*0.13}px` }}>
          <div style={{ width:'4px', height:'4px', borderRadius:'50%', background:'hsl(218,67%,4%)' }} />
          <div style={{ width:'4px', height:'4px', borderRadius:'50%', background:'hsl(218,67%,4%)' }} />
        </div>
        {/* Evil eyes glow */}
        <div style={{ display:'flex', gap:'2px', justifyContent:'center', marginTop:'2px' }}>
          <div style={{ width:'6px', height:'2px', borderRadius:'1px', background:'hsl(0,100%,50%)', boxShadow:'0 0 4px hsl(0,100%,50%)' }} />
        </div>
      </div>
      {/* Body */}
      <div style={{ width:`${sz*0.65}px`, height:`${sz*0.7}px`, background:color,
        margin:'2px auto 0', borderRadius:'3px 3px 5px 5px',
        border:`1px solid hsl(0,0%,5%)`, opacity:0.85 }}>
        {isBoss && <div style={{ textAlign:'center', fontSize:'8px', paddingTop:'4px', opacity:0.6 }}>👹</div>}
      </div>
    </div>
  );
};

const GirlChild = ({ visible, rescued }: { visible: boolean; rescued: boolean }) => {
  if (!visible) return null;
  return (
    <div style={{ position:'absolute', bottom:'60px', right:'80px',
      animation: rescued ? 'fadeInUp 0.5s ease-out' : 'floatUp 1s ease-in-out infinite alternate' }}>
      {/* Captive girl character */}
      <div style={{ textAlign:'center', fontSize:'24px' }}>🧒</div>
      {!rescued && (
        <div style={{ fontFamily:'Cinzel Decorative,serif', fontSize:'6px', color:'hsl(51,100%,70%)',
          textAlign:'center', animation:'glitchFlicker 1s ease-in-out infinite', marginTop:'2px' }}>
          SAVE ME!
        </div>
      )}
      {rescued && (
        <div style={{ fontFamily:'Cinzel Decorative,serif', fontSize:'6px', color:'hsl(142,70%,60%)',
          textAlign:'center', marginTop:'2px' }}>
          ✨ RESCUED!
        </div>
      )}
    </div>
  );
};

/* ─── BACKGROUND SCENE ───────────────────────────────── */
const LevelBackground = ({ level, scrollX }: { level: typeof LEVELS[0]; scrollX: number }) => (
  <div style={{ position:'absolute', inset:0, overflow:'hidden', background:level.bg }}>
    {/* Stars / particles */}
    {Array.from({ length: 18 }).map((_,i) => (
      <div key={i} style={{ position:'absolute',
        top:`${5+i*5}%`, left:`${(i*7+scrollX*0.02)%100}%`,
        width: i%3===0?3:2, height:i%3===0?3:2, borderRadius:'50%',
        background: i%4===0?'hsl(51,100%,70%)':'hsl(43,51%,54%)',
        opacity:0.4+i%3*0.2,
        boxShadow:`0 0 ${i%2===0?6:3}px hsl(51,100%,50%)`,
        animation:`floatUp ${2+i%3}s ease-in-out ${i*0.2}s infinite alternate` }} />
    ))}
    {/* Ground */}
    <div style={{ position:'absolute', bottom:'0', left:0, right:0, height:'60px',
      background:'linear-gradient(0deg, hsl(218,40%,6%) 0%, transparent 100%)',
      borderTop:'1px solid hsla(43,51%,54%,0.2)' }} />
    {/* Ground texture lines */}
    {Array.from({ length: 8 }).map((_,i) => (
      <div key={i} style={{ position:'absolute', bottom:`${8+i*6}px`, left:0, right:0, height:'1px',
        background:`hsla(43,51%,54%,${0.04+i*0.01})` }} />
    ))}
    {/* Far background buildings/silhouettes */}
    {Array.from({ length: 5 }).map((_,i) => (
      <div key={i} style={{ position:'absolute', bottom:'58px',
        left:`${(i*22+scrollX*0.05)%110-10}%`,
        width:`${30+i*12}px`, height:`${40+i*20}px`,
        background:'hsla(218,50%,6%,0.8)', borderRadius:'2px 2px 0 0',
        borderTop:'1px solid hsla(43,51%,54%,0.1)' }} />
    ))}
    {/* Foreground speed lines */}
    {Array.from({ length: 6 }).map((_,i) => (
      <div key={i} style={{ position:'absolute', top:`${15+i*12}%`,
        left:`${(i*18+scrollX)%110-5}%`, width:'40px', height:'1px',
        background:`hsla(43,51%,54%,0.15)`, transform:'scaleX(2)' }} />
    ))}
  </div>
);

/* ─── MAIN GAME COMPONENT ────────────────────────────── */
type GamePhase = 'select'|'fighting'|'boss'|'bosswin'|'win'|'lose'|'complete';

interface EnemyState {
  id: number; x: number; health: number; maxHealth: number; action: 'idle'|'attack'|'hit'|'dead';
}

const BollywoodBrawl = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [hero, setHero] = useState<typeof HEROES[0] | null>(null);
  const [levelIdx, setLevelIdx] = useState(0);
  const [phase, setPhase] = useState<GamePhase>('select');
  const [playerX, setPlayerX] = useState(80);
  const [playerAction, setPlayerAction] = useState<'idle'|'punch'|'kick'|'hit'|'special'>('idle');
  const [playerFacing, setPlayerFacing] = useState<1|-1>(1);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [enemies, setEnemies] = useState<EnemyState[]>([]);
  const [boss, setBoss] = useState<EnemyState | null>(null);
  const [scrollX, setScrollX] = useState(0);
  const [muted, setMuted] = useState(false);
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [girlRescued, setGirlRescued] = useState(false);
  const [specialReady, setSpecialReady] = useState(false);
  const [specialCooldown, setSpecialCooldown] = useState(0);
  const [hitFlash, setHitFlash] = useState('');
  const [levelMsg, setLevelMsg] = useState('');

  const gameRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const lastEnemyHitRef = useRef(0);
  const comboRef = useRef(0);
  const comboTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const level = LEVELS[levelIdx];

  /* ── INIT LEVEL ── */
  const startLevel = useCallback((lIdx: number, selectedHero: typeof HEROES[0]) => {
    const lv = LEVELS[lIdx];
    setLevelIdx(lIdx);
    setPhase('fighting');
    setPlayerX(80);
    setPlayerAction('idle');
    setPlayerFacing(1);
    setScrollX(0);
    setCombo(0);
    setGirlRescued(false);
    setLevelMsg(`LEVEL ${lv.level}: ${lv.title}`);
    setTimeout(() => setLevelMsg(''), 2500);

    // Spawn enemies spaced across level
    const spawnedEnemies: EnemyState[] = Array.from({ length: lv.enemyCount }).map((_, i) => ({
      id: i,
      x: 350 + i * 140,
      health: 30 + lIdx * 8,
      maxHealth: 30 + lIdx * 8,
      action: 'idle',
    }));
    setEnemies(spawnedEnemies);

    tuneEngine.play(lv.tune, lv.bgTone);
  }, []);

  const startBoss = useCallback(() => {
    const lv = LEVELS[levelIdx];
    setPhase('boss');
    setBoss({ id: 999, x: 580, health: lv.bossHealth, maxHealth: lv.bossHealth, action: 'idle' });
    setLevelMsg(`BOSS: ${lv.bossName}`);
    setTimeout(() => setLevelMsg(''), 2000);
  }, [levelIdx]);

  /* ── ATTACK LOGIC ── */
  const doAttack = useCallback((type: 'punch'|'kick'|'special') => {
    if (!hero || phase !== 'fighting' && phase !== 'boss') return;
    setPlayerAction(type);
    setTimeout(() => setPlayerAction('idle'), 280);

    const RANGE = type === 'special' ? 180 : type === 'kick' ? 100 : 70;
    const DMG_BASE = type === 'special' ? 35 : type === 'kick' ? 18 : 12;

    // Hit nearby enemies
    if (phase === 'fighting') {
      setEnemies(prev => {
        let hit = false;
        const next = prev.map(e => {
          if (e.action === 'dead') return e;
          const dist = Math.abs(e.x - playerX);
          if (dist < RANGE) {
            hit = true;
            const dmg = DMG_BASE + Math.floor(Math.random() * 6);
            const newH = Math.max(0, e.health - dmg);
            setScore(s => s + dmg * 10);
            // Combo
            comboRef.current++;
            setCombo(comboRef.current);
            if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
            comboTimerRef.current = setTimeout(() => { comboRef.current = 0; setCombo(0); }, 1200);
            setHitFlash(`${dmg > 25 ? '💥 ' : ''}${dmg}`);
            setTimeout(() => setHitFlash(''), 500);
            return { ...e, health: newH, action: newH <= 0 ? 'dead' as const : 'hit' as const };
          }
          return e;
        });
        // Check if all dead → boss time
        const allDead = next.every(e => e.action === 'dead' || e.health <= 0);
        if (allDead && hit) setTimeout(startBoss, 600);
        return next;
      });
    }

    if (phase === 'boss' && boss) {
      const dist = Math.abs(boss.x - playerX);
      if (dist < RANGE) {
        const dmg = DMG_BASE + Math.floor(Math.random() * 8);
        setBoss(prev => {
          if (!prev) return prev;
          const newH = Math.max(0, prev.health - dmg);
          setHitFlash(`${dmg > 30 ? '💥 ' : ''}${dmg}`);
          setTimeout(() => setHitFlash(''), 500);
          if (newH <= 0) {
            setTimeout(() => {
              setPhase('bosswin');
              if (levelIdx === 4) {
                // Final level: rescue girl
                setGirlRescued(true);
                setTimeout(() => setPhase('complete'), 2500);
              } else {
                setTimeout(() => {
                  setLevelIdx(li => li + 1);
                  startLevel(levelIdx + 1, hero);
                }, 2000);
              }
            }, 600);
          }
          return { ...prev, health: newH, action: newH <= 0 ? 'dead' : 'hit' };
        });
      }
    }

    // Special cooldown
    if (type === 'special') {
      setSpecialReady(false);
      setSpecialCooldown(8);
      const cd = setInterval(() => {
        setSpecialCooldown(prev => {
          if (prev <= 1) { clearInterval(cd); setSpecialReady(true); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
  }, [hero, phase, playerX, boss, levelIdx, startBoss, startLevel]);

  /* ── MOVEMENT ── */
  const movePlayer = useCallback((dir: -1|1) => {
    setPlayerFacing(dir);
    setPlayerX(prev => {
      const next = prev + dir * 28;
      const clamped = Math.max(20, Math.min(700, next));
      // Auto-scroll
      if (clamped > 300) setScrollX(s => Math.max(0, s - dir * 20));
      return clamped;
    });
  }, []);

  /* ── ENEMY AI ── */
  useEffect(() => {
    if (phase !== 'fighting' && phase !== 'boss') return;
    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastEnemyHitRef.current < 800) return;

      // Enemies slowly walk toward player
      setEnemies(prev => prev.map(e => {
        if (e.action === 'dead' || e.health <= 0) return e;
        const dir = playerX > e.x ? 1 : -1;
        const newX = e.x + dir * 8;
        // Attack range
        if (Math.abs(newX - playerX) < 35) {
          lastEnemyHitRef.current = now;
          setPlayerHealth(h => Math.max(0, h - (5 + Math.floor(Math.random()*4))));
          setPlayerAction('hit');
          setTimeout(() => setPlayerAction('idle'), 200);
          if (playerHealth <= 0) setPhase('lose');
        }
        return { ...e, x: newX, action: Math.abs(newX - playerX) < 35 ? 'attack' : 'idle' };
      }));

      // Boss AI
      if (phase === 'boss' && boss && boss.health > 0) {
        setBoss(prev => {
          if (!prev) return prev;
          const dir = playerX > prev.x ? 1 : -1;
          const newX = prev.x + dir * 5;
          if (Math.abs(newX - playerX) < 55) {
            lastEnemyHitRef.current = now;
            setPlayerHealth(h => Math.max(0, h - (8 + Math.floor(Math.random()*6))));
            setPlayerAction('hit');
            setTimeout(() => setPlayerAction('idle'), 200);
          }
          return { ...prev, x: newX, action: Math.abs(newX - playerX) < 55 ? 'attack' : 'idle' };
        });
      }
    }, 600);
    return () => clearInterval(interval);
  }, [phase, playerX, boss, playerHealth]);

  /* ── KEYBOARD ── */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') movePlayer(-1);
      else if (e.key === 'ArrowRight') movePlayer(1);
      else if (e.key === 'z' || e.key === 'Z') doAttack('punch');
      else if (e.key === 'x' || e.key === 'X') doAttack('kick');
      else if (e.key === 's' || e.key === 'S') { if (specialReady) doAttack('special'); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, movePlayer, doAttack, specialReady]);

  /* ── SPECIAL ready after 8s ── */
  useEffect(() => {
    if (phase === 'fighting' || phase === 'boss') {
      setTimeout(() => setSpecialReady(true), 8000);
    }
  }, [phase, levelIdx]);

  /* ── CLEANUP ── */
  useEffect(() => {
    if (!open) tuneEngine.stop();
  }, [open]);

  if (!open) return null;

  const currentLevel = LEVELS[levelIdx];

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center"
      style={{ background:'hsla(218,67%,4%,0.97)' }}>

      {/* ── CLOSE BUTTON (top-left) ── */}
      <button onClick={() => { tuneEngine.stop(); onClose(); }}
        className="absolute top-4 left-4 z-50 flex items-center gap-1.5 rounded-full px-3 py-1.5 font-cinzel text-[9px] tracking-widest"
        style={{ background:'hsla(0,73%,40%,0.3)', border:'1px solid hsla(0,73%,40%,0.6)',
          color:'hsl(0,73%,60%)', boxShadow:'0 0 12px hsla(0,73%,40%,0.3)' }}
        aria-label="Close game">
        <X className="w-3.5 h-3.5" />CLOSE
      </button>

      {/* ── MUTE BUTTON (below close) ── */}
      <button onClick={() => { const m = tuneEngine.toggleMute(); setMuted(m); }}
        className="absolute top-14 left-4 z-50 flex items-center gap-1.5 rounded-full px-3 py-1.5 font-cinzel text-[9px] tracking-widest"
        style={{ background:'hsla(43,51%,54%,0.15)', border:'1px solid hsla(43,51%,54%,0.35)',
          color:'hsl(43,51%,54%)' }}
        aria-label="Toggle music">
        {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        {muted ? 'MUTED' : 'MUSIC'}
      </button>

      {/* ── HERO SELECT SCREEN ── */}
      {phase === 'select' && (
        <div className="flex flex-col items-center px-4 max-h-screen overflow-y-auto py-8">
          <h2 className="font-bebas text-4xl golden-text tracking-widest mb-1">BOLLYWOOD BRAWL</h2>
          <p className="font-cormorant text-sm text-muted-foreground italic mb-6">
            5 Levels · 5 Boss Fights · 1 Rescue Mission
          </p>
          <p className="font-cinzel text-[10px] tracking-widest text-primary mb-4">CHOOSE YOUR HERO</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-3xl w-full">
            {HEROES.map(h => (
              <button key={h.id}
                onClick={() => { setHero(h); setPlayerHealth(100); startLevel(0, h); }}
                className="interactive rounded-xl p-4 text-center transition-all hover:scale-105"
                style={{ background:`hsla(218,67%,6%,0.9)`,
                  border:`1px solid ${h.color}55`,
                  boxShadow:`0 0 16px ${h.color}22` }}>
                <div style={{ fontSize:'32px', marginBottom:'6px' }}>{h.emoji}</div>
                <div className="font-bebas text-lg" style={{ color:h.color }}>{h.name}</div>
                <div className="font-cinzel text-[8px] text-muted-foreground tracking-wider mt-1">{h.film}</div>
                <div style={{ width:'100%', height:'3px', borderRadius:'2px', background:h.color, opacity:0.6, marginTop:'6px' }} />
                <div className="font-cormorant text-[10px] italic mt-2" style={{ color:h.color }}>{h.power}</div>
              </button>
            ))}
          </div>
          <p className="font-cinzel text-[8px] text-muted-foreground mt-6 tracking-wider">
            ← → MOVE &nbsp;·&nbsp; Z PUNCH &nbsp;·&nbsp; X KICK &nbsp;·&nbsp; S SPECIAL
          </p>
        </div>
      )}

      {/* ── GAME SCREEN ── */}
      {(phase === 'fighting' || phase === 'boss' || phase === 'bosswin') && hero && (
        <div className="relative w-full max-w-2xl mx-4" style={{ height:'520px', overflow:'hidden',
          borderRadius:'12px', border:'1px solid hsla(43,51%,54%,0.3)',
          boxShadow:'0 0 40px hsla(43,51%,54%,0.15)' }}>

          {/* Background scene */}
          <LevelBackground level={currentLevel} scrollX={scrollX} />

          {/* HUD */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-2"
            style={{ background:'linear-gradient(180deg,hsla(218,67%,4%,0.9),transparent)' }}>
            {/* Player health */}
            <div className="flex flex-col gap-1">
              <div className="font-cinzel text-[8px] tracking-widest" style={{ color:hero.color }}>{hero.name}</div>
              <div style={{ width:'100px', height:'6px', background:'hsla(218,67%,10%,0.8)', borderRadius:'3px', overflow:'hidden' }}>
                <div style={{ height:'100%', background:hero.color, width:`${playerHealth}%`, transition:'width 0.3s',
                  boxShadow:`0 0 6px ${hero.color}` }} />
              </div>
            </div>
            {/* Level info */}
            <div className="text-center">
              <div className="font-bebas text-xs golden-text">LEVEL {currentLevel.level}</div>
              <div className="font-cinzel text-[7px] text-muted-foreground">{currentLevel.title}</div>
              <div className="font-bebas text-sm text-accent">{score}</div>
            </div>
            {/* Combo */}
            <div className="text-right">
              {combo > 1 && (
                <div className="font-bebas text-xl" style={{ color:'hsl(51,100%,50%)', animation:'fadeInUp 0.2s ease-out' }}>
                  {combo}x COMBO!
                </div>
              )}
              <div className="font-cinzel text-[8px] text-muted-foreground">
                LV {Array.from({ length:5 }).map((_,i) => i < levelIdx ? '◆' : '◇').join('')}
              </div>
            </div>
          </div>

          {/* Level transition message */}
          {levelMsg && (
            <div className="absolute inset-x-0 top-1/3 z-30 text-center pointer-events-none"
              style={{ animation:'fadeInUp 0.4s ease-out' }}>
              <div className="font-bebas text-3xl golden-text" style={{ textShadow:'0 0 30px hsl(43,51%,54%)' }}>
                {levelMsg}
              </div>
            </div>
          )}

          {/* Hit flash damage number */}
          {hitFlash && (
            <div className="absolute z-30 pointer-events-none font-bebas text-2xl"
              style={{ color:'hsl(0,80%,60%)', top:'40%', left:`${playerX + 30}px`,
                animation:'fadeInUp 0.4s ease-out forwards', textShadow:'0 0 8px hsl(0,80%,60%)' }}>
              -{hitFlash}
            </div>
          )}

          {/* Player */}
          {hero && (
            <HeroSprite hero={hero} action={playerAction} x={playerX} facing={playerFacing} />
          )}

          {/* Enemies */}
          {enemies.map(e => (
            <EnemySprite key={e.id} color={currentLevel.enemyColor} x={e.x - scrollX}
              health={e.health} maxHealth={e.maxHealth}
              name={currentLevel.enemyName} isBoss={false} action={e.action} />
          ))}

          {/* Boss */}
          {phase === 'boss' && boss && (
            <EnemySprite color={currentLevel.bossColor} x={boss.x - scrollX}
              health={boss.health} maxHealth={boss.maxHealth}
              name={currentLevel.bossName} isBoss action={boss.action} />
          )}

          {/* Girl child (level 5 boss fight only) */}
          {levelIdx === 4 && (phase === 'boss' || phase === 'bosswin') && (
            <GirlChild visible={true} rescued={girlRescued} />
          )}

          {/* Mobile controls */}
          <div className="absolute bottom-2 left-0 right-0 z-20 flex justify-between px-3">
            {/* D-pad */}
            <div className="flex gap-2">
              <button onPointerDown={() => { const iv = setInterval(()=>movePlayer(-1),80); return ()=>clearInterval(iv); }}
                onPointerUp={() => {}}
                className="w-10 h-10 rounded-lg font-bebas text-lg flex items-center justify-center"
                style={{ background:'hsla(218,67%,10%,0.8)', border:'1px solid hsla(43,51%,54%,0.3)', color:'hsl(43,51%,54%)' }}>←</button>
              <button onPointerDown={() => { const iv = setInterval(()=>movePlayer(1),80); return ()=>clearInterval(iv); }}
                className="w-10 h-10 rounded-lg font-bebas text-lg flex items-center justify-center"
                style={{ background:'hsla(218,67%,10%,0.8)', border:'1px solid hsla(43,51%,54%,0.3)', color:'hsl(43,51%,54%)' }}>→</button>
            </div>
            {/* Attack buttons */}
            <div className="flex gap-2">
              <button onClick={() => doAttack('punch')}
                className="w-10 h-10 rounded-full font-bebas text-sm"
                style={{ background:'hsl(0,73%,35%)', color:'hsl(42,42%,87%)', boxShadow:'0 0 10px hsl(0,73%,35%)' }}>P</button>
              <button onClick={() => doAttack('kick')}
                className="w-10 h-10 rounded-full font-bebas text-sm"
                style={{ background:'hsl(43,51%,54%)', color:'hsl(218,67%,4%)', boxShadow:'0 0 10px hsl(43,51%,54%)' }}>K</button>
              <button onClick={() => { if (specialReady) doAttack('special'); }}
                className="w-10 h-10 rounded-full font-bebas text-sm relative"
                style={{ background: specialReady ? `linear-gradient(135deg,${hero.color},hsl(51,100%,50%))` : 'hsla(218,67%,10%,0.8)',
                  color: specialReady ? 'hsl(218,67%,4%)' : 'hsl(43,51%,54%)', opacity: specialReady ? 1 : 0.5 }}>
                {specialReady ? 'S' : specialCooldown}
              </button>
            </div>
          </div>

          {/* Boss win overlay */}
          {phase === 'bosswin' && !girlRescued && levelIdx < 4 && (
            <div className="absolute inset-0 z-30 flex items-center justify-center"
              style={{ background:'hsla(218,67%,4%,0.7)', backdropFilter:'blur(4px)' }}>
              <div className="text-center animate-[fadeInUp_0.4s_ease-out]">
                <div style={{ fontSize:'48px' }}>🏆</div>
                <div className="font-bebas text-3xl golden-text">LEVEL CLEAR!</div>
                <div className="font-cormorant text-sm text-muted-foreground italic mt-2">
                  Next level loading...
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── GAME OVER ── */}
      {phase === 'lose' && (
        <div className="flex flex-col items-center gap-4">
          <div style={{ fontSize:'56px' }}>💀</div>
          <h3 className="font-bebas text-5xl" style={{ color:'hsl(0,73%,50%)' }}>GAME OVER</h3>
          <p className="font-cormorant text-lg text-muted-foreground italic">The villains won this time...</p>
          <div className="font-bebas text-2xl golden-text">SCORE: {score}</div>
          <div className="flex gap-3">
            <button onClick={() => { if(hero){ setPlayerHealth(100); startLevel(levelIdx, hero); } }}
              className="interactive px-6 py-2 rounded-full font-cinzel text-[10px] tracking-widest text-primary-foreground"
              style={{ background:'linear-gradient(135deg,hsl(43,51%,54%),hsl(51,100%,50%))', boxShadow:'0 0 16px hsla(43,51%,54%,0.4)' }}>
              RETRY LEVEL
            </button>
            <button onClick={() => { setPhase('select'); setScore(0); setLevelIdx(0); tuneEngine.stop(); }}
              className="interactive px-6 py-2 rounded-full font-cinzel text-[10px] tracking-widest"
              style={{ border:'1px solid hsla(43,51%,54%,0.4)', color:'hsl(43,51%,54%)' }}>
              CHANGE HERO
            </button>
          </div>
        </div>
      )}

      {/* ── COMPLETE / RESCUE SCREEN ── */}
      {phase === 'complete' && (
        <div className="flex flex-col items-center gap-4 text-center px-8">
          <div style={{ fontSize:'64px', animation:'floatUp 1s ease-in-out infinite alternate' }}>🧒✨</div>
          <h3 className="font-bebas text-5xl golden-text" style={{ animation:'glitchFlicker 3s ease-in-out infinite' }}>
            MISSION COMPLETE!
          </h3>
          <p className="font-cormorant text-xl italic" style={{ color:'hsl(142,70%,60%)' }}>
            The girl child has been rescued!
          </p>
          <p className="font-cormorant text-sm text-muted-foreground italic max-w-sm">
            Justice prevails. Today, Bollywood's finest heroes stood together for what truly matters.
          </p>
          <div className="font-bebas text-3xl golden-text">FINAL SCORE: {score.toLocaleString()}</div>
          {/* Hero cameos */}
          <div className="flex gap-3 mt-2">
            {HEROES.map(h => (
              <div key={h.id} style={{ fontSize:'20px', animation:`floatUp ${1+Math.random()}s ease-in-out infinite alternate` }}>
                {h.emoji}
              </div>
            ))}
          </div>
          <button onClick={() => { setPhase('select'); setScore(0); setLevelIdx(0); tuneEngine.stop(); }}
            className="interactive mt-4 px-8 py-3 rounded-full font-cinzel text-xs tracking-[0.2em] text-primary-foreground"
            style={{ background:'linear-gradient(135deg,hsl(43,51%,54%),hsl(51,100%,50%))', boxShadow:'0 0 24px hsla(43,51%,54%,0.5)' }}>
            PLAY AGAIN
          </button>
        </div>
      )}
    </div>
  );
};

export default BollywoodBrawl;
