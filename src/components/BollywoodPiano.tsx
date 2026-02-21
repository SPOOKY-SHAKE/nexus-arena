import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Volume2, VolumeX, Music } from 'lucide-react';

/* ─── 40 SONGS (chronological 1990–2010) ─── */
const SONGS = [
  { title: 'Dil Hai Ki Manta Nahin', film: 'Dil Hai Ki Manta Nahin', year: 1991, bpm: 96,
    notes: [0,2,4,5,4,2,0,2,4,7,5,4,2,0,2,4,5,7,9,7,5,4,2,4,5,4,2,0] },
  { title: 'Jo Jeeta Wohi Sikandar', film: 'Jo Jeeta Wohi Sikandar', year: 1992, bpm: 112,
    notes: [4,5,7,9,7,5,4,2,0,2,4,5,4,2,4,7,9,11,9,7,5,4,5,4,2,0,2,4] },
  { title: 'Choli Ke Peeche', film: 'Khal Nayak', year: 1993, bpm: 128,
    notes: [0,4,7,4,0,4,7,4,9,7,5,4,2,4,5,7,9,7,5,4,0,4,7,4,9,11,12,11] },
  { title: 'Tu Cheez Badi Hai Mast', film: 'Mohra', year: 1994, bpm: 116,
    notes: [0,0,4,0,0,4,7,4,0,0,4,7,9,7,4,0,4,7,9,11,9,7,4,7,9,11,12,11] },
  { title: 'Tujhe Dekha Toh', film: 'DDLJ', year: 1995, bpm: 76,
    notes: [2,4,5,7,5,4,2,0,2,4,5,4,2,4,7,5,4,2,4,5,7,9,7,5,4,2,0,2] },
  { title: 'Rangeela Re', film: 'Rangeela', year: 1995, bpm: 104,
    notes: [7,9,11,9,7,5,7,9,11,12,11,9,7,9,11,9,7,5,4,5,7,5,4,2,4,5,7,9] },
  { title: 'Dil To Pagal Hai', film: 'Dil To Pagal Hai', year: 1997, bpm: 92,
    notes: [9,7,5,4,2,4,5,7,5,4,2,0,2,4,5,4,7,9,11,9,7,5,7,9,11,12,11,9] },
  { title: 'Chaiyya Chaiyya', film: 'Dil Se', year: 1998, bpm: 108,
    notes: [7,9,11,9,7,5,4,5,7,9,11,12,11,9,7,5,4,2,4,5,7,9,7,5,4,5,7,9] },
  { title: 'Kuch Kuch Hota Hai', film: 'Kuch Kuch Hota Hai', year: 1998, bpm: 88,
    notes: [4,5,7,9,7,5,4,2,0,2,4,5,4,2,0,2,4,7,5,4,2,4,5,7,9,11,9,7] },
  { title: 'Maahi Ve', film: 'Kaante', year: 2002, bpm: 84,
    notes: [4,5,7,9,11,9,7,5,4,5,7,9,7,5,4,2,4,5,7,5,4,2,0,2,4,5,7,9] },
  { title: 'Ek Ajnabee', film: 'Aankhen', year: 2002, bpm: 94,
    notes: [0,2,4,5,7,5,4,2,0,2,4,5,4,2,0,2,4,7,5,4,2,4,5,7,9,7,5,4] },
  { title: 'Kal Ho Na Ho', film: 'Kal Ho Na Ho', year: 2003, bpm: 78,
    notes: [2,4,5,7,9,7,5,4,5,7,9,11,9,7,5,4,2,4,5,7,5,4,2,0,2,4,5,4] },
  { title: 'Woh Lamhe', film: 'Zeher', year: 2005, bpm: 80,
    notes: [4,5,7,9,7,5,4,5,7,9,11,9,7,5,4,2,4,5,7,9,7,5,4,2,0,2,4,5] },
  { title: 'Bunty Aur Babli', film: 'Bunty Aur Babli', year: 2005, bpm: 132,
    notes: [9,7,5,4,7,9,11,9,7,5,4,5,7,9,7,5,4,2,4,5,7,9,11,12,11,9,7,9] },
  { title: 'Kajra Re', film: 'Bunty Aur Babli', year: 2005, bpm: 124,
    notes: [0,4,7,9,7,4,0,4,7,9,11,9,7,4,0,2,4,7,5,4,2,0,4,7,9,11,12,9] },
  { title: 'Rang De Basanti', film: 'Rang De Basanti', year: 2006, bpm: 94,
    notes: [0,2,4,5,4,2,0,2,4,5,7,5,4,2,4,5,7,9,7,5,4,5,7,9,11,9,7,5] },
  { title: 'Beedi', film: 'Omkara', year: 2006, bpm: 110,
    notes: [2,4,5,4,2,0,2,4,5,7,5,4,2,0,2,4,5,4,7,5,4,2,4,5,7,9,7,5] },
  { title: 'Dhoom Again', film: 'Dhoom 2', year: 2006, bpm: 130,
    notes: [4,7,9,11,9,7,4,7,9,11,12,11,9,7,4,5,7,9,7,5,4,2,4,5,7,5,4,2] },
  { title: 'Tere Bina', film: 'Guru', year: 2007, bpm: 82,
    notes: [5,7,9,11,9,7,5,4,5,7,9,7,5,4,2,4,5,7,5,4,2,0,2,4,5,4,2,0] },
  { title: 'Barso Re', film: 'Guru', year: 2007, bpm: 102,
    notes: [0,2,4,7,4,2,0,4,7,9,7,4,0,4,7,9,11,9,7,4,0,2,4,7,9,11,12,11] },
  { title: 'Chak De India', film: 'Chak De India', year: 2007, bpm: 108,
    notes: [7,9,11,12,11,9,7,5,7,9,11,12,11,9,7,9,11,12,13,12,11,9,7,9,11,9,7,5] },
  { title: 'Dard-E-Disco', film: 'Om Shanti Om', year: 2007, bpm: 136,
    notes: [7,7,9,7,7,9,11,9,7,7,9,11,12,11,9,7,9,11,12,11,9,7,5,7,9,11,9,7] },
  { title: 'Ye Ishq Haaye', film: 'Jab We Met', year: 2007, bpm: 90,
    notes: [2,4,5,7,5,4,2,4,5,7,9,7,5,4,2,0,2,4,5,4,2,4,5,7,9,11,9,7] },
  { title: 'Khwaja Mere Khwaja', film: 'Jodhaa Akbar', year: 2008, bpm: 72,
    notes: [2,4,5,4,2,0,2,4,5,7,5,4,2,0,2,4,5,4,5,7,9,7,5,4,2,4,5,7] },
  { title: 'Pehli Nazar Mein', film: 'Race', year: 2008, bpm: 86,
    notes: [5,7,9,11,9,7,5,4,5,7,9,7,5,4,2,4,5,7,5,4,2,0,2,4,5,7,5,4] },
  { title: 'Jai Ho', film: 'Slumdog Millionaire', year: 2008, bpm: 114,
    notes: [4,5,7,9,11,12,11,9,7,5,4,5,7,9,7,5,4,2,4,5,7,9,11,9,7,5,4,5] },
  { title: 'Dhan Te Nan', film: 'Kaminey', year: 2009, bpm: 138,
    notes: [0,0,7,0,0,7,9,0,0,7,9,11,0,7,9,11,12,11,9,7,0,4,7,9,7,4,0,4] },
  { title: 'Hairat', film: 'Anjaana Anjaani', year: 2010, bpm: 100,
    notes: [9,11,12,11,9,7,5,7,9,11,12,11,9,7,5,4,5,7,9,7,5,4,2,4,5,7,9,11] },
  { title: 'Sheila Ki Jawani', film: 'Tees Maar Khan', year: 2010, bpm: 134,
    notes: [4,7,9,7,4,7,9,11,9,7,4,7,9,11,12,11,9,7,4,5,7,9,7,5,4,2,4,7] },
  { title: 'Zor Ka Jhatka', film: 'Action Replayy', year: 2010, bpm: 126,
    notes: [0,4,7,4,0,4,9,7,4,0,4,7,9,11,9,7,4,0,2,4,7,9,7,4,0,4,7,9] },
  { title: 'Jumma Chumma De De', film: 'Hum', year: 1991, bpm: 120,
    notes: [4,4,7,4,4,7,9,7,4,4,7,4,0,2,4,7,9,7,5,4,2,4,7,9,11,9,7,5] },
  { title: 'Senorita', film: 'Zindagi Na Milegi Dobara', year: 2001, bpm: 118,
    notes: [9,11,12,11,9,7,9,11,12,11,9,7,5,7,9,11,9,7,5,4,5,7,9,7,5,4,2,4] },
  { title: 'Bulla Ki Jaana', film: 'Rang De Basanti', year: 2006, bpm: 96,
    notes: [4,7,9,7,4,5,7,9,11,9,7,5,4,5,7,9,7,5,4,2,4,5,7,5,4,2,0,4] },
  { title: 'Tum Hi Ho', film: 'Aashiqui 2', year: 2013, bpm: 74,
    notes: [2,4,5,7,9,7,5,4,5,7,9,11,9,7,5,4,2,4,5,7,5,4,2,0,2,4,5,4] },
  { title: 'Nagada Sang Dhol', film: 'Ram-Leela', year: 2013, bpm: 142,
    notes: [0,4,7,4,0,7,9,7,4,0,4,7,9,11,9,7,4,7,9,11,12,11,9,7,4,0,4,7] },
  { title: 'Abhi Mujh Mein Kahin', film: 'Agneepath', year: 2012, bpm: 70,
    notes: [4,5,7,9,11,12,11,9,7,5,4,5,7,9,11,9,7,5,4,2,4,5,7,9,7,5,4,2] },
  { title: 'Dilbaro', film: 'Raazi', year: 2018, bpm: 76,
    notes: [5,4,2,0,2,4,5,7,5,4,2,4,5,7,9,7,5,4,5,7,9,11,9,7,5,4,2,4] },
  { title: 'Ae Dil Hai Mushkil', film: 'Ae Dil Hai Mushkil', year: 2016, bpm: 84,
    notes: [9,11,12,11,9,7,5,7,9,11,9,7,5,4,5,7,9,11,12,11,9,7,5,4,2,4,5,7] },
  { title: 'Saiyaara', film: 'Ek Tha Tiger', year: 2012, bpm: 88,
    notes: [7,9,11,9,7,5,4,5,7,9,11,12,11,9,7,5,4,5,7,9,7,5,4,2,4,5,7,9] },
  { title: 'Ek Do Teen', film: 'Tezaab', year: 1988, bpm: 140,
    notes: [0,2,4,2,0,4,2,0,4,5,7,5,4,2,4,5,4,2,0,2,4,7,5,4,2,4,5,7] },
];

