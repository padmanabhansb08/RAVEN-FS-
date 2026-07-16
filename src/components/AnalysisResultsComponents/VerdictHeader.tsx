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
    analysisResult.score > 60 ? '#ef4444' : analysisResult.score > 25 ? '#f59e0b' : '#10b981';

  const textScoreColorClass =
    analysisResult.score > 60
      ? 'text-rose-300'
      : analysisResult.score > 25
        ? 'text-amber-300'
        : 'text-emerald-300';

  const textScoreLabel =
    analysisResult.score > 60
      ? 'High risk'
      : analysisResult.score > 25
        ? 'Review hold'
        : 'Low risk';

  const verdictClass =
    analysisResult.verdict === 'HIGH RISK'
      ? 'bg-rose-500/10 text-rose-200 border-rose-500/25'
      : analysisResult.verdict === 'MEDIUM RISK'
        ? 'bg-amber-500/10 text-amber-200 border-amber-500/25'
        : 'bg-emerald-500/10 text-emerald-200 border-emerald-500/25';

  return (
    <div className="glass-panel rounded-3xl border border-white/10 p-5 md:p-6 flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-200">
            Final review summary
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] bg-emerald-500/10 text-emerald-200 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono uppercase font-bold tracking-wider">
              Scan complete
            </span>
            <span className="text-[10px] text-slate-500 font-mono tracking-wider">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>

        {useManagedAgent ? (
          <div className="rounded-2xl border border-violet-500/20 bg-violet-500/8 p-3 flex items-start gap-3 max-w-sm">
            <div className="mt-0.5 bg-violet-500/15 p-1.5 rounded-lg">
              <Sparkles className="w-3.5 h-3.5 text-violet-300" />
            </div>
            <div>
              <span className="font-bold uppercase block text-[10px] text-violet-200">
                Managed agent active
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Workflow <span className="text-slate-200">{managedAgentId}</span> contributed to the
                final score and relationships.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-black/30 p-3 flex items-start gap-3 max-w-sm">
            <div>
              <span className="font-bold uppercase block text-[10px] text-slate-300">
                Local pattern mode
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                The workspace is using local heuristics while keeping the interface responsive.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-5 xl:grid-cols-[auto_1fr_auto] items-center">
        <div className="relative w-24 h-24 flex items-center justify-center shrink-0 select-none">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="5"
              fill="transparent"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke={scoreColor}
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 40}
              strokeDashoffset={2 * Math.PI * 40 * (1 - analysisResult.score / 100)}
              className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_currentColor]"
            />
          </svg>
          <div className="absolute text-center">
            <span className="text-3xl font-semibold text-white leading-none tracking-tight">
              {analysisResult.score}
            </span>
            <p
              className={`text-[8px] uppercase font-bold tracking-wider leading-none mt-1 ${textScoreColorClass}`}
            >
              {textScoreLabel}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-[9.5px] font-mono tracking-widest font-bold uppercase border px-2.5 py-1 rounded-full ${verdictClass}`}
            >
              {analysisResult.verdict}
            </span>
            {useManagedAgent && (
              <span className="text-[8.5px] font-mono text-violet-200 font-bold uppercase px-2 py-1 border border-violet-500/20 rounded-full bg-violet-500/10 flex items-center gap-1 leading-none select-none">
                <Sparkles className="w-3.5 h-3.5 text-violet-300" />
                {managedAgentId}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-300 leading-7 max-w-2xl">{analysisResult.summary}</p>
        </div>

        <div className="grid gap-2 text-[10px] font-mono border-t xl:border-t-0 xl:border-l border-white/10 pt-4 xl:pt-0 xl:pl-5 min-w-[220px]">
          <div className="flex justify-between items-center gap-4">
            <span className="text-slate-500 uppercase font-medium">Action</span>
            <span
              className={
                analysisResult.caseFileDetails.recommendingRejection
                  ? 'text-rose-300 font-bold'
                  : 'text-emerald-300 font-bold'
              }
            >
              {analysisResult.caseFileDetails.recommendingRejection ? 'Escalate' : 'Clear'}
            </span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-slate-500 uppercase">Anomalies</span>
            <span
              className={
                analysisResult.contradictions.length > 0
                  ? 'text-amber-300 font-bold'
                  : 'text-slate-400'
              }
            >
              {analysisResult.contradictions.length}
            </span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-slate-500 uppercase">Nodes</span>
            <span className="text-violet-300 font-bold">{analysisResult.graphNodes.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
