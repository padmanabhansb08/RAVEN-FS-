import { Check, Download, Scale } from 'lucide-react';
import { AnalysisResult } from '../../types';

interface ComplianceDirectivesProps {
  readonly analysisResult: AnalysisResult;
}

export function ComplianceDirectives({ analysisResult }: ComplianceDirectivesProps) {
  return (
    <div className="glass-panel rounded-none border border-white/10 p-5 md:p-6 space-y-4 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
      <div className="border-b border-white/10 pb-3 flex justify-between items-center">
        <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-200 flex items-center gap-2">
          <Scale className="w-4 h-4 text-teal-400" />
          Compliance Directives
        </h4>
        <span className="text-[9.5px] font-mono text-slate-500 font-bold leading-none select-none uppercase tracking-wider">
          Export and Copy Actions
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-none border border-white/10 bg-black/40 p-5 space-y-2 shadow-inner transition-colors hover:border-teal-500/20">
          <span className="text-teal-400 block text-[10px] tracking-[0.2em] uppercase font-bold">
            Recommended Action
          </span>
          <p className="text-sm text-slate-200 leading-relaxed font-light">
            {analysisResult.caseFileDetails.enforcementActionRequired ||
              'Review findings with the appropriate operations team.'}
          </p>
        </div>

        <div className="rounded-none border border-white/10 bg-black/40 p-5 space-y-2 shadow-inner transition-colors hover:border-blue-500/20">
          <span className="text-blue-400 block text-[10px] tracking-[0.2em] uppercase font-bold">
            Compliance Note
          </span>
          <p className="text-sm text-slate-300 leading-relaxed font-light">
            {analysisResult.caseFileDetails.ncrbComplianceNote ||
              'No additional compliance note provided.'}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          onClick={() => {
            const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(analysisResult, null, 2))}`;
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute('href', jsonString);
            downloadAnchor.setAttribute('download', 'RAVEN_RelationAudit_Registry.json');
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
          }}
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-full border border-teal-500/30 bg-teal-500/15 px-5 py-3 text-[10.5px] font-bold uppercase tracking-widest text-teal-100 transition-all hover:bg-teal-500/25 hover:shadow-[0_0_15px_rgba(20,184,166,0.3)] hover:scale-[1.02] active:scale-95"
        >
          <Download className="w-4 h-4" />
          Download JSON
        </button>

        <button
          onClick={async () => {
            const reportText = [
              '[RAVEN ANALYSIS REPORT]',
              `Verdict: ${analysisResult.verdict}`,
              `Score: ${analysisResult.score}/100`,
              `Summary: ${analysisResult.summary}`,
              `Compliance: ${analysisResult.caseFileDetails.ncrbComplianceNote || 'N/A'}`,
              `Action: ${analysisResult.caseFileDetails.enforcementActionRequired || 'N/A'}`,
            ].join('\n');

            await navigator.clipboard.writeText(reportText);
          }}
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-full border border-white/10 bg-white/5 px-5 py-3 text-[10.5px] font-bold uppercase tracking-widest text-slate-200 transition-all hover:bg-white/10 hover:border-blue-400/30 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:text-blue-100 hover:scale-[1.02] active:scale-95"
        >
          <Check className="w-4 h-4 text-blue-400" />
          Copy Report
        </button>
      </div>
    </div>
  );
}
