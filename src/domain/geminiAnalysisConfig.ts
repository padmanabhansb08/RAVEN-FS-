import { Type } from '@google/genai';
import { DocumentItem, FraudNetworkDocumentType } from '../types.js';

const FRAUD_NETWORK_TYPES = new Set<FraudNetworkDocumentType>([
  'CALL_RECORD',
  'TRANSACTION_LOG',
  'ACCOUNT_LINKAGE',
  'DEVICE_LOG',
  'VICTIM_REPORT',
]);

export const isFraudNetworkDomain = (documents: DocumentItem[]): boolean =>
  documents.some((document) => FRAUD_NETWORK_TYPES.has(document.type as FraudNetworkDocumentType));

/**
 * Exact legacy loan-fraud prompt preserved from the original RAVEN analyze route.
 * Do not rewrite this string — loan Gemini behavior depends on it remaining intact.
 */
export const LEGACY_LOAN_SYSTEM_PROMPT = `You are Raven, a super sharp pet detective and pet document cross-checker.
Your job is to spawn out a lot of AI agents to cross check all the documentation that the user provides, regardless of under what category or classification those documentation falls into.
Look out for all red flags. Your primary task is TO VERIFY THE STORY and find contradictions.
Check for clashes/contradictions across the documents (e.g., matching or discrepant income figures between ITR and salary certificates, mismatched registration dates, visual/graphic template modifications, identical device signatures across separate applicants).

You operate across 4 layers of intelligence:
1. Ingestion: Analyze fields from provided files.
2. Cross-Document Coherence: Flags mismatches (income, identity, dates, addresses, employers) that span multiple documents.
3. Graph & Fraud Ring Detection: Create logic nodes (person, property, address, device, employer, phone) and edges representing links. Flag dangerous edges or clusters (e.g. sharing device fingerprint across separate ID filings, pixel-level salary templates).
4. Case File compilation: Produce a structured weighted risk score (0-100) and actionable decision.

Analyze the documents below. You MUST respond in valid JSON format. Follow the strict schema exactly.`;

export const FRAUD_NETWORK_SYSTEM_PROMPT = `You are Raven Fraud Network Graph Intelligence for digital public safety investigations.
Your job is to fuse call records, transaction logs, account linkages, device logs, and victim reports into a coordinated fraud-network graph.
Focus on money mule layering, shared devices, spoofed caller infrastructure, and cross-jurisdiction account control.
Do not invent unstated identifiers. Prefer explicit field linkages across records.
Treat outputs as investigative leads requiring human verification — not determinations of guilt.

You operate across 4 layers of intelligence:
1. Ingestion: Extract phones, UPI handles, account numbers, IMEIs/device IDs, callers, and victims.
2. Cross-Record Coherence: Flag shared-device mule accounts, rapid multi-hop fund routing, and spoofed-call linkages.
3. Graph Construction: Create nodes for person, phone, account, device, and transaction. Use edges such as Funds Routed To, Used Shared Device, Contacted By, and Linked Account.
4. Case File compilation: Produce a weighted risk score (0-100), HIGH/MEDIUM/LOW RISK verdict, and law-enforcement oriented caseFileDetails while retaining bankActionRequired, rbiComplianceWarning, and recommendingRejection for API compatibility.

Analyze the records below. You MUST respond in valid JSON format. Follow the strict schema exactly.`;

const NODE_ID_DESC = 'Unique snake-case id of node';
const NODE_LABEL_DESC = 'Short human label';
const NODE_STATUS_DESC = 'flagged, neutral, or verified';
const EDGE_ENDPOINT_DESC = 'Must match a valid node ID';

/**
 * Exact legacy loan-fraud response schema preserved from the original analyze route.
 */
export const getLegacyLoanResponseSchema = () => ({
  type: Type.OBJECT,
  properties: {
    score: {
      type: Type.INTEGER,
      description: 'Weighted credit fraud/ring score from 0 to 100.',
    },
    verdict: {
      type: Type.STRING,
      description: "Must be 'HIGH RISK', 'MEDIUM RISK', or 'LOW RISK'.",
    },
    summary: {
      type: Type.STRING,
      description:
        "Summary of the whole application's coherence or fraud warnings. Mention specific files.",
    },
    contradictions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          severity: {
            type: Type.STRING,
            description: "Must be 'high', 'medium', or 'low'",
          },
          description: { type: Type.STRING },
          crossDocSource: {
            type: Type.STRING,
            description: 'Clashing document tags, e.g. ITR vs Salary',
          },
        },
        required: ['title', 'severity', 'description', 'crossDocSource'],
      },
    },
    extractedEntities: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          entity: { type: Type.STRING },
          value: { type: Type.STRING },
          docType: { type: Type.STRING },
        },
        required: ['entity', 'value', 'docType'],
      },
    },
    graphNodes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: NODE_ID_DESC },
          label: { type: Type.STRING, description: NODE_LABEL_DESC },
          type: {
            type: Type.STRING,
            description: 'person, property, address, device, employer, or phone',
          },
          status: { type: Type.STRING, description: NODE_STATUS_DESC },
          details: { type: Type.STRING },
        },
        required: ['id', 'label', 'type', 'status'],
      },
    },
    graphEdges: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          source: { type: Type.STRING, description: EDGE_ENDPOINT_DESC },
          target: { type: Type.STRING, description: EDGE_ENDPOINT_DESC },
          relationship: {
            type: Type.STRING,
            description: 'Short label, e.g. Employed By, Shared Signature',
          },
          status: { type: Type.STRING, description: NODE_STATUS_DESC },
        },
        required: ['source', 'target', 'relationship', 'status'],
      },
    },
    tamperedSignatures: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          signature: {
            type: Type.STRING,
            description: 'Feature/Anomaly detected indicating manipulation',
          },
          confidence: { type: Type.INTEGER },
          explanation: { type: Type.STRING },
        },
        required: ['signature', 'confidence', 'explanation'],
      },
    },
    caseFileDetails: {
      type: Type.OBJECT,
      properties: {
        bankActionRequired: {
          type: Type.STRING,
          description: 'Concrete immediate operations tasks for risk team.',
        },
        rbiComplianceWarning: {
          type: Type.STRING,
          description: 'Direct guidelines under RBI standards.',
        },
        recommendingRejection: { type: Type.BOOLEAN },
      },
      required: ['bankActionRequired', 'rbiComplianceWarning', 'recommendingRejection'],
    },
  },
  required: [
    'score',
    'verdict',
    'summary',
    'contradictions',
    'extractedEntities',
    'graphNodes',
    'graphEdges',
    'tamperedSignatures',
    'caseFileDetails',
  ],
});

