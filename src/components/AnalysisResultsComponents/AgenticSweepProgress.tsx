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
    <div className="glass-panel rounded-none border border-white/10 p-5 md:p-8 flex flex-col gap-6 min-h-[540px] relative overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.3)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.1),transparent_35%)] pointer-events-none" />
      <div className="border-b border-white/10 pb-4 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-teal-400 animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-200">
            Active Analysis Sweep
          </span>
        </div>
        <span className="text-[10px] font-mono bg-teal-500/10 text-teal-300 border border-teal-500/30 px-3 py-1.5 rounded-full font-bold uppercase animate-[pulse_2s_ease-in-out_infinite] shadow-[0_0_15px_rgba(20,184,166,0.2)]">
          Processing
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-5 relative z-10">
        {steps.map((step) => {
          const isActive = activeStageId === step.id;
          const isDone = activeStageId > step.id;

          const iconContent = isDone ? (
            <div className="w-6 h-6 rounded-full bg-blue-500/15 border border-blue-500/40 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
              <Check className="w-4 h-4 text-blue-300 font-bold" />
            </div>
          ) : isActive ? (
            <div className="w-6 h-6 rounded-full bg-teal-500/15 border border-teal-400/50 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(20,184,166,0.3)]">
              <RefreshCw className="w-4 h-4 text-teal-300 animate-spin" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 font-mono text-[10px] text-slate-500 font-bold">
              0{step.id}
            </div>
          );

          const titleColor = isActive
            ? 'text-teal-200'
            : isDone
              ? 'text-blue-300'
              : 'text-slate-500';

          const bgColor = isActive
            ? 'bg-teal-500/5 border-teal-400/40 shadow-[0_5px_20px_rgba(20,184,166,0.15)] ring-1 ring-teal-400/20 backdrop-blur-md'
            : isDone
              ? 'bg-blue-500/5 border-blue-500/20 shadow-sm'
              : 'bg-black/20 border-white/10 opacity-60';

          return (
            <div
              key={step.id}
              className={`p-5 rounded-none border transition-all duration-500 flex flex-col gap-3 ${bgColor}`}
            >
              <div className="flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
                <div className="flex items-center gap-3">
                  {iconContent}
                  <div>
                    <h4 className={`text-sm font-bold leading-none tracking-wide ${titleColor}`}>
                      {step.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1.5 leading-normal font-light">{step.desc}</p>
                  </div>
                </div>

                {isActive && (
                  <span className="text-[9px] font-mono uppercase bg-teal-500/15 border border-teal-500/30 px-3 py-1 rounded-full text-teal-200 animate-pulse font-bold self-start sm:self-center shrink-0 shadow-[0_0_10px_rgba(20,184,166,0.2)]">
                    Running
                  </span>
                )}
                {isDone && (
                  <span className="text-[9px] font-mono uppercase bg-blue-500/10 border border-blue-500/25 px-3 py-1 rounded-full text-blue-300 font-bold self-start sm:self-center shrink-0">
                    Done
                  </span>
                )}
                {!isActive && !isDone && (
                  <span className="text-[9px] font-mono uppercase bg-white/5 border border-white/10 px-3 py-1 rounded-full text-slate-500 font-bold self-start sm:self-center shrink-0">
                    Waiting
                  </span>
                )}
              </div>

              {(isActive || isDone) && (
                <div
                  className={`mt-2 text-xs ${isActive ? 'bg-black/50 border-teal-500/30' : 'bg-black/30 border-white/5'} border rounded-none p-4 text-slate-300 select-text leading-relaxed flex items-start sm:items-center gap-3 break-words font-mono shadow-inner`}
                >
                  {!isDone && (
                    <span className="mt-1 sm:mt-0 inline-block w-2 h-2 rounded-full bg-teal-400 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] shrink-0"></span>
                  )}
                  <span>{stageOutputs[step.id]}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="border-t border-white/10 pt-5 flex flex-col sm:flex-row justify-between items-center gap-3 font-mono text-[11px] text-slate-500 relative z-10 uppercase tracking-widest font-bold">
        <span className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-teal-400 animate-spin" />
          <span className="text-teal-300">Tracing records...</span>{' '}
          <span className="text-slate-400">{(activeStageId - 1) * 25 || 5}% complete</span>
        </span>
        <span className="text-teal-400/60 text-[9px] tracking-[0.3em]">
          Keep workspace open
        </span>
      </div>
    </div>
  );
}
