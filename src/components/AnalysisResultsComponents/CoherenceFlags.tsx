import { ShieldAlert, CheckCircle2 } from 'lucide-react';
import { AnalysisResult } from '../../types';

interface CoherenceFlagsProps {
  readonly analysisResult: AnalysisResult;
}

export function CoherenceFlags({ analysisResult }: CoherenceFlagsProps) {
  return (
    <div className="glass-panel border border-white/5 p-5 rounded-xl space-y-4 shadow-lg relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
      <div className="border-b border-white/5 pb-2 flex justify-between items-center relative z-10">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-indigo-400" />
          Section 1: Multi-Document Coherence clashing flags
        </h4>
        <span className="text-[9.5px] font-mono text-slate-500 font-bold select-none">
          Audit Level 2
        </span>
      </div>

      {analysisResult.contradictions.length > 0 ? (
        <div className="space-y-3">
          {analysisResult.contradictions.map((con, idx) => {
            let severityClass = 'bg-[#0A0A0B]/60 border-white/5';
            if (con.severity === 'high') {
              severityClass = 'bg-red-500/5 border-red-550/20 text-red-100';
            } else if (con.severity === 'medium') {
              severityClass = 'bg-amber-500/5 border-amber-550/15 text-amber-100';
            }

            let badgeClass = 'bg-[#0A0A0B] text-slate-400';
            if (con.severity === 'high') {
              badgeClass = 'bg-red-950/85 text-red-400 border border-red-900/30';
            } else if (con.severity === 'medium') {
              badgeClass = 'bg-amber-955/85 text-amber-400 border border-amber-900/30';
            }

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row gap-3 items-start justify-between transition-all duration-300 relative z-10 backdrop-blur-md shadow-inner ${severityClass}`}
              >
                <div className="space-y-1.5 flex-1 select-text">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[8px] font-mono tracking-widest uppercase px-1.5 py-0.5 rounded leading-none font-bold shadow-sm ${badgeClass}`}
                    >
                      {con.severity}
                    </span>
                    <span className="text-xs font-semibold text-white tracking-wide">{con.title}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {con.description}
                  </p>
                </div>
                <div className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-slate-400 bg-black/60 border border-white/5 px-2.5 py-1 rounded max-w-[200px] text-center self-start sm:self-center shadow-inner">
                  {con.crossDocSource}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel border border-emerald-500/20 rounded-xl p-8 text-center flex flex-col items-center justify-center gap-2 relative z-10 shadow-[0_0_30px_rgba(16,185,129,0.05)]">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <h4 className="text-xs font-mono font-bold tracking-wider uppercase text-emerald-300 mt-2">
            Coherence alignment verified
          </h4>
          <p className="text-xs text-slate-400 font-sans max-w-sm leading-relaxed mt-1">
            Income margins, corporate PAN hashes, listed guarantor files, and locations align
            precisely without cross-document contradictions.
          </p>
        </div>
      )}
    </div>
  );
}
