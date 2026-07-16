import { Dispatch, SetStateAction } from 'react';
import { Database, FileText, Briefcase, Sparkles, UploadCloud, Trash2 } from 'lucide-react';
import { DocumentItem, AnalysisResult } from '../types';
import { DocumentUploader } from './DocumentUploader';
import { WebFingerprint } from '../utils/fingerprint';
import { INITIAL_DEMO_DOCUMENTS } from '../constants/documents';

interface SidebarProps {
  readonly documentsState: DocumentItem[];
  readonly setDocumentsState: Dispatch<SetStateAction<DocumentItem[]>>;
  readonly activeDocTab: string;
  readonly setActiveDocTab: Dispatch<SetStateAction<string>>;
  readonly handleDocumentContentChange: (docId: string, newContent: string) => void;
  readonly handleDocumentIngested: (newDoc: DocumentItem) => void;
  readonly managedAgentId: string;
  readonly setManagedAgentId: Dispatch<SetStateAction<string>>;
  readonly useManagedAgent: boolean;
  readonly setUseManagedAgent: Dispatch<SetStateAction<boolean>>;
  readonly customDirectives: string;
  readonly setCustomDirectives: Dispatch<SetStateAction<string>>;
  readonly engineMode: 'gemini' | 'local';
  readonly setEngineMode: Dispatch<SetStateAction<'gemini' | 'local'>>;
  readonly isAnalyzing: boolean;
  readonly triggerVerification: (currentDocs: DocumentItem[], customFpId?: string) => void;
  readonly browserFingerprint: WebFingerprint | null;
  readonly setAnalysisResult: Dispatch<SetStateAction<AnalysisResult | null>>;
}

