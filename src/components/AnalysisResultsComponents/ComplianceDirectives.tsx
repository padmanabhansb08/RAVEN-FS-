import { Scale, Download, Check } from 'lucide-react';
import { AnalysisResult } from '../../types';

interface ComplianceDirectivesProps {
  readonly analysisResult: AnalysisResult;
}

export function ComplianceDirectives({ analysisResult }: ComplianceDirectivesProps) {
  return (
    <div className="glass-panel border border-white/5 p-5 rounded-xl space-y-4 shadow-lg">
      <div className="border-b border-white/5 pb-2 flex justify-between items-center">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Scale className="w-4 h-4 text-indigo-400" />
          Section 4: Executive Compliance Directives & Action logs
        </h4>
        <span className="text-[9.5px] font-mono text-slate-500 font-bold leading-none select-none">
          Cybercrime Compliance Check
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-panel border border-white/5 rounded-lg p-3.5 space-y-1 select-all shadow-inner relative z-10">
          <span className="text-slate-500 block text-[8px] tracking-wider uppercase font-bold font-mono">
            Recommended Compliance Action
          </span>
          <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium">
            {analysisResult.caseFileDetails.enforcementActionRequired}
          </p>
        </div>

        <div className="glass-panel border border-white/5 rounded-lg p-3.5 space-y-1 select-all shadow-inner relative z-10">
          <span className="text-slate-500 block text-[8px] tracking-wider uppercase font-bold font-mono">
            Applicable Enforcement Guideline
          </span>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {analysisResult.caseFileDetails.ncrbComplianceNote}
          </p>
        </div>
      </div>

      {/* Operation Actions row buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={() => {
            const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
              JSON.stringify(analysisResult, null, 2),
            )}`;
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute('href', jsonString);
            downloadAnchor.setAttribute('download', `RAVEN_RelationAudit_Registry.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
          }}
          className="inline-flex items-center justify-center gap-1.5 w-full sm:w-auto bg-indigo-650 hover:bg-indigo-755 cursor-pointer text-white text-[10.5px] font-mono tracking-widest uppercase font-bold px-4 py-2.5 rounded transition shadow shadow-indigo-950/20"
        >
          <Download className="w-3.5 h-3.5 text-indigo-200" />
          Download Intelligence Package (JSON)
        </button>

        <button
          onClick={() => {
            const reportText = `[RAVEN FRAUD RING INTELLIGENCE REPORT]\nVerdict: ${analysisResult.verdict}\nDeficit risk rating: ${analysisResult.score}/100\nCore Summary: ${analysisResult.summary}\nNCRB Filing Suggested: ${analysisResult.caseFileDetails.ncrbComplianceNote}\nEnforcement Recommendation: ${analysisResult.caseFileDetails.enforcementActionRequired}`;
            navigator.clipboard.writeText(reportText);
            alert('Official Case File data copied successfully to clipboard!');
          }}
          className="inline-flex items-center justify-center gap-1.5 w-full sm:w-auto bg-black/40 border border-white/5 hover:bg-black/60 hover:border-white/10 cursor-pointer text-slate-300 text-[10.5px] font-mono tracking-widest uppercase font-bold px-4 py-2.5 rounded transition shadow-inner"
        >
          <Check className="w-4 h-4 text-emerald-400 animate-[pulse_1.5s_infinite]" />
          Copy Enforcement Report
        </button>
      </div>
    </div>
  );
}
