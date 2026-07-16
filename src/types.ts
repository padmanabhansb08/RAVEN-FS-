export interface Contradiction {
  title: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  crossDocSource: string; // e.g. "ITR vs Salary Slip"
}

export interface ExtractedEntity {
  entity: string;
  value: string;
  docType: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'person' | 'property' | 'address' | 'device' | 'employer' | 'phone' | 'account' | 'transaction';
  status: 'flagged' | 'neutral' | 'verified';
  details?: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  relationship: string;
  status: 'flagged' | 'neutral' | 'verified';
}

export type DocumentType =
  | 'CALL_RECORD'
  | 'TRANSACTION_LOG'
  | 'ACCOUNT_LINKAGE'
  | 'DEVICE_LOG'
  | 'VICTIM_REPORT'
  | 'ITR'
  | 'SALARY_SLIP'
  | 'PROPERTY_VALUATION'
  | 'ID_PROOF'
  | 'OTHER';

export interface TamperedSignature {
  signature: string;
  confidence: number; // 0 to 100
  explanation: string;
}

export interface AnalysisResult {
  score: number; // 0 to 100
  verdict: 'HIGH RISK' | 'MEDIUM RISK' | 'LOW RISK';
  summary: string;
  contradictions: Contradiction[];
  extractedEntities: ExtractedEntity[];
  graphNodes: GraphNode[];
  graphEdges: GraphEdge[];
  tamperedSignatures: TamperedSignature[];
  caseFileDetails: {
    enforcementActionRequired?: string;
    ncrbComplianceNote?: string;
    bankActionRequired?: string;
    rbiComplianceWarning?: string;
    recommendingRejection: boolean;
  };
  deviceFingerprintLog?: string;
  isSimulated?: boolean;
  aiStatus?: {
    success: boolean;
    isQuotaExceeded: boolean;
    message?: string;
  };
  managedAgentStats?: {
    agentId: string;
    description: string;
    loadedSkills: string[];
    traversalDirectives: string;
    active: boolean;
  };
}

export interface DocumentItem {
  id: string;
  name: string;
  type: DocumentType;
  content: string;
  status?: string;
  metadata?: {
    fileSize?: string;
    createdDate?: string;
    authorTool?: string;
    dpiCheck?: string;
    fontsPercent?: string;
  };
  file?: File;
}

export interface CaseStudy {
  id: string;
  title: string;
  description: string;
  targetRisk: 'HIGH' | 'LOW';
  documents: DocumentItem[];
  riskFactorNotes: string;
}
