import { AnalysisResult, Contradiction, ExtractedEntity, GraphEdge, GraphNode } from '../types';

export type AnalysisEngine = 'LOCAL' | 'GEMINI' | 'LOCAL_FALLBACK';

export interface EvidenceTimelineEvent {
  sequence: number;
  stage: 'CALL' | 'VICTIM' | 'TRANSACTION' | 'MULE_ACCOUNT' | 'SHARED_DEVICE' | 'NETWORK_CLUSTER';
  label: string;
  description: string;
  entityIds: string[];
}

export interface ConfidenceContribution {
  label: string;
  source: 'LOCAL_RULE' | 'GEMINI_MODEL' | 'GEMINI_SIGNAL';
  contribution: number;
  confidence: number;
  rationale: string;
}

export interface GraphExplanation {
  source: string;
  target: string;
  relationship: string;
  explanation: string;
}

export interface EvidenceAuditMetadata {
  ingestedAt: string;
  engine: AnalysisEngine;
  fallbackUsed: boolean;
  exportedAt: string;
  evidenceHash: string;
}

export interface LawEnforcementEvidencePackage {
  schemaVersion: '1.0';
  caseId: string;
  timestamp: string;
  evidenceHash: string;
  verdict: AnalysisResult['verdict'];
  summary: string;
  entities: ExtractedEntity[];
  relationships: GraphEdge[];
  graphNodes: GraphNode[];
  contradictions: Contradiction[];
  timeline: EvidenceTimelineEvent[];
  graphExplanations: GraphExplanation[];
  riskScore: number;
  confidenceBreakdown: ConfidenceContribution[];
  recommendedLawEnforcementActions: string[];
  crossJurisdictionNotes: string;
  auditMetadata: EvidenceAuditMetadata;
  analystNotes: string;
  courtAdmissibility: {
    status: 'REVIEW_REQUIRED';
    statement: string;
  };
  humanAnalystDisclaimer: string;
}

export interface EvidencePackageOptions {
  ingestedAt: string;
  exportedAt?: string;
  analystNotes?: string;
}

const HUMAN_ANALYST_DISCLAIMER =
  'RAVEN outputs are investigative leads, not proof of guilt. A trained human analyst must verify source records, chain of custody, and legal relevance before operational or judicial use.';

const COURT_REVIEW_STATEMENT =
  'This export preserves a deterministic integrity hash and audit metadata. Court admissibility remains subject to source authentication, chain-of-custody procedures, and review by the competent legal authority.';

const SEVERITY_WEIGHTS: Record<Contradiction['severity'], number> = {
  high: 30,
  medium: 18,
  low: 8,
};

const FRAUD_NETWORK_DOCUMENT_TYPES = new Set([
  'CALL_RECORD',
  'TRANSACTION_LOG',
  'ACCOUNT_LINKAGE',
  'DEVICE_LOG',
  'VICTIM_REPORT',
]);

const getRuleConfidence = (severity: Contradiction['severity']): number => {
  if (severity === 'high') return 90;
  if (severity === 'medium') return 70;
  return 50;
};

const getNode = (analysisResult: AnalysisResult, type: GraphNode['type']): GraphNode | undefined =>
  analysisResult.graphNodes.find((node) => node.type === type);

export const isFraudNetworkAnalysis = (analysisResult: AnalysisResult): boolean =>
  Boolean(
    analysisResult.caseFileDetails.lawEnforcementAction ||
      analysisResult.caseFileDetails.ncrbFilingRecommended !== undefined ||
      analysisResult.extractedEntities.some(({ docType }) =>
        FRAUD_NETWORK_DOCUMENT_TYPES.has(docType),
      ) ||
      analysisResult.graphNodes.some(
        ({ type }) => type === 'account' || type === 'transaction',
      ),
  );

export const getAnalysisEngine = (analysisResult: AnalysisResult): AnalysisEngine => {
  if (analysisResult.aiStatus?.success === false) return 'LOCAL_FALLBACK';

  const statusMessage = analysisResult.aiStatus?.message?.toLocaleLowerCase() ?? '';
  if (statusMessage.includes('local')) return 'LOCAL';

  return 'GEMINI';
};

