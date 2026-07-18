import { describe, expect, it } from 'vitest';
import { AnalysisResult } from '../../types';
import { buildEvidencePackage, isFraudNetworkAnalysis } from '../evidencePackage';

const INGESTED_AT = '2026-07-18T10:00:00.000Z';

const PS6_RESULT: AnalysisResult = {
  score: 90,
  verdict: 'HIGH RISK',
  summary: 'Coordinated mule network detected.',
  contradictions: [
    {
      title: 'Shared Device Across Mule Accounts',
      severity: 'high',
      description: 'Two accounts share one device.',
      crossDocSource: 'Account Linkage vs Device Log',
    },
  ],
  extractedEntities: [
    { entity: 'ANANYA RAO', value: 'Person', docType: 'VICTIM_REPORT' },
  ],
  graphNodes: [
    { id: 'phone-1', label: '+91-90000', type: 'phone', status: 'flagged' },
    { id: 'person-1', label: 'ANANYA RAO', type: 'person', status: 'neutral' },
    { id: 'transaction-1', label: 'TXN-1', type: 'transaction', status: 'flagged' },
    { id: 'account-1', label: 'XXXX-9081', type: 'account', status: 'flagged' },
    { id: 'device-1', label: 'IMEI-1', type: 'device', status: 'flagged' },
  ],
  graphEdges: [
    {
      source: 'transaction-1',
      target: 'account-1',
      relationship: 'Funds Routed To',
      status: 'flagged',
    },
    {
      source: 'account-1',
      target: 'device-1',
      relationship: 'Used Shared Device',
      status: 'flagged',
    },
  ],
  tamperedSignatures: [],
  caseFileDetails: {
    bankActionRequired: 'Preserve transaction records.',
    rbiComplianceWarning: 'Advisory only.',
    recommendingRejection: true,
    lawEnforcementAction: 'Correlate with NCRP records.',
    ncrbFilingRecommended: true,
    courtPackageReady: false,
    crossJurisdictionNote: 'Signals link Karnataka and West Bengal.',
  },
  aiStatus: {
    success: true,
    isQuotaExceeded: false,
    message: "Evaluated using RAVEN's fully optimized Local Rule Intelligence engine.",
  },
};

describe('buildEvidencePackage', () => {
  it('detects PS6 analysis from extracted record provenance when optional LE fields are absent', () => {
    const sparseGeminiResult: AnalysisResult = {
      ...PS6_RESULT,
      graphNodes: [],
      graphEdges: [],
      caseFileDetails: {
        bankActionRequired: 'Review',
        rbiComplianceWarning: 'Advisory',
        recommendingRejection: false,
      },
    };

    expect(isFraudNetworkAnalysis(sparseGeminiResult)).toBe(true);
  });

  it('builds the canonical PS6 case package with required intelligence sections', async () => {
    const evidencePackage = await buildEvidencePackage(PS6_RESULT, {
      ingestedAt: INGESTED_AT,
      exportedAt: '2026-07-18T10:05:00.000Z',
      analystNotes: 'Device linkage independently reviewed.',
    });

    expect(evidencePackage.caseId).toMatch(/^RAVEN-[A-F0-9]{12}$/);
    expect(evidencePackage.evidenceHash).toMatch(/^[a-f0-9]{64}$/);
    expect(evidencePackage.entities).toEqual(PS6_RESULT.extractedEntities);
    expect(evidencePackage.relationships).toEqual(PS6_RESULT.graphEdges);
    expect(evidencePackage.recommendedLawEnforcementActions).toContain(
      'Correlate with NCRP records.',
    );
    expect(evidencePackage.auditMetadata.engine).toBe('LOCAL');
    expect(evidencePackage.auditMetadata.fallbackUsed).toBe(false);
    expect(evidencePackage.humanAnalystDisclaimer).toContain('investigative leads');
    expect(evidencePackage.analystNotes).toBe('Device linkage independently reviewed.');
    expect(evidencePackage.timeline.map(({ stage }) => stage)).toEqual([
      'CALL',
      'VICTIM',
      'TRANSACTION',
      'MULE_ACCOUNT',
      'SHARED_DEVICE',
      'NETWORK_CLUSTER',
    ]);
  });

  it('generates the same evidence hash when only export time changes', async () => {
    const first = await buildEvidencePackage(PS6_RESULT, {
      ingestedAt: INGESTED_AT,
      exportedAt: '2026-07-18T10:05:00.000Z',
    });
    const second = await buildEvidencePackage(PS6_RESULT, {
      ingestedAt: INGESTED_AT,
      exportedAt: '2026-07-18T10:10:00.000Z',
    });

    expect(first.evidenceHash).toBe(second.evidenceHash);
    expect(first.caseId).toBe(second.caseId);
    expect(first.auditMetadata.exportedAt).not.toBe(second.auditMetadata.exportedAt);
  });

  it('changes the evidence hash when substantive evidence changes', async () => {
    const changedResult = { ...PS6_RESULT, score: 60 };
    const first = await buildEvidencePackage(PS6_RESULT, {
      ingestedAt: INGESTED_AT,
    });
    const second = await buildEvidencePackage(changedResult, {
      ingestedAt: INGESTED_AT,
    });

    expect(first.evidenceHash).not.toBe(second.evidenceHash);
  });
});
