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
      <div className="glass-panel rounded-none border border-white/10 p-5 md:p-6 flex flex-col gap-4 min-h-0">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-semibold text-slate-200">Document Workspace</h3>
          </div>
          <span className="text-[10px] bg-teal-500/10 border border-teal-500/20 px-3 py-1 rounded-none text-teal-300 font-bold tracking-wider uppercase">
            Secure Vault
          </span>
        </div>

        <DocumentUploader onDocumentIngested={handleDocumentIngested} />

        <div className="space-y-3">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <span>Active files</span>
            <span>{documentsState.length} loaded</span>
          </div>
          <div className="flex flex-wrap gap-2 rounded-none border border-white/5 bg-white/5 p-2 shadow-inner">
            {documentsState.map((doc) => {
              const isActive = activeDocTab === doc.id;
              return (
                <button
                  key={doc.id}
                  onClick={() => setActiveDocTab(doc.id)}
                  className={`rounded-none px-4 py-1.5 text-xs font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-teal-500/20 text-teal-200 border border-teal-400/40 shadow-[0_0_15px_rgba(20,184,166,0.15)]'
                      : 'text-slate-400 border border-transparent hover:text-slate-200 hover:bg-white/10'
                  }`}
                >
                  {doc.name.slice(0, 20)}
                </button>
              );
            })}
          </div>
        </div>

        {activeDocObj ? (
          <div className="flex flex-col gap-4 min-h-0 mt-2">
            <div className="grid grid-cols-2 gap-3 rounded-none border border-white/10 bg-black/30 p-4 text-sm">
              <div>
                <span className="block text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  Category
                </span>
                <span className="mt-1 block text-slate-200 font-mono text-xs">{activeDocObj.type}</span>
              </div>
              <div>
                <span className="block text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  Source
                </span>
                <span className="mt-1 block text-teal-300 font-mono text-xs">
                  {activeDocObj.metadata?.authorTool || 'Standard portal'}
                </span>
              </div>
            </div>

            <div className="rounded-none border border-white/10 bg-black/30 p-4 min-h-[280px] flex flex-col group">
              <div className="mb-3 flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
                <span>Editable document text</span>
                <span className="text-blue-400">OCR draft</span>
              </div>
              <textarea
                value={activeDocObj.content}
                onChange={(e) => handleDocumentContentChange(activeDocObj.id, e.target.value)}
                className="flex-1 w-full resize-none rounded-none border border-white/5 bg-white/5 p-4 text-xs font-mono leading-relaxed text-slate-300 outline-none transition-all focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/30 group-hover:border-white/10"
                placeholder="Document OCR output text payload..."
              />
            </div>
          </div>
        ) : (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-none border border-dashed border-white/10 bg-black/30 text-center mt-2">
            <FileText className="h-10 w-10 text-slate-600 mb-2" />
            <p className="mt-3 text-sm font-semibold text-slate-300">No documents loaded</p>
            <p className="mt-1 max-w-xs text-xs text-slate-500">
              Upload a file to start building the analysis workspace.
            </p>
          </div>
        )}
      </div>

      <div className="glass-panel rounded-none border border-white/10 p-5 md:p-6 flex flex-col gap-4 min-h-0">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-semibold text-slate-200">Analysis Controls</h2>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-teal-300">
            <span className="h-2 w-2 rounded-none bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
            Ready
          </div>
        </div>

        <div className="space-y-5 text-sm mt-2">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Managed Agent ID</label>
            <input
              type="text"
              value={managedAgentId}
              onChange={(e) => setManagedAgentId(e.target.value)}
              className="w-full rounded-none border border-white/10 bg-white/5 px-4 py-3 text-xs font-mono text-slate-200 outline-none transition focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/30"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Custom Directives</label>
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-teal-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useManagedAgent}
                  onChange={(e) => setUseManagedAgent(e.target.checked)}
                  className="h-3.5 w-3.5 accent-teal-500 rounded bg-white/10 border-white/20"
                />
                Enabled
              </label>
            </div>
            <textarea
              rows={4}
              value={customDirectives}
              onChange={(e) => setCustomDirectives(e.target.value)}
              className="w-full resize-none rounded-none border border-white/10 bg-white/5 px-4 py-3 text-xs font-mono leading-relaxed text-slate-300 outline-none transition focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/30"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Analysis Engine</label>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {engineMode === 'gemini' ? 'Cloud' : 'Local'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setEngineMode('gemini');
                  localStorage.setItem('raven_engine_mode', 'gemini');
                }}
                className={`rounded-none border px-4 py-2 text-xs font-bold transition-all duration-300 ${
                  engineMode === 'gemini'
                    ? 'border-teal-400/30 bg-teal-500/15 text-teal-200 shadow-[0_0_15px_rgba(20,184,166,0.15)]'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10'
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
                className={`rounded-none border px-4 py-2 text-xs font-bold transition-all duration-300 ${
                  engineMode === 'local'
                    ? 'border-blue-400/30 bg-blue-500/15 text-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10'
                }`}
              >
                Local
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-5 mt-auto">
          <button
            onClick={() => {
              setDocumentsState(INITIAL_DEMO_DOCUMENTS);
              setActiveDocTab('doc-itr');
              triggerVerification(INITIAL_DEMO_DOCUMENTS, browserFingerprint?.id);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-none border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10"
          >
            <UploadCloud className="h-4 w-4 text-slate-400" />
            Reset Demo
          </button>
          <button
            onClick={() => {
              setDocumentsState([]);
              setActiveDocTab('');
              setAnalysisResult(null);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-none border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-xs font-bold text-rose-300 transition hover:bg-rose-500/15 hover:border-rose-500/30 hover:shadow-[0_0_15px_rgba(244,63,94,0.15)]"
          >
            <Trash2 className="h-4 w-4" />
            Clear Files
          </button>
        </div>

        <button
          onClick={() => triggerVerification(documentsState, browserFingerprint?.id)}
          disabled={isAnalyzing || documentsState.length === 0}
          className={`mt-2 inline-flex items-center justify-center gap-3 rounded-none px-5 py-3.5 text-sm font-bold tracking-wide transition-all duration-300 ${
            isAnalyzing || documentsState.length === 0
              ? 'cursor-not-allowed border border-white/10 bg-white/5 text-slate-500'
              : 'border border-teal-400/50 bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-[0_0_30px_rgba(20,184,166,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:brightness-110'
          }`}
        >
          <Sparkles className={`h-5 w-5 ${isAnalyzing ? 'animate-spin' : ''}`} />
          {isAnalyzing ? 'Running Intelligence Sweep' : 'Run Analysis'}
        </button>
      </div>
    </section>
  );
}
