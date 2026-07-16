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
        <section className="glass-panel rounded-3xl border border-white/10 p-5 md:p-7 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.16),transparent_34%),radial-gradient(circle_at_left,rgba(59,130,246,0.1),transparent_30%)] pointer-events-none" />
          <div className="relative flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-200">
                <ShieldCheck className="h-3.5 w-3.5" />
                Repository dashboard
              </span>
              <span className="text-[11px] uppercase tracking-[0.28em] text-slate-400 font-mono">
                Compatibility and quality overview
              </span>
            </div>
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
                A polished view of build health, security, tests, and delivery flow.
              </h1>
              <p className="mt-3 text-sm md:text-base leading-7 text-slate-300">
                This dashboard now follows the same visual system as the analysis workspace, with strong hierarchy,
                readable cards, and a black + purple direction that feels intentional.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <BarChart3 className="h-5 w-5 text-violet-300" />
                <div className="mt-3 text-sm font-medium text-white">Build health first</div>
                <div className="mt-1 text-sm text-slate-400">Visibility into delivery, coverage, and trendlines.</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <ShieldCheck className="h-5 w-5 text-violet-300" />
                <div className="mt-3 text-sm font-medium text-white">Security posture</div>
                <div className="mt-1 text-sm text-slate-400">Risk is surfaced before it becomes a release blocker.</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <Sparkles className="h-5 w-5 text-violet-300" />
                <div className="mt-3 text-sm font-medium text-white">Cleaner story</div>
                <div className="mt-1 text-sm text-slate-400">Everything is framed for fast scanning and trust.</div>
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
