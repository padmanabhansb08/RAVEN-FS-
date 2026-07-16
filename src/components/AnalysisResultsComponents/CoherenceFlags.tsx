import { CheckCircle2, ShieldAlert } from 'lucide-react';
import { AnalysisResult } from '../../types';

interface CoherenceFlagsProps {
  readonly analysisResult: AnalysisResult;
}

export function CoherenceFlags({ analysisResult }: CoherenceFlagsProps) {
  return (
    <div className="glass-panel rounded-3xl border border-white/10 p-5 md:p-6 space-y-4">
      <div className="border-b border-white/10 pb-3 flex justify-between items-center">
        <h4 className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-200 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-violet-300" />
          Coherence flags
        </h4>
        <span className="text-[9.5px] font-mono text-slate-500 font-bold select-none">
          Cross-document review
        </span>
      </div>

      {analysisResult.contradictions.length > 0 ? (
        <div className="space-y-3">
          {analysisResult.contradictions.map((con, idx) => {
            const tone =
              con.severity === 'high'
                ? 'border-rose-500/25 bg-rose-500/8'
                : con.severity === 'medium'
                  ? 'border-amber-500/20 bg-amber-500/8'
                  : 'border-white/10 bg-white/5';

            const badgeTone =
              con.severity === 'high'
                ? 'bg-rose-500/10 text-rose-200 border-rose-500/20'
                : con.severity === 'medium'
                  ? 'bg-amber-500/10 text-amber-200 border-amber-500/20'
                  : 'bg-white/5 text-slate-300 border-white/10';

            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row gap-3 items-start justify-between ${tone}`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[8px] font-mono tracking-widest uppercase px-1.5 py-0.5 rounded-full leading-none font-bold border ${badgeTone}`}
                    >
                      {con.severity}
                    </span>
                    <span className="text-sm font-medium text-white">{con.title}</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-6">{con.description}</p>
                </div>
                <div className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-slate-400 bg-black/30 border border-white/10 px-2.5 py-1 rounded-full max-w-[220px] text-center">
                  {con.crossDocSource}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/8 p-8 text-center flex flex-col items-center justify-center gap-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-300" />
          <h4 className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200 mt-2">
            No contradictions found
          </h4>
          <p className="text-sm text-slate-400 max-w-sm leading-6">
            The uploaded material is internally consistent across names, dates, and supporting
            values.
          </p>
        </div>
      )}
    </div>
  );
}
