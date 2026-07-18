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
import { LawEnforcementIntelligence } from './AnalysisResultsComponents/LawEnforcementIntelligence';
import { isFraudNetworkAnalysis } from '../domain/evidencePackage';

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

          {isFraudNetworkAnalysis(analysisResult) && (
            <LawEnforcementIntelligence
              analysisResult={analysisResult}
            />
          )}

          <MetadataSignatures analysisResult={analysisResult} />

          <ComplianceDirectives analysisResult={analysisResult} />
        </div>
      </div>
    );
  } else {
    content = (
      <div className="glass-panel border border-white/5 rounded-xl p-8 text-center flex flex-col items-center justify-center min-h-[500px]">
        <Database className="w-12 h-12 text-slate-700 animate-pulse" />
        <h3 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase mt-5">
          Workspace Awaiting Active Scan
        </h3>
        <p className="text-xs text-slate-500 font-sans mt-2 max-w-sm">
          Upload call records, transaction logs, and account linkages. RAVEN will detect coordinated
          fraud patterns and map the ring topology.
        </p>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-4 min-h-0">
      <div className="glass-panel rounded-3xl border border-white/10 p-4 md:p-5 flex items-center justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.24em] text-violet-200 font-semibold">
            Results view
          </div>
          <h2 className="mt-1 text-lg font-semibold text-white">
            Analysis output and final reporting
          </h2>
        </div>
        <div className="hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-2 text-xs text-slate-400">
          <LayoutDashboard className="h-3.5 w-3.5 text-violet-300" />
          <span>Structured review panel</span>
        </div>
      </div>

      {content}
      {errorText && (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/8 p-3 flex items-center gap-2 text-xs font-mono text-rose-200 select-text">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorText}</span>
        </div>
      )}
    </section>
  );
}