const PIANO_KEYS = 14;
const WHITE_KEYS = [0,2,4,5,7,9,11,12];
const BLACK_KEYS = [1,3,6,8,10,13];
const KEY_LABELS = ['C','D♭','D','E♭','E','F','G♭','G','A♭','A','B♭','B','C','D♭'];
const NOTE_FREQS = [261.63,277.18,293.66,311.13,329.63,349.23,369.99,392.00,415.30,440.00,466.16,493.88,523.25,554.37];
const HIT_ZONE = 86;

const DEFAULT_SPONSORS = [
  { name: 'PRESTIGE GLOBAL', tagline: "Building Tomorrow's Justice", color: 'hsl(43,51%,54%)' },
  { name: 'LEXIS NEXIS', tagline: 'Legal Research Redefined', color: 'hsl(215,70%,60%)' },
  { name: 'MANUPATRA', tagline: "India's Leading Legal DB", color: 'hsl(270,60%,60%)' },
  { name: 'SCC ONLINE', tagline: 'Supreme Court Cases', color: 'hsl(142,60%,50%)' },
  { name: 'EASTERN BOOK CO.', tagline: 'Since 1940', color: 'hsl(33,100%,55%)' },
  { name: 'CLT INDIA', tagline: 'Legal Excellence', color: 'hsl(0,73%,55%)' },
  { name: 'BAR COUNCIL', tagline: 'Of Jharkhand', color: 'hsl(51,100%,50%)' },
  { name: 'NUSRL ALUMNI', tagline: 'Always Connected', color: 'hsl(43,51%,54%)' },
];

