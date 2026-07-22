import { ShieldAlert, Sparkles } from 'lucide-react';
import { AnalysisResult } from '../../types';

interface AIStatusBannersProps {
  readonly analysisResult: AnalysisResult;
}

export function AIStatusBanners({ analysisResult }: AIStatusBannersProps) {
  if (!analysisResult.aiStatus || analysisResult.aiStatus.success) {
    return null;
  }

  if (analysisResult.aiStatus.isQuotaExceeded) {
    return (
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-none p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center gap-2 text-amber-400">
          <ShieldAlert className="w-5 h-5 shrink-0 animate-bounce text-amber-500" />
          <div>
            <span className="font-bold uppercase block text-[10px]">
              GEMINI CLOUD QUOTA REACHED (FREE TIER)
            </span>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5 leading-relaxed">
              To protect your seamless workflow, the local RAVEN Multi-Document Rule Intelligence
              dynamic analyzer has compiled this relational graph check instantly with top-tier
              heuristics.
            </p>
          </div>
        </div>
        <span className="text-[9px] uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded text-amber-300 font-bold self-start sm:self-center shrink-0">
          Rule Engine Active
        </span>
      </div>
    );
  }

  return (
    <div className="bg-blue-500/5 border border-blue-500/20 rounded-none p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs shadow-[0_5px_15px_rgba(59,130,246,0.1)]">
      <div className="flex items-center gap-2 text-blue-400">
        <Sparkles className="w-5 h-5 shrink-0 text-blue-400 animate-pulse" />
        <div>
          <span className="font-bold uppercase block text-[10px]">
            LOCAL PATTERN DETECTION ENGINE
          </span>
          <p className="text-[11px] text-slate-400 font-sans mt-0.5 leading-relaxed">
            Evaluated using RAVEN&apos;s fully optimized multi-document coherence ruleset. Set
            GEMINI_API_KEY inside Settings drawer to fully enable LLM deep-reasoning tree
            structures.
          </p>
        </div>
      </div>
      <span className="text-[9px] uppercase tracking-wider bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded text-blue-300 font-bold self-start sm:self-center shrink-0">
        Local Mode
      </span>
    </div>
  );
}
