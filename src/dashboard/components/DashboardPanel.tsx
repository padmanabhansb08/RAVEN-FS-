import type { ReactNode } from 'react';

interface DashboardPanelProps {
  title: string;
  eyebrow?: string;
  children: ReactNode;
}

export function DashboardPanel({ title, eyebrow, children }: DashboardPanelProps) {
  return (
    <section className="glass-panel rounded-none border border-white/10 p-5 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          {eyebrow && (
            <div className="text-[10px] uppercase tracking-[0.2em] text-teal-300 font-bold">
              {eyebrow}
            </div>
          )}
          <h2 className="mt-1.5 text-xl font-bold text-white tracking-wide">{title}</h2>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
