import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function PRAnalytics({ data }: { data: any }) {
  if (!data) return null;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-black/30 border border-white/5 p-4 rounded-none text-center shadow-inner hover:border-white/10 transition-all">
          <div className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-1">Open PRs</div>
          <div className="text-2xl font-bold text-white">{data.openPRs}</div>
        </div>
        <div className="bg-black/30 border border-teal-500/10 p-4 rounded-none text-center shadow-inner hover:border-teal-500/20 transition-all relative overflow-hidden">
          <div className="absolute inset-0 bg-teal-500/5 opacity-50 pointer-events-none" />
          <div className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-1 relative z-10">Merged PRs</div>
          <div className="text-2xl font-bold text-teal-400 drop-shadow-[0_0_5px_rgba(20,184,166,0.3)] relative z-10">{data.mergedPRs}</div>
        </div>
        <div className="bg-black/30 border border-white/5 p-4 rounded-none text-center shadow-inner hover:border-white/10 transition-all">
          <div className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-1">Avg Merge Time</div>
          <div className="text-2xl font-bold text-white">{data.avgMergeTime}h</div>
        </div>
      </div>
      <div className="h-48 bg-black/20 border border-white/5 rounded-none p-4 shadow-inner">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.history}>
            <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)' }} itemStyle={{ color: '#e2e8f0' }} />
            <Bar
              isAnimationActive={false}
              dataKey="merged"
              stackId="a"
              fill="#2dd4bf"
              name="Merged"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              isAnimationActive={false}
              dataKey="opened"
              stackId="a"
              fill="#3b82f6"
              name="Opened"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
