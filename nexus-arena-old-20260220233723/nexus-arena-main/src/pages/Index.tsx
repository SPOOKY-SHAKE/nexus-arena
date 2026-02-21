import { useEffect, useRef } from 'react';
import { AppProvider, useApp } from '@/contexts/AppContext';
import AnimatedBackground from '@/components/AnimatedBackground';
import CustomCursor from '@/components/CustomCursor';
import GlobalHeader from '@/components/GlobalHeader';
import IndexPanel from '@/components/IndexPanel';
import LoadingScreen from '@/components/LoadingScreen';
import NavigationDots from '@/components/NavigationDots';
import Chapter1 from '@/components/chapters/Chapter1';
import Chapter2 from '@/components/chapters/Chapter2';
import Chapter3 from '@/components/chapters/Chapter3';
import Chapter4 from '@/components/chapters/Chapter4';

const MainContent = () => {
  const { setCurrentChapter, isLoading } = useApp();
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const chapter = parseInt(id.replace('chapter-', ''));
            if (!isNaN(chapter)) setCurrentChapter(chapter);
          }
        });
      },
      { root: el, threshold: 0.5 }
    );

    el.querySelectorAll('[id^="chapter-"]').forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, [setCurrentChapter]);

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <CustomCursor />
      <GlobalHeader />
      <IndexPanel />
      {!isLoading && <NavigationDots />}
      <LoadingScreen />

      <main
        ref={mainRef}
        className="relative z-10 h-screen overflow-y-auto"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        <Chapter1 />
        <Chapter2 />
        <Chapter3 />
        <Chapter4 />
      </main>
    </div>
  );
};

const Index = () => (
  <AppProvider>
    <MainContent />
  </AppProvider>
);

export default Index;
