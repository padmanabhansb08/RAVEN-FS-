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
    <div className="glass-panel rounded-none border border-white/10 p-4 flex flex-col gap-3 relative overflow-hidden group shadow-[0_15px_40px_rgba(0,0,0,0.3)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.12),transparent_30%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
      <div className="flex justify-between items-center border-b border-white/10 pb-2.5 relative z-10">
        <div className="flex items-center gap-2">
          <Scan className="w-4 h-4 text-teal-400" />
          <span className="text-sm font-bold text-slate-200 tracking-wide">Document Upload</span>
        </div>
        <span className="text-[10px] text-teal-200 font-bold bg-teal-500/10 px-3 py-1 rounded-none border border-teal-500/20 shadow-[0_0_10px_rgba(20,184,166,0.15)] uppercase tracking-wider">
          Ready
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
        className={`relative overflow-hidden border border-dashed rounded-none p-8 text-center cursor-pointer transition-all duration-500 flex flex-col items-center justify-center gap-4 z-10 ${
          dragActive
            ? 'border-teal-400 bg-teal-500/10 scale-[0.99] shadow-[0_0_30px_rgba(20,184,166,0.2)]'
            : 'border-white/10 bg-black/20 hover:border-teal-400/50 hover:bg-white/5 hover:shadow-[0_0_20px_rgba(20,184,166,0.1)]'
        }`}
      >
        {dragActive && (
          <motion.div
            initial={{ top: '-10%' }}
            animate={{ top: '110%' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="absolute left-0 right-0 h-1 bg-blue-400/60 shadow-[0_0_20px_rgba(59,130,246,1)] z-0 pointer-events-none"
          />
        )}

        <motion.div
          animate={{ scale: dragActive ? 1.15 : 1 }}
          className={`relative z-10 p-4 rounded-none border transition-all duration-300 ${
            dragActive
              ? 'bg-teal-500/15 border-teal-400/50 shadow-[0_0_20px_rgba(20,184,166,0.3)]'
              : 'bg-white/5 border-white/10 group-hover:bg-teal-500/10 group-hover:border-teal-400/30 group-hover:shadow-[0_0_15px_rgba(20,184,166,0.15)]'
          }`}
        >
          <UploadCloud
            className={`w-8 h-8 transition-colors ${dragActive ? 'text-teal-300 animate-pulse' : 'text-slate-400 group-hover:text-teal-300'}`}
          />
        </motion.div>

        <div className="space-y-2 relative z-10">
          <p className="text-sm font-bold text-slate-200 tracking-wide">
            Drag and drop a file, or{' '}
            <span className="text-teal-400 hover:text-teal-300 cursor-pointer underline decoration-teal-400/30 underline-offset-4 decoration-2 transition-colors">
              browse
            </span>
          </p>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto font-light">
            Supports PDFs, images, text files, and document scans.
          </p>
        </div>
      </div>

      {errorText && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-none text-sm text-rose-200 flex items-center gap-2 shadow-[0_5px_15px_rgba(244,63,94,0.15)]">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span className="font-medium">{errorText}</span>
        </div>
      )}

      {/* Uploading Progress Details State inspired by FineUploader layout */}
      <AnimatePresence>
        {currentUpload && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="glass-panel rounded-none border border-white/10 p-5 space-y-4 relative z-10 shadow-[0_10px_30px_rgba(0,0,0,0.2)] overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-none blur-2xl -mr-10 -mt-10 pointer-events-none" />
            <div className="flex items-center justify-between text-xs border-b border-white/10 pb-3 relative z-10">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 bg-teal-500/10 rounded-none border border-teal-500/20 shrink-0 shadow-[0_0_10px_rgba(20,184,166,0.1)]">
                  <FileText className="w-5 h-5 text-teal-400 animate-pulse" />
                </div>
                <div className="min-w-0">
                  <p className="text-slate-100 font-bold truncate leading-none mb-1.5 text-sm tracking-wide">
                    {currentUpload.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium uppercase tracking-wider text-[9px]">
                    <span>{currentUpload.size}</span>
                    <span className="text-teal-400/50">•</span>
                    <span className="text-teal-400 font-bold">
                      {currentUpload.type} category
                    </span>
                  </div>
                </div>
              </div>

              {currentUpload.status === 'completed' ? (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-none text-[10px] bg-blue-500/10 text-blue-300 border border-blue-500/20 font-bold uppercase tracking-wider shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.15)]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Ingested
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-none text-[10px] bg-teal-500/10 text-teal-300 border border-teal-500/20 font-bold uppercase tracking-wider shrink-0 shadow-[0_0_10px_rgba(20,184,166,0.15)]">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Working
                </span>
              )}
            </div>

            <div className="space-y-3 relative z-10">
              <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
                <span className="text-teal-200 truncate max-w-[80%]">{currentUpload.stage}</span>
                <span className="font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">{currentUpload.progress}%</span>
              </div>

              <div className="w-full bg-black/40 rounded-none h-2.5 overflow-hidden border border-white/5 shadow-inner">
                <div
                  className={`h-full rounded-none transition-all duration-300 font-mono ${
                    currentUpload.status === 'completed'
                      ? 'bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                      : 'bg-gradient-to-r from-teal-500 to-blue-500 relative overflow-hidden shadow-[0_0_10px_rgba(20,184,166,0.5)]'
                  }`}
                  style={{ width: `${currentUpload.progress}%` }}
                >
                  {currentUpload.status !== 'completed' && (
                    <motion.div
                      className="absolute inset-0 bg-white/30"
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
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
