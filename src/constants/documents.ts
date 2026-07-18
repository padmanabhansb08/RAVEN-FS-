import { DocumentItem } from '../types';

export const INITIAL_DEMO_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-victim',
    name: 'Victim_Report_KA_1042.txt',
    type: 'VICTIM_REPORT',
    content: `NCRP VICTIM REPORT: NCRP-KA-2026-1042
NAME: ANANYA RAO
DISTRICT: BENGALURU URBAN, KARNATAKA
CONTACTED BY: +91-98765-44021
SCAM TYPE: DIGITAL ARREST / CBI IMPERSONATION
UPI BENEFICIARY: mule.alpha@upi
AMOUNT LOST: INR 4,75,000
INCIDENT TIME: 2026-07-18T09:12:00+05:30
STATEMENT: Caller ordered the victim to remain isolated on video and transfer funds for a secret verification.`,
    metadata: {
      fileSize: '18 KB',
      createdDate: '2026-07-18 10:05:12',
      authorTool: 'National Cybercrime Reporting Portal Export',
      fontsPercent: '100% Embedded',
    },
  },
  {
    id: 'doc-call',
    name: 'Call_Record_Spoof_Cluster_77.txt',
    type: 'CALL_RECORD',
    content: `TELECOM CALL DETAIL RECORD
CALL ID: CDR-20260718-7781
CALLER: +91-98765-44021
CALLEE: +91-99887-12004
START TIME: 2026-07-18T08:44:00+05:30
DURATION: 00:47:13
SPOOFING SIGNATURE: CLI-MISMATCH-77
DEVICE IMEI: imei-356789104563210
CELL LOCATION: KOLKATA, WEST BENGAL
SCRIPT MARKERS: CBI officer; digital arrest; do not contact family; transfer for verification.`,
    metadata: {
      fileSize: '9 KB',
      createdDate: '2026-07-18 09:42:21',
      authorTool: 'Telecom CDR Gateway',
    },
  },
  {
    id: 'doc-transactions',
    name: 'Transaction_Log_Mule_Alpha.txt',
    type: 'TRANSACTION_LOG',
    content: `FINANCIAL TRANSACTION INTELLIGENCE LOG
TRANSACTION ID: TXN-7F31A
FROM ACCOUNT: XXXX-2214
TO UPI: mule.alpha@upi
TO ACCOUNT: XXXX-9081
AMOUNT: INR 4,75,000
TIMESTAMP: 2026-07-18T09:12:46+05:30
NEXT HOP ACCOUNT: XXXX-4472
NEXT HOP AMOUNT: INR 4,60,000
NEXT HOP TIME: 2026-07-18T09:16:08+05:30
CHANNEL: UPI IMPS BRIDGE`,
    metadata: {
      fileSize: '14 KB',
      createdDate: '2026-07-18 09:20:00',
      authorTool: 'Bank AML Transaction Export',
    },
  },
  {
    id: 'doc-accounts',
    name: 'Account_Linkage_Mule_Cluster.txt',
    type: 'ACCOUNT_LINKAGE',
    content: `ACCOUNT LINKAGE REGISTRY
ACCOUNT: XXXX-9081
UPI ID: mule.alpha@upi
ACCOUNT HOLDER: VIKRAM DAS
REGISTERED PHONE: +91-98765-44021
REGISTERED DEVICE: imei-356789104563210
OPENED AT: 2026-07-11T14:31:00+05:30
LINKED ACCOUNT: XXXX-4472
LINKED ACCOUNT HOLDER: PRIYA SEN
LINK REASON: SHARED DEVICE AND RAPID FUND ROUTING
JURISDICTION: HOWRAH, WEST BENGAL`,
    metadata: {
      fileSize: '11 KB',
      createdDate: '2026-07-18 09:25:40',
      authorTool: 'Bank KYC Linkage Service',
    },
  },
  {
    id: 'doc-devices',
    name: 'Device_Log_Shared_Mule_Infrastructure.txt',
    type: 'DEVICE_LOG',
    content: `DEVICE INTELLIGENCE LOG
DEVICE IMEI: imei-356789104563210
DEVICE ID: CanvasFingerprint:fp-88a29b4e
ACCOUNT SESSION: XXXX-9081
SECOND ACCOUNT SESSION: XXXX-4472
SESSION IP: 103.210.43.12
IP LOCATION: HOWRAH, WEST BENGAL
FIRST REGISTRATION: 2026-07-11T14:31:00+05:30
SECOND REGISTRATION: 2026-07-11T14:34:00+05:30
SIGNAL: IDENTICAL DEVICE USED ACROSS UNRELATED MULE ACCOUNTS.`,
    metadata: {
      fileSize: '8 KB',
      createdDate: '2026-07-18 09:28:10',
      authorTool: 'RAVEN-Log-Tracker-SDK',
    },
  },
];
