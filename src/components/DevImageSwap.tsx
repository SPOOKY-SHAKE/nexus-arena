import { useState, useRef } from 'react';
import { Settings, X, Upload, ChevronDown, ChevronUp } from 'lucide-react';

interface ImageSlot {
  id: string;
  label: string;
  currentSrc: string;
  selector: string; // CSS selector or ID of the img element
}

const IMAGE_SLOTS: ImageSlot[] = [
  { id: 'vc', label: 'Vice Chancellor Portrait', currentSrc: '/vc-portrait.png', selector: '[alt="Vice Chancellor, NUSRL"]' },
  { id: 'hero-bg', label: 'Hero Video/BG', currentSrc: '', selector: '#slide-1-0 video' },
  { id: 'activity-1', label: 'Activity — Debate', currentSrc: '', selector: '[alt="Debate"]' },
  { id: 'activity-2', label: 'Activity — Cultural Night', currentSrc: '', selector: '[alt="Cultural Night"]' },
  { id: 'activity-3', label: 'Activity — Fashion Show', currentSrc: '', selector: '[alt="Fashion Show"]' },
  { id: 'activity-4', label: 'Activity — Legal Aid', currentSrc: '', selector: '[alt="Legal Aid"]' },
  { id: 'activity-5', label: 'Activity — Treasure Hunt', currentSrc: '', selector: '[alt="Treasure Hunt"]' },
];

const DevImageSwap = () => {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [swapped, setSwapped] = useState<Record<string, string>>({});
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  if (!import.meta.env.DEV) return null;

  const handleFileChange = (slot: ImageSlot, file: File) => {
    const url = URL.createObjectURL(file);
    setSwapped(prev => ({ ...prev, [slot.id]: url }));

    // Apply directly to DOM
    const els = document.querySelectorAll<HTMLImageElement>(slot.selector);
    els.forEach(el => { el.src = url; });
  };

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen(p => !p)}
        className="fixed bottom-6 left-6 z-[9998] flex items-center gap-2 rounded-full px-3 py-2 font-cinzel text-[9px] tracking-widest"
        style={{
          background: 'hsla(218,67%,8%,0.95)',
          border: '1px solid hsla(43,51%,54%,0.4)',
          color: 'hsl(43,51%,54%)',
          boxShadow: '0 0 20px hsla(43,51%,54%,0.2)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <Settings className="w-3.5 h-3.5" />
        DEV: SWAP IMAGES
      </button>

      {/* Panel */}
      {open && (
        <div
          className="fixed bottom-16 left-6 z-[9998] rounded-xl"
          style={{
            background: 'hsla(218,67%,5%,0.98)',
            border: '1px solid hsla(43,51%,54%,0.35)',
            boxShadow: '0 0 40px hsla(43,51%,54%,0.15)',
            backdropFilter: 'blur(20px)',
            width: '280px',
            maxHeight: '70vh',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-primary/20">
            <h3 className="font-cinzel text-[11px] tracking-widest text-primary">IMAGE SWAP PANEL</h3>
            <div className="flex gap-2">
              <button onClick={() => setExpanded(p => !p)} className="text-muted-foreground hover:text-primary">
                {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-primary">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: '55vh' }}>
            <div className="p-3 space-y-2">
              {IMAGE_SLOTS.map(slot => (
                <div key={slot.id} className="rounded-lg p-3"
                  style={{ background: 'hsla(215,50%,8%,0.8)', border: '1px solid hsla(43,51%,54%,0.12)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-cormorant text-xs text-foreground/80">{slot.label}</span>
                    {swapped[slot.id] && (
                      <span className="font-cinzel text-[7px] tracking-wider text-accent">✓ SWAPPED</span>
                    )}
                  </div>

                  {/* Preview */}
                  {(swapped[slot.id] || slot.currentSrc) && (
                    <img
                      src={swapped[slot.id] || slot.currentSrc}
                      alt={slot.label}
                      className="w-full h-16 object-cover rounded mb-2 opacity-70"
                    />
                  )}

                  {/* Upload button */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={el => { fileRefs.current[slot.id] = el; }}
                    style={{ display: 'none' }}
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) handleFileChange(slot, file);
                    }}
                  />
                  <button
                    onClick={() => fileRefs.current[slot.id]?.click()}
                    className="interactive w-full flex items-center justify-center gap-2 rounded py-1.5 font-cinzel text-[8px] tracking-widest transition-colors"
                    style={{
                      background: 'hsla(43,51%,54%,0.1)',
                      border: '1px solid hsla(43,51%,54%,0.25)',
                      color: 'hsl(43,51%,54%)',
                    }}
                  >
                    <Upload className="w-3 h-3" />
                    UPLOAD IMAGE
                  </button>
                </div>
              ))}
            </div>

            {/* Reset all */}
            {Object.keys(swapped).length > 0 && (
              <div className="px-3 pb-3">
                <button
                  onClick={() => {
                    setSwapped({});
                    // Re-apply original srcs from DOM
                    IMAGE_SLOTS.forEach(slot => {
                      if (slot.currentSrc) {
                        const els = document.querySelectorAll<HTMLImageElement>(slot.selector);
                        els.forEach(el => { el.src = slot.currentSrc; });
                      }
                    });
                  }}
                  className="interactive w-full py-1.5 rounded font-cinzel text-[8px] tracking-widest text-muted-foreground hover:text-primary transition-colors"
                  style={{ border: '1px solid hsla(43,51%,54%,0.15)' }}
                >
                  RESET ALL
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DevImageSwap;
