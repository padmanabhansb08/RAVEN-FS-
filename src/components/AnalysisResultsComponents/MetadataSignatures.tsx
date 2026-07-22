import { Activity, CheckCircle2 } from 'lucide-react';
import { AnalysisResult } from '../../types';

interface MetadataSignaturesProps {
  readonly analysisResult: AnalysisResult;
}

export function MetadataSignatures({ analysisResult }: MetadataSignaturesProps) {
  return (
    <div className="glass-panel rounded-none border border-white/10 p-5 md:p-6 space-y-4 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
      <div className="border-b border-white/10 pb-3 flex justify-between items-center">
        <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-200 flex items-center gap-2">
          <Activity className="w-4 h-4 text-teal-400 animate-pulse" />
          Metadata Signatures
        </h4>
        <span className="text-[9.5px] font-mono text-slate-500 font-bold select-none uppercase tracking-wider">
          Integrity Review
        </span>
      </div>

      {analysisResult.tamperedSignatures.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysisResult.tamperedSignatures.map((sig, i) => (
            <div
              key={i}
              className="rounded-none p-5 flex flex-col gap-3 border border-amber-500/20 bg-amber-500/10 shadow-inner"
            >
              <span className="text-[9px] font-mono tracking-widest uppercase font-bold px-2 py-1 rounded-full leading-none shrink-0 self-start bg-amber-500/15 text-amber-200 border border-amber-500/30">
                Confidence {sig.confidence}%
              </span>
              <h5 className="text-sm font-bold text-white tracking-wide">{sig.signature}</h5>
              <p className="text-sm text-slate-300 leading-relaxed font-light">{sig.explanation}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-none border border-emerald-500/20 bg-emerald-500/10 p-8 text-center flex flex-col items-center justify-center gap-3 shadow-inner">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]" />
          <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-200">
            Metadata Clean
          </h4>
          <p className="text-sm text-slate-400 max-w-sm leading-relaxed font-light">
            Authoring tools, fonts, and resolution markers look consistent.
          </p>
        </div>
      )}
    </div>
  );
}
