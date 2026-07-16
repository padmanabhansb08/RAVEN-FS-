import { Activity, Check, RefreshCw, Terminal } from 'lucide-react';

interface AgenticSweepProgressProps {
  readonly activeStageId: number;
  readonly stageOutputs: { readonly [key: number]: string };
}

export function AgenticSweepProgress({ activeStageId, stageOutputs }: AgenticSweepProgressProps) {
  const steps = [
    {
      id: 1,
      title: 'Layer 1 - Document ingestion',
      desc: 'Verifies uploaded files, extracted text, and metadata quality.',
    },
    {
      id: 2,
      title: 'Layer 2 - Cross-document coherence',
      desc: 'Checks for conflicting claims, mismatched dates, and duplicate entities.',
    },
    {
      id: 3,
      title: 'Layer 3 - Relationship graph',
      desc: 'Maps people, devices, accounts, and source links into a network.',
    },
    {
      id: 4,
      title: 'Layer 4 - Compliance summary',
      desc: 'Compiles findings into a final score, verdict, and action package.',
    },
  ];

  return (
    <div className="glass-panel rounded-3xl border border-white/10 p-5 md:p-6 flex flex-col gap-5 min-h-[540px] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.16),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08),transparent_28%)] pointer-events-none" />
      <div className="border-b border-white/10 pb-3 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-violet-300 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-200">
            Active analysis sweep
          </span>
        </div>
        <span className="text-[10px] font-mono bg-violet-500/10 text-violet-200 border border-violet-500/20 px-2.5 py-1 rounded-full font-bold uppercase animate-pulse">
          Processing
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-4 relative z-10">
        {steps.map((step) => {
          const isActive = activeStageId === step.id;
          const isDone = activeStageId > step.id;

          const iconContent = isDone ? (
            <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 text-emerald-300 font-bold" />
            </div>
          ) : isActive ? (
            <div className="w-5 h-5 rounded-full bg-violet-500/10 border border-violet-400/40 flex items-center justify-center shrink-0">
              <RefreshCw className="w-3.5 h-3.5 text-violet-300 animate-spin" />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 font-mono text-[9px] text-slate-500">
              0{step.id}
            </div>
          );

          const titleColor = isActive
            ? 'text-violet-200'
            : isDone
              ? 'text-emerald-300'
              : 'text-slate-500';

          const bgColor = isActive
            ? 'bg-violet-500/10 border-violet-400/30 shadow-[0_0_24px_rgba(168,85,247,0.12)] ring-1 ring-violet-400/20 backdrop-blur-md'
            : isDone
              ? 'bg-emerald-500/8 border-emerald-500/20'
              : 'bg-black/20 border-white/10 opacity-60';

          return (
            <div
              key={step.id}
              className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col gap-2 ${bgColor}`}
            >
              <div className="flex items-start sm:items-center justify-between gap-3 flex-col sm:flex-row">
                <div className="flex items-center gap-2.5">
                  {iconContent}
                  <div>
                    <h4 className={`text-xs font-semibold leading-none ${titleColor}`}>
                      {step.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-1 leading-normal">{step.desc}</p>
                  </div>
                </div>

                {isActive && (
                  <span className="text-[8px] font-mono uppercase bg-violet-500/10 border border-violet-500/25 px-2 py-0.5 rounded-full text-violet-200 animate-pulse font-bold self-start sm:self-center shrink-0">
                    Running
                  </span>
                )}
                {isDone && (
                  <span className="text-[8px] font-mono uppercase bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-full text-emerald-300 font-bold self-start sm:self-center shrink-0">
                    Done
                  </span>
                )}
                {!isActive && !isDone && (
                  <span className="text-[8px] font-mono uppercase bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-slate-600 font-bold self-start sm:self-center shrink-0">
                    Waiting
                  </span>
                )}
              </div>

              {(isActive || isDone) && (
                <div
                  className={`mt-2 text-[11px] ${isActive ? 'bg-black/45 border-violet-500/20' : 'bg-black/30 border-white/10'} border rounded-xl p-3 text-slate-300 select-text leading-relaxed flex items-center gap-2 break-words`}
                >
                  {!isDone && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-violet-300 animate-ping shrink-0"></span>
                  )}
                  <span>{stageOutputs[step.id]}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row justify-between items-center gap-3 font-mono text-[10px] text-slate-500 relative z-10">
        <span className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-violet-300 animate-spin" />
          <span className="text-violet-200 font-bold">Tracing records...</span>{' '}
          {(activeStageId - 1) * 25 || 5}% complete
        </span>
        <span className="text-violet-300/70 text-[9px] uppercase tracking-widest font-bold">
          Keep this workspace open
        </span>
      </div>
    </div>
  );
}
