import { useState } from 'react';
import { CheckSquare, Square, DoorOpen, Star, Award, Car } from 'lucide-react';
import HighwayCarGame from '@/components/HighwayCarGame';

const tcClauses = [
  'All participants must register through the official AVIRBHAAV portal with valid institutional ID.',
  'Eligibility is restricted to bona fide students of recognised law universities across India.',
  'All participants shall adhere to the code of conduct prescribed by the Organising Committee.',
  'Any form of misconduct, plagiarism, or unsportsmanlike behaviour shall result in immediate disqualification.',
  'Intellectual property rights of all submissions shall vest with AVIRBHAAV and NUSRL.',
  'By participating, all attendees consent to photography, videography, and media coverage of the event.',
  'Prize distribution is subject to fulfilment of all competition requirements and jury decisions, which are final.',
  'Disputes arising from participation shall be resolved through arbitration by the AVIRBHAAV Disciplinary Committee.',
  'NUSRL and the Organising Committee shall not be liable for personal injury, loss of property, or damages.',
  'The Organising Committee reserves the right to amend these terms at any time without prior notice.',
  'All matters shall be governed by the laws of India, with exclusive jurisdiction vested in courts at Ranchi, Jharkhand.',
  'Registration and participation constitute unconditional acceptance of all terms and conditions herein.',
];

const TermsSlide = () => {
  const [accepted, setAccepted] = useState(false);

  return (
    <div id="slide-3-0" className="slide parchment-bg flex flex-col items-center justify-center px-6 py-16">
      {/* Wax seal */}
      <div className="mb-6" style={{ animation: 'waxSeal 1s ease-out forwards' }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: 'radial-gradient(circle, hsl(0, 73%, 40%), hsl(0, 100%, 20%))' }}>
          <span className="font-cinzel text-foreground text-xs font-bold">NUSRL</span>
        </div>
      </div>

      <h2 className="font-cinzel text-xl md:text-3xl golden-text tracking-widest mb-6">TERMS & CONDITIONS</h2>

      {/* Parchment box */}
      <div className="w-full max-w-2xl glass-panel rounded-lg p-6 md:p-8 relative"
        style={{ border: '1px solid hsla(43, 51%, 54%, 0.2)' }}>
        <div className="max-h-[40vh] overflow-y-auto pr-4 space-y-4">
          {tcClauses.map((clause, i) => (
            <div key={i} className="flex gap-3">
              <span className="font-cinzel text-[10px] text-primary/50 mt-1 flex-shrink-0">{i + 1}.</span>
              <p className="font-cormorant text-sm text-foreground/80 leading-relaxed">{clause}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Accept checkbox */}
      <div className="mt-6 flex items-center gap-3">
        <button onClick={() => setAccepted(!accepted)} className="interactive text-primary">
          {accepted ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
        </button>
        <span className="font-cormorant text-sm text-foreground/70">I HAVE READ & UNDERSTOOD</span>
        {accepted && (
          <div style={{ animation: 'waxSeal 0.5s ease-out forwards' }}>
            <Award className="w-5 h-5 text-accent" />
          </div>
        )}
      </div>

      {/* Leave button */}
      <button
        className="interactive mt-8 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        onClick={() => {
          const el = document.getElementById('chapter-0');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <DoorOpen className="w-4 h-4" />
        <span className="font-cinzel text-[10px] tracking-widest">RETURN TO THE BEGINNING</span>
      </button>
    </div>
  );
};

const SponsorsSlide = () => {
  const [gameOpen, setGameOpen] = useState(false);
  const sponsors = {
    title: { name: 'PRESTIGE GLOBAL', tagline: 'Building Tomorrow\'s Justice' },
    platinum: [
      { name: 'LEXIS NEXIS', tagline: 'Legal Research Redefined' },
      { name: 'MANUPATRA', tagline: 'India\'s Leading Legal Database' },
    ],
    gold: [
      { name: 'SCC ONLINE', tagline: 'Supreme Court Cases' },
      { name: 'EASTERN BOOK CO.', tagline: 'Since 1940' },
      { name: 'CLT INDIA', tagline: 'Legal Excellence' },
    ],
    associates: ['NUSRL Alumni Association', 'Bar Council of Jharkhand', 'Ranchi Chamber of Commerce', 'Legal Aid Society', 'Youth Legal Forum'],
  };

  return (
    <div id="slide-3-1" className="slide flex flex-col items-center justify-center px-6 py-12">
      <h2 className="font-cinzel text-xl md:text-3xl golden-text tracking-widest mb-8">POWERED BY VISIONARIES</h2>

      {/* Title Sponsor */}
      <div className="glass-panel rounded-lg p-8 text-center mb-8 max-w-md w-full interactive hover:scale-[1.02] transition-transform"
        style={{ border: '2px solid hsla(43, 51%, 54%, 0.4)', animation: 'pulseGlow 3s ease-in-out infinite' }}>
        <Star className="w-6 h-6 text-accent mx-auto mb-2" />
        <p className="font-cinzel text-[10px] tracking-widest text-primary/50 mb-1">TITLE SPONSOR</p>
        <p className="font-bebas text-3xl golden-text">{sponsors.title.name}</p>
        <p className="font-cormorant text-sm text-muted-foreground italic mt-1">{sponsors.title.tagline}</p>
      </div>

      {/* Platinum */}
      <div className="grid grid-cols-2 gap-4 max-w-lg w-full mb-6">
        {sponsors.platinum.map((s, i) => (
          <div key={i} className="glass-panel rounded-lg p-4 text-center interactive hover:scale-105 transition-transform"
            style={{ border: '1px solid hsla(215, 30%, 60%, 0.3)' }}>
            <p className="font-cinzel text-[8px] tracking-widest text-muted-foreground mb-1">PLATINUM</p>
            <p className="font-bebas text-lg text-foreground">{s.name}</p>
            <p className="font-cormorant text-[11px] text-muted-foreground italic">{s.tagline}</p>
          </div>
        ))}
      </div>

      {/* Gold */}
      <div className="grid grid-cols-3 gap-3 max-w-lg w-full mb-6">
        {sponsors.gold.map((s, i) => (
          <div key={i} className="glass-panel rounded p-3 text-center interactive hover:scale-105 transition-transform"
            style={{ border: '1px solid hsla(43, 51%, 54%, 0.2)' }}>
            <p className="font-bebas text-sm golden-text">{s.name}</p>
            <p className="font-cormorant text-[10px] text-muted-foreground">{s.tagline}</p>
          </div>
        ))}
      </div>

      {/* Associates marquee */}
      <div className="w-full max-w-lg overflow-hidden h-6">
        <div className="whitespace-nowrap" style={{ animation: 'tickerScroll 15s linear infinite' }}>
          {sponsors.associates.concat(sponsors.associates).map((name, i) => (
            <span key={i} className="font-cormorant text-xs text-muted-foreground mx-6">
              {name} •
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const Chapter3 = () => (
  <section id="chapter-2" className="h-screen snap-start">
    <div className="flex h-full overflow-x-auto snap-x snap-mandatory">
      <TermsSlide />
      <SponsorsSlide />
    </div>
  </section>
);

export default Chapter3;
