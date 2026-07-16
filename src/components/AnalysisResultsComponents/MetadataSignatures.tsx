import { Activity, CheckCircle2 } from 'lucide-react';
import { AnalysisResult } from '../../types';

interface MetadataSignaturesProps {
  readonly analysisResult: AnalysisResult;
}

export function MetadataSignatures({ analysisResult }: MetadataSignaturesProps) {
  return (
    <div className="glass-panel rounded-3xl border border-white/10 p-5 md:p-6 space-y-4">
      <div className="border-b border-white/10 pb-3 flex justify-between items-center">
        <h4 className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-200 flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-violet-300 animate-pulse" />
          Metadata signatures
        </h4>
        <span className="text-[9.5px] font-mono text-slate-500 font-bold select-none">
          Integrity review
        </span>
      </div>

      {analysisResult.tamperedSignatures.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysisResult.tamperedSignatures.map((sig, i) => (
            <div key={i} className="rounded-2xl p-4 flex flex-col gap-2 border border-amber-500/20 bg-amber-500/8">
              <span className="text-[8.5px] font-mono tracking-widest uppercase font-bold px-1.5 py-0.5 rounded-full leading-none shrink-0 self-start bg-amber-500/10 text-amber-200 border border-amber-500/20">
                Confidence {sig.confidence}%
              </span>
              <h5 className="text-sm font-medium text-white">{sig.signature}</h5>
              <p className="text-sm text-slate-300 leading-6">{sig.explanation}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/8 p-8 text-center flex flex-col items-center justify-center gap-1.5">
          <CheckCircle2 className="w-8 h-8 text-emerald-300" />
          <h4 className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200">
            Metadata clean
          </h4>
          <p className="text-sm text-slate-400 max-w-sm leading-6">
            Authoring tools, fonts, and resolution markers look consistent.
          </p>
        </div>
      )}
    </div>
  );
}
