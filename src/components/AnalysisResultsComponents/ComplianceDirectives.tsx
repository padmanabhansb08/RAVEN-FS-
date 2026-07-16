import { Check, Download, Scale } from 'lucide-react';
import { AnalysisResult } from '../../types';

interface ComplianceDirectivesProps {
  readonly analysisResult: AnalysisResult;
}

export function ComplianceDirectives({ analysisResult }: ComplianceDirectivesProps) {
  return (
    <div className="glass-panel rounded-3xl border border-white/10 p-5 md:p-6 space-y-4">
      <div className="border-b border-white/10 pb-3 flex justify-between items-center">
        <h4 className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-200 flex items-center gap-1.5">
          <Scale className="w-4 h-4 text-violet-300" />
          Compliance directives
        </h4>
        <span className="text-[9.5px] font-mono text-slate-500 font-bold leading-none select-none">
          Export and copy actions
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4 space-y-1">
          <span className="text-slate-500 block text-[10px] tracking-[0.2em] uppercase font-bold">
            Recommended action
          </span>
          <p className="text-sm text-slate-200 leading-6">
            {analysisResult.caseFileDetails.enforcementActionRequired ||
              'Review findings with the appropriate operations team.'}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/30 p-4 space-y-1">
          <span className="text-slate-500 block text-[10px] tracking-[0.2em] uppercase font-bold">
            Compliance note
          </span>
          <p className="text-sm text-slate-300 leading-6">
            {analysisResult.caseFileDetails.ncrbComplianceNote ||
              'No additional compliance note provided.'}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
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
          className="inline-flex items-center justify-center gap-1.5 w-full sm:w-auto rounded-2xl border border-violet-400/30 bg-violet-500/15 px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-widest text-violet-100 transition hover:bg-violet-500/20"
        >
          <Download className="w-3.5 h-3.5" />
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
          className="inline-flex items-center justify-center gap-1.5 w-full sm:w-auto rounded-2xl border border-white/10 bg-black/30 px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-200 transition hover:bg-white/5"
        >
          <Check className="w-4 h-4 text-emerald-300" />
          Copy report
        </button>
      </div>
    </div>
  );
}
