import { useEffect, useState } from 'react';
import AvirbhaavLogo from '@/components/AvirbhaavLogo';
import { Volume2, VolumeX, ChevronDown } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const HeroSlide = () => {
  const { audioEnabled, setAudioEnabled } = useApp();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div id="slide-1-0" className="slide flex items-center justify-center relative overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ filter: 'brightness(0.35) saturate(0.9) contrast(1.1)' }}
      >
        <source src="/hero-drone.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/60 z-1" />

      <div className={`relative z-10 text-center transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Rotating mandala logo */}
        <div className="relative flex items-center justify-center mb-4" style={{ height:'172px' }}>
          {/* Outer pulse ring */}
          <div className="absolute" style={{ width:'190px', height:'190px', borderRadius:'50%', 
            border:'1px solid hsla(43,51%,54%,0.2)', animation:'pulseGlow 4s ease-in-out infinite' }} />
          {/* Mandala rotates slowly */}
          <div style={{ width:'158px', height:'158px', animation:'spinSlow 28s linear infinite' }}>
            <img src="/avirbhav-logo.png" alt="AVIRBHAAV 2026" 
              style={{ width:'100%', height:'100%', objectFit:'contain',
                filter:'drop-shadow(0 0 22px hsla(43,51%,54%,0.7)) drop-shadow(0 0 44px hsla(33,100%,50%,0.3))' }} />
          </div>
          {/* Subtle static glow center */}
          <div className="absolute" style={{ width:'60px', height:'60px', borderRadius:'50%', 
            background:'radial-gradient(circle,hsla(43,51%,54%,0.15),transparent)',
            pointerEvents:'none' }} />
        </div>
        <AvirbhaavLogo size="lg" />

        <div className="mt-6 px-5 py-1.5 rounded-full border border-primary/30 inline-block"
          style={{ background: 'hsla(43, 51%, 54%, 0.12)', backdropFilter: 'blur(8px)' }}>
          <span className="font-cinzel text-[10px] md:text-xs tracking-[0.2em] text-primary">
            NATIONAL UNIVERSITY OF STUDY AND RESEARCH IN LAW
          </span>
        </div>

        <p className="mt-5 font-cormorant italic text-lg md:text-2xl text-foreground/80">
          Where Law Meets Legacy.
        </p>

        <div className="mt-12 flex flex-col items-center" style={{ animation: 'floatUp 3s ease-in-out infinite' }}>
          <span className="font-cinzel text-[9px] tracking-[0.3em] text-primary/50">SCROLL TO ENTER</span>
          <ChevronDown className="w-4 h-4 text-primary/50 mt-1" />
        </div>
      </div>

      {/* Audio toggle */}
      <button
        onClick={() => setAudioEnabled(!audioEnabled)}
        className="interactive absolute top-14 right-4 text-primary/50 hover:text-primary transition-colors z-20"
        aria-label="Toggle audio"
      >
        {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      </button>
    </div>
  );
};

const StandOutSlide = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    const el = document.getElementById('slide-1-1');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: '500+', label: 'Participants' },
    { value: '20+', label: 'Competitions' },
    { value: "#1", label: "India's Premier Law Fest" },
  ];

  return (
    <div id="slide-1-1" className="slide ink-bloom flex flex-col items-center justify-center px-6">
      <h2 className={`font-bebas text-5xl md:text-8xl golden-text tracking-wider mb-10 transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}>
        STAND OUT WITH US
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mb-10">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`glass-panel rounded-lg p-6 text-center transition-all duration-500 hover:scale-105 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              transitionDelay: `${i * 150 + 300}ms`,
              animationDelay: `${i * 150 + 300}ms`,
              animation: visible ? 'fadeInUp 0.6s ease-out forwards' : 'none',
            }}
          >
            <p className="font-bebas text-4xl golden-text">{stat.value}</p>
            <p className="font-cormorant text-sm text-muted-foreground mt-2">{stat.label}</p>
          </div>
        ))}
      </div>

      <a
        href="https://forms.google.com/AVIRBHAV-REGISTRATION-PLACEHOLDER"
        target="_blank"
        rel="noopener noreferrer"
        className="interactive inline-flex items-center gap-2 px-8 py-3 rounded-full font-cinzel text-xs tracking-[0.2em] text-primary-foreground relative overflow-hidden group"
        style={{ background: 'linear-gradient(135deg, hsl(43, 51%, 54%), hsl(51, 100%, 50%))' }}
      >
        <span className="relative z-10">BE PART OF HISTORY</span>
        {/* Arrow icon */}
        <svg className="relative z-10 w-3 h-3 transition-transform group-hover:translate-x-1" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0l8 8-8 8-1.4-1.4 5.6-5.6H0V7h12.2L6.6 1.4z"/>
        </svg>
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'linear-gradient(135deg, hsl(51, 100%, 50%), hsl(43, 51%, 54%))' }}
        />
      </a>
    </div>
  );
};

