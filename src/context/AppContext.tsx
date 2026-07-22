import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DocumentItem, AnalysisResult, GraphNode } from '../types';
import { INITIAL_DEMO_DOCUMENTS } from '../constants/documents';

interface AppContextType {
  documentsState: DocumentItem[];
  setDocumentsState: React.Dispatch<React.SetStateAction<DocumentItem[]>>;
  activeDocTab: string;
  setActiveDocTab: React.Dispatch<React.SetStateAction<string>>;
  analysisResult: AnalysisResult | null;
  setAnalysisResult: React.Dispatch<React.SetStateAction<AnalysisResult | null>>;
  isAnalyzing: boolean;
  setIsAnalyzing: React.Dispatch<React.SetStateAction<boolean>>;
  errorText: string;
  setErrorText: React.Dispatch<React.SetStateAction<string>>;
  selectedNode: GraphNode | null;
  setSelectedNode: React.Dispatch<React.SetStateAction<GraphNode | null>>;
  activeStageId: number;
  setActiveStageId: React.Dispatch<React.SetStateAction<number>>;
  stageOutputs: { [key: number]: string };
  setStageOutputs: React.Dispatch<React.SetStateAction<{ [key: number]: string }>>;
  useManagedAgent: boolean;
  setUseManagedAgent: React.Dispatch<React.SetStateAction<boolean>>;
  managedAgentId: string;
  setManagedAgentId: React.Dispatch<React.SetStateAction<string>>;
  customDirectives: string;
  setCustomDirectives: React.Dispatch<React.SetStateAction<string>>;
  engineMode: 'gemini' | 'local';
  setEngineMode: React.Dispatch<React.SetStateAction<'gemini' | 'local'>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [documentsState, setDocumentsState] = useState<DocumentItem[]>(INITIAL_DEMO_DOCUMENTS);
  const [activeDocTab, setActiveDocTab] = useState<string>('doc-itr');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  const [activeStageId, setActiveStageId] = useState<number>(0);
  const [stageOutputs, setStageOutputs] = useState<{ [key: number]: string }>({
    1: 'Awaiting workspace signal...',
    2: 'Awaiting workspace signal...',
    3: 'Awaiting workspace signal...',
    4: 'Awaiting workspace signal...',
  });

  const [useManagedAgent, setUseManagedAgent] = useState<boolean>(true);
  const [managedAgentId, setManagedAgentId] = useState<string>('raven-fraud-ring-detector');
  const [customDirectives, setCustomDirectives] = useState<string>(
    'Identify coordinated fraud rings by correlating call records, transaction flows, and device fingerprints across multiple accounts. Detect mule-chain patterns, spoofed-number sequences, and shared-device collisions. Map fraud network topology and generate law-enforcement intelligence packages for NCRB filing.',
  );

  const [engineMode, setEngineMode] = useState<'gemini' | 'local'>(() => {
    return (localStorage.getItem('raven_engine_mode') as 'gemini' | 'local') || 'gemini';
  });

  return (
    <AppContext.Provider
      value={{
        documentsState,
        setDocumentsState,
        activeDocTab,
        setActiveDocTab,
        analysisResult,
        setAnalysisResult,
        isAnalyzing,
        setIsAnalyzing,
        errorText,
        setErrorText,
        selectedNode,
        setSelectedNode,
        activeStageId,
        setActiveStageId,
        stageOutputs,
        setStageOutputs,
        useManagedAgent,
        setUseManagedAgent,
        managedAgentId,
        setManagedAgentId,
        customDirectives,
        setCustomDirectives,
        engineMode,
        setEngineMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
