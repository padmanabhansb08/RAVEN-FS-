import { describe, it, expect } from 'vitest';
import { parseDocument } from '../documentParser';
import { DocumentItem } from '../../types';

describe('parseDocument', () => {
  it('CALL_RECORD Document Type - extracts telecom fields correctly with spoof logic', () => {
    const doc: DocumentItem = {
      id: 'doc-cdr',
      name: 'call_logs.pdf',
      type: 'CALL_RECORD',
      content: 'Caller_ID: +91-9876543210 (Spoofed)\nReceiver: +91-1234567890\nLocation: Tower A',
      status: 'scanned',
    };
    const result = parseDocument(doc, 'anthropic-finance');
    expect(result.layout.gridMatch).toBe('Telecom Provider CDR Export');
    expect(result.entities).toHaveLength(3);
    const callerEntity = result.entities.find((e) => e.field === 'Source Phone Number');
    expect(callerEntity?.status).toBe('discrepant');
  });

  it('TRANSACTION_LOG Document Type - extracts bank fields correctly', () => {
    const doc: DocumentItem = {
      id: 'doc-txn',
      name: 'txn_log.pdf',
      type: 'TRANSACTION_LOG',
      content: 'Account Owner: Jane Doe\nTxn_Ref: TXN999\nAmount: 5000\nUPI: jane@upi',
      status: 'scanned',
    };
    const result = parseDocument(doc, 'layoutlm-v3');
    expect(result.layout.gridMatch).toBe('Bank Core Transaction Ledger');
    expect(result.entities).toHaveLength(4);
    const txnEntity = result.entities.find((e) => e.field === 'Bank TXN Reference');
    expect(txnEntity?.value).toBe('TXN999');
  });

  it('ACCOUNT_LINKAGE Document Type - extracts kyc fields correctly', () => {
    const doc: DocumentItem = {
      id: 'doc-kyc',
      name: 'kyc.pdf',
      type: 'ACCOUNT_LINKAGE',
      content: 'Account No: AC123\nRegistered Owner: Jane Doe\nUPI Handle: jane@upi',
      status: 'scanned',
    };
    const result = parseDocument(doc, 'fingpt-llama');
    expect(result.layout.gridMatch).toBe('State KYC / Account Registry');
    expect(result.entities).toHaveLength(3);
  });

  it('DEVICE_LOG Document Type - handles proxy/vpn ip warning and collision', () => {
    const doc: DocumentItem = {
      id: 'doc-dev',
      name: 'device.pdf',
      type: 'DEVICE_LOG',
      content: 'Session IP: 192.168.1.1 (Proxy)\nDevice ID: fp-88a29b4e (Collision)\nAction: login',
      status: 'scanned',
    };
    const result = parseDocument(doc, 'anthropic-finance');
    expect(result.layout.gridMatch).toBe('Application SDK Fingerprint Log');
    expect(result.entities).toHaveLength(3);
    const ipEntity = result.entities.find((e) => e.field === 'Client IP Geolocation');
    expect(ipEntity?.status).toBe('warning');
    const devEntity = result.entities.find((e) => e.field === 'Target Device Engine Signature');
    expect(devEntity?.status).toBe('discrepant');
  });

  it('Fallback Document Type', () => {
    const doc: DocumentItem = {
      id: 'doc-unknown',
      name: 'unknown.pdf',
      type: 'OTHER',
      content: 'random text',
      status: 'scanned',
    };
    const result = parseDocument(doc, 'anthropic-finance');
    expect(result.entities).toHaveLength(1);
    expect(result.entities[0].field).toBe('Document Ingestion Hash');
  });
});
