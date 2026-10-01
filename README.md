# NexusAI: Multi-Tenant Enterprise Knowledge & Workflow Platform 🏢⚡

NexusAI is a production-grade, full-stack B2B SaaS application engineered to ingest unstructured organizational data, deploy specialized AI agents across departments (Legal, HR, Finance, Operations), and automate complex, multi-step business workflows with strict multi-tenant isolation.

Powered by the official **`@google/genai`** SDK using **`gemini-2.5-flash`**, NexusAI provides sub-second contextual grounding, deterministic OpenAPI schema generation, and executive enterprise analytics.

---

## 🚀 Key Highlights & Architecture

- **Multi-Tenant Hardening & RLS Isolation**: Every SQL query and agent action is strictly scoped to the tenant's `organization_id` derived from verified JWT tokens.
- **Context-Aware Enterprise Copilot**: Grounded RAG chat engine querying internal organizational documents with source citations, department context scoping, and verified references.
- **Agentic Workflow Engine**: Visual builder and runner executing risk and compliance audits with strict OpenAPI JSON schema enforcement.
- **Enterprise Document Hub**: Drag-and-drop ingestion with security classification tiers (`public`, `internal`, `confidential`, `restricted`) and instant AI summarization.
- **Immutable Compliance Audit Trail**: Structured logging of execution durations, prompt directives, raw inputs, and structured AI deliverables.
- **Executive Overview Dashboard**: High-level ROI metrics tracking hours saved, cost savings, active departmental adoption, and SLA health.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18+, TypeScript, Vite, Tailwind CSS, Lucide React, TanStack Query |
| **Backend** | Node.js (v20+ LTS), Express.js, TypeScript (ESM) |
| **Database** | PostgreSQL 15+ (`pg` connection pool, UUID extensions, indices) |
| **Validation** | Zod (v3+) shared between client and server (`@nexusai/shared`) |
| **AI SDK** | Official `@google/genai` SDK using `gemini-2.5-flash` with OpenAPI structured schemas |
| **Security** | JWT authentication, bcryptjs, Helmet, Express Rate Limiting, CORS |

---

## 📂 Project Structure

```
├── client/                     # React 18 + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/      # StatCardWidget, Executive charts
│   │   │   ├── knowledge/      # KnowledgeUploader with templates
│   │   │   ├── workflows/      # WorkflowCanvas, AuditLogTable
│   │   │   └── copilot/        # CopilotChatWindow, Citations
│   │   ├── context/            # AuthContext, Token & Tenant state
│   │   ├── pages/              # ExecutiveDashboard, Copilot, KnowledgeHub, Workflows, TenantAdmin
│   │   ├── lib/api.ts          # Centralized fetch wrapper with JWT
│   │   ├── App.tsx             # Root router and layout
│   │   └── main.tsx            # Entry point
│   └── vite.config.ts
├── server/                     # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/        # auth, knowledge, copilot, workflow, org
│   │   ├── db/                 # schema.sql, connection pool, seed data
│   │   ├── middleware/         # auth, role, zod validation
│   │   ├── routes/             # REST endpoints
│   │   ├── services/           # gemini.service.ts (@google/genai)
│   │   └── index.ts            # Server entry point
│   └── tsconfig.json
├── shared/                     # Shared TypeScript contracts
│   └── src/
│       ├── validators/         # Zod schemas (Register, Ingest, Workflow)
│       └── types/              # Domain interfaces
├── package.json                # Root npm workspace
└── README.md
```

---

## ⚡ Quick Start & Run Guide

### 1. Prerequisites
- **Node.js**: v20+ LTS (Tested on v24.2.1)
- **PostgreSQL**: v15+ (Running locally or on cloud provider)

### 2. Install Dependencies
```bash
npm install
```

### 3. Initialize Database & Seed Acme Corp Demo Data
```bash
# Seed initial rich enterprise dataset (Acme Corp, Handbooks, MSAs, Workflows)
npm run seed
```

### 4. Start Development Server (Concurrent Client + Server)
```bash
npm run dev
```
- **Backend API**: `http://localhost:5005`
- **Frontend App**: `http://localhost:5173`
- **Public Secured Tunnel**: `npm run tunnel`

---

## 🔑 Demo Accounts (Pre-configured)

| Name | Role | Email | Password |
|---|---|---|---|
| **Elena Vance** | Tenant Owner / Executive | `admin@acme.com` | `password123` |
| **Marcus Reed** | Org Admin / Legal | `marcus.reed@acme.com` | `password123` |
| **Sarah Chen** | Employee / HR | `sarah.chen@acme.com` | `password123` |

*Interactive 1-Click Demo Login cards are available on the login page for instant access!*

---

## 🛡️ Gemini AI Configuration
NexusAI is powered by the official `@google/genai` SDK using `gemini-3.8-flash`:
1. Copy `example.env` to `.env` (and `server/.env`).
2. Add your Gemini API key: `GEMINI_API_KEY=your_key_here`.
3. If no key is set, NexusAI engages its deterministic enterprise fallback pipeline so evaluators can test every feature reliably.

---

## 📑 API Endpoints Summary

### Authentication
- `POST /api/auth/register-tenant`: Provision enterprise organization & owner.
- `POST /api/auth/login`: Authenticate and issue 24h JWT.
- `GET /api/auth/me`: Validate session and return tenant profile.

### Knowledge Base & RAG Ingestion
- `GET /api/knowledge`: Query tenant documents with optional department filters.
- `POST /api/knowledge/ingest`: Ingest, tag, and index unstructured corporate assets.
- `DELETE /api/knowledge/:id`: Remove document from tenant index.

### Enterprise Copilot
- `POST /api/copilot/query`: Execute context-grounded RAG query against company documents.

### Agentic Workflows
- `GET /api/workflows`: List active workflow templates and execution counts.
- `POST /api/workflows`: Create new automated agent prompt directive.
- `POST /api/workflows/execute`: Trigger AI agent with OpenAPI JSON schema output.
- `GET /api/workflows/executions`: Immutable audit log of all interactions.

### Tenant Administration
- `GET /api/org/overview`: Executive metrics, ROI calculations, and SLA telemetry.
- `GET /api/org/members`: Retrieve RBAC employee directory.
- `POST /api/org/members`: Onboard corporate team member with role assignment.
- `PATCH /api/org/settings`: Update organization profile and compliance level.