export const buildEvidenceTimeline = (
  analysisResult: AnalysisResult,
): EvidenceTimelineEvent[] => {
  const phone = getNode(analysisResult, 'phone');
  const victim = getNode(analysisResult, 'person');
  const transaction = getNode(analysisResult, 'transaction');
  const account = getNode(analysisResult, 'account');
  const device = getNode(analysisResult, 'device');
  const flaggedEntityIds = analysisResult.graphNodes
    .filter(({ status }) => status === 'flagged')
    .map(({ id }) => id);

  return [
    {
      sequence: 1,
      stage: 'CALL',
      label: 'Suspicious call infrastructure observed',
      description: phone
        ? `${phone.label} appears in the submitted communication records.`
        : 'Call-record indicators initiated the intelligence sequence.',
      entityIds: phone ? [phone.id] : [],
    },
    {
      sequence: 2,
      stage: 'VICTIM',
      label: 'Victim report correlated',
      description: victim
        ? `${victim.label} is linked to the reported contact and payment request.`
        : 'A victim report was correlated with the communication signal.',
      entityIds: victim ? [victim.id] : [],
    },
    {
      sequence: 3,
      stage: 'TRANSACTION',
      label: 'Financial transfer traced',
      description: transaction
        ? `${transaction.label} connects the victim-side record to beneficiary infrastructure.`
        : 'Transaction metadata connects the report to beneficiary infrastructure.',
      entityIds: transaction ? [transaction.id] : [],
    },
    {
      sequence: 4,
      stage: 'MULE_ACCOUNT',
      label: 'Mule beneficiary identified',
      description: account
        ? `${account.label} receives or routes funds in the linked transaction chain.`
        : 'A beneficiary account is positioned in the suspected mule chain.',
      entityIds: account ? [account.id] : [],
    },
    {
      sequence: 5,
      stage: 'SHARED_DEVICE',
      label: 'Shared control infrastructure detected',
      description: device
        ? `${device.label} links otherwise separate account sessions.`
        : 'Device intelligence indicates shared account control.',
      entityIds: device ? [device.id] : [],
    },
    {
      sequence: 6,
      stage: 'NETWORK_CLUSTER',
      label: 'Coordinated network cluster formed',
      description: `${analysisResult.graphNodes.length} entities and ${analysisResult.graphEdges.length} relationships converge into the case graph.`,
      entityIds: flaggedEntityIds,
    },
  ];
};

const explainRelationship = (edge: GraphEdge, nodes: Map<string, GraphNode>): string => {
  const source = nodes.get(edge.source)?.label ?? edge.source;
  const target = nodes.get(edge.target)?.label ?? edge.target;
  const relationshipReasons: Record<string, string> = {
    'Funds Routed To': 'Transaction records show funds moving between these entities.',
    'Used Shared Device': 'Device logs show both entities authenticating through the same device.',
    'Contacted By': 'The victim report identifies this communication endpoint.',
    'Transferred To': 'The victim report names this beneficiary account or UPI handle.',
    Called: 'Call-detail records contain a direct communication event.',
    'Originated Call': 'Call metadata associates the device with the caller endpoint.',
    'Registered Phone': 'Account-linkage data records this phone as the registered contact.',
    'Linked Account': 'Account-linkage data explicitly associates these beneficiary accounts.',
    'Initiated Transaction': 'Transaction metadata identifies the source account for this transfer.',
  };

  const reason =
    relationshipReasons[edge.relationship] ??
    'The submitted records contain an explicit relationship between these entities.';
  return `${source} → ${target}: ${reason}`;
};

export const buildGraphExplanations = (
  analysisResult: AnalysisResult,
): GraphExplanation[] => {
  const nodes = new Map(analysisResult.graphNodes.map((node) => [node.id, node]));
  return analysisResult.graphEdges.map((edge) => ({
    source: edge.source,
    target: edge.target,
    relationship: edge.relationship,
    explanation: explainRelationship(edge, nodes),
  }));
};

