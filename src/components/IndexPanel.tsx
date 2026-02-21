import { useApp } from '@/contexts/AppContext';
import { X, Flame } from 'lucide-react';

interface IndexItem {
  id: string;
  label: string;
  chapter: number;
  slide: number;
}

const indexItems: { title: string; items: IndexItem[] }[] = [
  {
    title: 'Chapter 1: THE SPECTACLE',
    items: [
      { id: 'slide-1-0', label: '1.1 Hero & Video', chapter: 0, slide: 0 },
      { id: 'slide-1-1', label: '1.2 Stand Out With Us', chapter: 0, slide: 1 },
      { id: 'slide-1-2', label: '1.3 Fantasy World — Activities', chapter: 0, slide: 2 },
      { id: 'slide-1-3', label: '1.4 Leader\'s Message', chapter: 0, slide: 3 },
    ],
  },
  {
    title: 'Chapter 2: THE ARENA',
    items: [
      { id: 'slide-2-0', label: '2.1 Leaderboard & Quiz', chapter: 1, slide: 0 },
      { id: 'slide-2-1', label: '2.2 Literary · Sports · Cultural', chapter: 1, slide: 1 },
      { id: 'slide-2-2', label: '2.3 Cricket Stadium', chapter: 1, slide: 2 },
    ],
  },
  {
    title: 'Chapter 3: THE COVENANT',
    items: [
      { id: 'slide-3-0', label: '3.1 Terms & Conditions', chapter: 2, slide: 0 },
      { id: 'slide-3-1', label: '3.2 Sponsors', chapter: 2, slide: 1 },
    ],
  },
  {
    title: 'Chapter 4: THE CONNECTION',
    items: [
      { id: 'slide-4-0', label: '4.1 Social · Team · Map · Contact', chapter: 3, slide: 0 },
    ],
  },
];

const IndexPanel = () => {
  const { indexPanelOpen, setIndexPanelOpen, currentChapter } = useApp();

  const handleNavigate = (id: string, chapter: number, slide: number) => {
    if ((window as any).__avirbhavNavigate) {
      (window as any).__avirbhavNavigate(chapter, slide);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', inline: 'start' });
    }
    setIndexPanelOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      {indexPanelOpen && (
        <div
          className="fixed inset-0 z-[1100] bg-background/60"
          onClick={() => setIndexPanelOpen(false)}
        />
      )}
      {/* Panel */}
      <div
        className={`fixed top-0 left-0 h-full z-[1200] w-[80vw] sm:w-[30vw] min-w-[280px] transition-transform duration-500 ease-out ${
          indexPanelOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: 'hsla(218, 67%, 4%, 0.97)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid hsla(43, 51%, 54%, 0.3)',
        }}
      >
        {/* Corner ornaments */}
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-primary/30" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-primary/30" />

        <div className="p-6 pt-12 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-cinzel text-sm golden-text tracking-widest">AVIRBHAAV</h2>
            <button onClick={() => setIndexPanelOpen(false)} className="interactive text-primary hover:text-accent">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="font-cinzel text-[10px] text-muted-foreground tracking-wider mb-8">FULL INDEX</p>

          <nav className="space-y-6">
            {indexItems.map((chapter, ci) => (
              <div key={ci}>
                <h3 className="font-cinzel text-[11px] text-primary/70 tracking-wider mb-3">{chapter.title}</h3>
                <div className="space-y-1 pl-3">
                  {chapter.items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id, item.chapter, item.slide)}
                      className={`interactive w-full text-left flex items-center gap-2 py-1.5 px-2 rounded text-sm font-cormorant transition-colors ${
                        currentChapter === item.chapter
                          ? 'text-accent'
                          : 'text-foreground/70 hover:text-primary'
                      }`}
                    >
                      {currentChapter === item.chapter && <Flame className="w-3 h-3 text-amber flex-shrink-0" />}
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default IndexPanel;
