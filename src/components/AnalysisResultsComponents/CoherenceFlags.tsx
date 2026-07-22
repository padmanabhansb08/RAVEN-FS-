import { CheckCircle2, ShieldAlert } from 'lucide-react';
import { AnalysisResult } from '../../types';

interface CoherenceFlagsProps {
  readonly analysisResult: AnalysisResult;
}

export function CoherenceFlags({ analysisResult }: CoherenceFlagsProps) {
  return (
    <div className="glass-panel rounded-none border border-white/10 p-5 md:p-6 space-y-4 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
      <div className="border-b border-white/10 pb-3 flex justify-between items-center">
        <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-200 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-teal-400" />
          Coherence Flags
        </h4>
        <span className="text-[9.5px] font-mono text-slate-500 font-bold select-none uppercase tracking-wider">
          Cross-Document Review
        </span>
      </div>

      {analysisResult.contradictions.length > 0 ? (
        <div className="space-y-4">
          {analysisResult.contradictions.map((con, idx) => {
            const tone =
              con.severity === 'high'
                ? 'border-rose-500/30 bg-rose-500/10'
                : con.severity === 'medium'
                  ? 'border-amber-500/20 bg-amber-500/10'
                  : 'border-white/10 bg-white/5';

            const badgeTone =
              con.severity === 'high'
                ? 'bg-rose-500/15 text-rose-200 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.15)]'
                : con.severity === 'medium'
                  ? 'bg-amber-500/15 text-amber-200 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.15)]'
                  : 'bg-white/10 text-slate-300 border-white/20';

            return (
              <div
                key={idx}
                className={`p-5 rounded-none border flex flex-col sm:flex-row gap-4 items-start justify-between shadow-inner ${tone}`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[9px] font-mono tracking-widest uppercase px-2 py-1 rounded-full leading-none font-bold border ${badgeTone}`}
                    >
                      {con.severity}
                    </span>
                    <span className="text-sm font-bold text-white tracking-wide">{con.title}</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed font-light">{con.description}</p>
                </div>
                <div className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-teal-200 bg-teal-500/10 border border-teal-500/20 px-3 py-1.5 rounded-full max-w-[220px] text-center shadow-[0_0_10px_rgba(20,184,166,0.1)]">
                  {con.crossDocSource}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-none border border-emerald-500/20 bg-emerald-500/10 p-8 text-center flex flex-col items-center justify-center gap-3 shadow-inner">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]" />
          <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-200">
            No Contradictions Found
          </h4>
          <p className="text-sm text-slate-400 max-w-sm leading-relaxed font-light">
            The uploaded material is internally consistent across names, dates, and supporting
            values.
          </p>
        </div>
      )}
    </div>
  );
}