export function Sidebar({
  documentsState,
  setDocumentsState,
  activeDocTab,
  setActiveDocTab,
  handleDocumentContentChange,
  handleDocumentIngested,
  managedAgentId,
  setManagedAgentId,
  useManagedAgent,
  setUseManagedAgent,
  customDirectives,
  setCustomDirectives,
  engineMode,
  setEngineMode,
  isAnalyzing,
  triggerVerification,
  browserFingerprint,
  setAnalysisResult,
}: SidebarProps) {
  const activeDocObj = documentsState.find((d) => d.id === activeDocTab);

  return (
    <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr] min-h-0">
      <div className="glass-panel rounded-3xl border border-white/10 p-5 md:p-6 flex flex-col gap-4 min-h-0">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-violet-300" />
            <h3 className="text-xs font-semibold tracking-[0.24em] text-slate-300 uppercase">
              Document workspace
            </h3>
          </div>
          <span className="text-[10px] font-mono bg-violet-500/10 border border-violet-500/20 px-2 py-1 rounded-full text-violet-200 uppercase font-semibold">
            Secure vault
          </span>
        </div>

        <DocumentUploader onDocumentIngested={handleDocumentIngested} />

        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-slate-500 font-semibold">
            <span>Active files</span>
            <span>{documentsState.length} loaded</span>
          </div>
          <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-black/30 p-2">
            {documentsState.map((doc) => {
              const isActive = activeDocTab === doc.id;
              return (
                <button
                  key={doc.id}
                  onClick={() => setActiveDocTab(doc.id)}
                  className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition ${
                    isActive
                      ? 'bg-violet-500/20 text-violet-100 border border-violet-400/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {doc.name.slice(0, 20)}
                </button>
              );
            })}
          </div>
        </div>

        {activeDocObj ? (
          <div className="flex flex-col gap-3 min-h-0">
            <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-black/30 p-3 text-sm">
              <div>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  Category
                </span>
                <span className="mt-1 block text-slate-200">{activeDocObj.type}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  Source
                </span>
                <span className="mt-1 block text-violet-200">
                  {activeDocObj.metadata?.authorTool || 'Standard portal'}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-3 min-h-[280px] flex flex-col">
              <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-slate-500">
                <span>Editable document text</span>
                <span>OCR draft</span>
              </div>
              <textarea
                value={activeDocObj.content}
                onChange={(e) => handleDocumentContentChange(activeDocObj.id, e.target.value)}
                className="flex-1 w-full resize-none rounded-xl border border-white/10 bg-black/50 p-3 text-sm leading-6 text-slate-200 outline-none focus:border-violet-400/50 focus:ring-1 focus:ring-violet-400/30"
                placeholder="Document OCR output text payload..."
              />
            </div>
          </div>
        ) : (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/20 text-center">
            <FileText className="h-10 w-10 text-slate-600" />
            <p className="mt-3 text-sm font-medium text-slate-300">No documents loaded</p>
            <p className="mt-1 max-w-xs text-sm text-slate-500">
              Upload a file to start building the analysis workspace.
            </p>
          </div>
        )}
      </div>

      <div className="glass-panel rounded-3xl border border-white/10 p-5 md:p-6 flex flex-col gap-4 min-h-0">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-violet-300" />
            <h2 className="text-xs font-semibold tracking-[0.24em] text-slate-300 uppercase">
              Analysis controls
            </h2>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Ready
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
              Managed agent id
            </label>
            <input
              type="text"
              value={managedAgentId}
              onChange={(e) => setManagedAgentId(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-slate-100 outline-none focus:border-violet-400/50 focus:ring-1 focus:ring-violet-400/30"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                Custom directives
              </label>
              <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-violet-200">
                <input
                  type="checkbox"
                  checked={useManagedAgent}
                  onChange={(e) => setUseManagedAgent(e.target.checked)}
                  className="h-4 w-4 accent-violet-500"
                />
                Enabled
              </label>
            </div>
            <textarea
              rows={4}
              value={customDirectives}
              onChange={(e) => setCustomDirectives(e.target.value)}
              className="w-full resize-none rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-slate-100 outline-none focus:border-violet-400/50 focus:ring-1 focus:ring-violet-400/30"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                Analysis engine
              </label>
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                {engineMode === 'gemini' ? 'Cloud' : 'Local'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setEngineMode('gemini');
                  localStorage.setItem('raven_engine_mode', 'gemini');
                }}
                className={`rounded-xl border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
                  engineMode === 'gemini'
                    ? 'border-violet-400/30 bg-violet-500/15 text-violet-100'
                    : 'border-white/10 bg-black/30 text-slate-400 hover:text-slate-200'
                }`}
              >
                Gemini
              </button>
              <button
                type="button"
                onClick={() => {
                  setEngineMode('local');
                  localStorage.setItem('raven_engine_mode', 'local');
                }}
                className={`rounded-xl border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
                  engineMode === 'local'
                    ? 'border-violet-400/30 bg-violet-500/15 text-violet-100'
                    : 'border-white/10 bg-black/30 text-slate-400 hover:text-slate-200'
                }`}
              >
                Local
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
          <button
            onClick={() => {
              setDocumentsState(INITIAL_DEMO_DOCUMENTS);
              setActiveDocTab('doc-itr');
              triggerVerification(INITIAL_DEMO_DOCUMENTS, browserFingerprint?.id);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300 transition hover:bg-white/5"
          >
            <UploadCloud className="h-3.5 w-3.5" />
            Reset demo
          </button>
          <button
            onClick={() => {
              setDocumentsState([]);
              setActiveDocTab('');
              setAnalysisResult(null);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-200 transition hover:bg-rose-500/15"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear files
          </button>
        </div>

        <button
          onClick={() => triggerVerification(documentsState, browserFingerprint?.id)}
          disabled={isAnalyzing || documentsState.length === 0}
          className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition ${
            isAnalyzing || documentsState.length === 0
              ? 'cursor-not-allowed border border-white/10 bg-white/5 text-slate-500'
              : 'border border-violet-400/30 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-[0_0_28px_rgba(168,85,247,0.25)] hover:brightness-110'
          }`}
        >
          <Sparkles className={`h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          {isAnalyzing ? 'Running analysis' : 'Run analysis'}
        </button>
      </div>
    </section>
  );
}
