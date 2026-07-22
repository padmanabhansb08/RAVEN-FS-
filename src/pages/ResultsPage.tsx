import { AnalysisResults } from '../components/AnalysisResults';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ResultsPage() {
  const navigate = useNavigate();
  const {
    isAnalyzing,
    activeStageId,
    stageOutputs,
    analysisResult,
    selectedNode,
    setSelectedNode,
    useManagedAgent,
    managedAgentId,
    errorText,
  } = useAppContext();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors bg-teal-500/10 px-4 py-2 border border-teal-500/20 rounded-none uppercase text-xs font-bold tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Workspace
        </button>
        <h1 className="text-2xl font-bold text-white tracking-tight">Analysis Results</h1>
      </div>
      
      <div className="min-h-[70vh]">
        <AnalysisResults
          isAnalyzing={isAnalyzing}
          activeStageId={activeStageId}
          stageOutputs={stageOutputs}
          analysisResult={analysisResult}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
          useManagedAgent={useManagedAgent}
          managedAgentId={managedAgentId}
          errorText={errorText}
        />
      </div>
    </div>
  );
}