/* ─── Audio ─── */
class PianoAudio {
  private ctx: AudioContext | null = null;
  muted = false;
  getCtx() {
    if (!this.ctx || this.ctx.state === 'closed') this.ctx = new AudioContext();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }
  playKey(keyIdx: number) {
    if (this.muted) return;
    const ctx = this.getCtx();
    const freq = NOTE_FREQS[Math.max(0,Math.min(keyIdx, NOTE_FREQS.length-1))];
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    osc.type = 'triangle'; osc.frequency.value = freq;
    filter.type = 'lowpass'; filter.frequency.value = 2200;
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
    osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    const osc2 = ctx.createOscillator(); const g2 = ctx.createGain();
    osc2.type = 'sine'; osc2.frequency.value = freq * 2;
    g2.gain.setValueAtTime(0.05, ctx.currentTime);
    g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc2.connect(g2); g2.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.7);
    osc2.start(); osc2.stop(ctx.currentTime + 0.35);
  }
  toggleMute() { this.muted = !this.muted; return this.muted; }
  destroy() { try { this.ctx?.close(); } catch {} this.ctx = null; }
}
const audio = new PianoAudio();

interface FallingNote { id: number; key: number; y: number; hit: boolean; missed: boolean; }
interface Billboard { id: number; y: number; side: 'left'|'right'; sponsorIdx: number; }
let noteId = 0; let bbId = 0;