const ActivitiesSlide = () => {
  const activities = [
    { name: 'Debate', img: 'https://picsum.photos/seed/debate/400/300' },
    { name: 'Cultural Night', img: 'https://picsum.photos/seed/cultural/400/500' },
    { name: 'Fashion Show', img: 'https://picsum.photos/seed/fashion/400/350' },
    { name: 'Legal Aid', img: 'https://picsum.photos/seed/legal/400/400' },
    { name: 'Treasure Hunt', img: 'https://picsum.photos/seed/treasure/400/450' },
  ];

  return (
    <div id="slide-1-2" className="slide flex flex-col items-center justify-center px-6 py-16">
      <h2 className="font-bebas text-4xl md:text-7xl tracking-wider mb-10">
        <span className="golden-text">ENTER THE </span>
        <span className="text-crimson">FANTASY</span>
      </h2>

      <div className="columns-2 md:columns-3 gap-4 max-w-5xl w-full">
        {activities.map((act, i) => (
          <div key={i} className="mb-4 break-inside-avoid group relative overflow-hidden rounded-lg interactive">
            <img
              src={act.img}
              alt={act.name}
              className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-end justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'linear-gradient(0deg, hsla(218, 67%, 4%, 0.85) 0%, transparent 60%)' }}>
              <span className="font-cinzel text-sm tracking-widest text-primary pb-4">{act.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LeaderSlide = () => (
  <div id="slide-1-3" className="slide flex items-center justify-center px-6">
    <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10 items-center">
      {/* Portrait — replace existing portrait div */}
      <div className="flex flex-col items-center">
        <div
          className="relative overflow-hidden"
          style={{
            width: '220px',
            height: '280px',
            borderRadius: '12px',
            border: '2px solid hsla(43,51%,54%,0.5)',
            boxShadow: '0 0 40px hsla(43,51%,54%,0.2), 0 0 80px hsla(43,51%,54%,0.08)',
          }}
        >
          <img
            src="/vc-portrait.png"
            alt="Vice Chancellor, NUSRL"
            className="w-full h-full object-cover object-top"
          />
          {/* Gold shimmer overlay at bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 h-16"
            style={{
              background: 'linear-gradient(0deg, hsla(218,67%,4%,0.7) 0%, transparent 100%)',
            }}
          />
        </div>
        <p className="font-cinzel text-sm text-primary mt-4 tracking-wider">
          Prof. [Vice Chancellor Name]
        </p>
        <p className="font-cormorant text-xs text-muted-foreground italic">
          Vice Chancellor, NUSRL Ranchi
        </p>
        {/* Gold divider line below name */}
        <div
          className="mt-3 w-24 h-[1px]"
          style={{ background: 'linear-gradient(90deg, transparent, hsl(43,51%,54%), transparent)' }}
        />
      </div>

      {/* Speech */}
      <div>
        <h2 className="font-cinzel text-sm md:text-base golden-text tracking-widest mb-6">
          FROM THE DESK OF THE VICE CHANCELLOR
        </h2>
        <div className="max-h-[50vh] overflow-y-auto pr-4 space-y-4 font-cormorant text-foreground/80 italic leading-relaxed text-base">
          <p>
            "It is with great pride and immense honour that I welcome you to AVIRBHAAV —
            the crown jewel of our university's cultural legacy. This event represents
            not merely a gathering of minds, but a convergence of passion, intellect,
            and the unwavering spirit of legal scholarship."
          </p>
          <p>
            "At NUSRL Ranchi, we believe the pursuit of justice extends beyond
            the courtroom. Through AVIRBHAAV, we create a space where future legal
            luminaries express themselves through debate, art, sport, and camaraderie —
            because a great lawyer is also a great human being."
          </p>
          <p>
            "I invite each of you to immerse fully in this experience — challenge
            conventions, forge lasting bonds, and let your brilliance illuminate
            every corner of this magnificent celebration. May AVIRBHAAV be the
            catalyst that transforms your aspirations into achievements."
          </p>
          <p className="not-italic text-primary/60 text-sm">
            — With warm regards and highest expectations
          </p>
        </div>
        {/* Signature line */}
        <div className="mt-6 flex items-center gap-3">
          <div className="h-[1px] flex-1" style={{ background: 'linear-gradient(90deg, hsl(43, 51%, 54%), transparent)' }} />
          <svg viewBox="0 0 100 30" className="w-24 text-primary opacity-50">
            <path d="M5 25 C15 10, 25 5, 40 15 C50 20, 55 10, 65 12 C75 14, 85 5, 95 8"
              fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  </div>
);

const Chapter1 = () => (
  <section id="chapter-0" className="h-screen snap-start">
    <div className="flex h-full overflow-x-auto snap-x snap-mandatory">
      <HeroSlide />
      <StandOutSlide />
      <ActivitiesSlide />
      <LeaderSlide />
    </div>
  </section>
);

export default Chapter1;
