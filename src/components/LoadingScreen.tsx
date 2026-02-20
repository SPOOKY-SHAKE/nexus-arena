import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import AvirbhaavLogo from './AvirbhaavLogo';

const LoadingScreen = () => {
  const { isLoading, setIsLoading } = useApp();
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    const skipTimer = setTimeout(() => setShowSkip(true), 1000);
    const loadTimer = setTimeout(() => handleFinish(), 3500);
    return () => {
      clearTimeout(skipTimer);
      clearTimeout(loadTimer);
    };
  }, []);

  const handleFinish = () => {
    setFadeOut(true);
    setTimeout(() => {
      setShow(false);
      setIsLoading(false);
    }, 600);
  };

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[2000] bg-background flex flex-col items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="animate-[fadeInUp_1s_ease-out_forwards] opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
        <AvirbhaavLogo size="lg" />
      </div>

      <p className="font-cinzel text-[10px] tracking-[0.3em] text-primary/60 mt-8 animate-[fadeInUp_0.8s_ease-out_forwards] opacity-0"
        style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
        NATIONAL UNIVERSITY OF STUDY AND RESEARCH IN LAW
      </p>

      {/* Loading bar */}
      <div className="mt-10 w-48 h-[2px] bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, hsl(43, 51%, 54%), hsl(51, 100%, 50%))',
            animation: 'loadingBar 3s ease-out forwards',
          }}
        />
      </div>

      {showSkip && (
        <button
          onClick={handleFinish}
          className="interactive mt-8 font-cormorant text-xs text-muted-foreground hover:text-primary transition-colors tracking-widest animate-[fadeInUp_0.4s_ease-out_forwards]"
        >
          SKIP INTRO
        </button>
      )}
    </div>
  );
};

export default LoadingScreen;
