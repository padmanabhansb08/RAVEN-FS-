import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function ExecutiveOverview({ data }: { data: any }) {
  if (!data) return null;
  return (
    <section className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Overall Health', value: data.overallScore },
          { label: 'Engineering Quality', value: data.engineeringScore },
          { label: 'Security Score', value: data.securityScore },
          { label: 'Maintainability', value: data.maintainabilityScore },
        ].map((item) => (
          <div key={item.label} className="surface p-4 rounded-none">
            <div className="text-sm text-slate-400">{item.label}</div>
            <div
              className={`text-3xl font-semibold ${item.value > 80 ? 'text-emerald-300' : 'text-amber-300'}`}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>
      <div className="h-64 rounded-none border border-white/10 bg-black/20 p-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.history}>
            <XAxis dataKey="date" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            />
            <Line
              isAnimationActive={false}
              type="monotone"
              dataKey="score"
              stroke="#a78bfa"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
