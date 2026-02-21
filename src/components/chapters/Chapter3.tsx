import { CheckSquare, Square, DoorOpen, Star, Award, Lock, Settings } from 'lucide-react';
import BollywoodPiano from '@/components/BollywoodPiano';
import ParticleText from '@/components/ParticleText';
import { useDevAuth } from '@/hooks/useDevAuth';
import { useState, useEffect } from 'react';

const TermsSlide = () => {
  const [accepted, setAccepted] = useState(false);
  const { isAuthorized } = useDevAuth();
  const [editMode, setEditMode] = useState(false);
  const [clauses, setClauses] = useState([
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
  ]);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [draftText, setDraftText] = useState('');

  const startEdit = (i: number) => { setEditingIdx(i); setDraftText(clauses[i]); };
  const saveEdit = () => {
    if (editingIdx === null) return;
    setClauses(prev => { const n=[...prev]; n[editingIdx]=draftText; return n; });
    setEditingIdx(null);
  };
  const addClause = () => setClauses(prev => [...prev, 'New clause — click to edit.']);
  const removeClause = (i: number) => setClauses(prev => prev.filter((_,idx) => idx !== i));

  return (
    <div id="slide-3-0" className="slide parchment-bg flex flex-col items-center justify-center px-6 py-16">
      {/* Wax seal */}
      <div className="mb-2" style={{ animation: 'waxSeal 1s ease-out forwards' }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: 'radial-gradient(circle, hsl(0, 73%, 40%), hsl(0, 100%, 20%))' }}>
          <span className="font-cinzel text-foreground text-[8px] font-bold leading-tight text-center" style={{ maxWidth:'44px', display:'block' }}>
            NUSRL
          </span>
        </div>
      </div>
      <div className="mb-4">
        <ParticleText
          text="NATIONAL UNIVERSITY OF STUDY AND RESEARCH IN LAW"
          fontSize={11}
          color="hsl(43,51%,54%)"
          height={36}
        />
      </div>

      <h2 className="font-cinzel text-xl md:text-3xl golden-text tracking-widest mb-6">TERMS & CONDITIONS</h2>

      {/* Parchment box */}
      <div className="w-full max-w-2xl glass-panel rounded-lg p-6 md:p-8 relative"
        style={{ border: '1px solid hsla(43, 51%, 54%, 0.2)' }}>
        <div className="max-h-[40vh] overflow-y-auto pr-4 space-y-4">
          {clauses.map((clause, i) => (
            <div key={i} className="flex gap-3 group relative">
              <span className="font-cinzel text-[10px] text-primary/50 mt-1 flex-shrink-0">{i + 1}.</span>
              {editMode && editingIdx === i ? (
                <div className="flex-1">
                  <textarea
                    value={draftText}
                    onChange={e => setDraftText(e.target.value)}
                    className="w-full bg-transparent border border-primary/40 rounded p-2 font-cormorant text-sm text-foreground/80 resize-none focus:outline-none focus:border-primary"
                    rows={3}
                  />
                  <div className="flex gap-2 mt-1">
                    <button onClick={saveEdit} className="font-cinzel text-[8px] text-accent tracking-wider hover:text-primary">SAVE</button>
                    <button onClick={() => setEditingIdx(null)} className="font-cinzel text-[8px] text-muted-foreground tracking-wider">CANCEL</button>
                  </div>
                </div>
              ) : (
                <p
                  className={`font-cormorant text-sm text-foreground/80 leading-relaxed flex-1 ${editMode ? 'cursor-pointer hover:text-primary transition-colors hover:bg-primary/5 rounded px-1' : ''}`}
                  onClick={() => editMode && startEdit(i)}
                >
                  {clause}
                  {editMode && <span className="ml-2 text-primary/40 text-[10px]">✏️</span>}
                </p>
              )}
              {editMode && editingIdx !== i && (
                <button onClick={() => removeClause(i)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive/60 hover:text-destructive font-cinzel text-[8px] flex-shrink-0 mt-1">✕</button>
              )}
            </div>
          ))}
        </div>

        {isAuthorized && (
          <div className="mt-4 pt-4 border-t border-primary/20 flex items-center justify-between">
            <div className="flex gap-3">
              <button
                onClick={() => { setEditMode(p => !p); setEditingIdx(null); }}
                className="font-cinzel text-[8px] tracking-widest rounded px-3 py-1.5 transition-all"
                style={{ background: editMode ? 'hsla(43,51%,54%,0.2)' : 'hsla(218,67%,10%,0.8)',
                  border: `1px solid ${editMode ? 'hsl(43,51%,54%)' : 'hsla(43,51%,54%,0.2)'}`,
                  color: editMode ? 'hsl(43,51%,54%)' : 'hsl(42,42%,60%)' }}>
                {editMode ? '🔒 EXIT EDIT' : '✏️ EDIT CLAUSES'}
              </button>
              {editMode && (
                <button onClick={addClause}
                  className="font-cinzel text-[8px] tracking-widest rounded px-3 py-1.5"
                  style={{ background:'hsla(43,51%,54%,0.1)', border:'1px solid hsla(43,51%,54%,0.3)', color:'hsl(43,51%,54%)' }}>
                  + ADD CLAUSE
                </button>
              )}
            </div>
            <span className="font-cinzel text-[7px] text-muted-foreground/40">DEV MODE AUTHORIZED</span>
          </div>
        )}
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
  const [sponsors, setSponsors] = useState({
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
  });
  const [editMode, setEditMode] = useState(false);
  const [editingType, setEditingType] = useState<'title' | 'platinum' | 'gold' | 'associates' | null>(null);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [draft, setDraft] = useState<any>(null);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.altKey && e.shiftKey && e.key === 'S') setEditMode(p => !p); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const saveEdit = () => {
    if (!editingType || !draft) return;
    setSponsors(prev => {
      const next = { ...prev };
      if (editingType === 'title') next.title = draft;
      else if (editingType === 'platinum' && editingIdx !== null) (next.platinum as any)[editingIdx] = draft;
      else if (editingType === 'gold' && editingIdx !== null) (next.gold as any)[editingIdx] = draft;
      else if (editingType === 'associates' && editingIdx !== null) (next.associates as any)[editingIdx] = draft;
      return next;
    });
    setEditingType(null);
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
      <div className="w-full max-w-lg overflow-hidden h-6 mb-6">
        <div className="whitespace-nowrap" style={{ animation: 'tickerScroll 15s linear infinite' }}>
          {sponsors.associates.concat(sponsors.associates).map((name, i) => (
            <span key={i} className="font-cormorant text-xs text-muted-foreground mx-6">
              {name} •
            </span>
          ))}
        </div>
      </div>

      {/* Bollywood Piano Button */}
      <button
        onClick={() => setGameOpen(true)}
        className="interactive flex items-center gap-3 px-8 py-3 rounded-full font-cinzel text-xs tracking-[0.2em] text-primary-foreground"
        style={{
          background: 'linear-gradient(135deg, hsl(43, 51%, 54%), hsl(51, 100%, 50%))',
          boxShadow: '0 0 20px hsla(43, 51%, 54%, 0.3)',
        }}
      >
        <span>🎹</span>
        BOLLYWOOD PIANO
      </button>

      <BollywoodPiano open={gameOpen} onClose={() => setGameOpen(false)} />

      {/* Floating Edit Panel */}
      {editMode && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] glass-panel rounded-xl p-4 w-[90%] max-w-lg shadow-2xl border-primary/30">
          <div className="flex items-center justify-between mb-3 border-b border-primary/20 pb-2">
            <span className="font-cinzel text-[10px] tracking-widest text-primary flex items-center gap-2">
              <Settings className="w-3 h-3" /> SPONSOR EDITOR
            </span>
            <button onClick={() => setEditMode(false)} className="text-muted-foreground hover:text-primary text-lg">×</button>
          </div>
          
          <div className="max-h-[30vh] overflow-y-auto space-y-3">
            {/* Title Sponsor Edit */}
            <div className="p-2 rounded bg-primary/5 flex items-center justify-between border border-primary/10">
              <span className="font-bebas text-xs text-primary">TITLE SPONSOR</span>
              <button onClick={() => { setEditingType('title'); setDraft({...sponsors.title}); }} className="text-[9px] font-cinzel text-accent">EDIT</button>
            </div>

            {/* Platinum Sponsors Edit */}
            <div className="space-y-1">
              <span className="font-bebas text-[10px] text-muted-foreground ml-1">PLATINUM</span>
              {sponsors.platinum.map((s, i) => (
                <div key={i} className="p-2 rounded bg-primary/5 flex items-center justify-between border border-primary/10">
                  <span className="font-cormorant text-xs">{s.name}</span>
                  <button onClick={() => { setEditingType('platinum'); setEditingIdx(i); setDraft({...s}); }} className="text-[9px] font-cinzel text-accent">EDIT</button>
                </div>
              ))}
            </div>

            {/* Gold Sponsors Edit */}
            <div className="space-y-1">
              <span className="font-bebas text-[10px] text-muted-foreground ml-1">GOLD</span>
              {sponsors.gold.map((s, i) => (
                <div key={i} className="p-2 rounded bg-primary/5 flex items-center justify-between border border-primary/10">
                  <span className="font-cormorant text-xs">{s.name}</span>
                  <button onClick={() => { setEditingType('gold'); setEditingIdx(i); setDraft({...s}); }} className="text-[9px] font-cinzel text-accent">EDIT</button>
                </div>
              ))}
            </div>
          </div>

          {editingType && draft && (
            <div className="mt-4 p-3 rounded bg-navy/80 border border-primary/30">
              <div className="space-y-2">
                <input value={draft.name || draft} onChange={e => setDraft(editingType === 'associates' ? e.target.value : { ...draft, name: e.target.value })}
                  placeholder="Name" className="w-full bg-transparent border-b border-primary/40 p-1 text-xs outline-none" />
                {editingType !== 'associates' && (
                  <input value={draft.tagline} onChange={e => setDraft({ ...draft, tagline: e.target.value })}
                    placeholder="Tagline" className="w-full bg-transparent border-b border-primary/20 p-1 text-[10px] outline-none" />
                )}
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={saveEdit} className="bg-accent text-white px-3 py-1 rounded text-[9px] font-cinzel">SAVE</button>
                <button onClick={() => setEditingType(null)} className="text-muted-foreground px-3 py-1 rounded text-[9px] font-cinzel">CANCEL</button>
              </div>
            </div>
          )}
          <p className="text-center font-cinzel text-[7px] text-muted-foreground/40 mt-3">EDITOR OVERLAY ACTIVE • ALT+SHIFT+S TO HIDE</p>
        </div>
      )}
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
