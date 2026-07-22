import { Dispatch, SetStateAction } from 'react';
import { AlertTriangle, Database, LayoutDashboard } from 'lucide-react';
import { AnalysisResult, GraphNode } from '../types';
import { AgenticSweepProgress } from './AnalysisResultsComponents/AgenticSweepProgress';
import { VerdictHeader } from './AnalysisResultsComponents/VerdictHeader';
import { CoherenceFlags } from './AnalysisResultsComponents/CoherenceFlags';
import { RelationalGraph } from './AnalysisResultsComponents/RelationalGraph';
import { MetadataSignatures } from './AnalysisResultsComponents/MetadataSignatures';
import { ComplianceDirectives } from './AnalysisResultsComponents/ComplianceDirectives';
import { AIStatusBanners } from './AnalysisResultsComponents/AIStatusBanners';

interface AnalysisResultsProps {
  readonly isAnalyzing: boolean;
  readonly activeStageId: number;
  readonly stageOutputs: { readonly [key: number]: string };
  readonly analysisResult: AnalysisResult | null;
  readonly selectedNode: GraphNode | null;
  readonly setSelectedNode: Dispatch<SetStateAction<GraphNode | null>>;
  readonly useManagedAgent: boolean;
  readonly managedAgentId: string;
  readonly errorText: string;
}

export function AnalysisResults({
  isAnalyzing,
  activeStageId,
  stageOutputs,
  analysisResult,
  selectedNode,
  setSelectedNode,
  useManagedAgent,
  managedAgentId,
  errorText,
}: AnalysisResultsProps) {
  let content = null;

  if (isAnalyzing) {
    content = <AgenticSweepProgress activeStageId={activeStageId} stageOutputs={stageOutputs} />;
  } else if (analysisResult) {
    content = (
      <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-8">
        <AIStatusBanners analysisResult={analysisResult} />

        <VerdictHeader
          analysisResult={analysisResult}
          useManagedAgent={useManagedAgent}
          managedAgentId={managedAgentId}
        />

        {/* Consolidated Report Body */}
        <div className="flex flex-col gap-6">
          <CoherenceFlags analysisResult={analysisResult} />

          <RelationalGraph
            analysisResult={analysisResult}
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
          />

          <MetadataSignatures analysisResult={analysisResult} />

          <ComplianceDirectives analysisResult={analysisResult} />
        </div>
      </div>
    );
  } else {
    content = (
      <div className="glass-panel border border-white/5 rounded-none p-10 text-center flex flex-col items-center justify-center min-h-[500px] shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-teal-500/20 rounded-full blur-xl animate-pulse" />
          <Database className="w-16 h-16 text-slate-600 relative z-10" />
        </div>
        <h3 className="text-xs font-mono font-bold tracking-[0.3em] text-slate-400 uppercase">
          Intelligence Module Standby
        </h3>
        <p className="text-sm text-slate-500 font-sans mt-4 max-w-sm leading-relaxed font-light">
          Upload call records, transaction logs, and account linkages. The intelligence engine will automatically execute multi-layered analysis.
        </p>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-6 min-h-0">
      <div className="glass-panel rounded-none border border-white/10 p-5 md:p-6 flex items-center justify-between gap-4 shadow-[0_15px_40px_rgba(0,0,0,0.2)]">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-teal-300 font-bold">
            Intelligence Matrix
          </div>
          <h2 className="mt-2 text-xl font-bold text-white tracking-tight">
            Analysis output and structured intelligence
          </h2>
        </div>
        <div className="hidden md:flex items-center gap-3 rounded-full border border-teal-500/20 bg-teal-500/10 px-4 py-2 text-xs font-semibold text-teal-100 shadow-inner">
          <LayoutDashboard className="h-4 w-4 text-teal-300" />
          <span>Dashboard Active</span>
        </div>
      </div>

      {content}
      {errorText && (
        <div className="rounded-none border border-rose-500/20 bg-rose-500/10 p-4 flex items-center gap-3 text-xs font-mono text-rose-200 select-text shadow-[0_0_20px_rgba(244,63,94,0.1)]">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500" />
          <span>{errorText}</span>
        </div>
      )}
    </section>
  );
}
