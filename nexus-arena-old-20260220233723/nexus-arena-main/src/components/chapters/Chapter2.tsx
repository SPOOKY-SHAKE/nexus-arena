import { useState, useEffect, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import QuizGame from '@/components/QuizGame';
import { Play, Trophy, Music, BookOpen, Dumbbell, Palette } from 'lucide-react';

const AnimatedCounter = ({ target, active }: { target: number; active: boolean }) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
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
      <h2 className="font-bebas text-4xl md:text-6xl tracking-wider mb-6"
        style={{ color: 'hsl(var(--foreground))', textShadow: '0 0 20px hsla(0, 0%, 100%, 0.15)' }}>
        LEADERBOARD
      </h2>

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

const CricketSlide = () => (
  <div id="slide-2-2" className="slide flex flex-col items-center justify-center px-6">
    <h2 className="font-bebas text-4xl md:text-6xl golden-text tracking-wider mb-6">CRICKET STADIUM</h2>

    {/* Stadium SVG */}
    <div className="relative w-full max-w-lg aspect-square">
      <svg viewBox="0 0 400 400" className="w-full h-full">
        {/* Stadium outline */}
        <ellipse cx="200" cy="200" rx="180" ry="180" fill="hsl(215, 55%, 8%)" stroke="hsl(43, 51%, 54%)" strokeWidth="2" opacity="0.6" />
        <ellipse cx="200" cy="200" rx="120" ry="120" fill="none" stroke="hsl(43, 51%, 54%)" strokeWidth="0.5" opacity="0.3" />
        <ellipse cx="200" cy="200" rx="60" ry="60" fill="none" stroke="hsl(43, 51%, 54%)" strokeWidth="0.5" opacity="0.3" />
        {/* Pitch */}
        <rect x="190" y="160" width="20" height="80" fill="hsl(43, 51%, 54%)" opacity="0.2" rx="2" />
        {/* Floodlights */}
        {[45, 135, 225, 315].map(angle => {
          const rad = (angle * Math.PI) / 180;
          const x = 200 + Math.cos(rad) * 170;
          const y = 200 + Math.sin(rad) * 170;
          return (
            <g key={angle}>
              <circle cx={x} cy={y} r="6" fill="hsl(51, 100%, 50%)" opacity="0.5" />
              <circle cx={x} cy={y} r="15" fill="none" stroke="hsl(51, 100%, 50%)" strokeWidth="0.5" opacity="0.2" />
            </g>
          );
        })}
        {/* Labels */}
        <text x="200" y="200" textAnchor="middle" fill="hsl(43, 51%, 54%)" fontSize="8" fontFamily="Cinzel Decorative" opacity="0.6">PITCH</text>
        <text x="200" y="90" textAnchor="middle" fill="hsl(43, 51%, 54%)" fontSize="6" fontFamily="Cinzel Decorative" opacity="0.4">PAVILION</text>
        <text x="200" y="320" textAnchor="middle" fill="hsl(43, 51%, 54%)" fontSize="6" fontFamily="Cinzel Decorative" opacity="0.4">VIP BOX</text>
      </svg>

      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="glass-panel rounded-lg px-6 py-4 text-center">
          <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="font-cinzel text-xs tracking-widest text-primary">ANT CRICKET</p>
          <p className="font-cormorant text-xs text-muted-foreground mt-1">Coming in the next update</p>
        </div>
      </div>
    </div>
  </div>
);

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
