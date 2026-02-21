import { useApp } from '@/contexts/AppContext';

const chapters = ['THE SPECTACLE', 'THE ARENA', 'THE COVENANT', 'THE CONNECTION'];

const NavigationDots = () => {
  const { currentChapter } = useApp();

  const handleClick = (index: number) => {
    const el = document.getElementById(`chapter-${index}`);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-[900] flex flex-col gap-4">
      {chapters.map((name, i) => (
        <button
          key={i}
          onClick={() => handleClick(i)}
          className="interactive group relative flex items-center justify-end"
          aria-label={`Go to ${name}`}
        >
          {/* Tooltip */}
          <span className="absolute right-6 whitespace-nowrap font-cinzel text-[8px] tracking-wider text-primary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {name}
          </span>
          {/* Dot */}
          <div
            className={`w-2.5 h-2.5 rounded-full border transition-all ${
              currentChapter === i
                ? 'bg-primary border-primary scale-125'
                : 'bg-transparent border-primary/40 hover:border-primary'
            }`}
            style={currentChapter === i ? { animation: 'pulseGlow 2s ease-in-out infinite', boxShadow: '0 0 8px hsla(43, 51%, 54%, 0.5)' } : {}}
          />
        </button>
      ))}
    </div>
  );
};

export default NavigationDots;
