import { Layers3, ShieldCheck, Sparkles, Workflow } from 'lucide-react';

const pillars = [
  {
    icon: Workflow,
    title: 'What is being built',
    text: 'A document analysis workspace that ingests files, compares evidence, and produces a structured risk report.',
  },
  {
    icon: ShieldCheck,
    title: 'What it must do',
    text: 'Support the current analysis endpoints, keep upload and editor flows stable, and remain easy to use across screen sizes.',
  },
  {
    icon: Sparkles,
    title: 'How it should feel',
    text: 'Premium, calm, and intentional with a black base, purple accents, and readable patterns that help users move quickly.',
  },
];

export function ProductBlueprint() {
  return (
    <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
      <div className="glass-panel rounded-3xl border border-white/10 p-5 md:p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.10),transparent_30%)] pointer-events-none" />
        <div className="relative flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-fuchsia-200">
              <Layers3 className="h-3.5 w-3.5" />
              Frontend rebuild blueprint
            </span>
            <span className="text-[11px] uppercase tracking-[0.28em] text-slate-400 font-mono">
              Black + purple system
            </span>
          </div>

          <div className="max-w-3xl space-y-3">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
              A clear product shell for document analysis, review, and reporting.
            </h2>
            <p className="text-sm md:text-base leading-7 text-slate-300 max-w-2xl">
              We are turning the current technical demo into a focused workspace with a defined
              purpose, cleaner hierarchy, and stronger usability while preserving every analysis
              endpoint already in use.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <article
                  key={pillar.title}
                  className="rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur-sm"
                >
                  <Icon className="h-5 w-5 text-violet-300" />
                  <h3 className="mt-3 text-sm font-semibold text-white">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{pillar.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <aside className="glass-panel rounded-3xl border border-white/10 p-5 md:p-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-violet-200">
          <div className="h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_18px_rgba(168,85,247,0.8)]" />
          Build priorities
        </div>
        <div className="mt-4 space-y-3 text-sm">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-slate-200 font-medium">1. Product clarity</div>
            <div className="mt-1 text-slate-400">
              Make the main workflow obvious at a glance so users always know where they are.
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-slate-200 font-medium">2. Compatibility</div>
            <div className="mt-1 text-slate-400">
              Keep layouts responsive, keyboard-friendly, and stable across modern browsers.
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-slate-200 font-medium">3. Polished execution</div>
            <div className="mt-1 text-slate-400">
              Use restrained motion, depth, and spacing so the interface feels premium rather than
              noisy.
            </div>
          </div>
        </div>
      </aside>
    </section>
  );
}
