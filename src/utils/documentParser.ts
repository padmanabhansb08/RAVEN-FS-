export interface ParsedEntity {
  field: string;
  value: string;
  classification: 'IDENTITY' | 'FINANCIAL' | 'ORGANIZATION' | 'TEMPORAL' | 'GEOGRAPHIC';
  confidence: number;
  extractedFrom: string;
  status: 'verified' | 'discrepant' | 'warning';
}

export interface LayoutDiscovered {
  gridMatch: string;
  fieldsCount: number;
  density: string;
  alignmentConfidence: number;
}

import { DocumentItem } from '../types';

export const parseDocument = (
  document: DocumentItem,
  nlpModel: string,
): { entities: ParsedEntity[]; layout: LayoutDiscovered } => {
  const { content: text, type, id: documentId } = document;
  const selectedModel = nlpModel as 'anthropic-finance' | 'fingpt-llama' | 'layoutlm-v3';
  const lines = text.split('\n');
  const tempEntities: ParsedEntity[] = [];
  let discoveredFields = 0;
  let layoutDiscovered: LayoutDiscovered = {
    gridMatch: 'Standard Template',
    fieldsCount: 0,
    density: 'Normal',
    alignmentConfidence: 99.5,
  };

  // Helper to find lines with content
  const findValue = (labelKeywords: string[]): { val: string; raw: string } | null => {
    const lowerKeywords = labelKeywords.map((keyword) => keyword.toLowerCase());
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      if (lowerKeywords.some((keyword) => lowerLine.includes(keyword))) {
        discoveredFields++;
        let delimiterIdx = line.indexOf(':');
        if (delimiterIdx === -1) {
          delimiterIdx = line.indexOf('=');
        }
        if (delimiterIdx !== -1) {
          return {
            val: line.substring(delimiterIdx + 1).trim(),
            raw: line,
          };
        }
        const chunks = line.split(' ');
        if (chunks.length > 2) {
          return {
            val: chunks.slice(2).join(' ').trim(),
            raw: line,
          };
        }
      }
    }
    return null;
  };

  if (type === 'CALL_RECORD') {
    const callerMatch = findValue(['caller_id', 'caller']);
    const receiverMatch = findValue(['receiver', 'called']);
    const locationMatch = findValue(['cell_tower_location', 'location']);

    if (callerMatch) {
      tempEntities.push({
        field: 'Source Phone Number',
        value: callerMatch.val,
        classification: 'IDENTITY',
        confidence: 99.2,
        extractedFrom: callerMatch.raw,
        status: callerMatch.val.toLowerCase().includes('spoof') ? 'discrepant' : 'verified',
      });
    }

    if (receiverMatch) {
      tempEntities.push({
        field: 'Target Phone Number',
        value: receiverMatch.val,
        classification: 'IDENTITY',
        confidence: 98.6,
        extractedFrom: receiverMatch.raw,
        status: 'verified',
      });
    }

    if (locationMatch) {
      tempEntities.push({
        field: 'Telecom Tower Area',
        value: locationMatch.val,
        classification: 'GEOGRAPHIC',
        confidence: 94.2,
        extractedFrom: locationMatch.raw,
        status: 'verified',
      });
    }

    layoutDiscovered = {
      gridMatch: 'Telecom Provider CDR Export',
      fieldsCount: discoveredFields,
      density: 'High',
      alignmentConfidence: 98.4,
    };
  } else if (type === 'TRANSACTION_LOG') {
    const ownerMatch = findValue(['account owner', 'owner']);
    const txnMatch = findValue(['txn_ref', 'transaction']);
    const amtMatch = findValue(['amount', 'debit', 'credit']);
    const upiMatch = findValue(['beneficiary_upi', 'upi']);

    if (ownerMatch) {
      tempEntities.push({
        field: 'Originating Account Owner',
        value: ownerMatch.val,
        classification: 'IDENTITY',
        confidence: 98.1,
        extractedFrom: ownerMatch.raw,
        status: 'verified',
      });
    }

    if (txnMatch) {
      tempEntities.push({
        field: 'Bank TXN Reference',
        value: txnMatch.val,
        classification: 'FINANCIAL',
        confidence: 99.1,
        extractedFrom: txnMatch.raw,
        status: 'verified',
      });
    }

    if (amtMatch) {
      tempEntities.push({
        field: 'Transfer Amount',
        value: amtMatch.val,
        classification: 'FINANCIAL',
        confidence: 99.5,
        extractedFrom: amtMatch.raw,
        status: 'verified',
      });
    }

    if (upiMatch) {
      tempEntities.push({
        field: 'Destination UPI Handle',
        value: upiMatch.val,
        classification: 'IDENTITY',
        confidence: 99.0,
        extractedFrom: upiMatch.raw,
        status: 'verified',
      });
    }

    layoutDiscovered = {
      gridMatch: 'Bank Core Transaction Ledger',
      fieldsCount: discoveredFields,
      density: 'Medium-High',
      alignmentConfidence: 99.4,
    };
  } else if (type === 'ACCOUNT_LINKAGE') {
    const accMatch = findValue(['account no', 'a/c']);
    const ownerMatch = findValue(['registered owner', 'owner']);
    const upiMatch = findValue(['upi handle', 'upi']);

    if (accMatch) {
      tempEntities.push({
        field: 'Account Identifier',
        value: accMatch.val,
        classification: 'FINANCIAL',
        confidence: 99.7,
        extractedFrom: accMatch.raw,
        status: 'verified',
      });
    }

    if (ownerMatch) {
      tempEntities.push({
        field: 'KYC Verified Owner',
        value: ownerMatch.val,
        classification: 'IDENTITY',
        confidence: 97.5,
        extractedFrom: ownerMatch.raw,
        status: 'verified',
      });
    }

    if (upiMatch) {
      tempEntities.push({
        field: 'Mapped UPI Handle',
        value: upiMatch.val,
        classification: 'IDENTITY',
        confidence: 99.0,
        extractedFrom: upiMatch.raw,
        status: 'verified',
      });
    }

    layoutDiscovered = {
      gridMatch: 'State KYC / Account Registry',
      fieldsCount: discoveredFields,
      density: 'Medium',
      alignmentConfidence: 97.9,
    };
  } else if (type === 'DEVICE_LOG') {
    const geoIp = findValue(['ip assigned', 'session ip', 'location trace']);
    const deviceSig = findValue(['device id', 'device platform', 'canvasfingerprint']);
    const eventMatch = findValue(['event', 'action']);

    if (geoIp) {
      tempEntities.push({
        field: 'Client IP Geolocation',
        value: geoIp.val,
        classification: 'GEOGRAPHIC',
        confidence: 99.1,
        extractedFrom: geoIp.raw,
        status:
          geoIp.val.toLowerCase().includes('proxy') || geoIp.val.toLowerCase().includes('vpn')
            ? 'warning'
            : 'verified',
      });
    }

    if (deviceSig) {
      tempEntities.push({
        field: 'Target Device Engine Signature',
        value: deviceSig.val,
        classification: 'IDENTITY',
        confidence: 98.4,
        extractedFrom: deviceSig.raw,
        status: text.toLowerCase().includes('collision') ? 'discrepant' : 'verified',
      });
    }

    if (eventMatch) {
      tempEntities.push({
        field: 'Recorded Client Action',
        value: eventMatch.val,
        classification: 'ORGANIZATION',
        confidence: 98.0,
        extractedFrom: eventMatch.raw,
        status: 'verified',
      });
    }

    layoutDiscovered = {
      gridMatch: 'Application SDK Fingerprint Log',
      fieldsCount: discoveredFields,
      density: 'Medium',
      alignmentConfidence: 98.5,
    };
  } else {
    // General Parser
    tempEntities.push({
      field: 'Document Ingestion Hash',
      value: `md5-${documentId.replace('doc-', '')}`,
      classification: 'IDENTITY',
      confidence: 100.0,
      extractedFrom: 'Security Tag',
      status: 'verified',
    });

    layoutDiscovered = {
      gridMatch: 'Unstructured Field OCR Text',
      fieldsCount: discoveredFields || 1,
      density: 'Low',
      alignmentConfidence: 93.5,
    };
  }

  return { entities: tempEntities, layout: layoutDiscovered };
};