export const buildConfidenceBreakdown = (
  analysisResult: AnalysisResult,
): ConfidenceContribution[] => {
  const engine = getAnalysisEngine(analysisResult);
  const signalSource = engine === 'GEMINI' ? 'GEMINI_SIGNAL' : 'LOCAL_RULE';
  const contributions: ConfidenceContribution[] = analysisResult.contradictions.map(
    (contradiction) => ({
      label: contradiction.title,
      source: signalSource,
      contribution: SEVERITY_WEIGHTS[contradiction.severity],
      confidence: getRuleConfidence(contradiction.severity),
      rationale: contradiction.description,
    }),
  );

  if (engine === 'GEMINI') {
    contributions.unshift({
      label: 'Gemini structured network assessment',
      source: 'GEMINI_MODEL',
      contribution: analysisResult.score,
      confidence: analysisResult.score,
      rationale:
        'Gemini produced the structured verdict using the PS6 fraud-network response schema.',
    });
  }

  return contributions;
};

const canonicalize = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (!value || typeof value !== 'object') return value;

  return Object.fromEntries(
    Object.entries(value)
      .filter(([, entryValue]) => entryValue !== undefined)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entryValue]) => [key, canonicalize(entryValue)]),
  );
};

const sha256 = async (value: unknown): Promise<string> => {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Web Crypto SHA-256 is unavailable in this environment.');
  }

  const canonicalJson = JSON.stringify(canonicalize(value));
  const digest = await globalThis.crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(canonicalJson),
  );

  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

export const buildEvidencePackage = async (
  analysisResult: AnalysisResult,
  options: EvidencePackageOptions,
): Promise<LawEnforcementEvidencePackage> => {
  const engine = getAnalysisEngine(analysisResult);
  const timeline = buildEvidenceTimeline(analysisResult);
  const graphExplanations = buildGraphExplanations(analysisResult);
  const confidenceBreakdown = buildConfidenceBreakdown(analysisResult);
  const recommendedLawEnforcementActions = [
    analysisResult.caseFileDetails.lawEnforcementAction,
    analysisResult.caseFileDetails.bankActionRequired,
    analysisResult.caseFileDetails.ncrbFilingRecommended
      ? 'Prepare a verified complaint package for the NCRP/NCRB workflow.'
      : undefined,
  ].filter((action): action is string => Boolean(action));
  const analystNotes = options.analystNotes?.trim() ?? '';
  const fallbackUsed = engine === 'LOCAL_FALLBACK';
  const courtAdmissibility = {
    status: 'REVIEW_REQUIRED' as const,
    statement: COURT_REVIEW_STATEMENT,
  };

  const substantiveEvidence = {
    schemaVersion: '1.0',
    timestamp: options.ingestedAt,
    verdict: analysisResult.verdict,
    summary: analysisResult.summary,
    entities: analysisResult.extractedEntities,
    relationships: analysisResult.graphEdges,
    graphNodes: analysisResult.graphNodes,
    contradictions: analysisResult.contradictions,
    timeline,
    graphExplanations,
    riskScore: analysisResult.score,
    confidenceBreakdown,
    recommendedLawEnforcementActions,
    crossJurisdictionNotes:
      analysisResult.caseFileDetails.crossJurisdictionNote ??
      'No cross-jurisdiction note was produced.',
    analystNotes,
    engine,
    fallbackUsed,
    humanAnalystDisclaimer: HUMAN_ANALYST_DISCLAIMER,
    courtAdmissibility,
  };
  const evidenceHash = await sha256(substantiveEvidence);

  return {
    ...substantiveEvidence,
    schemaVersion: '1.0',
    caseId: `RAVEN-${evidenceHash.slice(0, 12).toLocaleUpperCase()}`,
    evidenceHash,
    auditMetadata: {
      ingestedAt: options.ingestedAt,
      engine,
      fallbackUsed,
      exportedAt: options.exportedAt ?? new Date().toISOString(),
      evidenceHash,
    },
  };
};
