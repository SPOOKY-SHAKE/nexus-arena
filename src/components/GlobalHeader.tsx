import { useApp } from '@/contexts/AppContext';
import { Menu } from 'lucide-react';

const GlobalHeader = () => {
  const { indexPanelOpen, setIndexPanelOpen } = useApp();

  return (
    <header className="fixed top-0 left-0 right-0 h-9 z-[1000] glass-panel flex items-center justify-between px-4"
      style={{ borderBottom: '1px solid hsla(43, 51%, 54%, 0.3)' }}>
      <div className="flex items-center gap-3">
        {/* Seal icon placeholder */}
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary fill-current opacity-80">
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
        <span className="font-cinzel text-[9px] tracking-[0.2em] text-primary hidden sm:block">
          NATIONAL UNIVERSITY OF STUDY AND RESEARCH IN LAW
        </span>
        <span className="font-cinzel text-[9px] tracking-[0.15em] text-primary sm:hidden">
          NUSRL
        </span>
      </div>
      <button
        onClick={() => setIndexPanelOpen(!indexPanelOpen)}
        className="interactive text-primary hover:text-accent transition-colors p-1"
        aria-label="Toggle index panel"
      >
        <Menu className="w-5 h-5" />
      </button>
    </header>
  );
};

export default GlobalHeader;
