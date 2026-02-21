import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import QuizGame from '@/components/QuizGame';
import ParticleText from '@/components/ParticleText';
import { Play } from 'lucide-react';
import LeaderboardSync from '@/components/LeaderboardSync';

const AnimatedCounter = ({ target, active }: { target: number; active: boolean }) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = 0;
    const duration = 1200;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, active]);
  return <>{value}</>;
};

const LeaderboardSlide = () => {
  const { leaderboardData, setLeaderboardData } = useApp();
  const [quizOpen, setQuizOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    const el = document.getElementById('slide-2-0');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const tickerMessages = [
    'Team Apex just scored 200 pts! 🔥',
    'Legal Eagles clinch the debate round! ⚖️',
    'Justice League dominates the moot court! 🏛️',
    'New high score in Legal Quiz Blitz! 🎯',
    'NUSRL team advances to finals! 🏆',
  ];

  return (
    <div id="slide-2-0" className="slide flex flex-col items-center justify-center px-4 md:px-8">
      <ParticleText
        text="LEADERBOARD"
        fontSize={72}
        color="hsl(43,51%,54%)"
        height={100}
        className="mb-4"
      />

      {/* Table */}
      <div className="w-full max-w-3xl glass-panel rounded-lg overflow-hidden mb-6">
        <div className="grid grid-cols-[50px_1fr_1fr_80px_50px] gap-2 px-4 py-2 text-[10px] font-cinzel tracking-wider text-muted-foreground border-b border-border">
          <span>RANK</span><span>NAME</span><span>COLLEGE</span><span>PTS</span><span></span>
        </div>
        <div className="max-h-[35vh] overflow-y-auto">
          {leaderboardData.map((entry, i) => (
            <div key={i}
              className={`grid grid-cols-[50px_1fr_1fr_80px_50px] gap-2 px-4 py-2.5 text-sm font-cormorant items-center border-b border-border/30 transition-all ${
                i < 3 ? 'text-accent' : 'text-foreground/80'
              }`}
              style={{
                animation: visible ? `fadeInUp 0.4s ease-out ${i * 60}ms forwards` : 'none',
                opacity: visible ? undefined : 0,
              }}
            >
              <span className="font-bebas text-lg">{entry.rank}</span>
              <span>{entry.name}</span>
              <span className="text-xs text-muted-foreground truncate">{entry.college}</span>
              <span className="font-bebas text-base">
                <AnimatedCounter target={entry.points} active={visible} />
              </span>
              <span>{entry.badge}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Play button */}
      <button
        onClick={() => setQuizOpen(true)}
        className="interactive flex items-center gap-3 px-8 py-3 rounded-full font-cinzel text-xs tracking-[0.2em] text-primary-foreground mb-6"
        style={{
          background: 'linear-gradient(135deg, hsl(43, 51%, 54%), hsl(51, 100%, 50%))',
          boxShadow: '0 0 20px hsla(43, 51%, 54%, 0.3)',
        }}
      >
        <Play className="w-4 h-4" />
        PLAY LEGAL QUIZ BLITZ
      </button>

      {/* Ticker */}
      <div className="w-full max-w-3xl overflow-hidden h-6">
        <div className="whitespace-nowrap" style={{ animation: 'tickerScroll 20s linear infinite' }}>
          {tickerMessages.concat(tickerMessages).map((msg, i) => (
            <span key={i} className="font-cormorant text-xs text-muted-foreground mx-8">{msg}</span>
          ))}
        </div>
      </div>

      <LeaderboardSync />
      <QuizGame
        open={quizOpen}
        onClose={() => setQuizOpen(false)}
        onScore={(pts) => {
          if (pts > 0) {
            setLeaderboardData(prev => {
              const updated = [...prev];
              if (updated[8]) updated[8] = { ...updated[8], points: updated[8].points + pts };
              return updated;
            });
          }
        }}
      />
    </div>
  );
};

/* Rest of the file components like EventsSlide and CricketSlide remain exactly the same as they were after prompt #3 */
/* I will include them to ensure the file remains functional and complete */

import { BookOpen, Dumbbell, Palette } from 'lucide-react';

const EventsSlide = () => {
  const [expanded, setExpanded] = useState<number | null>(null);

  const categories = [
    {
      title: 'LITERARY EVENTS',
      icon: BookOpen,
      color: 'hsla(43, 51%, 54%, 0.1)',
      borderColor: 'hsla(43, 51%, 54%, 0.4)',
      events: ['Debate', 'Extempore', 'Creative Writing', 'Model UN'],
    },
    {
      title: 'SPORTS EVENTS',
      icon: Dumbbell,
      color: 'hsla(0, 73%, 40%, 0.08)',
      borderColor: 'hsla(0, 73%, 40%, 0.3)',
      events: ['Cricket', 'Football', 'Basketball', 'Carrom', 'Badminton'],
    },
    {
      title: 'CULTURAL EVENTS',
      icon: Palette,
      color: 'hsla(33, 100%, 50%, 0.08)',
      borderColor: 'hsla(33, 100%, 50%, 0.3)',
      events: ['Dance', 'Music', 'Fashion Show', 'Skit', 'Stand-up Comedy'],
    },
  ];

  return (
    <div id="slide-2-1" className="slide concert-bg flex flex-col items-center justify-center px-6">
      <h2 className="font-bebas text-3xl md:text-5xl golden-text tracking-wider mb-8">
        LITERARY · SPORTS · CULTURAL
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        {categories.map((cat, ci) => {
          const Icon = cat.icon;
          return (
            <div
              key={ci}
              className="rounded-lg p-6 transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: cat.color,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${cat.borderColor}`,
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Icon className="w-5 h-5 text-primary" />
                <h3 className="font-cinzel text-xs tracking-widest text-primary">{cat.title}</h3>
              </div>
              <div className="space-y-2 mb-4">
                {cat.events.map((evt, ei) => (
                  <div key={ei} className="flex items-center gap-2 font-cormorant text-sm text-foreground/80">
                    <div className="w-1 h-1 rounded-full bg-primary/50" />
                    <span>{evt}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setExpanded(expanded === ci ? null : ci)}
                className="interactive font-cinzel text-[10px] tracking-widest text-primary/70 hover:text-accent transition-colors"
              >
                {expanded === ci ? 'CLOSE' : 'VIEW DETAILS'}
              </button>
              {expanded === ci && (
                <div className="mt-4 pt-4 border-t border-border/30 font-cormorant text-xs text-muted-foreground leading-relaxed">
                  Competition format: Knockout rounds leading to grand finals. Teams of 2-4 members.
                  Registration opens 2 weeks prior. Certificates for all participants, trophies for winners.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const BOLLYWOOD_FACTS: Record<string | number, { movie: string; year: number; fact: string; stars: string }> = {
  1: {
    movie: 'Lagaan',
    year: 2001,
    fact: 'The climactic cricket match scene was shot over 3 weeks in Bhuj. The film was nominated for the Academy Award for Best Foreign Language Film.',
    stars: 'Aamir Khan, Gracy Singh',
  },
  2: {
    movie: 'Dil Chahta Hai',
    year: 2001,
    fact: 'Farhan Akhtar\'s directorial debut redefined an entire generation of Bollywood storytelling. Shot partly in Sydney, Australia.',
    stars: 'Aamir Khan, Saif Ali Khan, Akshaye Khanna',
  },
  3: {
    movie: 'Rang De Basanti',
    year: 2006,
    fact: 'A.R. Rahman\'s score was composed in just 45 days. The film sparked nationwide youth protests about accountability in India.',
    stars: 'Aamir Khan, Soha Ali Khan, R. Madhavan',
  },
  4: {
    movie: 'Sholay',
    year: 1975,
    fact: 'Though released in 1975, Sholay\'s dialogues are still quoted daily across India. "Kitne aadmi the?" remains one of Indian cinema\'s most iconic lines.',
    stars: 'Amitabh Bachchan, Dharmendra, Hema Malini',
  },
  6: {
    movie: 'Mughal-E-Azam',
    year: 1960,
    fact: 'Took 16 years to complete. The "Pyar Kiya Toh Darna Kya" sequence used 100,000 pieces of glass imported from Belgium for the mirror palace.',
    stars: 'Dilip Kumar, Madhubala',
  },
  W: {
    movie: 'Kuch Kuch Hota Hai',
    year: 1998,
    fact: 'Karan Johar\'s directorial debut. The basketball game sequence became one of the most iconic college scenes in Indian cinema history.',
    stars: 'Shah Rukh Khan, Kajol, Rani Mukerji',
  },
};

const BollywoodBadge = ({ outcome }: { outcome: string | number }) => {
  const fact = BOLLYWOOD_FACTS[outcome];
  if (!fact) return null;
  return (
    <div className="mt-4 pt-4 border-t border-primary/20">
      <p className="font-cinzel text-[8px] tracking-[0.2em] text-primary/60 mb-1">🎬 BOLLYWOOD VAULT</p>
      <p className="font-bebas text-base golden-text">{fact.movie} ({fact.year})</p>
      <p className="font-cormorant text-xs italic text-foreground/70 leading-relaxed mt-1">{fact.fact}</p>
      <p className="font-cinzel text-[8px] text-muted-foreground mt-2 tracking-wider">{fact.stars}</p>
    </div>
  );
};

const CricketSlide = () => {
  const { setLeaderboardData } = useApp();

  type GamePhase = 'ready' | 'batting' | 'result' | 'over';
  type Outcome = 1 | 2 | 3 | 4 | 6 | 'W';

  const [gamePhase, setGamePhase] = useState<GamePhase>('ready');
  const [ballsLeft, setBallsLeft] = useState(6);
  const [totalRuns, setTotalRuns] = useState(0);
  const [lastOutcome, setLastOutcome] = useState<Outcome | null>(null);
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [vipGlow, setVipGlow] = useState(false);

  const handleBat = () => {
    if (gamePhase !== 'ready') return;
    setGamePhase('batting');
    setActiveZone(null);
    const r = Math.random();
    let outcome: Outcome;
    if (r < 0.28) outcome = 1;
    else if (r < 0.50) outcome = 2;
    else if (r < 0.68) outcome = 3;
    else if (r < 0.80) outcome = 4;
    else if (r < 0.88) outcome = 6;
    else outcome = 'W';
    setTimeout(() => {
      setLastOutcome(outcome);
      if (outcome !== 'W') setTotalRuns(p => p + (outcome as number));
      if (outcome === 4) { setVipGlow(true); setTimeout(() => setVipGlow(false), 3000); }
      if (outcome === 6) {
        setLeaderboardData(prev => {
          const u = [...prev];
          if (u[8]) u[8] = { ...u[8], points: u[8].points + 50 };
          return u.sort((a, b) => b.points - a.points).map((e, i) => ({ ...e, rank: i + 1 }));
        });
      }
      const newBalls = ballsLeft - 1;
      setBallsLeft(newBalls);
      setGamePhase('result');
      setTimeout(() => {
        setGamePhase(newBalls <= 0 ? 'over' : 'ready');
        if (newBalls > 0) setLastOutcome(null);
      }, 3000);
    }, 400);
  };

  const resetGame = () => {
    setBallsLeft(6); setTotalRuns(0); setLastOutcome(null);
    setVipGlow(false); setActiveZone(null); setGamePhase('ready');
  };

  const ZONES: Record<string, string> = {
    pitch: 'Core Competitions — 100 pts per win',
    inner: 'Participation Points — 20 pts per event entered',
    outer: 'Bonus Challenges — 50 pts per challenge',
    pavilion: 'Attendance & Engagement — 10 pts per day',
    vip: 'Special Jury Points — up to 200 pts by panel',
  };

  const resultCards: Record<string | number, JSX.Element> = {
    1: (
      <div className="glass-panel rounded-xl p-8 text-center max-w-sm mx-4 animate-[fadeInUp_0.35s_ease-out]"
        style={{ border: '2px solid hsl(43,51%,54%)' }}>
        <div className="text-5xl mb-3">⚡</div>
        <h3 className="font-bebas text-4xl golden-text mb-2">1 RUN</h3>
        <p className="font-cinzel text-sm text-primary tracking-wider mb-2">KNOCKOUT ENTRY</p>
        <p className="font-cormorant text-base text-foreground/80 italic">
          Round 1 Qualifier — You've earned entry into any Literary, Sports, or Cultural knockout round.
        </p>
        <div className="mt-4 overflow-hidden h-7 glass-panel rounded px-3">
          <div className="font-bebas text-lg text-accent whitespace-nowrap" style={{ animation: 'tickerScroll 2s ease-out forwards' }}>
            DEBATE · CRICKET · DANCE · MOOT COURT · MUSIC ·
          </div>
        </div>
        <BollywoodBadge outcome={1} />
      </div>
    ),
    2: (
      <div className="glass-panel rounded-xl p-8 text-center max-w-sm mx-4 animate-[fadeInUp_0.35s_ease-out]"
        style={{ border: '2px solid hsl(215,60%,65%)' }}>
        <div className="text-5xl mb-3">🛡️</div>
        <h3 className="font-bebas text-4xl mb-2" style={{ color: 'hsl(215,60%,75%)' }}>2 RUNS</h3>
        <p className="font-cinzel text-sm tracking-wider mb-2" style={{ color: 'hsl(215,60%,75%)' }}>SEMI-FINALIST</p>
        <p className="font-cormorant text-base text-foreground/80 italic mb-4">
          Knockout Survivor — Promoted to Round 2. Your performance has been noted.
        </p>
        <div className="flex justify-center gap-2">
          {[0,150,300,450,600].map(d => (
            <span key={d} className="text-2xl" style={{ animation: `fadeInUp 0.4s ease-out ${d}ms both` }}>⭐</span>
          ))}
        </div>
        <BollywoodBadge outcome={2} />
      </div>
    ),
    3: (
      <div className="glass-panel rounded-xl p-8 text-center max-w-sm mx-4 animate-[fadeInUp_0.35s_ease-out]"
        style={{ border: '2px solid hsl(33,100%,50%)' }}>
        <div className="text-5xl mb-3" style={{ animation: 'fadeInUp 0.6s ease-out 0.3s both' }}>🏆</div>
        <h3 className="font-bebas text-4xl mb-2" style={{ color: 'hsl(33,100%,60%)' }}>3 RUNS</h3>
        <p className="font-cinzel text-sm tracking-wider mb-2" style={{ color: 'hsl(33,100%,60%)' }}>EMERGING RECORD PLAYER</p>
        <p className="font-cormorant text-base text-foreground/80 italic">
          Best Performance Nominee — Your name enters the Hall of Records.
        </p>
        <div className="mt-4 font-cinzel text-[10px] tracking-widest text-accent glass-panel rounded px-3 py-1">
          🏛️ HALL OF RECORDS — NOMINEE
        </div>
        <BollywoodBadge outcome={3} />
      </div>
    ),
    4: (
      <div className="glass-panel rounded-xl p-6 text-center max-w-md mx-4 relative overflow-hidden animate-[fadeInUp_0.35s_ease-out]"
        style={{ border: '2px solid hsl(0,73%,40%)' }}>
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="absolute pointer-events-none rounded-full"
            style={{ width: 5, height: 5, left: `${Math.random() * 100}%`, top: '-8px',
              background: i%3===0?'hsl(43,51%,54%)':i%3===1?'hsl(51,100%,50%)':'hsl(0,73%,40%)',
              animation: `floatUp ${1.5+Math.random()}s ease-in ${Math.random()*0.5}s infinite alternate` }} />
        ))}
        <div className="text-5xl mb-2">👑</div>
        <h3 className="font-bebas text-4xl golden-text mb-1">4 RUNS</h3>
        <p className="font-cinzel text-sm text-primary tracking-wider mb-3">SPECIAL JURY UNLOCKED · VIP ACCESS</p>
        <div className="grid grid-cols-2 gap-3 text-left">
          <div>
            <p className="font-cinzel text-[9px] tracking-widest text-primary mb-1">JURY CRITERIA</p>
            {['Exceptional originality','Cross-disciplinary feat','Outstanding artistry','Unanimous panel vote'].map((c,i)=>(
              <p key={i} className="font-cormorant text-xs text-foreground/80 flex gap-1"><span className="text-primary">•</span>{c}</p>
            ))}
          </div>
          <div>
            <p className="font-cinzel text-[9px] tracking-widest text-primary mb-1">VIP PERKS</p>
            {['Front-row finals seat','Backstage Cultural Night','Direct jury Q&A','VC Certificate'].map((p,i)=>(
              <p key={i} className="font-cormorant text-xs text-foreground/80 flex gap-1"><span className="text-accent">★</span>{p}</p>
            ))}
          </div>
        </div>
        <BollywoodBadge outcome={4} />
      </div>
    ),
    6: (
      <div className="absolute inset-0 flex flex-col items-center justify-center z-40 animate-[fadeInUp_0.35s_ease-out]"
        style={{ background: 'rgba(4,8,18,0.92)' }}>
        {Array.from({ length: 8 }).map((_,i)=>(
          <div key={i} className="absolute rounded-full pointer-events-none"
            style={{ width:8, height:8, left:`${10+i*11}%`, top:`${10+(i%3)*20}%`,
              background: i%2===0?'hsl(51,100%,50%)':'hsl(43,51%,54%)',
              animation:`ripple ${0.8+Math.random()*0.4}s ease-out ${i*0.1}s infinite` }} />
        ))}
        <div className="text-6xl mb-2">🏆</div>
        <h3 className="font-bebas text-6xl golden-text" style={{ animation:'glitchFlicker 2s ease-in-out infinite' }}>SIX!</h3>
        <p className="font-cinzel text-lg text-primary tracking-widest mt-1">CHAMPION STATUS</p>
        <p className="font-cormorant text-base text-foreground/80 italic mt-2 mb-4">
          Winner / Runner — You've hit the maximum. Event winner status achieved.
        </p>
        <div className="glass-panel rounded-lg px-6 py-2" style={{ border:'1px solid hsl(51,100%,50%)' }}>
          <span className="font-bebas text-xl" style={{ color:'hsl(142,70%,45%)' }}>+50 PTS ADDED TO LEADERBOARD!</span>
        </div>
        <div className="glass-panel rounded-lg px-4 py-3 mx-8 mt-3" style={{ border: '1px solid hsla(43,51%,54%,0.3)' }}>
          <BollywoodBadge outcome={6} />
        </div>
      </div>
    ),
    W: (
      <div className="glass-panel rounded-xl p-8 text-center max-w-sm mx-4 animate-[fadeInUp_0.35s_ease-out]"
        style={{ border: '2px solid hsl(0,73%,40%)' }}>
        <div className="flex justify-center gap-1 mb-4 relative h-12">
          {['-25deg','0deg','25deg'].map((rot,i)=>(
            <div key={i} className="w-2 h-10 rounded-sm bg-primary/70"
              style={{ transform:`rotate(${rot})`, animation:`fadeInUp 0.3s ease-out ${i*80}ms both`, transformOrigin:'bottom' }} />
          ))}
          <div className="absolute text-3xl" style={{ top:'-8px', animation:'floatUp 0.5s ease-out forwards' }}>💥</div>
        </div>
        <h3 className="font-bebas text-5xl" style={{ color:'hsl(0,73%,50%)' }}>OUT!</h3>
        <p className="font-cinzel text-sm text-primary tracking-wider mt-1 mb-2">ELIMINATED</p>
        <p className="font-cormorant text-base text-foreground/80 italic">The stumps have spoken.</p>
        <BollywoodBadge outcome="W" />
      </div>
    ),
  };

  return (
    <div id="slide-2-2" className="slide relative overflow-hidden flex flex-col items-center justify-start pt-12">

      {/* ── STADIUM SVG BACKGROUND ── */}
      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full" style={{ opacity: 0.9 }}>
        {/* Outer grass */}
        <ellipse cx="200" cy="200" rx="185" ry="185" fill="hsl(134, 38%, 10%)" stroke="hsl(43,51%,54%)" strokeWidth="2" />
        {/* Inner field */}
        <ellipse cx="200" cy="200" rx="130" ry="130" fill="hsl(134, 42%, 14%)" />
        {/* Boundary rope */}
        <ellipse cx="200" cy="200" rx="128" ry="128" fill="none" stroke="hsl(43,51%,54%)" strokeWidth="1.5" opacity="0.5" />
        {/* 30-yard circle */}
        <ellipse cx="200" cy="200" rx="80" ry="80" fill="none" stroke="hsl(43,51%,54%)" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.4" />

        {/* PAVILION zone — clickable top arc */}
        <path d="M 110,50 A 140,140 0 0,1 290,50 L 270,80 A 110,110 0 0,0 130,80 Z"
          fill={activeZone === 'pavilion' ? 'hsla(43,51%,54%,0.3)' : 'hsla(43,51%,54%,0.04)'}
          stroke="hsl(43,51%,54%)" strokeWidth="0.5" style={{ cursor:'pointer', transition:'fill 0.3s' }}
          onClick={() => setActiveZone(activeZone === 'pavilion' ? null : 'pavilion')} />
        <text x="200" y="68" textAnchor="middle" fill="hsl(43,51%,54%)" fontSize="7" fontFamily="Cinzel Decorative" opacity="0.7">PAVILION</text>

        {/* VIP BOX zone — clickable bottom arc, glows on 4-run */}
        <path d="M 110,350 A 140,140 0 0,0 290,350 L 270,320 A 110,110 0 0,1 130,320 Z"
          fill={vipGlow ? 'hsla(51,100%,50%,0.45)' : activeZone === 'vip' ? 'hsla(51,100%,50%,0.15)' : 'hsla(0,73%,40%,0.04)'}
          stroke={vipGlow ? 'hsl(51,100%,50%)' : 'hsl(0,73%,40%)'} strokeWidth={vipGlow ? 2 : 0.5}
          style={{ cursor:'pointer', transition:'all 0.3s', filter: vipGlow ? 'drop-shadow(0 0 14px hsl(51,100%,50%))' : 'none' }}
          onClick={() => setActiveZone(activeZone === 'vip' ? null : 'vip')} />
        <text x="200" y="342" textAnchor="middle" fill={vipGlow ? 'hsl(51,100%,50%)' : 'hsl(0,73%,40%)'} fontSize="7" fontFamily="Cinzel Decorative" opacity="0.9">VIP BOX</text>

        {/* Pitch — clickable */}
        <rect x="188" y="155" width="24" height="90" rx="3"
          fill={activeZone === 'pitch' ? 'hsla(43,51%,54%,0.5)' : 'hsla(43,51%,54%,0.2)'}
          stroke="hsl(43,51%,54%)" strokeWidth="1" style={{ cursor:'pointer', transition:'fill 0.3s' }}
          onClick={() => setActiveZone(activeZone === 'pitch' ? null : 'pitch')} />
        <line x1="186" y1="175" x2="214" y2="175" stroke="hsl(42,42%,87%)" strokeWidth="0.8" opacity="0.5" />
        <line x1="186" y1="225" x2="214" y2="225" stroke="hsl(42,42%,87%)" strokeWidth="0.8" opacity="0.5" />
        <text x="200" y="204" textAnchor="middle" fill="hsl(43,51%,54%)" fontSize="5" fontFamily="Cinzel Decorative" opacity="0.8">PITCH</text>

        {/* Invisible inner ring click zone */}
        <ellipse cx="200" cy="200" rx="104" ry="104" fill="transparent" stroke="transparent" strokeWidth="20"
          style={{ cursor:'pointer' }} onClick={() => setActiveZone(activeZone === 'inner' ? null : 'inner')} />
        <text x="200" y="135" textAnchor="middle" fill="hsl(43,51%,54%)" fontSize="6" fontFamily="Cinzel Decorative" opacity="0.35">INNER RING</text>

        {/* Invisible outer ring click zone */}
        <ellipse cx="200" cy="200" rx="158" ry="158" fill="transparent" stroke="transparent" strokeWidth="38"
          style={{ cursor:'pointer' }} onClick={() => setActiveZone(activeZone === 'outer' ? null : 'outer')} />
        <text x="338" y="205" textAnchor="middle" fill="hsl(0,73%,40%)" fontSize="6" fontFamily="Cinzel Decorative" opacity="0.35" transform="rotate(90,338,205)">OUTER RING</text>

        {/* Floodlights */}
        {[45,135,225,315].map(angle => {
          const rad = (angle * Math.PI) / 180;
          const lx = 200 + Math.cos(rad) * 178;
          const ly = 200 + Math.sin(rad) * 178;
          return (
            <g key={angle}>
              <circle cx={lx} cy={ly} r="7" fill="hsl(51,100%,50%)" opacity="0.7" />
              <circle cx={lx} cy={ly} r="18" fill="none" stroke="hsl(51,100%,50%)" strokeWidth="0.5" opacity="0.2" />
            </g>
          );
        })}

        {/* ── CRICKET BAT (centered at pitch) ── */}
        {/* Bat handle */}
        <rect x="197" y="150" width="6" height="30" rx="3" fill="hsl(42,42%,65%)" opacity="0.9" />
        {/* Bat blade — wider flat part */}
        <rect x="190" y="178" width="20" height="50" rx="4" fill="hsl(42,42%,78%)"
          style={{ filter: 'drop-shadow(0 0 6px hsla(43,51%,54%,0.4))' }} />
        {/* Bat edge highlight */}
        <rect x="190" y="178" width="4" height="50" rx="2 0 0 2" fill="hsl(42,42%,88%)" opacity="0.4" />
        {/* Bat brand stripe */}
        <rect x="192" y="195" width="16" height="2" rx="1" fill="hsl(43,51%,54%)" opacity="0.6" />

        {/* ── CRICKET BALL — animated floating ── */}
        {/* Ball glow */}
        <circle cx="240" cy="190" r="14" fill="hsla(0,73%,40%,0.15)" style={{ animation: 'floatUp 2s ease-in-out infinite' }} />
        {/* Ball body */}
        <circle cx="240" cy="190" r="10" fill="hsl(0,73%,40%)"
          style={{ animation: 'floatUp 2s ease-in-out infinite', filter: 'drop-shadow(0 0 8px hsla(0,73%,40%,0.8))' }} />
        {/* Ball seam lines */}
        <path d="M 233,186 C 237,188 237,192 233,194" fill="none" stroke="hsl(42,42%,78%)" strokeWidth="1" opacity="0.7"
          style={{ animation: 'floatUp 2s ease-in-out infinite' }} />
        <path d="M 247,186 C 243,188 243,192 247,194" fill="none" stroke="hsl(42,42%,78%)" strokeWidth="1" opacity="0.7"
          style={{ animation: 'floatUp 2s ease-in-out infinite' }} />
      </svg>

      {/* ── HUD — always on top ── */}
      <div className="absolute top-12 left-0 right-0 flex items-center justify-between px-6 z-20">
        <div className="glass-panel rounded-lg px-4 py-2 flex items-center gap-2">
          <span className="font-cinzel text-[9px] tracking-widest text-muted-foreground">BALLS</span>
          <div className="flex gap-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`w-3 h-3 rounded-full border transition-all ${
                i < ballsLeft ? 'bg-primary border-primary' : 'bg-transparent border-muted-foreground/30'
              }`} />
            ))}
          </div>
        </div>
        <h2 className="font-bebas text-3xl golden-text tracking-wider">CRICKET ARENA</h2>
        <div className="glass-panel rounded-lg px-4 py-2 text-center">
          <span className="font-cinzel text-[9px] tracking-widest text-muted-foreground block">RUNS</span>
          <span className="font-bebas text-2xl golden-text">{totalRuns}</span>
        </div>
      </div>

      {/* ── ZONE INFO CARD ── */}
      {activeZone && gamePhase === 'ready' && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 glass-panel rounded-lg px-5 py-3 text-center z-30 animate-[fadeInUp_0.3s_ease-out]"
          style={{ border:'1px solid hsla(43,51%,54%,0.4)', minWidth:'220px' }}>
          <p className="font-cinzel text-[10px] tracking-widest text-primary mb-1 uppercase">{activeZone.replace('vip','VIP BOX').replace('inner','INNER RING').replace('outer','OUTER RING')}</p>
          <p className="font-cormorant text-sm text-foreground/80">{ZONES[activeZone]}</p>
          <button onClick={() => setActiveZone(null)} className="interactive mt-2 font-cinzel text-[8px] text-muted-foreground hover:text-primary tracking-widest">CLOSE ×</button>
        </div>
      )}

      {/* ── BALL ANIMATION (mid-swing) ── */}
      {gamePhase === 'batting' && (
        <div className="absolute pointer-events-none z-20 rounded-full"
          style={{ width:12, height:12, background:'hsl(0,80%,55%)', boxShadow:'0 0 8px hsl(0,80%,55%)',
            top:'42%', left:'50%', transform:'translate(-50%,-50%)',
            animation:'floatUp 0.4s ease-out forwards' }} />
      )}

      {/* ── TAP TO BAT BUTTON ── */}
      {gamePhase === 'ready' && (
        <button className="interactive absolute z-20 flex flex-col items-center gap-3"
          style={{ top:'52%', left:'50%', transform:'translate(-50%,-50%)' }}
          onClick={handleBat}>
          <div className="w-24 h-24 rounded-full flex items-center justify-center font-bebas text-4xl"
            style={{ background:'radial-gradient(circle,hsl(43,51%,54%),hsl(25,76%,31%))',
              boxShadow:'0 0 30px hsla(43,51%,54%,0.5)', animation:'pulseGlow 2s ease-in-out infinite' }}>
            🏏
          </div>
          <span className="font-cinzel text-[10px] tracking-[0.2em] text-primary/80">TAP TO BAT</span>
        </button>
      )}

      {/* ── RESULT OVERLAY ── */}
      {gamePhase === 'result' && lastOutcome !== null && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center"
          style={{ background:'rgba(4,8,18,0.8)', backdropFilter:'blur(6px)' }}>
          {resultCards[lastOutcome]}
        </div>
      )}

      {/* ── GAME OVER ── */}
      {gamePhase === 'over' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center"
          style={{ background:'rgba(4,8,18,0.93)', backdropFilter:'blur(8px)' }}>
          <h3 className="font-bebas text-5xl golden-text mb-2">OVER COMPLETE</h3>
          <p className="font-cormorant text-2xl text-foreground/80 mb-1">
            Total Runs: <span className="golden-text font-bebas text-3xl">{totalRuns}</span>
          </p>
          <p className="font-cormorant text-lg italic text-muted-foreground mb-6">
            {totalRuns<=5?'"Needs Practice"':totalRuns<=12?'"Decent Knock"':totalRuns<=20?'"Fine Innings!"':'"Champion\'s Over!"'}
          </p>
          <button className="interactive px-8 py-3 rounded-full font-cinzel text-xs tracking-[0.2em] text-primary-foreground"
            style={{ background:'linear-gradient(135deg,hsl(43,51%,54%),hsl(51,100%,50%))', boxShadow:'0 0 20px hsla(43,51%,54%,0.4)' }}
            onClick={resetGame}>PLAY AGAIN</button>
        </div>
      )}
    </div>
  );
};

const Chapter2 = () => (
  <section id="chapter-1" className="h-screen snap-start">
    <div className="flex h-full overflow-x-auto snap-x snap-mandatory">
      <LeaderboardSlide />
      <EventsSlide />
      <CricketSlide />
    </div>
  </section>
);

export default Chapter2;
