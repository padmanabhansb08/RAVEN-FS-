import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function BuildHealth({ data }: { data: any }) {
  if (!data) return null;
  return (
    <section className="space-y-4">
      <div className="flex gap-4">
        <div className="surface p-3 rounded-none flex-1">
          <div className="text-sm text-slate-400">Build Success Rate</div>
          <div className="text-2xl font-semibold text-emerald-300">{data.buildSuccessRate}%</div>
        </div>
        <div className="surface p-3 rounded-none flex-1">
          <div className="text-sm text-slate-400">Deploy Success Rate</div>
          <div className="text-2xl font-semibold text-emerald-300">{data.deploySuccessRate}%</div>
        </div>
      </div>
      <div className="h-48 rounded-none border border-white/10 bg-black/20 p-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.history}>
            <XAxis dataKey="date" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            />
            <Bar isAnimationActive={false} dataKey="success" stackId="a" fill="#34d399" />
            <Bar isAnimationActive={false} dataKey="failure" stackId="a" fill="#fb7185" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
