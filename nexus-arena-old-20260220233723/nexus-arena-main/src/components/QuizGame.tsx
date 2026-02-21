import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

interface QuizProps {
  open: boolean;
  onClose: () => void;
  onScore: (points: number) => void;
}

const questions = [
  {
    q: 'Which Article of the Indian Constitution guarantees the Right to Equality?',
    options: ['Article 12', 'Article 14', 'Article 19', 'Article 21'],
    correct: 1,
  },
  {
    q: 'Who is known as the "Father of the Indian Constitution"?',
    options: ['Jawaharlal Nehru', 'Mahatma Gandhi', 'B.R. Ambedkar', 'Vallabhbhai Patel'],
    correct: 2,
  },
  {
    q: 'The Supreme Court of India was established in which year?',
    options: ['1947', '1950', '1952', '1949'],
    correct: 1,
  },
  {
    q: 'Which writ is known as the "bulwark of personal liberty"?',
    options: ['Mandamus', 'Certiorari', 'Habeas Corpus', 'Quo Warranto'],
    correct: 2,
  },
  {
    q: 'The Preamble to the Indian Constitution was amended by which Amendment?',
    options: ['42nd Amendment', '44th Amendment', '1st Amendment', '73rd Amendment'],
    correct: 0,
  },
];

const QuizGame = ({ open, onClose, onScore }: QuizProps) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [flash, setFlash] = useState<'correct' | 'wrong' | null>(null);
  const [finished, setFinished] = useState(false);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    if (!open) {
      setCurrentQ(0);
      setScore(0);
      setTimeLeft(60);
      setFinished(false);
      setAnswered(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open || finished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [open, finished]);

  const handleAnswer = useCallback((idx: number) => {
    if (answered || finished) return;
    setAnswered(true);
    const isCorrect = idx === questions[currentQ].correct;
    setFlash(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setScore(prev => prev + 20);

    setTimeout(() => {
      setFlash(null);
      setAnswered(false);
      if (currentQ < questions.length - 1) {
        setCurrentQ(prev => prev + 1);
      } else {
        setFinished(true);
      }
    }, 800);
  }, [currentQ, answered, finished]);

  const handleClose = () => {
    onScore(score);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1500] flex items-center justify-center bg-background/95 p-4">
      <div
        className="relative w-full max-w-lg glass-panel rounded-lg p-6 md:p-8"
        style={{ border: '2px solid hsla(43, 51%, 54%, 0.4)' }}
      >
        <button onClick={handleClose} className="interactive absolute top-4 right-4 text-primary hover:text-accent">
          <X className="w-5 h-5" />
        </button>

        <h2 className="font-bebas text-2xl md:text-3xl golden-text mb-1">LEGAL QUIZ BLITZ</h2>

        {!finished ? (
          <>
            {/* Timer bar */}
            <div className="w-full h-1.5 bg-muted rounded-full mt-3 mb-6 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${(timeLeft / 60) * 100}%`,
                  background: timeLeft > 20
                    ? 'linear-gradient(90deg, hsl(43, 51%, 54%), hsl(51, 100%, 50%))'
                    : 'hsl(0, 100%, 27%)',
                }}
              />
            </div>

            <div className="flex justify-between text-xs font-cormorant text-muted-foreground mb-4">
              <span>Question {currentQ + 1}/{questions.length}</span>
              <span>{timeLeft}s</span>
              <span>Score: {score}</span>
            </div>

            <p className="font-cormorant text-lg text-foreground mb-6">{questions[currentQ].q}</p>

            <div className="space-y-3">
              {questions[currentQ].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={answered}
                  className={`interactive w-full text-left px-4 py-3 rounded border transition-all font-cormorant ${
                    flash && i === questions[currentQ].correct
                      ? 'border-accent bg-accent/10 text-accent'
                      : flash === 'wrong' && answered
                      ? 'border-border text-muted-foreground'
                      : 'border-border hover:border-primary text-foreground hover:bg-primary/5'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {flash && (
              <div className={`mt-4 text-center font-bebas text-lg ${flash === 'correct' ? 'text-accent' : 'text-crimson'}`}>
                {flash === 'correct' ? '✓ CORRECT! +20' : '✗ WRONG'}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <p className="font-bebas text-5xl golden-text mb-4">{score}</p>
            <p className="font-cormorant text-lg text-foreground mb-2">POINTS EARNED</p>
            <p className="font-cormorant text-sm text-muted-foreground mb-8">
              {score >= 80 ? 'Outstanding legal mind!' : score >= 40 ? 'Well argued, counsellor!' : 'The law demands more study.'}
            </p>
            <button
              onClick={handleClose}
              className="interactive px-8 py-3 rounded font-cinzel text-xs tracking-widest text-primary-foreground"
              style={{ background: 'linear-gradient(135deg, hsl(43, 51%, 54%), hsl(51, 100%, 50%))' }}
            >
              RETURN TO ARENA
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizGame;
