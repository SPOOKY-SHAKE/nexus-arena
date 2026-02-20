import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface LeaderboardEntry {
  rank: number;
  name: string;
  college: string;
  points: number;
  badge: string;
}

interface AppContextType {
  currentChapter: number;
  setCurrentChapter: (c: number) => void;
  indexPanelOpen: boolean;
  setIndexPanelOpen: (o: boolean) => void;
  audioEnabled: boolean;
  setAudioEnabled: (a: boolean) => void;
  leaderboardData: LeaderboardEntry[];
  setLeaderboardData: React.Dispatch<React.SetStateAction<LeaderboardEntry[]>>;
  teamPoints: number;
  setTeamPoints: React.Dispatch<React.SetStateAction<number>>;
  isLoading: boolean;
  setIsLoading: (l: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

const initialLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Team Apex', college: 'NLSIU Bangalore', points: 2450, badge: '🥇' },
  { rank: 2, name: 'Legal Eagles', college: 'NALSAR Hyderabad', points: 2280, badge: '🥈' },
  { rank: 3, name: 'Justice League', college: 'NLU Delhi', points: 2150, badge: '🥉' },
  { rank: 4, name: 'The Advocates', college: 'NUJS Kolkata', points: 1980, badge: '⭐' },
  { rank: 5, name: 'Lex Warriors', college: 'GNLU Gandhinagar', points: 1850, badge: '⭐' },
  { rank: 6, name: 'Courtroom Kings', college: 'RMLNLU Lucknow', points: 1720, badge: '⭐' },
  { rank: 7, name: 'Moot Masters', college: 'NLIU Bhopal', points: 1640, badge: '🔥' },
  { rank: 8, name: 'Verdict Vipers', college: 'HNLU Raipur', points: 1510, badge: '🔥' },
  { rank: 9, name: 'Case Crushers', college: 'NUSRL Ranchi', points: 1430, badge: '🔥' },
  { rank: 10, name: 'Statute Squad', college: 'CNLU Patna', points: 1350, badge: '🔥' },
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [indexPanelOpen, setIndexPanelOpen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState(initialLeaderboard);
  const [teamPoints, setTeamPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <AppContext.Provider value={{
      currentChapter, setCurrentChapter,
      indexPanelOpen, setIndexPanelOpen,
      audioEnabled, setAudioEnabled,
      leaderboardData, setLeaderboardData,
      teamPoints, setTeamPoints,
      isLoading, setIsLoading,
    }}>
      {children}
    </AppContext.Provider>
  );
};
