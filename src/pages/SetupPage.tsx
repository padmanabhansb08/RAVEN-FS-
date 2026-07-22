import { LayoutGrid, ArrowRight } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ProductBlueprint } from '../components/ProductBlueprint';
import { Sidebar } from '../components/Sidebar';
import { useAppContext } from '../context/AppContext';
import { WebFingerprint } from '../utils/fingerprint';
import { AnalysisResult, DocumentItem } from '../types';

export default function SetupPage() {
  const { browserFingerprint } = useOutletContext<{ browserFingerprint: WebFingerprint | null }>();
  const navigate = useNavigate();
  
  const {
    documentsState,
    setDocumentsState,
    activeDocTab,
    setActiveDocTab,
    isAnalyzing,
    setIsAnalyzing,
    setAnalysisResult,
    setErrorText,
    setSelectedNode,
    setActiveStageId,
    setStageOutputs,
    managedAgentId,
    setManagedAgentId,
    useManagedAgent,
    setUseManagedAgent,
    customDirectives,
    setCustomDirectives,
    engineMode,
    setEngineMode,
  } = useAppContext();

  const handleDocumentContentChange = (docId: string, newContent: string) => {
    const updated = documentsState.map((d) => {
      if (d.id === docId) {
        return { ...d, content: newContent };
      }
      return d;
    });
    setDocumentsState(updated);
  };

  const handleDocumentIngested = (newDoc: DocumentItem) => {
    const updatedDocs = [...documentsState, newDoc];
    setDocumentsState(updatedDocs);
    setActiveDocTab(newDoc.id);
    triggerVerification(updatedDocs, browserFingerprint?.id);
  };

  const triggerVerification = async (currentDocs: DocumentItem[], customFpId?: string) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setErrorText('');
    setSelectedNode(null);
    setActiveStageId(1);
    setStageOutputs({
      1: 'Synthesizing raw dossiers and optical alignment tags...',
      2: 'Waiting for Ingestion layer authorization...',
      3: 'Waiting for Coherence index calculation...',
      4: 'Waiting for Executive compliance compilation...',
    });

    const deviceFingerprintId = customFpId || browserFingerprint?.id || 'fp-tester';
    const activeEngine = localStorage.getItem('raven_engine_mode') || engineMode || 'gemini';

    try {
      const formData = new FormData();
      currentDocs.forEach((doc) => {
        if (doc.file) {
          formData.append('files', doc.file, doc.name);
        } else {
          const blob = new Blob([doc.content], { type: 'text/plain' });
          formData.append('files', blob, doc.name);
        }
      });

      formData.append('useManagedAgent', String(useManagedAgent));
      formData.append('managedAgentId', managedAgentId);
      formData.append('engineMode', activeEngine);
      formData.append('clientFingerprintId', deviceFingerprintId);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data: AnalysisResult = await response.json();

      if (data.aiStatus && !data.aiStatus.success && data.aiStatus.isQuotaExceeded) {
        setEngineMode('local');
        localStorage.setItem('raven_engine_mode', 'local');
      }

      if (data.graphNodes) {
        data.graphNodes = data.graphNodes.map((node) => {
          if (
            node.type === 'device' &&
            (node.label.includes(deviceFingerprintId) || node.label.includes('Fingerprint'))
          ) {
            return {
              ...node,
              label: `Your Device: ${deviceFingerprintId}`,
              details: `FINGERPRINT MATCHED. Browser fingerprint active on multi-document entries.`,
            };
          }
          return node;
        });
      }

      const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

      // --- LAYER 1 STREAMING TRANSITION ---
      setStageOutputs((prev) => ({
        ...prev,
        1: `Scanning ${currentDocs.length} custom user documents... Parsing EXIF metadata and OCR layers...`,
      }));
      await delay(1200);

      const mainApplicant =
        data.extractedEntities?.find(
          (e) =>
            e.value.includes('Signee') ||
            e.value.includes('Applicant') ||
            e.value.includes('Owner'),
        )?.entity || 'Applicant';
      const layer1Success = `Ingested: Extracted user trace signature of candidate [${mainApplicant}] successfully.`;

      setStageOutputs((prev) => ({
        ...prev,
        1: layer1Success,
        2: 'Running multi-document comparative matrices. Analyzing monthly income & employer clashing structures...',
      }));
      setActiveStageId(2);
      await delay(1400);

      // --- LAYER 2 STREAMING TRANSITION ---
      const contradictionsCount = data.contradictions?.length || 0;
      const layer2Success =
        contradictionsCount > 0
          ? `Coherence Alert: Highlighted ${contradictionsCount} active clashing claims. Detected '${data.contradictions[0].title}' discrepancies.`
          : 'Coherence Balanced: Verified clean income, date registers and address statements without conflicts.';

      setStageOutputs((prev) => ({
        ...prev,
        2: layer2Success,
        3: 'Simulating entity mapping. Translating structural nodes into network vertices...',
      }));
      setActiveStageId(3);
      await delay(1200);

      // --- LAYER 3 STREAMING TRANSITION ---
      const nodeCount = data.graphNodes?.length || 0;
      const edgeCount = data.graphEdges?.length || 0;
      const layer3Success = `Graph Complete: Mapped ${nodeCount} transaction vertices and established ${edgeCount} relationship edges.`;

      setStageOutputs((prev) => ({
        ...prev,
        3: layer3Success,
        4: 'Compiling risk score algorithms, writing legal audit records under RBI regulations...',
      }));
      setActiveStageId(4);
      await delay(1100);

      // --- LAYER 4 STREAMING TRANSITION ---
      const layer4Success = `Enforcement Executed: Final threat weight rating compiled at ${data.score}/100. Intelligence package ready.`;
      setStageOutputs((prev) => ({
        ...prev,
        4: layer4Success,
      }));
      await delay(600);

      setAnalysisResult(data);
      
      // Navigate to results page automatically when done!
      navigate('/results');
      
    } catch (err: unknown) {
      console.error('Analysis API execution failure:', err);
      setErrorText(
        'Relational sweep execution failed connecting online tools. Please check connection.',
      );
    } finally {
      setIsAnalyzing(false);
      setActiveStageId(0);
    }
  };

  return (
    <>
      <ProductBlueprint />
      <section id="execution-workspace" className="min-h-[80vh] flex flex-col justify-center border-t border-white/5 pt-24 pb-16 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-teal-500/20 to-transparent" />
        
        <div className="max-w-6xl mx-auto w-full flex flex-col gap-8 relative z-10">
          <div className="mb-8 border-b border-slate-800 pb-6">
            <h2 className="text-2xl font-medium text-white tracking-tight">
              Document Control Center
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Upload documents and configure your analysis parameters.
            </p>
          </div>

          <div className="mt-4">
            <Sidebar
              documentsState={documentsState}
              setDocumentsState={setDocumentsState}
              activeDocTab={activeDocTab}
              setActiveDocTab={setActiveDocTab}
              handleDocumentContentChange={handleDocumentContentChange}
              handleDocumentIngested={handleDocumentIngested}
              managedAgentId={managedAgentId}
              setManagedAgentId={setManagedAgentId}
              useManagedAgent={useManagedAgent}
              setUseManagedAgent={setUseManagedAgent}
              customDirectives={customDirectives}
              setCustomDirectives={setCustomDirectives}
              engineMode={engineMode}
              setEngineMode={setEngineMode}
              isAnalyzing={isAnalyzing}
              triggerVerification={() => triggerVerification(documentsState, browserFingerprint?.id)}
              browserFingerprint={browserFingerprint}
              setAnalysisResult={setAnalysisResult}
            />
          </div>
        </div>
      </section>
    </>
  );
}
