import { useState, useEffect, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Instagram, Linkedin, Twitter, Youtube, Facebook, MessageCircle, MapPin, Send } from 'lucide-react';
import { useDevAuth } from '@/hooks/useDevAuth';

const Chapter4 = () => {
  const [socials, setSocials] = useState([
    { icon: Instagram, label: 'Instagram', color: 'hsl(330,70%,50%)', url: 'https://instagram.com/avirbhaav_nusrl' },
    { icon: Linkedin,  label: 'LinkedIn',  color: 'hsl(210,80%,45%)', url: 'https://linkedin.com/company/avirbhaav' },
    { icon: Twitter,   label: 'X / Twitter', color: 'hsl(200,80%,50%)', url: 'https://twitter.com/avirbhaav_nusrl' },
    { icon: Youtube,   label: 'YouTube',   color: 'hsl(0,80%,50%)',   url: 'https://youtube.com/@avirbhaav' },
    { icon: Facebook,  label: 'Facebook',  color: 'hsl(220,70%,50%)', url: 'https://facebook.com/avirbhaav.nusrl' },
    { icon: MessageCircle, label: 'WhatsApp', color: 'hsl(142,70%,45%)', url: 'https://wa.me/910000000000' },
  ]);
  const [socialEditMode, setSocialEditMode] = useState(false);
  const [editingLink, setEditingLink] = useState<number|null>(null);
  const [draftUrl, setDraftUrl] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const { setLeaderboardData } = useApp();
  const [isShaking, setIsShaking] = useState(false);
  const [apples, setApples] = useState<{ id: number; left: number; top: number; type: 'red' | 'gold' }[]>([]);
  const [points, setPoints] = useState(0);
  const appleIdRef = useRef(0);
  const [sendStatus, setSendStatus] = useState<'idle'|'sent'>('idle');

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.altKey && e.shiftKey && e.key === 'E') setSocialEditMode(p => !p); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const handleSend = () => {
    if (!formData.name || !formData.email || !formData.message) return;
    const subject = encodeURIComponent(`AVIRBHAAV Enquiry from ${formData.name}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
    window.location.href = `mailto:shubh.nag@nusrlranchi.ac.in?subject=${subject}&body=${body}`;
    setSendStatus('sent');
    setTimeout(() => { setFormData({name:'',email:'',message:''}); setSendStatus('idle'); }, 4000);
  };

  const [teamMembers, setTeamMembers] = useState([
    { name: 'Aditya Sharma', role: 'Convenor', img: 'https://i.pravatar.cc/150?u=aditya' },
    { name: 'Priya Mishra', role: 'Co-Convenor', img: 'https://i.pravatar.cc/150?u=priya' },
    { name: 'Rahul Verma', role: 'Tech Lead', img: 'https://i.pravatar.cc/150?u=rahul' },
    { name: 'Sneha Das', role: 'Cultural Head', img: 'https://i.pravatar.cc/150?u=sneha' },
    { name: 'Vikram Singh', role: 'Sports Head', img: 'https://i.pravatar.cc/150?u=vikram' },
    { name: 'Ananya Roy', role: 'PR & Media', img: 'https://i.pravatar.cc/150?u=ananya' },
  ]);
  const { isAuthorized } = useDevAuth();
  const [teamEditMode, setTeamEditMode] = useState(false);
  const [editingMember, setEditingMember] = useState<number|null>(null);
  const fileInputRefs = useRef<(HTMLInputElement|null)[]>([]);

  const handleShake = () => {
    if (isShaking) return;
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 800);
    const newApples = Array.from({ length: 3 }).map(() => ({
      id: appleIdRef.current++,
      left: 30 + Math.random() * 40,
      top: 50 + Math.random() * 10,
      type: Math.random() > 0.9 ? 'gold' : 'red',
    })) as { id: number; left: number; top: number; type: 'red' | 'gold' }[];
    setApples(p => [...p, ...newApples]);
  };

  const collectApple = (id: number, type: 'red' | 'gold') => {
    setApples(p => p.filter(a => a.id !== id));
    const pGain = type === 'gold' ? 50 : 10;
    setPoints(p => p + pGain);
    setLeaderboardData(prev => {
      const u = [...prev];
      if (u[8]) u[8] = { ...u[8], points: u[8].points + pGain };
      return u.sort((a, b) => b.points - a.points).map((e, i) => ({ ...e, rank: i + 1 }));
    });
  };

  return (
    <section id="chapter-3" className="snap-start overflow-y-auto">
      <div id="slide-4-0" className="min-h-screen px-6 py-20">
        <div className="max-w-6xl mx-auto">
          {/* 4-Quadrant Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Social */}
            <div className="glass-panel rounded-lg p-6">
              <h3 className="font-bebas text-2xl text-foreground mb-6">FIND US ON</h3>
              <div className="grid grid-cols-3 gap-4">
                {socials.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <a href={s.url} target="_blank" rel="noopener noreferrer" 
                        className="interactive flex flex-col items-center gap-2 p-1 rounded-lg hover:bg-muted/30 transition-colors group">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all group-hover:scale-110"
                          style={{ borderColor: s.color, boxShadow: `0 0 0 0 ${s.color}` }}>
                          <Icon className="w-5 h-5" style={{ color: s.color }} />
                        </div>
                        <span className="font-cormorant text-[10px] text-muted-foreground">{s.label}</span>
                      </a>
                      {socialEditMode && (
                        editingLink === i ? (
                          <div style={{ width:'100%' }}>
                            <input value={draftUrl} onChange={e => setDraftUrl(e.target.value)}
                              className="w-full bg-transparent border-b border-primary/30 text-[8px] font-cormorant text-foreground outline-none text-center" />
                            <div className="flex justify-center gap-2 mt-1">
                              <button onClick={() => { setSocials(p => { const n=[...p]; n[i]={...n[i],url:draftUrl}; return n; }); setEditingLink(null); }}
                                className="font-cinzel text-[7px] text-accent">✓</button>
                              <button onClick={() => setEditingLink(null)} className="font-cinzel text-[7px] text-muted-foreground">✕</button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => { setEditingLink(i); setDraftUrl(s.url); }}
                            className="font-cinzel text-[7px] text-primary/50 hover:text-primary truncate max-w-full" style={{ maxWidth:'70px' }}>
                            🔗 edit
                          </button>
                        )
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Team */}
            <div className="glass-panel rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bebas text-2xl text-foreground">THE MINDS BEHIND AVIRBHAAV</h3>
                {isAuthorized && (
                  <button
                    onClick={() => { setTeamEditMode(p => !p); setEditingMember(null); }}
                    className="font-cinzel text-[8px] tracking-widest rounded px-2 py-1 transition-all"
                    style={{ background: teamEditMode ? 'hsla(43,51%,54%,0.2)' : 'transparent',
                      border:'1px solid hsla(43,51%,54%,0.3)', color:'hsl(43,51%,54%)' }}>
                    {teamEditMode ? '✓ DONE' : '✏️ EDIT'}
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                {teamMembers.map((m, i) => (
                  <div key={i} className="interactive flex flex-col items-center text-center group relative"
                    style={{ perspective: '600px' }}>
                    <div className="w-14 h-14 rounded-full border border-primary/30 overflow-hidden mb-2 transition-transform duration-300 group-hover:scale-110 relative"
                      style={{ boxShadow: '0 0 12px hsla(43, 51%, 54%, 0.1)' }}>
                      <img src={m.img} alt={m.name} className="w-full h-full object-cover" loading="lazy" />
                      {/* Upload overlay in edit mode */}
                      {teamEditMode && (
                        <button
                          onClick={() => fileInputRefs.current[i]?.click()}
                          className="absolute inset-0 flex items-center justify-center rounded-full opacity-0 hover:opacity-100 transition-opacity"
                          style={{ background:'hsla(218,67%,4%,0.75)', color:'hsl(43,51%,54%)', fontSize:'18px' }}>
                          📷
                        </button>
                      )}
                    </div>
                    {/* Hidden file input */}
                    <input
                      ref={el => { fileInputRefs.current[i] = el; }}
                      type="file" accept="image/*"
                      style={{ display:'none' }}
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const url = URL.createObjectURL(file);
                        setTeamMembers(prev => { const n=[...prev]; n[i]={ ...n[i], img:url }; return n; });
                      }}
                    />
                    {/* Name/role — editable in dev mode */}
                    {teamEditMode && editingMember === i ? (
                      <div className="w-full space-y-1">
                        <input
                          className="w-full bg-transparent border-b border-primary/40 text-center font-cormorant text-xs text-foreground focus:outline-none"
                          value={m.name}
                          onChange={e => setTeamMembers(prev => { const n=[...prev]; n[i]={...n[i],name:e.target.value}; return n; })}
                        />
                        <input
                          className="w-full bg-transparent border-b border-primary/20 text-center font-cormorant text-[10px] text-muted-foreground focus:outline-none"
                          value={m.role}
                          onChange={e => setTeamMembers(prev => { const n=[...prev]; n[i]={...n[i],role:e.target.value}; return n; })}
                        />
                        <button onClick={() => setEditingMember(null)} className="font-cinzel text-[7px] text-accent">DONE</button>
                      </div>
                    ) : (
                      <>
                        <p className={`font-cormorant text-xs text-foreground ${teamEditMode?'cursor-pointer hover:text-primary':''}`}
                          onClick={() => teamEditMode && setEditingMember(i)}>{m.name}</p>
                        <p className="font-cormorant text-[10px] text-muted-foreground">{m.role}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="glass-panel rounded-lg p-6 relative">
              <h3 className="font-bebas text-2xl text-foreground mb-4">FIND US</h3>
              <div className="relative rounded-lg overflow-hidden" style={{ height: '200px' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3662.5!2d85.3!3d23.35!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sNUSRL%20Ranchi!5e0!3m2!1sen!2sin!4v1"
                  width="100%" height="100%" style={{ border: 0, filter: 'invert(0.9) hue-rotate(180deg) saturate(0.5)' }}
                  allowFullScreen loading="lazy" title="NUSRL Location" />
                {/* Pin marker */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full" style={{ animation: 'floatUp 2s ease-in-out infinite' }}>
                  <MapPin className="w-8 h-8 text-accent drop-shadow-lg" />
                </div>
              </div>
              <p className="font-cormorant text-xs text-muted-foreground mt-3">NUSRL, Ranchi, Jharkhand, India</p>
            </div>

            {/* Contact */}
            <div className="glass-panel rounded-lg p-6">
              <h3 className="font-bebas text-2xl text-foreground mb-6">GET IN TOUCH</h3>
              <div className="space-y-4">
                <div>
                  <input
                    type="text" placeholder="Your Name"
                    value={formData.name}
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    className="interactive w-full bg-transparent border-b border-primary/30 focus:border-primary outline-none py-2 font-cormorant text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors"
                    aria-label="Your name"
                  />
                </div>
                <div>
                  <input
                    type="email" placeholder="Email Address"
                    value={formData.email}
                    onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    className="interactive w-full bg-transparent border-b border-primary/30 focus:border-primary outline-none py-2 font-cormorant text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors"
                    aria-label="Your email"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Your Message" rows={3}
                    value={formData.message}
                    onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                    className="interactive w-full bg-transparent border-b border-primary/30 focus:border-primary outline-none py-2 font-cormorant text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors resize-none"
                    aria-label="Your message"
                  />
                </div>
                <button onClick={handleSend} disabled={sendStatus==='sent'}
                  className="interactive w-full py-3 rounded font-cinzel text-[10px] tracking-[0.2em] text-primary-foreground flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all"
                  style={{ background: sendStatus==='sent'
                    ? 'linear-gradient(135deg,hsl(142,60%,35%),hsl(142,70%,45%))'
                    : 'linear-gradient(135deg,hsl(43,51%,54%),hsl(51,100%,50%))' }}>
                  {sendStatus==='sent' ? <>✓ OPENING EMAIL CLIENT</> : <><Send className="w-3 h-3" /> SEND TO NUSRL</>}
                </button>
                {sendStatus==='sent' && (
                  <p className="font-cormorant text-xs italic text-accent/80 text-center mt-2">
                    Your email client is opening — hit send to reach shubh.nag@nusrlranchi.ac.in
                  </p>
                )}
              </div>
              <p className="font-cinzel text-[8px] tracking-widest text-muted-foreground/50 mt-6 text-center">
                © 2025 AVIRBHAAV | NUSRL
              </p>
            </div>
          </div>
        </div>

        {/* ── APPLE TREE GAME ── */}
        <div className="relative mt-20 pt-20 pb-40 overflow-hidden bg-gradient-to-t from-[hsl(134,38%,8%)] to-transparent">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <div className="text-center mb-12">
              <h3 className="font-bebas text-5xl golden-text mb-2">THE GIVING TREE</h3>
              <p className="font-cormorant text-lg text-muted-foreground italic">"Nature's bounty is the ultimate reward."</p>
              <div className="glass-panel inline-block px-6 py-2 rounded-full mt-4">
                <span className="font-cinzel text-xs tracking-widest text-primary">COLLECTED: {points} PTS</span>
              </div>
            </div>

            {/* Tree */}
            <div className="relative w-80 h-96 cursor-pointer" onClick={handleShake}>
              {/* Trunk */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-40 bg-[hsl(25,76%,15%)] rounded-t-lg" />
              {/* Leaves */}
              <div className={`absolute bottom-32 left-1/2 -translate-x-1/2 w-64 h-64 bg-[hsl(134,42%,15%)] rounded-full border-2 border-[hsl(134,42%,30%)] shadow-[0_0_40px_hsla(134,42%,50%,0.1)] transition-transform ${isShaking ? 'animate-[treeSway_0.2s_ease-in-out_infinite]' : ''}`}>
                {/* Visual Apples in tree */}
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="absolute w-3 h-3 rounded-full bg-[hsl(0,73%,40%)]"
                    style={{ left: `${20 + Math.random() * 60}%`, top: `${20 + Math.random() * 60}%` }} />
                ))}
              </div>
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap animate-bounce font-cinzel text-[10px] tracking-widest text-primary/50">
                SHAKE ME
              </div>
            </div>

            {/* Grass & Fallen Apples */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-[hsl(134,38%,10%)] border-t border-[hsl(134,38%,20%)]">
              {apples.map(apple => (
                <div key={apple.id}
                  onClick={() => collectApple(apple.id, apple.type)}
                  className={`interactive absolute w-5 h-5 rounded-full cursor-pointer shadow-lg animate-[fadeInUp_0.4s_ease-out] ${apple.type === 'gold' ? 'bg-[hsl(51,100%,50%)]' : 'bg-[hsl(0,73%,40%)]'}`}
                  style={{ left: `${apple.left}%`, bottom: '20px', filter: apple.type === 'gold' ? 'drop-shadow(0 0 10px hsla(51,100%,50%,0.5))' : 'none' }}>
                  <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-green-900 rounded-full translate-x-1 -translate-y-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Chapter4;
