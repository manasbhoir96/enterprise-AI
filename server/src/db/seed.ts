import bcrypt from "bcryptjs";
import { query, transaction } from "./index.js";

export async function autoSeedIfEmpty(): Promise<void> {
  try {
    const orgCheck = await query("SELECT count(*)::int as count FROM organizations");
    if (orgCheck.rows[0].count > 0) {
      console.log("ℹ️  Database already contains enterprise data. Skipping auto-seed.");
      return;
    }

    console.log("🌱 Database is empty. Seeding Acme Corporation enterprise demo environment...");
    await runSeed();
    console.log("✅ Auto-seed completed successfully.");
  } catch (err) {
    console.error("Auto-seed error:", err);
  }
}

export async function runSeed(): Promise<void> {
  const passwordHash = await bcrypt.hash("password123", 10);

  await transaction(async (client) => {
    // 1. Create Organization
    const orgRes = await client.query(
      `INSERT INTO organizations (name, industry, compliance_level)
       VALUES ('Acme Corporation', 'Enterprise Cloud & AI Solutions', 'SOC2 Type II & HIPAA')
       RETURNING id`
    );
    const orgId = orgRes.rows[0].id;

    // 2. Create Users
    const ownerRes = await client.query(
      `INSERT INTO users (organization_id, email, password_hash, full_name, department, role)
       VALUES 
       ($1, 'admin@acme.com', $2, 'Elena Vance', 'Executive Leadership', 'owner'),
       ($1, 'marcus.reed@acme.com', $2, 'Marcus Reed', 'Legal & Compliance', 'admin'),
       ($1, 'sarah.chen@acme.com', $2, 'Sarah Chen', 'Human Resources', 'employee')
       RETURNING id, email, role`,
      [orgId, passwordHash]
    );

    const ownerId = ownerRes.rows.find((u) => u.email === "admin@acme.com")!.id;
    const adminId = ownerRes.rows.find((u) => u.email === "marcus.reed@acme.com")!.id;

    // 3. Create Knowledge Assets
    const handbookText = `ACME CORPORATION - GLOBAL EMPLOYEE POLICY HANDBOOK (2025-2026)

SECTION 1: TRAVEL & EXPENSE REIMBURSEMENT POLICY
1.1 Air Travel: Standard corporate travel is economy class for domestic flights under 5 hours. Business class booking is pre-authorized for nonstop international flights exceeding 6 hours, provided approval from department Vice President is obtained 14 days in advance.
1.2 Lodging & Per Diem: Lodging must be booked through corporate portal. Maximum reimbursable room rate is $260/night for Tier-1 cities (San Francisco, New York, London, Tokyo) and $185/night for Tier-2 cities. Daily meal allowance is $80/day ($20 breakfast, $25 lunch, $35 dinner).
1.3 Expense Submissions: All itemized receipts must be uploaded into the expense management system within 30 calendar days following trip completion. Non-reimbursable expenses include alcoholic beverages, personal laundry under 4 days, and non-business entertainment.

SECTION 2: PAID TIME OFF & SICK LEAVE
2.1 PTO Accrual: Full-time employees accrue 18 days of paid vacation per calendar year, accrued semi-monthly on the 1st and 15th. Up to 5 unused PTO days can be rolled over to Q1 of the subsequent year.
2.2 Dedicated Health & Sick Leave: 10 days of fully compensated sick and mental wellness leave are provided annually.
2.3 Parental Leave: Acme provides 16 weeks of 100% paid parental leave for primary and secondary caregivers following birth or adoption.

SECTION 3: CODE OF CONDUCT & DATA GOVERNANCE
All employees must comply with SOC2 Type II security guidelines. Client confidential information must reside strictly within encrypted corporate infrastructure.`;

    const contractText = `MASTER SERVICES AGREEMENT (MSA) - CLOUD INFRASTRUCTURE & VENDOR TERMS

BETWEEN: Acme Corporation ("Customer") and CloudScale Systems Inc. ("Vendor")

CLAUSE 8: LIMITATION OF LIABILITY & INDEMNIFICATION
8.1 Mutual Indemnification: Vendor agrees to defend, indemnify, and hold harmless Customer from any claims, suits, or demands arising out of Vendor's breach of confidentiality, IP infringement, or gross negligence.
8.2 Aggregate Liability Cap: Except for gross negligence or willful misconduct, each party's maximum aggregate financial liability under this Agreement shall be limited to the total fees paid by Customer to Vendor in the twelve (12) months preceding the claim.

CLAUSE 12: TERM & TERMINATION
12.1 Termination for Convenience: Customer may terminate this Agreement at any time with thirty (30) days prior written notice. Vendor shall promptly provide a pro-rated refund of any prepaid, unearned fees.
12.2 Termination for Cause: Either party may immediately terminate this agreement upon written notice if the counterparty commits a material breach and fails to cure such breach within fifteen (15) days.

CLAUSE 15: SERVICE LEVEL AGREEMENT (SLA) & AVAILABILITY
Vendor guarantees 99.95% system uptime measured on a calendar month basis. Downtime exceeding 0.05% shall trigger an automatic 10% credit against monthly subscription fees.`;

    const financialsText = `ACME CORPORATION - Q3 FINANCIAL REVIEW & COST ALLOCATION REPORT

EXECUTIVE SUMMARY
Total Gross Revenue for Q3: $42,850,000 (+18.4% YoY).
Gross Margin: 74.2% across Enterprise SaaS and Professional Advisory divisions.
EBITDA: $9,620,000 (22.4% margin).

DEPARTMENTAL BUDGET VARIANCES:
- Engineering & R&D: $14.2M spent vs $13.8M budgeted (+2.9% variance driven by GPU model inference scaling).
- Sales & Marketing: $11.5M spent vs $12.1M budgeted (-5.0% variance due to optimized outbound automation).
- General & Administrative: $4.8M spent (on target).

VENDOR ANOMALY DETECTION:
Cloud storage compute costs on AWS increased by 14% month-over-month. Recommendation is to institute reserved instance commitments for baseline workloads to yield an estimated $340,000 in annual recurring savings.`;

    const securityText = `ACME INFORMATION SECURITY & INCIDENT RESPONSE RUNBOOK (SOC2 / ISO 27001)

1. ACCESS CONTROLS & AUTHENTICATION
- Mandatory FIDO2 / WebAuthn Hardware MFA for all administrative consoles (AWS, GitHub, Production DB).
- Password rotation schedule: 90 days with 16-character minimum complexity requirements.
- Zero Trust Architecture: All internal microservices require mutual TLS (mTLS) with cryptographic identity tokens.

2. DATA CLASSIFICATION TIERS
- Public: Marketing assets, press releases.
- Internal: Standard operations documentation, org charts.
- Confidential: Financial ledgers, customer contracts, roadmap documentation.
- Restricted: PII, cryptographic secrets, authentication keys, production database dumps.

3. INCIDENT RESPONSE SLA
- Severity 1 (Critical Outage / Active Breach): Incident commander mobilized within 15 minutes. C-Suite notified within 45 minutes. Regulatory notification within 72 hours.`;

    await client.query(
      `INSERT INTO knowledge_assets (organization_id, uploaded_by, title, content_text, department_tag, classification)
       VALUES 
       ($1, $2, 'Acme Corp Global Employee Handbook (2025 Edition)', $3, 'Human Resources', 'internal'),
       ($1, $2, 'Acme Enterprise Master Services Agreement (MSA)', $4, 'Legal & Compliance', 'confidential'),
       ($1, $2, 'Q3 Financial Performance & Cloud Cost Audit', $5, 'Finance & Accounting', 'confidential'),
       ($1, $2, 'Information Security & Incident Response Runbook', $6, 'Operations & Supply Chain', 'restricted')`,
      [orgId, ownerId, handbookText, contractText, financialsText, securityText]
    );

    // 4. Create AI Workflows
    const wfRes = await client.query(
      `INSERT INTO ai_workflows (organization_id, created_by, name, system_prompt, target_department)
       VALUES 
       ($1, $2, 'Enterprise Contract Risk Analyzer', 'Execute rigorous contractual risk analysis, identifying indemnity exposure, liability caps, and termination penalties.', 'Legal & Compliance'),
       ($1, $2, 'Quarterly Financial Health Synthesizer', 'Synthesize financial statements, budget variances, and cost anomalies for executive quarterly review.', 'Finance & Accounting'),
       ($1, $2, 'Vendor SOC2 & Security Risk Assessor', 'Evaluate 3rd party vendor posture, encryption standards, and SLA uptime guarantees.', 'Operations & Supply Chain'),
       ($1, $2, 'HR Policy QA & Onboarding Plan Generator', 'Generate department-specific 30-60-90 day onboarding roadmap and verify policy alignment.', 'Human Resources')
       RETURNING id, name`,
      [orgId, adminId]
    );

    const contractWorkflowId = wfRes.rows.find((w) => w.name === 'Enterprise Contract Risk Analyzer')!.id;
    const finWorkflowId = wfRes.rows.find((w) => w.name === 'Quarterly Financial Health Synthesizer')!.id;

    // 5. Seed Pre-run Workflow Executions (Audit Log)
    const sampleRiskReport = {
      executiveSummary: "Contractual audit completed for Acme Corporation (Enterprise Cloud & AI Solutions). Identified favorable mutual indemnification and SLA uptime provisions with minor lead-time adjustments recommended.",
      overallRiskScore: 3,
      identifiedRisks: [
        {
          riskType: "Aggregate Liability Cap Alignment",
          severity: "LOW",
          description: "Liability is properly capped at 12 months trailing fees, which aligns with standard corporate risk thresholds.",
          remediationAction: "Standard legal sign-off approved."
        },
        {
          riskType: "Termination Notice Lead Time",
          severity: "MEDIUM",
          description: "30-day notice for convenience is standard, but ensure data export window is confirmed prior to contract termination.",
          remediationAction: "Append transition assistance SLA requirement."
        }
      ],
      complianceChecklist: [
        { requirement: "Mutual Limitation of Liability Cap Enforced", status: "PASS" },
        { requirement: "Enterprise Data Processing Addendum (DPA)", status: "PASS" },
        { requirement: "Standard 30-Day Termination Convenience Clause", status: "PASS" },
        { requirement: "Enterprise SLA (99.95%+) Guarantee & Credit Enforceability", status: "PASS" }
      ]
    };

    await client.query(
      `INSERT INTO workflow_executions 
       (workflow_id, executed_by, status, input_payload, ai_response, execution_time_ms, created_at)
       VALUES 
       ($1, $2, 'completed', $3, $4, 1140, NOW() - INTERVAL '2 hours'),
       ($5, $2, 'completed', $6, $4, 1420, NOW() - INTERVAL '5 hours')`,
      [
        contractWorkflowId,
        adminId,
        JSON.stringify({ inputData: contractText.substring(0, 400), targetDepartment: 'Legal & Compliance' }),
        JSON.stringify(sampleRiskReport),
        finWorkflowId,
        JSON.stringify({ inputData: financialsText.substring(0, 400), targetDepartment: 'Finance & Accounting' })
      ]
    );
  });
}

// Allow standalone execution via `npm run seed`
if (process.argv[1] && process.argv[1].endsWith("seed.ts")) {
  console.log("🚀 Running manual database seeding script...");
  runSeed()
    .then(() => {
      console.log("✅ Seeding script complete!");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}
