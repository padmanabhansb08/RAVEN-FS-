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

export type GraphNodeType =
  | 'person'
  | 'property'
  | 'address'
  | 'device'
  | 'employer'
  | 'phone'
  | 'account'
  | 'transaction';

export interface GraphNode {
  id: string;
  label: string;
  type: GraphNodeType;
  status: 'flagged' | 'neutral' | 'verified';
  details?: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  relationship: string;
  status: 'flagged' | 'neutral' | 'verified';
}

export interface TamperedSignature {
  signature: string;
  confidence: number; // 0 to 100
  explanation: string;
}

export interface CaseFileDetails {
  // Legacy underwriting fields remain required for backward compatibility.
  bankActionRequired: string;
  rbiComplianceWarning: string;
  recommendingRejection: boolean;
  // PS6 / law-enforcement fields (additive).
  lawEnforcementAction?: string;
  ncrbFilingRecommended?: boolean;
  courtPackageReady?: boolean;
  crossJurisdictionNote?: string;
  evidenceHash?: string;
  // Team RAVEN-FS field aliases (optional; UI may prefer these when present).
  enforcementActionRequired?: string;
  ncrbComplianceNote?: string;
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
  caseFileDetails: CaseFileDetails;
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

export type LegacyDocumentType =
  | 'ITR'
  | 'SALARY_SLIP'
  | 'PROPERTY_VALUATION'
  | 'ID_PROOF';

export type FraudNetworkDocumentType =
  | 'CALL_RECORD'
  | 'TRANSACTION_LOG'
  | 'ACCOUNT_LINKAGE'
  | 'DEVICE_LOG'
  | 'VICTIM_REPORT';

export type DocumentType = LegacyDocumentType | FraudNetworkDocumentType | 'OTHER';

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
