import { useState } from 'react';
import { Instagram, Linkedin, Twitter, Youtube, Facebook, MessageCircle, MapPin, Send } from 'lucide-react';

const socials = [
  { icon: Instagram, label: 'Instagram', color: 'hsl(330, 70%, 50%)' },
  { icon: Linkedin, label: 'LinkedIn', color: 'hsl(210, 80%, 45%)' },
  { icon: Twitter, label: 'X / Twitter', color: 'hsl(200, 80%, 50%)' },
  { icon: Youtube, label: 'YouTube', color: 'hsl(0, 80%, 50%)' },
  { icon: Facebook, label: 'Facebook', color: 'hsl(220, 70%, 50%)' },
  { icon: MessageCircle, label: 'WhatsApp', color: 'hsl(142, 70%, 45%)' },
];

const teamMembers = [
  { name: 'Aditya Sharma', role: 'Convenor', img: 'https://i.pravatar.cc/150?u=aditya' },
  { name: 'Priya Mishra', role: 'Co-Convenor', img: 'https://i.pravatar.cc/150?u=priya' },
  { name: 'Rahul Verma', role: 'Tech Lead', img: 'https://i.pravatar.cc/150?u=rahul' },
  { name: 'Sneha Das', role: 'Cultural Head', img: 'https://i.pravatar.cc/150?u=sneha' },
  { name: 'Vikram Singh', role: 'Sports Head', img: 'https://i.pravatar.cc/150?u=vikram' },
  { name: 'Ananya Roy', role: 'PR & Media', img: 'https://i.pravatar.cc/150?u=ananya' },
];

const Chapter4 = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  return (
    <section id="chapter-3" className="h-screen snap-start overflow-y-auto">
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
                    <a key={i} href="#" className="interactive flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted/30 transition-colors group">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all group-hover:scale-110"
                        style={{ borderColor: s.color, boxShadow: `0 0 0 0 ${s.color}` }}>
                        <Icon className="w-5 h-5" style={{ color: s.color }} />
                      </div>
                      <span className="font-cormorant text-[10px] text-muted-foreground">{s.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Team */}
            <div className="glass-panel rounded-lg p-6">
              <h3 className="font-bebas text-2xl text-foreground mb-6">THE MINDS BEHIND AVIRBHAAV</h3>
              <div className="grid grid-cols-3 gap-4">
                {teamMembers.map((m, i) => (
                  <div key={i} className="interactive flex flex-col items-center text-center group"
                    style={{ perspective: '600px' }}>
                    <div className="w-14 h-14 rounded-full border border-primary/30 overflow-hidden mb-2 transition-transform duration-300 group-hover:scale-110"
                      style={{ boxShadow: '0 0 12px hsla(43, 51%, 54%, 0.1)' }}>
                      <img src={m.img} alt={m.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <p className="font-cormorant text-xs text-foreground">{m.name}</p>
                    <p className="font-cormorant text-[10px] text-muted-foreground">{m.role}</p>
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
                <button
                  className="interactive w-full py-3 rounded font-cinzel text-[10px] tracking-[0.2em] text-primary-foreground flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-transform"
                  style={{ background: 'linear-gradient(135deg, hsl(43, 51%, 54%), hsl(51, 100%, 50%))' }}
                >
                  <Send className="w-3 h-3" />
                  SEND
                </button>
              </div>
              <p className="font-cinzel text-[8px] tracking-widest text-muted-foreground/50 mt-6 text-center">
                © 2025 AVIRBHAAV | NUSRL
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Chapter4;
