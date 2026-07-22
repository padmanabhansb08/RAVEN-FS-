import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Award } from 'lucide-react';
import { Header } from '../components/Header';
import { computeBrowserFingerprint, WebFingerprint, getFingerprintJSVisitorId } from '../utils/fingerprint';
import { useAppContext } from '../context/AppContext';

export default function MainLayout() {
  const [browserFingerprint, setBrowserFingerprint] = useState<WebFingerprint | null>(null);
  const { setDocumentsState } = useAppContext();

  useEffect(() => {
    const fp = computeBrowserFingerprint();
    setBrowserFingerprint(fp);

    getFingerprintJSVisitorId().then((visitorId) => {
      let activeFp = fp;
      if (visitorId) {
        activeFp = {
          ...fp,
          fpjsVisitorId: visitorId,
          id: `fp-${visitorId.slice(0, 8)}`,
        };
        setBrowserFingerprint(activeFp);
      }

      setDocumentsState((docs) => 
        docs.map((doc) => {
          if (doc.id === 'doc-devices' && activeFp) {
            return {
              ...doc,
              content: doc.content.replace(/fp-[a-zA-Z0-9]+/, activeFp.id),
            };
          }
          return doc;
        })
      );
    });
  }, [setDocumentsState]);

  return (
    <div className="min-h-screen bg-transparent text-slate-200 flex flex-col font-sans selection:bg-teal-500/30 selection:text-white">
      <Header browserFingerprint={browserFingerprint} />
      
      <main className="flex-1 px-4 md:px-6 py-5 md:py-6 max-w-7xl w-full mx-auto min-h-0 flex flex-col gap-5">
        <Outlet context={{ browserFingerprint }} />
      </main>

      <footer className="glass-panel border-t border-white/5 px-4 md:px-6 py-5 mt-auto z-10 relative rounded-none">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono font-medium text-slate-500 select-none uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 bg-teal-500 rounded-none animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></span>
            <span>RAVEN-FS Document Intelligence</span>
          </div>
          <div className="text-blue-300/80 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-blue-400" />
            <span>Sharp UI Edition</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
