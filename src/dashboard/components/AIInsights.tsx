import React from 'react';
import { Sparkles } from 'lucide-react';

export default function AIInsights({ data }: { data: any }) {
  if (!data) return null;
  return (
    <div className="space-y-4">
      <div className="bg-black/30 border border-white/5 p-5 rounded-none shadow-inner relative overflow-hidden group hover:border-teal-500/20 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
        <h3 className="font-bold text-teal-300 mb-3 flex items-center gap-2 relative z-10">
          <Sparkles className="w-4 h-4" /> Executive Summary
        </h3>
        <p className="text-slate-300 leading-relaxed font-light relative z-10">{data.summary}</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-black/30 border border-white/5 p-5 rounded-none border-l-4 border-l-rose-500/70 shadow-inner hover:border-l-rose-400 transition-all">
          <h3 className="font-bold text-rose-300 mb-3 tracking-wide">Priority Action Items</h3>
          <ul className="list-disc list-inside text-slate-300 space-y-2 leading-relaxed font-light">
            {data.actionItems.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="bg-black/30 border border-white/5 p-5 rounded-none border-l-4 border-l-teal-500/70 shadow-inner hover:border-l-teal-400 transition-all">
          <h3 className="font-bold text-teal-300 mb-3 tracking-wide">Positive Trends</h3>
          <ul className="list-disc list-inside text-slate-300 space-y-2 leading-relaxed font-light">
            {data.positiveTrends.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
