import { Sparkles } from 'lucide-react';
import { AnalysisResult } from '../../types';

interface VerdictHeaderProps {
  readonly analysisResult: AnalysisResult;
  readonly useManagedAgent: boolean;
  readonly managedAgentId: string;
}

export function VerdictHeader({
  analysisResult,
  useManagedAgent,
  managedAgentId,
}: VerdictHeaderProps) {
  const scoreColor =
    analysisResult.score > 60 ? '#ef4444' : analysisResult.score > 25 ? '#f59e0b' : '#14b8a6';

  const textScoreColorClass =
    analysisResult.score > 60
      ? 'text-rose-300'
      : analysisResult.score > 25
        ? 'text-amber-300'
        : 'text-teal-300';

  const textScoreLabel =
    analysisResult.score > 60
      ? 'High risk'
      : analysisResult.score > 25
        ? 'Review hold'
        : 'Low risk';

  const verdictClass =
    analysisResult.verdict === 'HIGH RISK'
      ? 'bg-rose-500/10 text-rose-200 border-rose-500/25 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
      : analysisResult.verdict === 'MEDIUM RISK'
        ? 'bg-amber-500/10 text-amber-200 border-amber-500/25 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
        : 'bg-teal-500/10 text-teal-200 border-teal-500/25 shadow-[0_0_10px_rgba(20,184,166,0.2)]';

  return (
    <div className="glass-panel rounded-none border border-white/10 p-5 md:p-8 flex flex-col gap-6 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-300">
            Final review summary
          </h3>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[10px] bg-teal-500/10 text-teal-200 border border-teal-500/20 px-3 py-1 rounded-full font-mono uppercase font-bold tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
              Scan complete
            </span>
            <span className="text-[10px] text-slate-500 font-mono tracking-wider">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>

        {useManagedAgent ? (
          <div className="rounded-none border border-blue-500/20 bg-blue-500/10 p-3.5 flex items-start gap-3 max-w-sm shadow-[0_0_15px_rgba(59,130,246,0.1)]">
            <div className="mt-0.5 bg-blue-500/20 p-1.5 rounded-none border border-blue-400/20">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            </div>
            <div>
              <span className="font-bold uppercase block text-[10px] tracking-widest text-blue-200">
                Intelligence Core Active
              </span>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Agent <span className="text-slate-200 font-mono">{managedAgentId}</span> generated the
                final score and relational matrix.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-none border border-white/10 bg-black/30 p-3.5 flex items-start gap-3 max-w-sm">
            <div>
              <span className="font-bold uppercase block text-[10px] tracking-widest text-slate-300">
                Local heuristic mode
              </span>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                The workspace is using local heuristics for analysis execution.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-[auto_1fr_auto] items-center">
        <div className="relative w-28 h-28 flex items-center justify-center shrink-0 select-none">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="56"
              cy="56"
              r="48"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="56"
              cy="56"
              r="48"
              stroke={scoreColor}
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 48}
              strokeDashoffset={2 * Math.PI * 48 * (1 - analysisResult.score / 100)}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out drop-shadow-[0_0_10px_currentColor]"
            />
          </svg>
          <div className="absolute text-center">
            <span className="text-4xl font-bold text-white leading-none tracking-tighter">
              {analysisResult.score}
            </span>
            <p
              className={`text-[9px] uppercase font-bold tracking-[0.2em] leading-none mt-1.5 ${textScoreColorClass}`}
            >
              {textScoreLabel}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`text-[10px] font-mono tracking-widest font-bold uppercase border px-3 py-1.5 rounded-full ${verdictClass}`}
            >
              {analysisResult.verdict}
            </span>
            {useManagedAgent && (
              <span className="text-[9px] font-mono text-blue-200 font-bold uppercase px-3 py-1.5 border border-blue-500/20 rounded-full bg-blue-500/10 flex items-center gap-2 leading-none select-none shadow-[0_0_10px_rgba(59,130,246,0.15)]">
                <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                {managedAgentId}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl font-light">{analysisResult.summary}</p>
        </div>

        <div className="grid gap-3 text-[10px] font-mono border-t xl:border-t-0 xl:border-l border-white/10 pt-5 xl:pt-0 xl:pl-6 min-w-[240px]">
          <div className="flex justify-between items-center gap-4">
            <span className="text-slate-500 uppercase font-bold tracking-widest">Directive</span>
            <span
              className={
                analysisResult.caseFileDetails.recommendingRejection
                  ? 'text-rose-400 font-bold tracking-wider'
                  : 'text-teal-400 font-bold tracking-wider'
              }
            >
              {analysisResult.caseFileDetails.recommendingRejection ? 'ESCALATE' : 'CLEAR'}
            </span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-slate-500 uppercase font-bold tracking-widest">Anomalies</span>
            <span
              className={
                analysisResult.contradictions.length > 0
                  ? 'text-amber-400 font-bold text-xs'
                  : 'text-slate-400 font-bold text-xs'
              }
            >
              {analysisResult.contradictions.length}
            </span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-slate-500 uppercase font-bold tracking-widest">Data Nodes</span>
            <span className="text-blue-400 font-bold text-xs">{analysisResult.graphNodes.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
