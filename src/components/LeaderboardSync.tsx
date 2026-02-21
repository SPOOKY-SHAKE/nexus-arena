import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { RefreshCw, LogIn, LogOut, ShieldCheck, AlertCircle, X } from 'lucide-react';

// ── FILL THESE IN AFTER SETUP ──────────────────────────
const GAPI_CLIENT_ID = 'YOUR_OAUTH_CLIENT_ID.apps.googleusercontent.com';
const GAPI_API_KEY   = 'YOUR_API_KEY';
const SHEET_ID       = 'YOUR_GOOGLE_SHEET_ID';
const SHEET_RANGE    = 'Sheet1!A2:E50';

const AUTHORIZED_EMAILS = [
  'shubh.nag@nusrlranchi.ac.in',
  'sn1542056@gmail.com',
  'shubhnag2611@gmail.com',
];

declare global {
  interface Window {
    google?: any;
    gapi?: any;
  }
}

const LeaderboardSync = () => {
  const { leaderboardData, setLeaderboardData } = useApp();
  const [signedIn, setSignedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [error, setError] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [gapiReady, setGapiReady] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [rowDraft, setRowDraft] = useState<any>(null);

  useEffect(() => {
    const s1 = document.createElement('script');
    s1.src = 'https://accounts.google.com/gsi/client'; s1.async = true;
    document.head.appendChild(s1);

    const s2 = document.createElement('script');
    s2.src = 'https://apis.google.com/js/api.js'; s2.async = true;
    s2.onload = () => {
      window.gapi?.load('client', async () => {
        try {
          await window.gapi.client.init({ apiKey: GAPI_API_KEY, discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'] });
          setGapiReady(true);
        } catch {}
      });
    };
    document.head.appendChild(s2);
    return () => { try { document.head.removeChild(s1); document.head.removeChild(s2); } catch {} };
  }, []);

  const signIn = () => {
    if (!window.google) { setError('Google API not loaded yet. Wait a moment and try again.'); return; }
    const tc = window.google.accounts.oauth2.initTokenClient({
      client_id: GAPI_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/spreadsheets email',
      callback: (resp: any) => {
        if (resp.access_token) {
          setAccessToken(resp.access_token);
          fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${resp.access_token}`)
            .then(r => r.json()).then(info => {
              const email = info.email || '';
              setUserEmail(email); setSignedIn(true);
              const auth = AUTHORIZED_EMAILS.includes(email);
              setIsAuthorized(auth);
              setError(auth ? '' : `Access denied: ${email} is not an authorized account`);
            });
        }
      },
    });
    tc.requestAccessToken();
  };

  const signOut = () => { setSignedIn(false); setUserEmail(''); setIsAuthorized(false); setAccessToken(''); setError(''); };

  const pullFromSheet = async () => {
    if (!gapiReady) { setError('API still loading. Try again in a moment.'); return; }
    setSyncing(true); setError('');
    try {
      const res = await window.gapi.client.sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: SHEET_RANGE });
      const rows: string[][] = res.result.values || [];
      const entries = rows.map((row, i) => ({
        rank: parseInt(row[0]) || i+1,
        name: row[1] || '',
        college: row[2] || '',
        points: parseInt(row[3]) || 0,
        badge: row[4] || '⭐',
      })).filter(e => e.name).sort((a,b) => b.points-a.points).map((e,i) => ({...e,rank:i+1}));
      setLeaderboardData(entries);
      setLastSync(new Date());
    } catch { setError('Read failed. Check SHEET_ID and ensure sheet is "Anyone can view".'); }
    setSyncing(false);
  };

  const pushToSheet = async () => {
    if (!isAuthorized || !accessToken) return;
    setSyncing(true); setError('');
    try {
      const vals = leaderboardData.map(e => [String(e.rank), e.name, e.college, String(e.points), e.badge]);
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(SHEET_RANGE)}?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: vals }),
      });
      setLastSync(new Date());
    } catch { setError('Write failed. Ensure account has edit access to the sheet.'); }
    setSyncing(false);
  };

  const addRow = () => setLeaderboardData(p => [...p, { rank:p.length+1, name:'New Team', college:'University', points:0, badge:'⭐' }]);
  const removeRow = (i: number) => setLeaderboardData(p => p.filter((_,j)=>j!==i).map((e,j)=>({...e,rank:j+1})));
  const saveRow = () => {
    if (editingRow === null) return;
    setLeaderboardData(p => { const n=[...p]; n[editingRow]=rowDraft; return n.sort((a,b)=>b.points-a.points).map((e,i)=>({...e,rank:i+1})); });
    setEditingRow(null);
  };

  return (
    <div className="relative w-full max-w-3xl mt-3">
      <button onClick={() => setPanelOpen(p => !p)}
        className="interactive flex items-center gap-1.5 px-3 py-1.5 rounded-full font-cinzel text-[8px] tracking-widest"
        style={{ background:'hsla(215,50%,8%,0.8)', border:'1px solid hsla(43,51%,54%,0.25)', color:'hsl(43,51%,54%)' }}>
        <RefreshCw className={`w-3 h-3 ${syncing?'animate-spin':''}`} />
        SYNC LEADERBOARD {lastSync ? `· Updated ${lastSync.getHours()}:${String(lastSync.getMinutes()).padStart(2,'0')}` : ''}
      </button>

      {panelOpen && (
        <div className="absolute left-0 right-0 z-50 mt-2 rounded-xl"
          style={{ background:'hsla(218,67%,5%,0.99)', border:'1px solid hsla(43,51%,54%,0.3)',
            backdropFilter:'blur(20px)', maxHeight:'65vh', overflowY:'auto' }}>
          <div className="sticky top-0 flex items-center justify-between px-4 py-2"
            style={{ background:'hsla(218,67%,5%,0.99)', borderBottom:'1px solid hsla(43,51%,54%,0.15)' }}>
            <span className="font-cinzel text-[10px] golden-text tracking-widest">LEADERBOARD SYNC — GOOGLE SHEETS</span>
            <button onClick={() => setPanelOpen(false)} className="text-muted-foreground hover:text-primary"><X className="w-4 h-4" /></button>
          </div>

          <div className="p-4 space-y-3">
            {error && (
              <div className="flex items-start gap-2 rounded-lg px-3 py-2"
                style={{ background:'hsla(0,73%,40%,0.15)', border:'1px solid hsla(0,73%,40%,0.3)' }}>
                <AlertCircle className="w-3 h-3 text-destructive flex-shrink-0 mt-0.5" />
                <span className="font-cormorant text-xs text-destructive">{error}</span>
              </div>
            )}

            {/* Auth row */}
            <div className="flex items-center justify-between rounded-lg px-3 py-2"
              style={{ background:'hsla(215,50%,8%,0.8)', border:'1px solid hsla(43,51%,54%,0.15)' }}>
              {signedIn ? (
                <div className="flex items-center gap-2">
                  {isAuthorized ? <ShieldCheck className="w-4 h-4 text-accent" /> : <AlertCircle className="w-4 h-4 text-destructive" />}
                  <div>
                    <div className="font-cinzel text-[8px] text-primary">{userEmail}</div>
                    <div className="font-cormorant text-[9px] text-muted-foreground">{isAuthorized ? 'Full access — Read & Write' : 'Access denied'}</div>
                  </div>
                </div>
              ) : (
                <span className="font-cormorant text-xs text-muted-foreground italic">Sign in to enable editing</span>
              )}
              <button onClick={signedIn ? signOut : signIn}
                className="flex items-center gap-1 px-3 py-1 rounded-full font-cinzel text-[8px] tracking-widest"
                style={{ background:signedIn?'hsla(0,73%,40%,0.2)':'hsla(43,51%,54%,0.2)',
                  border:`1px solid ${signedIn?'hsla(0,73%,40%,0.4)':'hsla(43,51%,54%,0.4)'}`,
                  color:signedIn?'hsl(0,73%,60%)':'hsl(43,51%,54%)' }}>
                {signedIn ? <><LogOut className="w-3 h-3" /> SIGN OUT</> : <><LogIn className="w-3 h-3" /> SIGN IN</>}
              </button>
            </div>

            {/* Sync buttons */}
            <div className="flex gap-2">
              <button onClick={pullFromSheet} disabled={syncing}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-cinzel text-[8px] tracking-widest"
                style={{ background:'hsla(215,50%,10%,0.8)', border:'1px solid hsla(43,51%,54%,0.3)', color:'hsl(43,51%,54%)', opacity:syncing?0.5:1 }}>
                <RefreshCw className={`w-3 h-3 ${syncing?'animate-spin':''}`} /> PULL FROM SHEET
              </button>
              {isAuthorized && accessToken && (
                <button onClick={pushToSheet} disabled={syncing}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-cinzel text-[8px] tracking-widest"
                  style={{ background:'hsla(43,51%,54%,0.15)', border:'1px solid hsla(43,51%,54%,0.4)', color:'hsl(43,51%,54%)', opacity:syncing?0.5:1 }}>
                  ⬆️ PUSH TO SHEET
                </button>
              )}
            </div>

            {/* Inline editor (authorized only) */}
            {isAuthorized && (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-cinzel text-[9px] text-primary">EDIT ENTRIES</span>
                  <button onClick={addRow} className="font-cinzel text-[8px] text-accent hover:text-primary">+ ADD</button>
                </div>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {leaderboardData.map((entry, i) => (
                    <div key={i} className="flex items-center gap-1 rounded px-2 py-1"
                      style={{ background:'hsla(215,50%,7%,0.8)', border:'1px solid hsla(43,51%,54%,0.08)' }}>
                      {editingRow === i && rowDraft ? (
                        <>
                          <span className="font-bebas text-xs text-muted-foreground w-5">{i+1}</span>
                          <input value={rowDraft.name} onChange={e => setRowDraft((p:any)=>({...p,name:e.target.value}))}
                            className="flex-1 min-w-0 bg-transparent font-cormorant text-xs text-foreground outline-none border-b border-primary/30" />
                          <input value={rowDraft.college} onChange={e => setRowDraft((p:any)=>({...p,college:e.target.value}))}
                            className="flex-1 min-w-0 bg-transparent font-cormorant text-[10px] text-muted-foreground outline-none border-b border-primary/20" />
                          <input type="number" value={rowDraft.points} onChange={e => setRowDraft((p:any)=>({...p,points:+e.target.value}))}
                            className="w-14 bg-transparent font-bebas text-sm text-primary outline-none border-b border-primary/30 text-center" />
                          <button onClick={saveRow} className="font-cinzel text-[7px] text-accent">✓</button>
                          <button onClick={() => setEditingRow(null)} className="font-cinzel text-[7px] text-muted-foreground">✕</button>
                        </>
                      ) : (
                        <>
                          <span className="font-bebas text-xs text-muted-foreground w-5">{entry.rank}</span>
                          <span className="flex-1 min-w-0 font-cormorant text-xs text-foreground truncate">{entry.name}</span>
                          <span className="hidden md:block flex-1 min-w-0 font-cormorant text-[10px] text-muted-foreground truncate">{entry.college}</span>
                          <span className="font-bebas text-sm golden-text w-12 text-center">{entry.points}</span>
                          <span className="text-xs">{entry.badge}</span>
                          <button onClick={() => { setEditingRow(i); setRowDraft({...entry}); }} className="text-primary/50 hover:text-primary text-xs ml-1">✏️</button>
                          <button onClick={() => removeRow(i)} className="text-destructive/40 hover:text-destructive text-xs">✕</button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <p className="font-cinzel text-[7px] text-muted-foreground/40 text-center">
                  Edit locally then PUSH TO SHEET to save permanently
                </p>
              </>
            )}

            {/* Setup hint */}
            <div className="rounded-lg px-3 py-2 font-cormorant text-[9px] text-muted-foreground/60 italic"
              style={{ background:'hsla(215,50%,7%,0.5)', border:'1px solid hsla(43,51%,54%,0.08)' }}>
              Setup: Fill GAPI_CLIENT_ID, GAPI_API_KEY, SHEET_ID in LeaderboardSync.tsx after creating a Google Cloud project with Sheets API enabled.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderboardSync;
