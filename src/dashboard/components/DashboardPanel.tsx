import type { ReactNode } from 'react';

interface DashboardPanelProps {
  title: string;
  eyebrow?: string;
  children: ReactNode;
}

export function DashboardPanel({ title, eyebrow, children }: DashboardPanelProps) {
  return (
    <section className="glass-panel rounded-3xl border border-white/10 p-5 md:p-6">
      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
        <div>
          {eyebrow && (
            <div className="text-[10px] uppercase tracking-[0.24em] text-violet-200 font-semibold">
              {eyebrow}
            </div>
          )}
          <h2 className="mt-1 text-xl font-semibold text-white">{title}</h2>
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}
