import React, { useState, useEffect } from 'react';
import ExecutiveOverview from './components/ExecutiveOverview';
import BuildHealth from './components/BuildHealth';
import TestCoverage from './components/TestCoverage';
import SecurityDashboard from './components/SecurityDashboard';
import CodeQuality from './components/CodeQuality';
import RepositoryActivity from './components/RepositoryActivity';
import PRAnalytics from './components/PRAnalytics';
import IssueManagement from './components/IssueManagement';
import PerformanceMonitoring from './components/PerformanceMonitoring';
import Contributors from './components/Contributors';
import AIInsights from './components/AIInsights';
import { DashboardPanel } from './components/DashboardPanel';
import { BarChart3, ShieldCheck, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('./dashboard-data.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load dashboard data');
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-white">Loading dashboard metrics...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  if (!data) return null;

  return (
    <div className="min-h-screen text-slate-200 p-4 md:p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <section className="glass-panel rounded-none border border-white/10 p-5 md:p-8 relative overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.3)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.12),transparent_35%),radial-gradient(circle_at_left,rgba(59,130,246,0.1),transparent_35%)] pointer-events-none" />
          <div className="relative flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-500/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-teal-200 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
                <ShieldCheck className="h-4 w-4" />
                Repository Dashboard
              </span>
              <span className="text-[11px] uppercase tracking-[0.28em] text-slate-400 font-mono font-bold">
                Compatibility and quality overview
              </span>
            </div>
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                A polished view of build health, security, tests, and delivery flow.
              </h1>
              <p className="mt-4 text-sm md:text-base leading-relaxed text-slate-300 font-light max-w-2xl">
                This dashboard now follows the same visual system as the analysis workspace, with
                strong hierarchy, readable cards, and a teal/blue direction that feels
                intentional and premium.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-none border border-white/10 bg-black/30 p-5 transition-all hover:bg-black/40 hover:border-teal-500/20 hover:shadow-[0_0_20px_rgba(20,184,166,0.1)]">
                <BarChart3 className="h-6 w-6 text-teal-400" />
                <div className="mt-4 text-sm font-bold text-white tracking-wide">Build Health First</div>
                <div className="mt-2 text-sm text-slate-400 font-light leading-relaxed">
                  Visibility into delivery, coverage, and trendlines.
                </div>
              </div>
              <div className="rounded-none border border-white/10 bg-black/30 p-5 transition-all hover:bg-black/40 hover:border-blue-500/20 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                <ShieldCheck className="h-6 w-6 text-blue-400" />
                <div className="mt-4 text-sm font-bold text-white tracking-wide">Security Posture</div>
                <div className="mt-2 text-sm text-slate-400 font-light leading-relaxed">
                  Risk is surfaced before it becomes a release blocker.
                </div>
              </div>
              <div className="rounded-none border border-white/10 bg-black/30 p-5 transition-all hover:bg-black/40 hover:border-teal-500/20 hover:shadow-[0_0_20px_rgba(20,184,166,0.1)]">
                <Sparkles className="h-6 w-6 text-teal-400" />
                <div className="mt-4 text-sm font-bold text-white tracking-wide">Cleaner Story</div>
                <div className="mt-2 text-sm text-slate-400 font-light leading-relaxed">
                  Everything is framed for fast scanning and trust.
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="space-y-6">
          <DashboardPanel title="AI Health Assessment" eyebrow="Insights">
            <AIInsights data={data.aiInsights} />
          </DashboardPanel>

          <DashboardPanel title="Executive Health Overview" eyebrow="Summary">
            <ExecutiveOverview data={data.executiveOverview} />
          </DashboardPanel>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <DashboardPanel title="Build & Deployment Health" eyebrow="Delivery">
              <BuildHealth data={data.buildHealth} />
            </DashboardPanel>
            <DashboardPanel title="Test & Coverage Analytics" eyebrow="Coverage">
              <TestCoverage data={data.testCoverage} />
            </DashboardPanel>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <DashboardPanel title="Security Dashboard" eyebrow="Security">
              <SecurityDashboard data={data.securityDashboard} />
            </DashboardPanel>
            <DashboardPanel title="Code Quality" eyebrow="Maintainability">
              <CodeQuality data={data.codeQuality} />
            </DashboardPanel>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <DashboardPanel title="Repository Activity" eyebrow="Activity">
              <RepositoryActivity data={data.repositoryActivity} />
            </DashboardPanel>
            <DashboardPanel title="PR Analytics" eyebrow="Reviews">
              <PRAnalytics data={data.prAnalytics} />
            </DashboardPanel>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <DashboardPanel title="Issue Management" eyebrow="Backlog">
              <IssueManagement data={data.issueManagement} />
            </DashboardPanel>
            <DashboardPanel title="Performance Monitoring" eyebrow="Performance">
              <PerformanceMonitoring data={data.performanceMonitoring} />
            </DashboardPanel>
          </div>

          <DashboardPanel title="Contributors" eyebrow="People">
            <Contributors data={data.contributors} />
          </DashboardPanel>
        </div>
      </div>
    </div>
  );
}
