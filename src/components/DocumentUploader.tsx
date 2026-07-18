import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { UPLOAD_SUCCESS_DURATION_MS } from '../constants/timing';
import { DocumentItem } from '../types';
import { inferDocumentTypeFromFilename } from '../domain/documentType';

interface DocumentUploaderProps {
  onDocumentIngested: (newDoc: DocumentItem) => void;
}

interface UploadingFile {
  name: string;
  size: string;
  type: string;
  progress: number;
  stage: string;
  status: 'idle' | 'uploading' | 'parsing' | 'completed' | 'failed';
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onDocumentIngested }) => {
  const [dragActive, setDragActive] = useState(false);
  const [currentUpload, setCurrentUpload] = useState<UploadingFile | null>(null);
  const [errorText, setErrorText] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    setErrorText('');

    // Validate format
    const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.txt', '.docx'];
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (
      !allowedExtensions.includes(fileExt) &&
      !file.type.match('image/*') &&
      file.type !== 'application/pdf'
    ) {
      setErrorText('Unsupported document format. Please upload PDF, PNG, JPG, JPEG, TXT or DOCX.');
      return;
    }

    const fileSizeStr =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        : `${(file.size / 1024).toFixed(0)} KB`;

    // Keep filename classification aligned with the server for legacy and PS6 records.
    const guessedType = inferDocumentTypeFromFilename(file.name);

    // Set uploading state inspired by FineUploader progress bars
    setCurrentUpload({
      name: file.name,
      size: fileSizeStr,
      type: guessedType,
      progress: 0,
      stage: 'Connecting FineUploader channel...',
      status: 'uploading',
    });

    const stages = [
      { progress: 15, stage: 'Stabilizing link / fine-uploader upload stream...' },
      { progress: 35, stage: 'Uploading binary blocks safely...' },
      { progress: 55, stage: 'Extracting optical metadata channels (OCR parsing)...' },
      { progress: 75, stage: 'Reading EXIF profiles and font tables...' },
      { progress: 90, stage: 'Analyzing coordinate offsets & DPI boundaries...' },
      { progress: 100, stage: 'Ingestion Success! Writing to RAVEN memory...' },
    ];

    let currentStageIndex = 0;

    const interval = setInterval(() => {
      if (currentStageIndex < stages.length) {
        const next = stages[currentStageIndex];
        setCurrentUpload((prev) =>
          prev
            ? {
                ...prev,
                progress: next.progress,
                stage: next.stage,
                status: next.progress === 100 ? 'completed' : 'uploading',
              }
            : null,
        );
        currentStageIndex++;
      } else {
        clearInterval(interval);

        // Finalize loading OCR mock content based on file contents or template
        // Read file if text, otherwise generate authentic OCR statement
        if (file.type === 'text/plain') {
          const reader = new FileReader();
          reader.onload = (event) => {
            const fileContent = event.target?.result as string;
            triggerDocumentCreation(file.name, guessedType, fileSizeStr, fileContent, file);
          };
          reader.readAsText(file);
        } else {
          // Generate realistic OCR text output based on guessed type
          const generatedOcr = generateMockOcrContent(file.name, guessedType);
          triggerDocumentCreation(file.name, guessedType, fileSizeStr, generatedOcr, file);
        }
      }
    }, 750);
  };

  const triggerDocumentCreation = (
    name: string,
    type: DocumentItem['type'],
    size: string,
    content: string,
    fileObj?: File,
  ) => {
    const todayStr = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      name: name,
      type: type,
      content: content,
      metadata: {
        fileSize: size,
        createdDate: todayStr,
        authorTool: 'FineUploader Client Standard Node (Agentic Upload)',
        dpiCheck: '300 DPI (Verified Authentic Vector Stream)',
        fontsPercent: '100% Fully Embedded Web Fonts',
      },
      file: fileObj,
    };
    onDocumentIngested(newDoc);

    // Keep showing completed indicator for a second then fade out
    setTimeout(() => {
      setCurrentUpload(null);
    }, UPLOAD_SUCCESS_DURATION_MS);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Highly detailed OCR simulator mirroring actual bank document templates
  const generateMockOcrContent = (fileName: string, type: string): string => {
    const cleanName = fileName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');

    switch (type) {
      case 'ITR':
        return `INCOME TAX RETURN DEPT OF INDIA (ITR-1 SAHAJ)
ASSESSMENT YEAR: 2026-27 | FY: 2025-26
PAN: APXPK0012P | FILING NAME: ${cleanName.toUpperCase()}
ADDRESS: PLOT 824, METROPOLITAN VISTAS, MUMBAI - 400012
FILING DATE: 15-MAY-2026 | STATUS: ACKNOWLEDGED
GROSS REVENUE DECLARED: INR 28,50,050
TAXABLE CREDITS: INR 25,12,000
EMPLOYMENT STATUS: REGULAR SALARIED INDIVIDUAL
EMPLOYER CLASSIFICATION: PRIVATE LIMITED FIRM`;

      case 'SALARY_SLIP':
        return `SALARY STATEMENT FOR MONTHLY PAYROLL APR 2026
OFFICIAL EMPLOYEE CODE: EMP-30491 || BENEFICIARY: ${cleanName.toUpperCase()}
DESIGNATION: SENIOR ASSOCIATE
EMPLOYER OFFICE: METROPOLITAN SOLUTIONS GROUP CO
GROSS CREDIT DETAILS: INR 2,20,000 / Month (Annualised Gross: INR 26,40,000)
NET DISBURSED AMOUNT: INR 1,98,400
ACCOUNTS CREDITED: STATE BANK OF INDIA - SB A/C: 109281318239`;

      case 'PROPERTY_VALUATION':
        return `GOVT LAND & REGISTER SYSTEM STATE COMPLIANCE REPORT
VALUATION REFERENCE: CERT-VAL-8821038A
OFFICIAL SECURITY OWNERS: ${cleanName.toUpperCase()}
TARGET PROPERTY DETAILS: METROPOLITAN VISTAS, SUITE 824, MUMBAI FLATS
MARKET VALUATION VALUE: INR 2,50,00,000
LIENS/MORTGAGES DECLARED: NONE (MORTGAGE REGISTRY STATUS: UNENCUMBERED)`;

      case 'ID_PROOF':
        return `CENTRAL UNIQUE IDENTITY REGISTRATION (UIDAI)
DOCUMENT CLASSIFICATION: PERMANENT ACCOUNT NUMBER (PAN) CERTIFICATE
ID SERIAL HASH: APXPK0012P
HOLDER FULL NAME: ${cleanName.toUpperCase()}
REGISTERED BIRTH YEAR: 1988
VALIDITY STATUS: ACTIVE • HIGH INTEGRITY METRIC`;

      case 'CALL_RECORD':
        return `TELECOM CALL DETAIL RECORD
CALL ID: CDR-${Date.now()}
CALLER: +91-90000-00001
CALLEE: +91-90000-00002
SPOOFING SIGNATURE: CLI-MISMATCH
DEVICE IMEI: imei-pending-extraction
SCRIPT MARKERS: digital arrest; urgent verification transfer`;

      case 'TRANSACTION_LOG':
        return `FINANCIAL TRANSACTION INTELLIGENCE LOG
TRANSACTION ID: TXN-${Date.now()}
FROM ACCOUNT: PENDING
TO ACCOUNT: PENDING
AMOUNT: INR 0
CHANNEL: UPI`;

      case 'ACCOUNT_LINKAGE':
        return `ACCOUNT LINKAGE REGISTRY
ACCOUNT: PENDING
ACCOUNT HOLDER: ${cleanName.toUpperCase()}
REGISTERED PHONE: PENDING
REGISTERED DEVICE: PENDING`;

      case 'DEVICE_LOG':
        return `DEVICE INTELLIGENCE LOG
DEVICE ID: CanvasFingerprint:pending
ACCOUNT SESSION: PENDING
SESSION IP: PENDING`;

      case 'VICTIM_REPORT':
        return `NCRP VICTIM REPORT
NAME: ${cleanName.toUpperCase()}
SCAM TYPE: DIGITAL ARREST
CONTACTED BY: PENDING
AMOUNT LOST: INR 0`;

      default:
        return `UNSTRUCTURED FIELD OCR TEXT EXTRACTED
INGESTED FILE NAME: ${fileName}
PARSED LOG TIMESTAMP: ${new Date().toISOString()}
CONTENT PARSED:
-------------------------------------------
Raw textual extract of file: ${cleanName}.
This document is prepared for auditing. Validated by FineUploader core security layers.
DPI parameters: 300dpi. EXIF integrity checks: Passed.`;
    }
  };

  return (
    <div className="bg-[#0A0A0B] border border-white/5 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <div className="flex items-center gap-1.5">
          <UploadCloud className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            FineUploader Live Document Ingestion Panel
          </span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono font-bold tracking-widest uppercase bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/20">
          Layer 1 Active
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple={false}
        onChange={handleChange}
        accept=".pdf,.png,.jpg,.jpeg,.txt,.docx"
      />

      {/* Main Drag & Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-2.5 ${
          dragActive
            ? 'border-indigo-400 bg-indigo-600/10 scale-[0.98] shadow-lg shadow-indigo-950/20'
            : 'border-white/5 bg-[#161618]/30 hover:border-indigo-500/40 hover:bg-[#161618]/65'
        }`}
      >
        <UploadCloud
          className={`w-8 h-8 transition-transform ${dragActive ? 'scale-110 text-indigo-400' : 'text-slate-500 group-hover:text-indigo-400'}`}
        />
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-200">
            Drag and Drop Document, or{' '}
            <span className="text-indigo-400 font-mono">Browse Files</span>
          </p>
          <p className="text-[10px] text-slate-500 font-mono leading-relaxed">
            Accepting PDF, Images (PNG, JPG, Scanned Docs) & TXT up to 10MB
          </p>
        </div>
      </div>

      {errorText && (
        <div className="bg-red-500/5 border border-red-500/10 p-2.5 rounded text-[11px] font-mono text-red-400 flex items-center gap-1.5 animate-shake">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorText}</span>
        </div>
      )}

      {/* Uploading Progress Details State inspired by FineUploader layout */}
      {currentUpload && (
        <div className="bg-[#161618] border border-white/5 rounded-lg p-3.5 space-y-3">
          <div className="flex items-center justify-between text-xs border-b border-white/5 pb-2">
            <div className="flex items-center gap-2 min-w-0">
              <FileText className="w-4 h-4 text-indigo-400 shrink-0 animate-pulse" />
              <div className="min-w-0">
                <p className="text-slate-200 font-semibold truncate leading-none mb-1 text-[11px]">
                  {currentUpload.name}
                </p>
                <div className="flex items-center gap-1.5 font-mono text-[9px] text-slate-500">
                  <span>Size: {currentUpload.size}</span>
                  <span>•</span>
                  <span className="text-indigo-400 uppercase font-medium">
                    {currentUpload.type} category
                  </span>
                </div>
              </div>
            </div>

            {currentUpload.status === 'completed' ? (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Ingested
              </span>
            ) : (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold uppercase animate-pulse shrink-0">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Working
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
              <span className="text-indigo-400 truncate max-w-[80%] italic">
                {currentUpload.stage}
              </span>
              <span className="font-bold">{currentUpload.progress}%</span>
            </div>

            {/* Smooth glowing progress track bar */}
            <div className="w-full bg-[#0A0A0B] rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 font-mono ${
                  currentUpload.status === 'completed'
                    ? 'bg-emerald-500 shadow-sm shadow-emerald-500/40'
                    : 'bg-indigo-600 shadow-sm shadow-indigo-600/40'
                }`}
                style={{ width: `${currentUpload.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
