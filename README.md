# BrandProof
### Pre-Publication Brand Governance & Content Review Prototype

BrandProof is a minimal, polished, and calm brand-governance website prototype designed to help organisations review content drafts before public release against approved brand voice guidelines, audited facts, legal terminology, and visual asset standards.

---

## 1. Core Principles & Responsible Design

1. **Human-in-the-Loop Governance**: Findings are transparent recommendations, not automatic decisions. Content is **never silently rewritten or automatically published**.
2. **Deliberate Approval**: Reviewers must perform an explicit, conscious sign-off action certifying compliance before any draft is approved.
3. **Local Privacy by Design**: Uploaded image previews and draft texts remain strictly within the local browser session. No content is transmitted to external AI endpoints, third-party clouds, or unverified services.
4. **Transparent Deterministic Checks**: The underlying `DemoReviewEngine` uses transparent rule-based pattern matching against active Brand Kit entries, citing specific guideline IDs, source documents, and version dates for every finding.

---

## 2. Screens & User Flows

- **Dashboard**:
  - Welcome area explaining BrandProof purpose.
  - Review queue for items awaiting attention (`In Review` or `Changes Requested`).
  - Recent reviews history with status badges and findings summaries.
  - Recurring issues widget summarizing top compliance pitfalls.
  - Clear demo data disclaimers.

- **Brand Kit**:
  - Six editable sections: Brand Voice, Approved Terminology, Approved Facts, Restricted Claims, Accessibility Guidance (WCAG 2.2 AA), and Visual Assets.
  - Source citations, versions, and review dates on all standards.
  - Interactive toggles to enable or disable individual rules.
  - "Add Demo Guideline" modal to test custom terminology or restricted claims.

- **New Review**:
  - Content title and target publication channel selector (Blog, Social, Landing Page, Press Release, Newsletter).
  - Draft editor with live word and character counters.
  - Optional static image upload with local FileReader preview, accessibility alt-text input, and image removal option.
  - **"Try sample review"** button: instantly loads a realistic fictional product campaign draft containing intentional, subtle brand violations.

- **Review Detail**:
  - Interactive draft viewer with color-coded highlights for open findings.
  - "Revision Diff" tab highlighting original submitted text against current applied text.
  - Findings list displaying category, severity, flagged text, plain explanation, specific rule citation, and suggested correction.
  - Actions: **Apply Suggestion**, **Undo**, **Dismiss** (with rationale note), and **Comment**.
  - Reviewer workflow: **Request Changes** (with specific feedback note) and **Approve for Publication** (with deliberate confirmation modal).
  - Activity timeline recording every human action (submission, suggestion applied, comments, approval).

- **Insights**:
  - Compact overview of recurring issue categories and percentages.
  - "Potentially Unclear Guidelines" analysis highlighting rules with frequent triggers to guide brand team policy updates.
  - Labeled sample size and demo data attribution.

---

## 3. Technology Stack

- **Framework**: Next.js 15 (App Router, React 19)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 (calm, accessible light theme with indigo/slate palette)
- **Icons**: Lucide React
- **State**: React Context with localStorage persistence and full demo reset capabilities
- **Engine**: Deterministic `DemoReviewEngine` implementing the extensible `BrandReviewEngine` interface

---

## 4. Getting Started

### Development Server
From the workspace root or inside `brandproof`:
```bash
# From root
npm run dev

# Or directly in brandproof
cd brandproof
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```

### Run Verification Tests
```bash
npm test
```
The test suite executes `scripts/verify-engine.ts`, verifying that restricted claim detection, trademark casing, SLA fact checks, and image accessibility warnings behave deterministically.
