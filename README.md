# RAVEN ÔÇö Relational Verification Engine

**Fraud Network Graph Intelligence for Digital Public Safety**
_ET AI Hackathon 2026 ÔÇö Problem Statement 6 (AI for Digital Public Safety)_

RAVEN ingests multiple heterogeneous documents, cross-checks them for logical
contradictions, reconstructs the relationships between the people/devices/accounts
involved as a graph, and produces an explainable, court-ready risk verdict.

The platform runs in **two domains from the same engine**:

| Domain | Input documents | Output |
| --- | --- | --- |
| **PS6 Fraud Network** (hackathon) | Victim reports, call records, transaction logs, account linkage, device logs | Fraud-ring detection, mule-account clusters, law-enforcement evidence package |
| **Legacy Loan Fraud** (original RAVEN) | ITR, bank statements, salary slips, ID proofs | Underwriting coherence audit, applicant risk score |

Domain routing is automatic and based on the uploaded document types, so both
workflows coexist without breaking each other.

---

## Key capabilities

- **Multi-document relational analysis** ÔÇö detects contradictions across documents
  (shared device across "unrelated" accounts, rapid fund routing, mismatched claims).
- **Graph intelligence** ÔÇö builds nodes (people, devices, accounts, transactions) and
  edges, then detects fraud rings including **shared-device mule-account clusters**.
- **Explainable risk scoring** ÔÇö every verdict ships with the contributing signals and
  a confidence breakdown, not a black-box number.
- **Law-enforcement evidence package** ÔÇö deterministic **SHA-256** integrity hash,
  evidence timeline, graph explanations, analyst notes, and a session audit trail,
  exportable as JSON for an NCRP-style filing package.
- **Resilient AI** ÔÇö server-side **Gemini** with domain-aware prompts, and an automatic
  **local heuristic fallback** when no API key is set or quota is exceeded (great for a
  reliable offline demo).
- **Browser fingerprinting** ÔÇö links submissions to a device signature.

---

## Tech stack

- **Frontend:** React 19, Vite 6, Tailwind CSS 4, Recharts, lucide-react, motion
- **Backend:** Express 4, Multer (uploads), pdf-parse (PDF text)
- **AI:** `@google/genai` (Gemini 3.5 Flash) with local heuristic fallback
- **Quality:** TypeScript (strict), ESLint, Prettier, Vitest (46 tests), Knip, jscpd

---

## Quick start

```bash
# 1. Install
npm ci

# 2. (Optional) enable live Gemini ÔÇö the app works fully without this
cp .env.example .env   # then set GEMINI_API_KEY

# 3. Run the dev server (Vite + Express on one port)
npm run dev
# open http://localhost:3000
```

> No API key? RAVEN automatically runs the **local intelligence engine**, so the demo
> works end-to-end offline.

### Production build

```bash
npm run build   # builds the client (dist/) and bundles the server (dist/server.js)
npm start       # serves the compiled app on port 3000
```

---

## Common scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server (hot reload) |
| `npm run build` | Production client + server bundle |
| `npm start` | Run compiled production server |
| `npm test` | Run the Vitest suite |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run format` | Prettier write |

---

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [API flow](docs/API_FLOW.md)
- [Demo script](docs/DEMO_SCRIPT.md)
- [Pitch deck outline](docs/PITCH_DECK.md)
- [Deployment guide](docs/DEPLOYMENT.md)
- [Submission checklist](docs/SUBMISSION_CHECKLIST.md)
- [Demo readiness audit](docs/DEMO_READINESS_AUDIT.md)

---

## Repository layout

```
src/
  App.tsx                     App shell + 4-stage analysis orchestration
  types.ts                    Shared domain types (documents, graph, verdict)
  constants/documents.ts      PS6 demo case (victim + mule-ring documents)
  domain/
    documentType.ts           Filename -> document-type inference
    fraudNetworkAnalysis.ts   PS6 local fraud-network analyzer
    geminiAnalysisConfig.ts   Domain-aware Gemini prompt/schema routing
    evidencePackage.ts        LEA evidence package + SHA-256 hashing
  server/
    routes.ts                 /api/analyze ÔÇö parse, route, Gemini + fallback
    analyzer.ts               Local heuristic engine (legacy + PS6 dispatch)
  utils/graphDB.ts            In-memory graph + fraud-ring detection
  components/                 UI (verdict, graph, compliance, LEA panel)
server.ts                     Express + Vite integration entrypoint
```

---

## How it works (30-second version)

1. Documents are uploaded to `POST /api/analyze`.
2. The server infers each document's type and picks the **PS6** or **legacy** domain.
3. If a Gemini key is present, a **domain-specific prompt + JSON schema** is used;
   otherwise (or on quota/error) it **falls back to the local analyzer**.
4. The engine extracts entities, builds the relationship graph, flags contradictions,
   and computes a risk score.
5. For fraud-network cases, RAVEN assembles a **hash-sealed evidence package** for
   law-enforcement review.

---

## License

Original team project ("RAVEN"), adapted for ET AI Hackathon 2026 PS6. See source
headers (`SPDX-License-Identifier: Apache-2.0`).
