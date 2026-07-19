import { describe, expect, it } from 'vitest';
import { INITIAL_DEMO_DOCUMENTS } from '../../constants/documents';
import { analyzeDocumentsDynamically } from '../analyzer';
import { DocumentItem } from '../../types';

describe('analyzeDocumentsDynamically PS6 fraud-network analysis', () => {
  it('maps the demo records into a connected mule-network graph', () => {
    const result = analyzeDocumentsDynamically(INITIAL_DEMO_DOCUMENTS);

    expect(result.graphNodes.some((node) => node.type === 'account')).toBe(true);
    expect(result.graphNodes.some((node) => node.type === 'transaction')).toBe(true);
    expect(result.graphNodes.some((node) => node.type === 'device')).toBe(true);
    expect(result.graphNodes.some((node) => node.type === 'phone')).toBe(true);
    expect(result.graphEdges.some((edge) => edge.relationship === 'Funds Routed To')).toBe(true);
    expect(result.graphEdges.some((edge) => edge.relationship === 'Used Shared Device')).toBe(true);
  });

  it('flags coordinated indicators and returns law-enforcement guidance', () => {
    const result = analyzeDocumentsDynamically(INITIAL_DEMO_DOCUMENTS);
    const titles = result.contradictions.map((contradiction) => contradiction.title);

    expect(titles).toContain('Shared Device Across Mule Accounts');
    expect(titles).toContain('Rapid Layered Fund Routing');
    expect(titles).toContain('Spoofed Caller Infrastructure Link');
    expect(result.verdict).toBe('HIGH RISK');
    expect(result.caseFileDetails.ncrbFilingRecommended).toBe(true);
    expect(result.caseFileDetails.crossJurisdictionNote).toContain('Karnataka');
    expect(result.caseFileDetails.crossJurisdictionNote).toContain('West Bengal');
  });

  it('preserves legacy loan-document analysis behavior', () => {
    const legacyDocuments: DocumentItem[] = [
      {
        id: 'legacy-itr',
        name: 'ITR.txt',
        type: 'ITR',
        content: 'NAME: RAJESH KUMAR\nEMPLOYER: APEX DIGITAL SOLUTIONS',
      },
      {
        id: 'legacy-salary',
        name: 'Salary.txt',
        type: 'SALARY_SLIP',
        content: 'NAME: RAJESH KUMAR\nEMPLOYER: APEX TECH SERVICES',
      },
    ];

    const result = analyzeDocumentsDynamically(legacyDocuments);

    expect(result.contradictions.map((contradiction) => contradiction.title)).toContain(
      'Employer Brand Identification Conflict',
    );
    expect(result.caseFileDetails.bankActionRequired).toBeDefined();
  });
});
