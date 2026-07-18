import { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  Clock3,
  Download,
  FileCheck2,
  Fingerprint,
  Gauge,
  GitBranch,
  Scale,
  ShieldCheck,
} from 'lucide-react';
import { AnalysisResult } from '../../types';
import {
  buildEvidencePackage,
  LawEnforcementEvidencePackage,
} from '../../domain/evidencePackage';

interface LawEnforcementIntelligenceProps {
  readonly analysisResult: AnalysisResult;
}

interface PackageSectionProps {
  readonly evidencePackage: LawEnforcementEvidencePackage;
}

const downloadEvidencePackage = (evidencePackage: LawEnforcementEvidencePackage): void => {
  const blob = new Blob([JSON.stringify(evidencePackage, null, 2)], {
    type: 'application/json;charset=utf-8',
  });
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  anchor.download = `${evidencePackage.caseId}_Court_Review_Evidence.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(downloadUrl);
};

const EvidenceTimeline = ({ evidencePackage }: PackageSectionProps) => (
  <section className="space-y-3">
    <div className="flex items-center gap-2">
      <Clock3 className="w-4 h-4 text-indigo-400" />
      <h5 className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-300">
        Evidence Timeline
      </h5>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
      {evidencePackage.timeline.map((event) => (
        <div
          key={event.stage}
          className="bg-black/30 border border-white/5 rounded-lg p-3 flex gap-3"
        >
          <span className="w-6 h-6 rounded-full bg-indigo-500/15 text-indigo-300 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
            {event.sequence}
          </span>
          <div>
            <span className="text-[8px] font-mono text-indigo-400 tracking-wider">
              {event.stage}
            </span>
            <p className="text-[11px] text-slate-200 font-medium mt-0.5">{event.label}</p>
            <p className="text-[10px] text-slate-500 leading-relaxed mt-1">
              {event.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const GraphExplanationPanel = ({ evidencePackage }: PackageSectionProps) => (
  <section className="space-y-3">
    <div className="flex items-center gap-2">
      <GitBranch className="w-4 h-4 text-indigo-400" />
      <h5 className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-300">
        Why The Graph Is Linked
      </h5>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
      {evidencePackage.graphExplanations.map((item, index) => (
        <div
          key={`${item.source}-${item.target}-${item.relationship}-${index}`}
          className="bg-black/30 border border-white/5 rounded-lg p-3"
        >
          <span className="text-[8px] font-mono uppercase tracking-wider text-rose-400">
            {item.relationship}
          </span>
          <p className="text-[10.5px] text-slate-300 leading-relaxed mt-1">
            {item.explanation}
          </p>
        </div>
      ))}
    </div>
  </section>
);

const ConfidenceBreakdownPanel = ({ evidencePackage }: PackageSectionProps) => (
  <section className="space-y-3">
    <div className="flex items-center gap-2">
      <Gauge className="w-4 h-4 text-indigo-400" />
      <h5 className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-300">
        Confidence & Score Contributions
      </h5>
    </div>
    <div className="space-y-2">
      {evidencePackage.confidenceBreakdown.map((item) => (
        <div key={`${item.source}-${item.label}`} className="bg-black/30 rounded-lg p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-[8px] font-mono text-indigo-400">{item.source}</span>
              <p className="text-[11px] text-slate-200 font-medium">{item.label}</p>
            </div>
            <span className="text-[10px] font-mono text-slate-300 shrink-0">
              +{item.contribution} · {item.confidence}%
            </span>
          </div>
          <div className="h-1 bg-white/5 rounded mt-2 overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded"
              style={{ width: `${Math.min(item.confidence, 100)}%` }}
            />
          </div>
          <p className="text-[9.5px] text-slate-500 mt-1.5 leading-relaxed">{item.rationale}</p>
        </div>
      ))}
    </div>
  </section>
);

const AuditTrail = ({
  evidencePackage,
  hasExported,
}: PackageSectionProps & { readonly hasExported: boolean }) => (
  <section className="space-y-3">
    <div className="flex items-center gap-2">
      <FileCheck2 className="w-4 h-4 text-indigo-400" />
      <h5 className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-300">
        Session Audit Trail
      </h5>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[9.5px]">
      <div className="bg-black/30 rounded p-2.5">
        <span className="text-slate-500 block">INGESTION TIME</span>
        <span className="text-slate-300">{evidencePackage.auditMetadata.ingestedAt}</span>
      </div>
      <div className="bg-black/30 rounded p-2.5">
        <span className="text-slate-500 block">ENGINE / FALLBACK</span>
        <span className="text-slate-300">
          {evidencePackage.auditMetadata.engine} /{' '}
          {evidencePackage.auditMetadata.fallbackUsed ? 'YES' : 'NO'}
        </span>
      </div>
      <div className="bg-black/30 rounded p-2.5">
        <span className="text-slate-500 block">LAST EXPORT</span>
        <span className="text-slate-300">
          {hasExported ? evidencePackage.auditMetadata.exportedAt : 'Not exported this session'}
        </span>
      </div>
      <div className="bg-black/30 rounded p-2.5 min-w-0">
        <span className="text-slate-500 block">SHA-256 INTEGRITY</span>
        <span className="text-emerald-400 break-all">{evidencePackage.evidenceHash}</span>
      </div>
    </div>
  </section>
);

export function LawEnforcementIntelligence({
  analysisResult,
}: LawEnforcementIntelligenceProps) {
  const ingestedAt = useRef(new Date().toISOString()).current;
  const [analystNotes, setAnalystNotes] = useState('');
  const [evidencePackage, setEvidencePackage] =
    useState<LawEnforcementEvidencePackage | null>(null);
  const [packageError, setPackageError] = useState('');
  const [hasExported, setHasExported] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    let active = true;
    setPackageError('');

    buildEvidencePackage(analysisResult, { ingestedAt, analystNotes })
      .then((nextPackage) => {
        if (active) setEvidencePackage(nextPackage);
      })
      .catch((error: unknown) => {
        if (active) {
          setPackageError(error instanceof Error ? error.message : 'Evidence package failed.');
        }
      });

    return () => {
      active = false;
    };
  }, [analysisResult, analystNotes, ingestedAt]);

  const handleEvidenceExport = async () => {
    setIsExporting(true);
    setPackageError('');
    try {
      const exportedPackage = await buildEvidencePackage(analysisResult, {
        ingestedAt,
        analystNotes,
        exportedAt: new Date().toISOString(),
      });
      setEvidencePackage(exportedPackage);
      setHasExported(true);
      downloadEvidencePackage(exportedPackage);
    } catch (error: unknown) {
      setPackageError(error instanceof Error ? error.message : 'Evidence export failed.');
    } finally {
      setIsExporting(false);
    }
  };

  if (!evidencePackage) {
    return (
      <div className="bg-[#161618] border border-white/5 rounded-xl p-5 text-xs text-slate-400">
        Preparing SHA-256 evidence package…
      </div>
    );
  }

  return (
    <div className="bg-[#161618] border border-indigo-500/15 rounded-xl p-5 space-y-6">
      <header className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-200">
              Law Enforcement Intelligence Package
            </h4>
          </div>
          <p className="text-[10px] text-slate-500 mt-1.5 max-w-2xl">
            Court-oriented, hash-verified investigative package. Legal admissibility requires source
            authentication and competent authority review.
          </p>
        </div>
        <div className="font-mono text-[9px] lg:text-right">
          <span className="block text-indigo-300 font-bold">{evidencePackage.caseId}</span>
          <span className="block text-slate-500 mt-1">
            ENGINE: {evidencePackage.auditMetadata.engine}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-indigo-950/15 border border-indigo-500/15 rounded-lg p-3.5">
          <span className="text-[8px] font-mono uppercase tracking-wider text-indigo-400">
            Recommended LE Action
          </span>
          <p className="text-xs text-slate-200 mt-1 leading-relaxed">
            {analysisResult.caseFileDetails.lawEnforcementAction ??
              analysisResult.caseFileDetails.bankActionRequired}
          </p>
        </div>
        <div className="bg-black/30 border border-white/5 rounded-lg p-3.5">
          <span className="text-[8px] font-mono uppercase tracking-wider text-indigo-400">
            Cross-Jurisdiction Linkage
          </span>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {evidencePackage.crossJurisdictionNotes}
          </p>
        </div>
      </div>

      <EvidenceTimeline evidencePackage={evidencePackage} />
      <GraphExplanationPanel evidencePackage={evidencePackage} />
      <ConfidenceBreakdownPanel evidencePackage={evidencePackage} />

      <section className="space-y-2">
        <label
          htmlFor="human-analyst-notes"
          className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-300"
        >
          Human Analyst Notes
        </label>
        <textarea
          id="human-analyst-notes"
          value={analystNotes}
          onChange={(event) => setAnalystNotes(event.target.value)}
          placeholder="Record verification observations, source checks, and escalation rationale…"
          className="w-full min-h-24 resize-y bg-black/35 border border-white/10 rounded-lg p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/40"
        />
        <p className="text-[9.5px] text-slate-500">
          Notes are session-only and become part of the hashed export. No data is persisted.
        </p>
      </section>

      <AuditTrail evidencePackage={evidencePackage} hasExported={hasExported} />

      <div className="border-t border-white/5 pt-4 space-y-3">
        <div className="flex items-start gap-2 text-[9.5px] text-amber-300/80 leading-relaxed">
          <Scale className="w-4 h-4 shrink-0" />
          <p>{evidencePackage.humanAnalystDisclaimer}</p>
        </div>
        {packageError && (
          <div className="flex items-center gap-2 text-[10px] text-red-400">
            <AlertTriangle className="w-4 h-4" />
            {packageError}
          </div>
        )}
        <button
          type="button"
          onClick={handleEvidenceExport}
          disabled={isExporting}
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-[10px] font-mono tracking-widest uppercase font-bold px-4 py-2.5 rounded transition cursor-pointer"
        >
          <Download className="w-4 h-4" />
          {isExporting ? 'Hashing Package…' : 'Download Court-Review Evidence JSON'}
        </button>
        <div className="inline-flex items-center gap-1.5 ml-3 text-[9px] font-mono text-emerald-400">
          <Fingerprint className="w-3.5 h-3.5" />
          SHA-256 VERIFIED
        </div>
      </div>
    </div>
  );
}