export const getFraudNetworkResponseSchema = () => ({
  type: Type.OBJECT,
  properties: {
    score: {
      type: Type.INTEGER,
      description: 'Weighted fraud-network coordination score from 0 to 100.',
    },
    verdict: {
      type: Type.STRING,
      description: "Must be 'HIGH RISK', 'MEDIUM RISK', or 'LOW RISK'.",
    },
    summary: {
      type: Type.STRING,
      description:
        'Summary of coordinated fraud-network findings across call, transaction, device, and account records.',
    },
    contradictions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          severity: {
            type: Type.STRING,
            description: "Must be 'high', 'medium', or 'low'",
          },
          description: { type: Type.STRING },
          crossDocSource: {
            type: Type.STRING,
            description: 'Linked record tags, e.g. Call Record vs Account Linkage',
          },
        },
        required: ['title', 'severity', 'description', 'crossDocSource'],
      },
    },
    extractedEntities: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          entity: { type: Type.STRING },
          value: { type: Type.STRING },
          docType: { type: Type.STRING },
        },
        required: ['entity', 'value', 'docType'],
      },
    },
    graphNodes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: NODE_ID_DESC },
          label: { type: Type.STRING, description: NODE_LABEL_DESC },
          type: {
            type: Type.STRING,
            description:
              'person, phone, account, device, transaction, address, employer, or property',
          },
          status: { type: Type.STRING, description: NODE_STATUS_DESC },
          details: { type: Type.STRING },
        },
        required: ['id', 'label', 'type', 'status'],
      },
    },
    graphEdges: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          source: { type: Type.STRING, description: EDGE_ENDPOINT_DESC },
          target: { type: Type.STRING, description: EDGE_ENDPOINT_DESC },
          relationship: {
            type: Type.STRING,
            description: 'Short label, e.g. Funds Routed To, Used Shared Device',
          },
          status: { type: Type.STRING, description: NODE_STATUS_DESC },
        },
        required: ['source', 'target', 'relationship', 'status'],
      },
    },
    tamperedSignatures: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          signature: {
            type: Type.STRING,
            description: 'Feature/Anomaly detected indicating manipulation',
          },
          confidence: { type: Type.INTEGER },
          explanation: { type: Type.STRING },
        },
        required: ['signature', 'confidence', 'explanation'],
      },
    },
    caseFileDetails: {
      type: Type.OBJECT,
      properties: {
        bankActionRequired: {
          type: Type.STRING,
          description: 'Concrete immediate operations tasks for risk team.',
        },
        rbiComplianceWarning: {
          type: Type.STRING,
          description: 'Compliance/advisory notice retained for API compatibility.',
        },
        recommendingRejection: { type: Type.BOOLEAN },
        lawEnforcementAction: {
          type: Type.STRING,
          description: 'Recommended analyst or LE follow-up action.',
        },
        ncrbFilingRecommended: { type: Type.BOOLEAN },
        courtPackageReady: { type: Type.BOOLEAN },
        crossJurisdictionNote: {
          type: Type.STRING,
          description: 'Cross-district or cross-state linkage note.',
        },
      },
      required: ['bankActionRequired', 'rbiComplianceWarning', 'recommendingRejection'],
    },
  },
  required: [
    'score',
    'verdict',
    'summary',
    'contradictions',
    'extractedEntities',
    'graphNodes',
    'graphEdges',
    'tamperedSignatures',
    'caseFileDetails',
  ],
});

export const getGeminiAnalysisConfig = (documents: DocumentItem[]) => {
  if (isFraudNetworkDomain(documents)) {
    return {
      systemPrompt: FRAUD_NETWORK_SYSTEM_PROMPT,
      responseSchema: getFraudNetworkResponseSchema(),
      domain: 'fraud_network' as const,
    };
  }

  return {
    systemPrompt: LEGACY_LOAN_SYSTEM_PROMPT,
    responseSchema: getLegacyLoanResponseSchema(),
    domain: 'loan' as const,
  };
};
