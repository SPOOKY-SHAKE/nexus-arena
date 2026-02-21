import { useEffect, useRef, useState } from 'react';
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
import FloralEffect from '@/components/FloralEffect';
import ExplosionEffect from '@/components/ExplosionEffect';
import DevImageSwap from '@/components/DevImageSwap';

const MainContent = () => {
  const { setCurrentChapter, isLoading } = useApp();
  const mainRef = useRef<HTMLDivElement>(null);
  const currentChapterRef = useRef(0);
  const currentSlideRef = useRef(0);
  const isTransitioningRef = useRef(false);

  // Chapter → slide count map
  const CHAPTER_SLIDES = [4, 3, 2, 1]; // ch0=4, ch1=3, ch2=2, ch3=1

  const getChapterEl = (ci: number) =>
    document.getElementById(`chapter-${ci}`) as HTMLElement | null;

  const getSlideEl = (ci: number, si: number) =>
    document.getElementById(`slide-${ci + 1}-${si}`) as HTMLElement | null;

  const navigateTo = (chapterIdx: number, slideIdx: number) => {
    const ch = getChapterEl(chapterIdx);
    if (!ch) return;

    // First scroll the chapter into vertical view
    ch.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Then scroll horizontally to the target slide within that chapter
    setTimeout(() => {
      const sl = getSlideEl(chapterIdx, slideIdx);
      if (sl) sl.scrollIntoView({ behavior: 'smooth', inline: 'start' });
    }, 80);

    currentChapterRef.current = chapterIdx;
    currentSlideRef.current = slideIdx;
    setCurrentChapter(chapterIdx);
  };

  const advance = (direction: 1 | -1) => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setTimeout(() => { isTransitioningRef.current = false; }, 800);

    const ci = currentChapterRef.current;
    const si = currentSlideRef.current;
    const maxSlides = CHAPTER_SLIDES[ci] - 1;

    if (direction === 1) {
      if (si < maxSlides) navigateTo(ci, si + 1);
      else if (ci < CHAPTER_SLIDES.length - 1) navigateTo(ci + 1, 0);
    } else {
      if (si > 0) navigateTo(ci, si - 1);
      else if (ci > 0) navigateTo(ci - 1, CHAPTER_SLIDES[ci - 1] - 1);
    }
  };

  // Rough scroll / momentum accumulation
  const scrollAccumulatorRef = useRef(0);
  const lastScrollTimeRef = useRef(0);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      // Reset accumulator if it's been too long since last wheel
      if (now - lastScrollTimeRef.current > 400) scrollAccumulatorRef.current = 0;
      lastScrollTimeRef.current = now;

      scrollAccumulatorRef.current += e.deltaY;

      // Threshold to trigger a chapter/slide step
      const stepThreshold = 350;

      if (Math.abs(scrollAccumulatorRef.current) >= stepThreshold) {
        const dir = scrollAccumulatorRef.current > 0 ? 1 : -1;
        advance(dir);
        // Deplete accumulator but not necessarily zero to allow "momentum"
        scrollAccumulatorRef.current -= dir * stepThreshold * 1.1;
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', 'ArrowRight'].includes(e.key)) { e.preventDefault(); advance(1); }
      if (['ArrowUp', 'PageUp', 'ArrowLeft'].includes(e.key)) { e.preventDefault(); advance(-1); }
    };

    // Touch support — momentum-based
    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY; };
    const onTouchEnd = (e: TouchEvent) => {
      const dy = touchY - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 60) return;
      advance(dy > 0 ? 1 : -1);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  useEffect(() => {
    (window as any).__avirbhavNavigate = navigateTo;
  }, []);

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <CustomCursor />
      <FloralEffect />
      <ExplosionEffect />
      <GlobalHeader />
      <IndexPanel />
      {!isLoading && <NavigationDots />}
      <LoadingScreen />

      <main
        ref={mainRef}
        className="relative z-10 h-screen overflow-hidden"
        style={{ scrollSnapType: 'none' }}
      >
        <Chapter1 />
        <Chapter2 />
        <Chapter3 />
        <Chapter4 />
      </main>
      <DevImageSwap />
    </div>
  );
};

const Index = () => (
  <AppProvider>
    <MainContent />
  </AppProvider>
);

export default Index;
