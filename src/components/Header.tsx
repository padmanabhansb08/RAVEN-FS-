import { Layers, Fingerprint } from 'lucide-react';
import { WebFingerprint } from '../utils/fingerprint';

interface HeaderProps {
  browserFingerprint: WebFingerprint | null;
}

export function Header({ browserFingerprint }: HeaderProps) {
  return (
    <header className="border-b border-white/10 glass-panel sticky top-0 z-50 px-4 md:px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-[0_0_28px_rgba(168,85,247,0.35)]">
          <Layers className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            RAVEN-FS
            <span className="text-xs font-mono text-violet-300 font-semibold uppercase tracking-[0.28em] ml-3">
              Document analysis workspace
            </span>
          </h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.28em] font-mono mt-1">
            A clear, compatible interface for upload, review, and analysis.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {browserFingerprint && (
          <div className="flex items-center gap-2.5 bg-violet-500/5 border border-violet-500/15 rounded-2xl px-3.5 py-2 text-xs font-mono">
            <Fingerprint className="w-4 h-4 text-indigo-400 shrink-0" />
            <div className="text-left">
              <span className="text-slate-500 block text-[8px] uppercase tracking-wider">
                Device ID Signature
              </span>
              <span className="text-indigo-300 font-bold">{browserFingerprint.id}</span>
            </div>
            <div className="h-6 w-px bg-white/5 mx-1"></div>
            <div>
              <span className="text-slate-500 block text-[8px] uppercase tracking-wider">
                Canvas Signature
              </span>
              <span className="text-slate-400 font-bold">
                {browserFingerprint.canvasHash.slice(0, 10)}
              </span>
            </div>
          </div>
        )}
        <div className="px-3.5 py-2 bg-violet-500/10 border border-violet-500/20 rounded-2xl text-violet-300 text-xs font-mono font-bold uppercase shrink-0">
          Workspace online
        </div>
      </div>
    </header>
  );
}
