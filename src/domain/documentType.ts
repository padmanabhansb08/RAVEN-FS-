import { DocumentType } from '../types';

const includesAny = (value: string, terms: readonly string[]) =>
  terms.some((term) => value.includes(term));

export const inferDocumentTypeFromFilename = (filename: string): DocumentType => {
  const name = filename.toLowerCase();

  // Prefer specific PS6 intelligence types before broad victim/report keywords
  // so names like Victim_Transaction_Log.pdf classify as TRANSACTION_LOG.
  if (includesAny(name, ['call', 'cdr', 'telecom'])) return 'CALL_RECORD';
  if (includesAny(name, ['transaction', 'txn', 'payment', 'transfer'])) return 'TRANSACTION_LOG';
  if (includesAny(name, ['account', 'linkage', 'mule', 'kyc'])) return 'ACCOUNT_LINKAGE';
  if (includesAny(name, ['device', 'imei', 'fingerprint', 'session'])) return 'DEVICE_LOG';
  if (includesAny(name, ['victim', 'complaint', 'ncrp'])) return 'VICTIM_REPORT';

  if (includesAny(name, ['itr', 'tax', 'return'])) return 'ITR';
  if (includesAny(name, ['salary', 'slip', 'pay', 'earnings'])) return 'SALARY_SLIP';
  if (includesAny(name, ['property', 'deed', 'valuation', 'asset'])) {
    return 'PROPERTY_VALUATION';
  }
  if (includesAny(name, ['id', 'pan', 'aadhaar', 'passport'])) return 'ID_PROOF';

  return 'OTHER';
};