const BollywoodPiano = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [songIdx, setSongIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [notes, setNotes] = useState<FallingNote[]>([]);
  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [pressedKey, setPressedKey] = useState<number | null>(null);
  const [hitFeedback, setHitFeedback] = useState<{key:number;type:'perfect'|'good'|'miss'}|null>(null);
  const [sponsors, setSponsors] = useState(DEFAULT_SPONSORS);
  const [devPanel, setDevPanel] = useState(false);
  const [editingSpIdx, setEditingSpIdx] = useState<number|null>(null);
  const [draftSp, setDraftSp] = useState({name:'',tagline:'',color:'hsl(43,51%,54%)'});

  const frameRef = useRef(0);
  const tRef = useRef(0);
  const noteQueueRef = useRef(0);
  const songNoteRef = useRef(0);
  const songProgressRef = useRef(0);
  const bbTimerRef = useRef(0);
  const comboRef = useRef(0);
  const scoreRef = useRef(0);

  const song = SONGS[songIdx % SONGS.length];
  const FPB = Math.max(12, Math.round(3600 / song.bpm));

  const gameLoop = useCallback(() => {
    tRef.current++;
    songProgressRef.current++;

    if (songProgressRef.current > song.notes.length * FPB + 100) {
      songProgressRef.current = 0; songNoteRef.current = 0; noteQueueRef.current = 0;
      setSongIdx(p => (p + 1) % SONGS.length);
    }

    if (tRef.current >= noteQueueRef.current && songNoteRef.current < song.notes.length) {
      const key = song.notes[songNoteRef.current];
      setNotes(p => [...p, { id: noteId++, key, y: 0, hit: false, missed: false }]);
      songNoteRef.current++;
      noteQueueRef.current = tRef.current + FPB;
    }

    setNotes(p => p.map(n => {
      if (n.hit || n.missed) return n;
      const ny = n.y + 0.5;
      if (ny > 102) { comboRef.current = 0; setCombo(0); return {...n, y:ny, missed:true}; }
      return {...n, y:ny};
    }).filter(n => n.y < 108));

    setBillboards(p => {
      const moved = p.map(b => ({...b, y: b.y - 0.15})).filter(b => b.y > -30);
      bbTimerRef.current++;
      if (bbTimerRef.current % 200 === 0) {
        const side = bbTimerRef.current % 400 === 0 ? 'left' : 'right';
        moved.push({ id: bbId++, y: 100, side, sponsorIdx: Math.floor(Math.random() * sponsors.length) });
      }
      return moved;
    });

    frameRef.current = requestAnimationFrame(gameLoop);
  }, [song, FPB, sponsors.length, gameLoop]);

  useEffect(() => {
    if (playing && open) {
      tRef.current = 0; noteQueueRef.current = FPB;
      frameRef.current = requestAnimationFrame(gameLoop);
    } else cancelAnimationFrame(frameRef.current);
    return () => cancelAnimationFrame(frameRef.current);
  }, [playing, open, gameLoop, FPB]);

  useEffect(() => { if (!open) { setPlaying(false); audio.destroy(); } }, [open]);

  const hitKey = useCallback((keyIdx: number) => {
    audio.playKey(keyIdx);
    setPressedKey(keyIdx);
    setTimeout(() => setPressedKey(null), 180);
    setNotes(p => {
      let best: FallingNote | null = null; let bestDist = 999;
      p.forEach(n => {
        if (n.hit || n.missed || n.key !== keyIdx) return;
        const dist = Math.abs(n.y - HIT_ZONE);
        if (dist < 12 && dist < bestDist) { bestDist = dist; best = n; }
      });
      if (best) {
        const type = bestDist < 4 ? 'perfect' : 'good';
        const pts = type === 'perfect' ? 100 : 50;
        comboRef.current++;
        scoreRef.current += pts * Math.max(1, Math.floor(comboRef.current / 5));
        setScore(scoreRef.current);
        setCombo(comboRef.current);
        setHitFeedback({ key: keyIdx, type });
        setTimeout(() => setHitFeedback(null), 300);
        return p.map(n => n === best ? {...n, hit:true} : n);
      } else {
        setHitFeedback({ key: keyIdx, type: 'miss' });
        setTimeout(() => setHitFeedback(null), 200);
        comboRef.current = 0; setCombo(0);
        return p;
      }
    });
  }, []);

  useEffect(() => {
    if (!open || !playing) return;
    const KB: Record<string,number> = { a:0,w:1,s:2,e:3,d:4,f:5,t:6,g:7,y:8,h:9,u:10,j:11,k:12,o:13 };
    const h = (e: KeyboardEvent) => { const k = KB[e.key.toLowerCase()]; if (k !== undefined) hitKey(k); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, playing, hitKey]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center"
      style={{ background:'hsla(218,67%,3%,0.98)' }}>

      {/* Close */}
      <button onClick={() => { setPlaying(false); onClose(); }}
        className="absolute top-4 left-4 z-50 flex items-center gap-1.5 rounded-full px-3 py-1.5 font-cinzel text-[9px] tracking-widest"
        style={{ background:'hsla(0,73%,40%,0.3)', border:'1px solid hsla(0,73%,40%,0.6)', color:'hsl(0,73%,60%)' }}>
        <X className="w-3.5 h-3.5" /> CLOSE
      </button>

      {/* Mute */}
      <button onClick={() => { const m = audio.toggleMute(); setMuted(m); }}
        className="absolute top-14 left-4 z-50 flex items-center gap-1.5 rounded-full px-3 py-1.5 font-cinzel text-[9px] tracking-widest"
        style={{ background:'hsla(43,51%,54%,0.15)', border:'1px solid hsla(43,51%,54%,0.35)', color:'hsl(43,51%,54%)' }}>
        {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        {muted ? 'MUTED' : 'MUSIC'}
      </button>

      {/* Dev Sponsor Panel toggle */}
      <button onClick={() => setDevPanel(p => !p)}
        className="absolute top-4 right-4 z-50 rounded-full px-3 py-1.5 font-cinzel text-[8px] tracking-widest"
        style={{ background:'hsla(215,50%,10%,0.9)', border:'1px solid hsla(43,51%,54%,0.3)', color:'hsl(43,51%,54%)' }}>
        ✏️ SPONSORS
      </button>

      {devPanel && (
        <div className="absolute top-14 right-4 z-50 rounded-xl overflow-hidden"
          style={{ width:'260px', maxHeight:'70vh', background:'hsla(218,67%,5%,0.98)',
            border:'1px solid hsla(43,51%,54%,0.3)', backdropFilter:'blur(16px)' }}>
          <div className="flex items-center justify-between px-4 py-2 border-b border-primary/20">
            <span className="font-cinzel text-[10px] tracking-widest text-primary">SPONSOR MANAGER</span>
            <button onClick={() => setDevPanel(false)} className="text-muted-foreground hover:text-primary text-lg">×</button>
          </div>
          <div className="overflow-y-auto p-3 space-y-2" style={{ maxHeight:'55vh' }}>
            {sponsors.map((sp, i) => (
              <div key={i} className="rounded-lg p-2" style={{ background:'hsla(215,50%,8%,0.8)', border:'1px solid hsla(43,51%,54%,0.12)' }}>
                {editingSpIdx === i ? (
                  <div className="space-y-1">
                    <input value={draftSp.name} onChange={e => setDraftSp(p => ({...p,name:e.target.value}))}
                      placeholder="Sponsor Name"
                      className="w-full bg-transparent border-b border-primary/30 font-cormorant text-xs text-foreground outline-none py-1" />
                    <input value={draftSp.tagline} onChange={e => setDraftSp(p => ({...p,tagline:e.target.value}))}
                      placeholder="Tagline"
                      className="w-full bg-transparent border-b border-primary/20 font-cormorant text-[10px] text-muted-foreground outline-none py-1" />
                    <div className="flex gap-2 mt-1">
                      <button onClick={() => {
                        setSponsors(p => { const n=[...p]; n[i]={...draftSp}; return n; });
                        setEditingSpIdx(null);
                      }} className="font-cinzel text-[8px] text-accent">SAVE</button>
                      <button onClick={() => setEditingSpIdx(null)} className="font-cinzel text-[8px] text-muted-foreground">CANCEL</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bebas text-xs" style={{ color:sp.color }}>{sp.name}</div>
                      <div className="font-cormorant text-[9px] text-muted-foreground italic">{sp.tagline}</div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => { setEditingSpIdx(i); setDraftSp({...sp}); }} className="text-primary/60 hover:text-primary text-xs">✏️</button>
                      <button onClick={() => setSponsors(p => p.filter((_,j)=>j!==i))} className="text-destructive/50 hover:text-destructive text-xs">✕</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <button onClick={() => setSponsors(p => [...p, {name:'NEW SPONSOR',tagline:'Add tagline',color:'hsl(43,51%,54%)'}])}
              className="w-full py-2 rounded font-cinzel text-[8px] tracking-widest text-primary border border-primary/30 hover:bg-primary/10 transition-colors">
              + ADD SPONSOR
            </button>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex items-stretch w-full max-w-4xl mx-4 gap-3" style={{ height:'88vh' }}>

        {/* Left Billboard */}
        <div className="relative overflow-hidden rounded-xl flex-shrink-0"
          style={{ width:'88px', background:'hsla(215,50%,5%,0.9)', border:'1px solid hsla(43,51%,54%,0.15)' }}>
          {billboards.filter(b => b.side === 'left').map(b => {
            const sp = sponsors[b.sponsorIdx % Math.max(1,sponsors.length)];
            return (
              <div key={b.id} className="absolute left-1 right-1 rounded-lg px-2 py-3 text-center"
                style={{ top:`${b.y}%`, background:'hsla(218,67%,6%,0.95)', border:`1px solid ${sp.color}66` }}>
                <div style={{ height:'2px', background:`linear-gradient(90deg,transparent,${sp.color},transparent)`, marginBottom:'4px' }} />
                <div className="font-bebas text-[8px] leading-tight" style={{ color:sp.color }}>{sp.name}</div>
                <div className="font-cormorant text-[7px] italic text-muted-foreground mt-1">{sp.tagline}</div>
                <div style={{ height:'2px', background:`linear-gradient(90deg,transparent,${sp.color},transparent)`, marginTop:'4px' }} />
              </div>
            );
          })}
        </div>

        {/* Center Game */}
        <div className="relative flex-1 flex flex-col overflow-hidden rounded-xl"
          style={{ background:'hsla(218,67%,3%,0.98)', border:'1px solid hsla(43,51%,54%,0.25)' }}>

          {/* Song HUD */}
          <div className="flex items-center justify-between px-4 py-2 flex-shrink-0"
            style={{ background:'linear-gradient(180deg,hsla(218,67%,5%,0.95),transparent)', borderBottom:'1px solid hsla(43,51%,54%,0.1)' }}>
            <div>
              <div className="font-bebas text-sm golden-text">{song.title}</div>
              <div className="font-cinzel text-[7px] text-muted-foreground">{song.film} · {song.year}</div>
            </div>
            <div className="text-right">
              <div className="font-bebas text-xl golden-text">{score.toLocaleString()}</div>
              {combo > 1 && <div className="font-bebas text-xs" style={{ color:'hsl(51,100%,60%)' }}>{combo}× COMBO</div>}
            </div>
            <div className="font-cinzel text-[7px] text-muted-foreground/60">
              {(songIdx % SONGS.length)+1} / {SONGS.length}
            </div>
          </div>

          {/* Falling Notes Area */}
          <div className="flex-1 relative overflow-hidden" style={{ minHeight:0 }}>
            {Array.from({length:PIANO_KEYS}).map((_,k) => (
              <div key={k} style={{ position:'absolute', top:0, bottom:0,
                left:`${(k/PIANO_KEYS)*100}%`, width:`${100/PIANO_KEYS}%`,
                borderRight:'1px solid hsla(43,51%,54%,0.04)',
                background: !WHITE_KEYS.includes(k) ? 'hsla(218,67%,2%,0.5)' : 'transparent' }} />
            ))}

            {/* Hit line */}
            <div className="absolute left-0 right-0 z-10" style={{ top:`${HIT_ZONE}%`, height:'4px',
              background:'linear-gradient(90deg,transparent,hsl(43,51%,54%),hsl(51,100%,50%),hsl(43,51%,54%),transparent)',
              boxShadow:'0 0 12px hsl(43,51%,54%)' }} />

            {/* Notes */}
            {notes.filter(n => !n.missed && n.y < 102).map(n => (
              <div key={n.id} style={{ position:'absolute', left:`${(n.key/PIANO_KEYS)*100+1}%`,
                top:`${n.y}%`, width:`${96/PIANO_KEYS}%`, height:'4.5%',
                background: n.hit ? 'transparent' : 'linear-gradient(180deg,hsl(51,100%,60%),hsl(43,51%,54%))',
                borderRadius:'4px 4px 2px 2px',
                boxShadow: n.hit ? 'none' : '0 0 10px hsl(43,51%,54%)',
                opacity: n.hit ? 0 : 1,
                transition: n.hit ? 'opacity 0.1s' : 'none',
                zIndex:5, border:'1px solid hsla(51,100%,60%,0.4)' }} />
            ))}

            {/* Feedback */}
            {hitFeedback && (
              <div style={{ position:'absolute', left:`${(hitFeedback.key/PIANO_KEYS)*100}%`,
                top:`${HIT_ZONE-14}%`, width:`${100/PIANO_KEYS}%`, textAlign:'center',
                fontFamily:'Bebas Neue,sans-serif', fontSize:'11px', zIndex:20,
                color: hitFeedback.type==='perfect'?'hsl(51,100%,60%)':hitFeedback.type==='good'?'hsl(43,51%,54%)':'hsl(0,73%,50%)',
                animation:'fadeInUp 0.3s ease-out', textShadow:'0 0 8px currentColor' }}>
                {hitFeedback.type==='perfect'?'PERFECT':hitFeedback.type==='good'?'GOOD':'MISS'}
              </div>
            )}
          </div>

          {/* Piano Keys */}
          <div className="flex-shrink-0 relative" style={{ height:'88px', background:'hsl(218,67%,3%)' }}>
            {WHITE_KEYS.map((k,wi) => (
              <button key={k} onPointerDown={() => hitKey(k)}
                className="absolute top-0 bottom-0 rounded-b-md"
                style={{ left:`${(wi/WHITE_KEYS.length)*100}%`, width:`${100/WHITE_KEYS.length}%`,
                  background: pressedKey===k ? 'linear-gradient(180deg,hsl(51,100%,80%),hsl(43,51%,60%))' : 'linear-gradient(180deg,hsl(42,42%,82%),hsl(42,42%,72%))',
                  border:'1px solid hsl(218,30%,25%)',
                  boxShadow: pressedKey===k ? '0 0 12px hsl(51,100%,50%)' : '0 2px 4px hsla(218,67%,4%,0.5)', zIndex:1 }}>
                <span style={{ position:'absolute', bottom:'5px', left:'50%', transform:'translateX(-50%)',
                  fontFamily:'Cinzel Decorative,serif', fontSize:'6px', color:'hsl(218,40%,30%)', opacity:0.6 }}>
                  {KEY_LABELS[k]}
                </span>
              </button>
            ))}
            {BLACK_KEYS.map(k => {
              const wli = WHITE_KEYS.findIndex(w => w > k) - 1;
              return (
                <button key={k} onPointerDown={e => { e.stopPropagation(); hitKey(k); }}
                  className="absolute top-0 rounded-b-md"
                  style={{ left:`${((wli+0.62)/WHITE_KEYS.length)*100}%`, width:`${60/WHITE_KEYS.length}%`, height:'60%',
                    background: pressedKey===k ? 'linear-gradient(180deg,hsl(43,51%,54%),hsl(33,60%,30%))' : 'linear-gradient(180deg,hsl(218,40%,14%),hsl(218,50%,8%))',
                    border:'1px solid hsl(218,30%,20%)',
                    boxShadow: pressedKey===k ? '0 0 14px hsl(43,51%,54%)' : '0 3px 6px hsla(0,0%,0%,0.7)', zIndex:2 }} />
              );
            })}
          </div>

          {/* Start Screen */}
          {!playing && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center"
              style={{ background:'hsla(218,67%,4%,0.92)', backdropFilter:'blur(8px)' }}>
              <div style={{ fontSize:'48px', animation:'floatUp 2s ease-in-out infinite alternate' }}>🎹</div>
              <h3 className="font-bebas text-4xl golden-text mt-3 mb-1">BOLLYWOOD PIANO</h3>
              <p className="font-cormorant text-sm text-muted-foreground italic mb-1 text-center px-8">
                40 classic Bollywood hits — play the falling notes as they hit the line
              </p>
              <p className="font-cinzel text-[8px] text-primary/60 tracking-wider mb-6 text-center px-4">
                KEYBOARD: A S D F G H J K (white) · W E T Y U (black) | MOBILE: Tap the keys
              </p>
              <button onClick={() => setPlaying(true)}
                className="interactive flex items-center gap-3 px-10 py-3 rounded-full font-cinzel text-xs tracking-[0.2em] text-primary-foreground"
                style={{ background:'linear-gradient(135deg,hsl(43,51%,54%),hsl(51,100%,50%))', boxShadow:'0 0 24px hsla(43,51%,54%,0.5)' }}>
                <Music className="w-4 h-4" /> PLAY
              </button>
            </div>
          )}
        </div>

        {/* Right Billboard */}
        <div className="relative overflow-hidden rounded-xl flex-shrink-0"
          style={{ width:'88px', background:'hsla(215,50%,5%,0.9)', border:'1px solid hsla(43,51%,54%,0.15)' }}>
          {billboards.filter(b => b.side === 'right').map(b => {
            const sp = sponsors[b.sponsorIdx % Math.max(1,sponsors.length)];
            return (
              <div key={b.id} className="absolute left-1 right-1 rounded-lg px-2 py-3 text-center"
                style={{ top:`${b.y}%`, background:'hsla(218,67%,6%,0.95)', border:`1px solid ${sp.color}66` }}>
                <div style={{ height:'2px', background:`linear-gradient(90deg,transparent,${sp.color},transparent)`, marginBottom:'4px' }} />
                <div className="font-bebas text-[8px] leading-tight" style={{ color:sp.color }}>{sp.name}</div>
                <div className="font-cormorant text-[7px] italic text-muted-foreground mt-1">{sp.tagline}</div>
                <div style={{ height:'2px', background:`linear-gradient(90deg,transparent,${sp.color},transparent)`, marginTop:'4px' }} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BollywoodPiano;
