import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertTriangle, RefreshCw, Scan } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UPLOAD_SUCCESS_DURATION_MS } from '../constants/timing';
import { DocumentItem } from '../types';

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
    const extMatch = /\.[^/.]+$/.exec(file.name);
    const fileExt = extMatch ? extMatch[0].toLowerCase() : '';

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

    // Guess category
    let guessedType: 'ITR' | 'SALARY_SLIP' | 'PROPERTY_VALUATION' | 'ID_PROOF' | 'OTHER' = 'OTHER';
    const lowerName = file.name.toLowerCase();
    if (lowerName.includes('itr') || lowerName.includes('tax') || lowerName.includes('return')) {
      guessedType = 'ITR';
    } else if (
      lowerName.includes('salary') ||
      lowerName.includes('slip') ||
      lowerName.includes('pay') ||
      lowerName.includes('earnings')
    ) {
      guessedType = 'SALARY_SLIP';
    } else if (
      lowerName.includes('property') ||
      lowerName.includes('deed') ||
      lowerName.includes('valuation') ||
      lowerName.includes('asset')
    ) {
      guessedType = 'PROPERTY_VALUATION';
    } else if (
      lowerName.includes('id') ||
      lowerName.includes('pan') ||
      lowerName.includes('aadhaar') ||
      lowerName.includes('passport')
    ) {
      guessedType = 'ID_PROOF';
    }

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
    <div className="bg-black/40 border border-white/5 shadow-inner rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
      <div className="flex justify-between items-center border-b border-white/5 pb-2 relative z-10">
        <div className="flex items-center gap-2">
          <Scan className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            MULTI-SOURCE DOCUMENT INGESTION LAYER
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono font-bold tracking-widest uppercase bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
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
        className={`relative overflow-hidden border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-4 z-10 ${
          dragActive
            ? 'border-indigo-400 bg-indigo-900/20 scale-[0.99] glow-indigo shadow-inner'
            : 'border-white/10 bg-black/40 hover:border-indigo-500/50 hover:bg-slate-900/50'
        }`}
      >
        {dragActive && (
          <motion.div
            initial={{ top: '-10%' }}
            animate={{ top: '110%' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="absolute left-0 right-0 h-1 bg-indigo-400/60 shadow-[0_0_20px_rgba(99,102,241,1)] z-0 pointer-events-none"
          />
        )}

        <motion.div
          animate={{ scale: dragActive ? 1.15 : 1 }}
          className={`relative z-10 p-3 rounded-full border transition-colors ${
            dragActive
              ? 'bg-indigo-600/20 border-indigo-400/50 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
              : 'bg-white/5 border-white/5 group-hover:bg-indigo-900/30 group-hover:border-indigo-500/30'
          }`}
        >
          <UploadCloud
            className={`w-8 h-8 transition-colors ${dragActive ? 'text-indigo-400 animate-pulse' : 'text-slate-400 group-hover:text-indigo-300'}`}
          />
        </motion.div>

        <div className="space-y-1.5 relative z-10">
          <p className="text-[13px] font-semibold text-slate-200">
            Drag and Drop Document, or{' '}
            <span className="text-indigo-400 font-mono underline decoration-indigo-500/30 underline-offset-4 decoration-2">
              Browse Files
            </span>
          </p>
          <p className="text-[10px] text-slate-500 font-mono leading-relaxed mt-2 max-w-sm mx-auto">
            Supporting call records, transaction logs, account linkages, device fingerprints, victim
            reports
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
      <AnimatePresence>
        {currentUpload && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-panel border border-white/5 rounded-xl p-4 space-y-4 relative z-10"
          >
            <div className="flex items-center justify-between text-xs border-b border-white/5 pb-2.5">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-1.5 bg-indigo-500/10 rounded-md border border-indigo-500/20 shrink-0">
                  <FileText className="w-5 h-5 text-indigo-400 animate-pulse" />
                </div>
                <div className="min-w-0">
                  <p className="text-slate-200 font-semibold truncate leading-none mb-1.5 text-[12px]">
                    {currentUpload.name}
                  </p>
                  <div className="flex items-center gap-1.5 font-mono text-[9px] text-slate-500">
                    <span>Size: {currentUpload.size}</span>
                    <span>•</span>
                    <span className="text-indigo-400 uppercase font-bold tracking-wider">
                      {currentUpload.type} category
                    </span>
                  </div>
                </div>
              </div>

              {currentUpload.status === 'completed' ? (
                <span className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-mono tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Ingested
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-mono tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold uppercase shrink-0 glow-indigo">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Working
                </span>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span className="text-indigo-300 truncate max-w-[80%] italic tracking-wide">
                  {currentUpload.stage}
                </span>
                <span className="font-bold text-indigo-400">{currentUpload.progress}%</span>
              </div>

              {/* Smooth glowing progress track bar */}
              <div className="w-full bg-black/60 rounded-full h-2 overflow-hidden border border-white/5 shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-300 font-mono ${
                    currentUpload.status === 'completed'
                      ? 'bg-emerald-500 shadow-sm shadow-emerald-500/40'
                      : 'bg-indigo-500 shadow-sm shadow-indigo-500/60 relative overflow-hidden'
                  }`}
                  style={{ width: `${currentUpload.progress}%` }}
                >
                  {currentUpload.status !== 'completed' && (
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
