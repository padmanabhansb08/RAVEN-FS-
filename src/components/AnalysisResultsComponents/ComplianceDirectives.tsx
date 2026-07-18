import { Check, Download, Scale } from 'lucide-react';
import { AnalysisResult } from '../../types';
import { isFraudNetworkAnalysis } from '../../domain/evidencePackage';

interface ComplianceDirectivesProps {
  readonly analysisResult: AnalysisResult;
}

const getActionText = (analysisResult: AnalysisResult, isFraudNetwork: boolean): string => {
  if (isFraudNetwork) {
    return (
      analysisResult.caseFileDetails.lawEnforcementAction ||
      analysisResult.caseFileDetails.enforcementActionRequired ||
      analysisResult.caseFileDetails.bankActionRequired ||
      'Review findings with the appropriate operations team.'
    );
  }
  return (
    analysisResult.caseFileDetails.enforcementActionRequired ||
    analysisResult.caseFileDetails.bankActionRequired ||
    'Review findings with the appropriate operations team.'
  );
};

const getComplianceNote = (analysisResult: AnalysisResult, isFraudNetwork: boolean): string => {
  if (isFraudNetwork) {
    return (
      analysisResult.caseFileDetails.ncrbComplianceNote ||
      analysisResult.caseFileDetails.rbiComplianceWarning ||
      'No additional compliance note provided.'
    );
  }
  return (
    analysisResult.caseFileDetails.ncrbComplianceNote ||
    analysisResult.caseFileDetails.rbiComplianceWarning ||
    'No additional compliance note provided.'
  );
};

const getReportText = (analysisResult: AnalysisResult, isFraudNetwork: boolean): string => {
  const action = getActionText(analysisResult, isFraudNetwork);
  const note = getComplianceNote(analysisResult, isFraudNetwork);

  if (isFraudNetwork) {
    return `[RAVEN LAW ENFORCEMENT INTELLIGENCE BRIEF]\nVerdict: ${analysisResult.verdict}\nNetwork risk rating: ${analysisResult.score}/100\nCore Summary: ${analysisResult.summary}\nLegal notice: ${note}\nRecommended LE action: ${action}`;
  }

  return `[RAVEN RELATIONAL AUDIT REPORT]\nVerdict: ${analysisResult.verdict}\nDeficit risk rating: ${analysisResult.score}/100\nCore Summary: ${analysisResult.summary}\nCompliance: ${note}\nAction: ${action}`;
};

export function ComplianceDirectives({ analysisResult }: ComplianceDirectivesProps) {
  const isFraudNetwork = isFraudNetworkAnalysis(analysisResult);

  return (
    <div className="glass-panel rounded-3xl border border-white/10 p-5 md:p-6 space-y-4">
      <div className="border-b border-white/10 pb-3 flex justify-between items-center">
        <h4 className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-200 flex items-center gap-1.5">
          <Scale className="w-4 h-4 text-violet-300" />
          {isFraudNetwork
            ? 'Law Enforcement Directives & Audit Logs'
            : 'Compliance directives'}
        </h4>
        <span className="text-[9.5px] font-mono text-slate-500 font-bold leading-none select-none">
          {isFraudNetwork ? 'Human-in-loop evidence review' : 'Export and copy actions'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4 space-y-1">
          <span className="text-slate-500 block text-[10px] tracking-[0.2em] uppercase font-bold">
            {isFraudNetwork ? 'Recommended Investigative Action' : 'Recommended action'}
          </span>
          <p className="text-sm text-slate-200 leading-6">
            {getActionText(analysisResult, isFraudNetwork)}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/30 p-4 space-y-1">
          <span className="text-slate-500 block text-[10px] tracking-[0.2em] uppercase font-bold">
            {isFraudNetwork ? 'Legal & Admissibility Notice' : 'Compliance note'}
          </span>
          <p className="text-sm text-slate-300 leading-6">
            {getComplianceNote(analysisResult, isFraudNetwork)}
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
            const reportText = getReportText(analysisResult, isFraudNetwork);
            await navigator.clipboard.writeText(reportText);
          }}
          className="inline-flex items-center justify-center gap-1.5 w-full sm:w-auto rounded-2xl border border-white/10 bg-black/30 px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-200 transition hover:bg-white/5"
        >
          <Check className="w-4 h-4 text-emerald-300" />
          {isFraudNetwork ? 'Copy Intelligence Brief' : 'Copy report'}
        </button>
      </div>
    </div>
  );
}
