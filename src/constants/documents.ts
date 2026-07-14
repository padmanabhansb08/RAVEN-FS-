import { DocumentItem } from '../types';

export const INITIAL_DEMO_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-txn',
    name: 'Victim_Transaction_Log_May.csv',
    type: 'TRANSACTION_LOG',
    content: `TRANSACTION REFERENCE LEDGER
ACCOUNT OWNER: VICTIM-NODE
TXN_REF: TXN-99882211
CREDIT/DEBIT: DEBIT
AMOUNT: INR 1,50,000
BENEFICIARY_UPI: mule123@ybl
TIMESTAMP: 2026-05-12 14:22:10`,
    metadata: {
      fileSize: '15 KB',
      createdDate: '2026-05-12 15:00:00',
      authorTool: 'Bank Core System',
      dpiCheck: 'N/A',
      fontsPercent: 'N/A',
    },
  },
  {
    id: 'doc-linkage',
    name: 'KYC_Account_Linkage_Mule.txt',
    type: 'ACCOUNT_LINKAGE',
    content: `ACCOUNT REGISTRY RECORD
ACCOUNT NO: ACCT-554433
REGISTERED OWNER: MULE-OPERATOR-1
UPI HANDLE: mule123@ybl
STATUS: ACTIVE
KYC_VERIFIED: YES`,
    metadata: {
      fileSize: '8 KB',
      createdDate: '2026-04-10 10:05:44',
      authorTool: 'KYC Portal',
      dpiCheck: 'N/A',
      fontsPercent: 'N/A',
    },
  },
  {
    id: 'doc-cdr',
    name: 'Call_Metadata_Telecom.csv',
    type: 'CALL_RECORD',
    content: `TELECOM METADATA EXTRACTION
CALLER_ID: +91-9876543210 (Spoofed Range Detected)
RECEIVER: VICTIM-NODE
DURATION: 45:12
CELL_TOWER_LOCATION: SECTOR-12-TOWER-A`,
    metadata: {
      fileSize: '45 KB',
      createdDate: '2026-05-12 13:35:00',
      authorTool: 'Telecom Export',
      dpiCheck: 'N/A',
      fontsPercent: 'N/A',
    },
  },
  {
    id: 'doc-devices',
    name: 'Session_Fingerprint_DeviceLogs.txt',
    type: 'DEVICE_LOG',
    content: `CLIENT SESSION FOOTPRINT
EVENT: ACCOUNT REGISTRATION
TARGET ACCOUNT: ACCT-554433
DEVICE ID: CanvasFingerprint:fp-88a29b4e
SESSION IP: 103.210.43.12 (VPN proxy node)
SUBMISSION TIMELINE: Parallel submissions sent exactly 4 minutes apart.`,
    metadata: {
      fileSize: '12 KB',
      createdDate: '2026-04-10 10:04:10',
      authorTool: 'RAVEN-Log-Tracker-SDK',
    },
  },
];
