import { describe, expect, it } from 'vitest';
import { INITIAL_DEMO_DOCUMENTS } from '../documents';

describe('PS6 demo documents', () => {
  it('covers the records needed to reveal a coordinated mule network', () => {
    expect(INITIAL_DEMO_DOCUMENTS.map((document) => document.type)).toEqual([
      'VICTIM_REPORT',
      'CALL_RECORD',
      'TRANSACTION_LOG',
      'ACCOUNT_LINKAGE',
      'DEVICE_LOG',
    ]);
  });

  it('contains shared indicators across otherwise separate records', () => {
    const corpus = INITIAL_DEMO_DOCUMENTS.map((document) => document.content).join('\n');

    expect(corpus.match(/mule\.alpha@upi/gi)?.length).toBeGreaterThanOrEqual(2);
    expect(corpus.match(/imei-356789104563210/gi)?.length).toBeGreaterThanOrEqual(2);
    expect(corpus.match(/\+91-98765-44021/g)?.length).toBeGreaterThanOrEqual(2);
  });
});
