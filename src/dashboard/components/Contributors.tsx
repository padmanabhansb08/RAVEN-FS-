import React from 'react';

export default function Contributors({ data }: { data: any }) {
  if (!data) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.list.map((contributor: any, i: number) => (
        <div key={i} className="flex items-center gap-4 bg-black/30 border border-white/5 p-4 rounded-none shadow-inner hover:border-teal-500/20 transition-all">
          <div className="w-10 h-10 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center font-bold text-teal-300 shadow-[0_0_10px_rgba(20,184,166,0.15)]">
            {contributor.name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-white tracking-wide">{contributor.name}</div>
            <div className="text-sm text-slate-400 font-light">{contributor.commits} commits</div>
          </div>
        </div>
      ))}
    </div>
  );
}
