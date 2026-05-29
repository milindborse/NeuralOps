# NeuralOps — Multi‑Agent Workflow Ecosystem (Prototype)
Final Round Assignment Submission

NeuralOps is an **interactive prototype** that explains and demonstrates a production‑ready design for operating an escape room / entertainment venue using a **central orchestrator + 30 specialized agents**.

This README is written so that someone with **zero prior context** can understand the complete prototype purely by reading.

---

## Table of Contents

- [What This Prototype Is](#what-this-prototype-is)
- [What You See in the App (UI Walkthrough)](#what-you-see-in-the-app-ui-walkthrough)
- [Core Concepts (Glossary)](#core-concepts-glossary)
- [System Guarantees & Governance](#system-guarantees--governance)
- [Central Orchestrator (System Brain)](#central-orchestrator-system-brain)
- [Agent Catalog (All 30 Agents)](#agent-catalog-all-30-agents)
- [Workflow Flows (Trigger → Action Chains)](#workflow-flows-trigger--action-chains)
- [Edge Scenarios (Stress Tests)](#edge-scenarios-stress-tests)
- [Live Workflow Simulator](#live-workflow-simulator)
- [Suggested Demo Script (5–7 Minutes)](#suggested-demo-script-57-minutes)
- [System Design Patterns (Scalable Infrastructure)](#system-design-patterns-scalable-infrastructure)
- [4‑Phase Build Strategy (Roadmap)](#4-phase-build-strategy-roadmap)
- [Recommended Tech Stack (Implementation Blueprint)](#recommended-tech-stack-implementation-blueprint)
- [How to Run](#how-to-run)
- [Optional Hosting](#optional-hosting)

---

<a id="what-this-prototype-is"></a>

## What This Prototype Is

**NeuralOps is not “30 bots.”** It’s one coordinated ecosystem designed around a single control plane.

### Problem it solves
Escape rooms/venues face a messy operational reality:

- High inbound volume across calls/WhatsApp/web
- Leads that must be qualified quickly
- Bookings + slot inventory that must stay consistent
- Payment failures, abandoned checkouts, and follow‑up automation
- Complaints that can escalate fast
- Humans must remain in control for sensitive outcomes

### What we built (prototype scope)
This project is a **front‑end prototype** that demonstrates:

- A **central orchestration model** (routing, memory, retries, confidence gating, escalation, conflict resolution)
- A complete **catalog of 30 agents**, each with purpose, inputs/outputs, dependencies, authority, thresholds, and hard boundaries
- **5 workflow flows** (Booking, Complaint, Abandoned Cart, Upsell, Failure & Recovery)
- **6 edge scenarios** that stress test governance and reliability
- A **live simulator** that animates step‑by‑step agent activation and shows a real‑time **Customer Context Object (CCO)**
- A practical **roadmap** to build this in 4 phases
- A recommended **engineering stack** to implement it in production

### What it is not
To keep the assignment focused, this prototype does **not** include real integrations (telephony, WhatsApp API, payment gateway, CRM, booking system). Those are referenced in the tech blueprint section.

---

<a id="what-you-see-in-the-app-ui-walkthrough"></a>

## What You See in the App (UI Walkthrough)

The single page app is organized as a guided narrative. In order, it contains:

1. **Overview / Hero** — Animated node graph showing 30 agents orbiting the Orchestrator
2. **System Philosophy** — Why orchestration, confidence, retries, governance, and HITL matter
3. **Architecture Diagram** — Click any agent node to open its full definition
4. **Orchestrator Deep Dive** — 6 cards explaining routing, memory, retry logic, confidence gates, escalation matrix, and conflict resolution
5. **Agents Reference** — A filterable grid of all 30 agents; click to see full details
6. **Workflow Flows** — 5 tabbed “trigger → action chain” flows with outcomes
7. **System Design Patterns** — Event bus, state machine, validation gateway, parallel execution, LangGraph mapping + interactive demos
8. **Build Phases** — 4 phases (MVP → growth → retention → intelligence)
9. **Scenarios & Edge Cases** — Stress tests (failures, missing info, conflicts, human override, AI identity challenge)
10. **Governance Boundaries** — Hard stops, ownership rules, overlap management
11. **Live Simulator** — Configure intent + lead temperature + failure mode; watch an animated timeline + real‑time CCO
12. **Tech Stack** — 8 engineering layers with tool suggestions

---

<a id="core-concepts-glossary"></a>

## Core Concepts (Glossary)

### Agent
A specialized capability with:

- A clearly defined **purpose**
- Explicit **inputs** and **outputs**
- Declared **dependencies**
- A strict **authority boundary** (what it may decide or write)
- A minimum **confidence threshold** for its outputs to be accepted

### Central Orchestrator
The system brain that:

- Routes every inbound event to the correct workflow chain
- Manages shared memory (the CCO)
- Wraps every agent invocation with retry/backoff
- Enforces confidence thresholds and validation rules
- Detects and resolves agent conflicts
- Triggers human escalation when required

### Customer Context Object (CCO)
A shared, versioned customer state that all agents read/write through the Orchestrator.

Think of it as the single source of truth for:

- Identity and intent
- Lead score + temperature
- Booking status and timeline
- Payment state
- Agent outputs + confidence scores
- Escalations and human overrides

### Confidence Score
Every agent output carries a confidence (0–100). The Orchestrator enforces:

- **≥ 80**: proceed automatically
- **60–79**: verification loop
- **< 60**: human review (or safe fallback behavior)

### Human‑in‑the‑Loop (HITL)
Humans are not “backup”; they are a first‑class control layer.

The system defines explicit points where the safest action is to pause/route to human.

---

<a id="system-guarantees--governance"></a>

## System Guarantees & Governance

This ecosystem is designed to be safe and reliable by construction.

### Hard Stops — rules that must never be violated

- No agent can finalize a refund **> ₹500** without human approval
- AI Identity Monitor must **never deny being AI** after direct questioning
- FOMO agent must **never fabricate scarcity**; urgency messages must be inventory‑verified
- Payment agent must **not retry payment** without explicit customer re‑consent
- Upsell agent must **not add items** without explicit customer confirmation
- No agent can override a **human operator’s active session**

### Ownership boundaries (single‑writer principles)

- **Lead Qualification** owns lead scoring (Conversion Prediction reads, does not write)
- **Booking** is the sole writer for slot reservation/inventory
- **Payment Validation** is the sole writer for transaction status
- **Reporting** is read‑only and never triggers actions directly

### Overlap management

- FOMO and Upsell cannot trigger simultaneously (anti‑spam gate)
- Conflict Resolution gets two attempts; then Supervisor Escalation is mandatory
- Follow‑Up Automation and Lead Nurture are mutually exclusive based on CCO flags
- Style Adaptation is a wrapper layer and cannot change factual content

---

<a id="central-orchestrator-system-brain"></a>

## Central Orchestrator (System Brain)

The Central Orchestrator is responsible for **governance, coordination, and safety**.

### Responsibilities (high‑level)

- **Routing engine**: inbound event → intent → chain selection
- **Memory management**: CCO read/write and versioning
- **Retry engine**: up to 3 attempts with backoff; can switch to fallback endpoints
- **Confidence enforcement**: gate downstream actions
- **Escalation matrix**: route to supervisor/human on defined triggers
- **Conflict resolution**: detect contradictions and resolve using verification + confidence
- **Boundary enforcement**: block illegal actions by any agent

### Orchestrator rules (prototype thresholds)

- Confidence: ≥80 auto‑proceed; 60–79 verify; <60 human review
- Retry: Attempt 1 immediate → Attempt 2 after ~2s → Attempt 3 after ~8s (then human)

---

<a id="agent-catalog-all-30-agents"></a>

## Agent Catalog (All 30 Agents)

This catalog mirrors what you can click through inside the app, but is reproduced here so the design is fully understandable from the README alone.

**Format per agent:** Purpose → Inputs → Outputs → Dependencies → Authority → Min confidence → Hard boundaries → Tech tags.

### Layer: Frontline CX (Agents 01–04)

<details>
	<summary><strong>Agent 01 — Intelligent Inbound Call Agent</strong></summary>

	- Purpose: AI receptionist and first-contact sales responder; answers inbound calls, identifies intent, classifies caller type, dispatches to correct workflow.
	- Inputs: Inbound call audio; Caller ID; Time of call
	- Outputs: Structured call summary; Intent classification; Caller type tag; CCO entry
	- Dependencies: Central Orchestrator; Agent 2 (Style Adapt); Agent 5 (Lead Qualify)
	- Authority: Classify and route. No transactional authority.
	- Min confidence: 75%
	- Hard boundaries: Cannot promise pricing/availability/special packages; cannot close a booking directly.
	- Tech tags: STT; Intent NLP; Call Routing; CRM Write
</details>

<details>
	<summary><strong>Agent 02 — Communication Style Adaptation Agent</strong></summary>

	- Purpose: Wraps all AI-to-customer communication; adapts tone to language comfort, vocabulary level, emotional state.
	- Inputs: Live speech/text; prior conversation context
	- Outputs: Adapted tone; pacing config; language complexity setting
	- Dependencies: Agent 1 (Inbound Call); Agent 14 (WhatsApp); Central Orchestrator
	- Authority: Wrapper layer only.
	- Min confidence: 65%
	- Hard boundaries: Cannot change factual content; cannot override other agents.
	- Tech tags: Sentiment NLP; Tone Classifier; Realtime Adaptation
</details>

<details>
	<summary><strong>Agent 03 — AI Identity Suspicion Monitor</strong></summary>

	- Purpose: Detects if customers suspect or ask whether they’re talking to AI; flags for transparent disclosure or human takeover.
	- Inputs: Transcript stream; tone signals; keyword triggers
	- Outputs: Confidence score (0–100); tagged transcript; escalation flag
	- Dependencies: Agent 1 (Inbound Call); Central Orchestrator; Agent 21 (Supervisor Escalation)
	- Authority: Flag/report only.
	- Min confidence: 80%
	- Hard boundaries: Must never deny being AI after direct questioning; cannot suppress identity flags.
	- Tech tags: Trust Detection; Transcript Tagging; Ethics Guard
</details>

<details>
	<summary><strong>Agent 04 — Conflict Predictor Agent</strong></summary>

	- Purpose: Predicts escalation early using emotional and behavioral signals.
	- Inputs: Audio tone analysis; transcript sentiment; repeat-pattern detection
	- Outputs: Escalation risk score; recommended action (continue/transfer/soothe)
	- Dependencies: Agent 1 (Inbound); Agent 20 (Conflict Resolution); Central Orchestrator
	- Authority: Advisory; flags risk.
	- Min confidence: 70%
	- Hard boundaries: Cannot initiate human handoff directly; cannot fabricate emotional state.
	- Tech tags: Emotion AI; Risk Scoring; Proactive Escalation
</details>

### Layer: Sales Acceleration (Agents 05–10)

<details>
	<summary><strong>Agent 05 — Lead Qualification Agent</strong></summary>

	- Purpose: Captures lead parameters and builds CRM-ready lead object; owns lead scoring.
	- Inputs: Date/event type; guest count; age group; budget signals; location preference
	- Outputs: Structured lead object; lead score (0–100); CRM push
	- Dependencies: Agent 1 (Inbound); Agent 6 (Conversion Predict); CRM system
	- Authority: Full authority on lead data collection and scoring.
	- Min confidence: 80%
	- Hard boundaries: Cannot assume missing parameters; cannot share lead scores externally without Orchestrator approval.
	- Tech tags: Lead Capture; NLP Extraction; CRM Integration; Scoring
</details>

<details>
	<summary><strong>Agent 06 — Conversion Prediction Agent</strong></summary>

	- Purpose: Real-time conversion probability engine; classifies hot/warm/cold; recommends next action.
	- Inputs: CCO lead object; excitement signals; urgency markers; objection patterns
	- Outputs: Conversion probability; lead tier; recommended next agent
	- Dependencies: Agent 5 (Lead Qualify); Agent 7 (Objection Intel); Agent 15 (Follow-Up)
	- Authority: Advisory scoring.
	- Min confidence: 72%
	- Hard boundaries: Cannot override Agent 5’s base score; no direct customer contact.
	- Tech tags: Predictive Scoring; ML Model; Real-time Analytics
</details>

<details>
	<summary><strong>Agent 07 — Objection Intelligence Agent</strong></summary>

	- Purpose: Classifies objections and generates rebuttal suggestions; supports coaching and script optimization.
	- Inputs: Live transcript; objection keywords; historical objection data
	- Outputs: Objection type; root-cause analysis; suggested rebuttal; dashboard update
	- Dependencies: Agent 5 (Lead Qualify); Agent 22 (Human Assist); Agent 23 (Missed Opportunity)
	- Authority: Suggest only.
	- Min confidence: 68%
	- Hard boundaries: Cannot fabricate false claims; cannot modify pricing/offers.
	- Tech tags: Objection NLP; Sales Intelligence; Script Engine
</details>

<details>
	<summary><strong>Agent 08 — Upsell Agent</strong></summary>

	- Purpose: Presents contextual upsells based on event type, budget, and sentiment; designed to be non-spammy.
	- Inputs: Event type; budget signal; booking context; sentiment score
	- Outputs: Upsell offer; package recommendation; CCO upsell flag
	- Dependencies: Agent 5 (Lead Qualify); Agent 9 (FOMO); Agent 11 (Booking); Central Orchestrator
	- Authority: Recommend only; requires customer confirmation.
	- Min confidence: 75%
	- Hard boundaries: Cannot add items without explicit confirmation; cannot trigger simultaneously with FOMO.
	- Tech tags: Personalization; Revenue Optimization; Anti-Spam Gate
</details>

<details>
	<summary><strong>Agent 09 — FOMO Conversion Agent</strong></summary>

	- Purpose: Ethical urgency generator using real inventory data only.
	- Inputs: Real-time slot availability; peak-day flags; lead score threshold
	- Outputs: Urgency message; inventory-backed availability signal
	- Dependencies: Agent 11 (Booking); Agent 6 (Conversion Predict); Central Orchestrator
	- Authority: Read-only on inventory.
	- Min confidence: 90%
	- Hard boundaries: Cannot fabricate scarcity; cannot trigger if Upsell already active.
	- Tech tags: Inventory API; Ethical Urgency; Anti-Fabrication Guard
</details>

<details>
	<summary><strong>Agent 10 — Proposal Generation Agent</strong></summary>

	- Purpose: Generates personalized proposals and invoice-style artifacts suitable for WhatsApp.
	- Inputs: Lead object; package selection; customer/event details; pricing data
	- Outputs: Custom HTML proposal; WhatsApp proposal; PDF invoice; package sheet
	- Dependencies: Agent 5 (Lead Qualify); Agent 11 (Booking); Agent 30 (Dynamic Pricing)
	- Authority: Generate/format only.
	- Min confidence: 85%
	- Hard boundaries: Cannot deviate from pricing engine output; cannot send without Orchestrator approval.
	- Tech tags: Template Engine; PDF Gen; Rich Media; Personalization
</details>

### Layer: Booking & Revenue (Agents 11–14)

<details>
	<summary><strong>Agent 11 — Booking Agent</strong></summary>

	- Purpose: Reservation automation; checks availability, reserves slots, confirms booking, writes to booking system.
	- Inputs: Date/time preference; guest count; package selection; customer details
	- Outputs: Booking confirmation; slot reservation; confirmation message; CCO booking status
	- Dependencies: Agent 5 (Lead Qualify); Agent 12 (Payment); Agent 9 (FOMO)
	- Authority: Sole authority on slot reservation.
	- Min confidence: 95%
	- Hard boundaries: Requires explicit booking signal; cannot confirm without payment validation.
	- Tech tags: Booking API; Slot Management; Availability Check; CRM Write
</details>

<details>
	<summary><strong>Agent 12 — Payment Validation Agent</strong></summary>

	- Purpose: Payment lifecycle owner (success/failure/pending/reconciliation); triggers booking confirmation.
	- Inputs: Payment webhook; transaction ID; payment status
	- Outputs: Validation status; confirmation trigger; reconciliation flag
	- Dependencies: Agent 11 (Booking); Agent 13 (Cart Recovery); payment gateway (Razorpay/UPI)
	- Authority: Sole authority on transaction status.
	- Min confidence: 99%
	- Hard boundaries: Cannot retry failed payment without re-consent; cannot approve refunds > ₹500 without human review; no direct customer comms.
	- Tech tags: Payment API; Webhook Handler; Reconciliation; High Security
</details>

<details>
	<summary><strong>Agent 13 — Abandoned Cart Recovery Agent</strong></summary>

	- Purpose: Detects abandonment, waits intelligently, initiates recovery across channels.
	- Inputs: CCO booking status; last activity timestamp; inactivity threshold
	- Outputs: Recovery outreach message; payment issue diagnosis; recovery attempt log
	- Dependencies: Agent 12 (Payment); Agent 14 (WhatsApp); Agent 15 (Follow-Up); Central Orchestrator
	- Authority: Can initiate outreach.
	- Min confidence: 70%
	- Hard boundaries: Max 3 attempts; respect opt-out; cannot offer discounts without rules/approval.
	- Tech tags: Abandonment Detection; Multi-channel; Recovery Workflow
</details>

<details>
	<summary><strong>Agent 14 — WhatsApp Booking Agent</strong></summary>

	- Purpose: Moves booking from voice to WhatsApp for async checkout + payment.
	- Inputs: Lead object; booking intent signal; WhatsApp opt-in
	- Outputs: WhatsApp booking link; payment request message; async conversation flow
	- Dependencies: Agent 1 (Inbound); Agent 11 (Booking); Agent 12 (Payment); WhatsApp Business API
	- Authority: Channel management only.
	- Min confidence: 80%
	- Hard boundaries: Cannot initiate WhatsApp without opt-in; sequential with voice call (no parallel operation).
	- Tech tags: WhatsApp API; Async Checkout; Mobile Native; UPI Pay
</details>

### Layer: Follow‑Up & Nurture (Agents 15–17)

<details>
	<summary><strong>Agent 15 — Follow-Up Automation Agent</strong></summary>

	- Purpose: Follow-up sequences across call/WhatsApp/email; adapts to lead score and timing.
	- Inputs: Lead score; intent classification; response history; time-since-contact
	- Outputs: Scheduled follow-up; channel selection; message content; follow-up log
	- Dependencies: Agent 6 (Conversion Predict); Agent 16 (Callback Timer); Agent 17 (Lead Nurture)
	- Authority: Scheduling authority.
	- Min confidence: 72%
	- Hard boundaries: Mutually exclusive with Lead Nurture based on CCO flags.
	- Tech tags: Sequence Builder; Multi-channel; Adaptive Logic
</details>

<details>
	<summary><strong>Agent 16 — Callback Timing Optimizer</strong></summary>

	- Purpose: Predicts optimal callback time window per lead.
	- Inputs: Call timestamps; response times; timezone; engagement patterns
	- Outputs: Callback window; priority score; calendar slot recommendation
	- Dependencies: Agent 15 (Follow-Up); Central Orchestrator; calendar API
	- Authority: Recommends; Orchestrator approves.
	- Min confidence: 65%
	- Hard boundaries: No callbacks outside 9am–9pm local; cannot override human-set callback time.
	- Tech tags: Predictive Timing; ML Pattern; Calendar Integration
</details>

<details>
	<summary><strong>Agent 17 — Lead Nurture Agent</strong></summary>

	- Purpose: Long-term nurture for medium-intent leads (education, social proof, reminders).
	- Inputs: Lead score 30–70; event timeline; objection history; engagement data
	- Outputs: Nurture sequence; content selection; engagement report
	- Dependencies: Agent 6 (Conversion Predict); Agent 15 (Follow-Up); Agent 7 (Objection Intel)
	- Authority: Content/sequencing.
	- Min confidence: 68%
	- Hard boundaries: Must not run for high-intent leads; cannot send competing messages when Agent 15 is active.
	- Tech tags: Drip Campaign; Social Proof; Long-term Nurture
</details>

### Layer: Customer Experience (Agents 18–21)

<details>
	<summary><strong>Agent 18 — Post-Booking Experience Agent</strong></summary>

	- Purpose: Pre-arrival excitement + preparedness sequence (maps, parking, FAQs, what-to-expect).
	- Inputs: Confirmed booking data; booking date/time; guest profile
	- Outputs: Reminder messages; location info; preparation content; excitement builders
	- Dependencies: Agent 11 (Booking); Agent 12 (Payment); WhatsApp/Email API
	- Authority: Communication only.
	- Min confidence: 85%
	- Hard boundaries: Cannot message before payment confirmation; read-only on booking data.
	- Tech tags: Pre-arrival CX; Drip Messaging; Rich Media; WhatsApp
</details>

<details>
	<summary><strong>Agent 19 — Live Experience Preview Agent</strong></summary>

	- Purpose: Sends videos/images/testimonials in real-time during sales calls to accelerate decision.
	- Inputs: Active call context; interest signals; media library
	- Outputs: WhatsApp media push; testimonials; walkthrough links
	- Dependencies: Agent 1 (Inbound); Agent 14 (WhatsApp); Agent 8 (Upsell)
	- Authority: Media assist only.
	- Min confidence: 70%
	- Hard boundaries: Only during live sales; max 3 media items per 5 minutes; no post-booking media without Agent 18 trigger.
	- Tech tags: Real-time Media; Companion Agent; Anti-Spam Gate
</details>

<details>
	<summary><strong>Agent 20 — Conflict Resolution Agent</strong></summary>

	- Purpose: Handles complaints with empathy and policy clarity; level 1 resolution.
	- Inputs: Complaint transcript; history; policy database
	- Outputs: Resolution offer; apology; policy explanation; escalation flag
	- Dependencies: Agent 4 (Conflict Predictor); Agent 21 (Supervisor); Central Orchestrator
	- Authority: Can offer resolutions within policy.
	- Min confidence: 78%
	- Hard boundaries: Cannot promise full refunds beyond limits; must escalate after 2 failed attempts.
	- Tech tags: Empathy NLP; Policy Engine; De-escalation; Resolution
</details>

<details>
	<summary><strong>Agent 21 — Supervisor Escalation Agent</strong></summary>

	- Purpose: High-complexity fallback; senior AI support; prepares human handoff packets.
	- Inputs: Escalated CCO; prior attempts; severity score
	- Outputs: High-authority resolution; human handoff packet; escalation log
	- Dependencies: Agent 20 (Conflict Res); Agent 4 (Conflict Predictor); human queue
	- Authority: Highest AI authority.
	- Min confidence: 80%
	- Hard boundaries: Cannot override payment decisions; cannot make legal commitments; must hand off to human when uncertain.
	- Tech tags: High Authority; Human Handoff; Severity Assessment
</details>

### Layer: Human Augmentation (Agents 22–23)

<details>
	<summary><strong>Agent 22 — Human Agent Assistant</strong></summary>

	- Purpose: Real-time copilot for human agents (scripts, objection responses, availability, upsell prompts).
	- Inputs: Active human session; CCO data; live transcript
	- Outputs: Script overlay; objection library; availability view; upsell prompts
	- Dependencies: Agent 5 (Lead Qualify); Agent 7 (Objection Intel); Agent 11 (Booking); Human Agent UI
	- Authority: Suggests only; human decides.
	- Min confidence: 75%
	- Hard boundaries: Cannot speak to customers directly; cannot override humans; cannot write to CCO without human confirmation.
	- Tech tags: Copilot UI; Real-time Assist; Human-in-Loop
</details>

<details>
	<summary><strong>Agent 23 — Missed Opportunity Agent</strong></summary>

	- Purpose: Post-call analysis: why a lead should have converted but didn’t; coaching insights.
	- Inputs: Completed call logs; outcomes; CCO history
	- Outputs: Miss analysis; win/loss patterns; coaching recommendations; script gaps
	- Dependencies: Agent 6 (Conversion Predict); Agent 7 (Objection Intel); Agent 24 (Reporting)
	- Authority: Analytics only.
	- Min confidence: 70%
	- Hard boundaries: Read-only; cannot do outreach or customer-facing actions.
	- Tech tags: Post-call Analytics; Win/Loss Analysis; Coaching Insights
</details>

### Layer: Intelligence & Growth (Agents 24–30)

<details>
	<summary><strong>Agent 24 — Reporting Agent</strong></summary>

	- Purpose: Live dashboard for calls, conversion, bookings, revenue, AI resolution rate, SLA adherence, missed calls.
	- Inputs: Agent event logs; aggregate CCO; payment records
	- Outputs: Dashboard; reports; alert triggers; exports
	- Dependencies: All agents (read); Central Orchestrator; BI tool
	- Authority: Strict read-only.
	- Min confidence: 95%
	- Hard boundaries: Zero write permissions; alerts go to humans, not other agents.
	- Tech tags: Business Intelligence; Real-time Metrics; Read-Only
</details>

<details>
	<summary><strong>Agent 25 — Validation / QA Agent</strong></summary>

	- Purpose: Audits outputs for broken flows, misclassification, script path failures, hallucination risk.
	- Inputs: Agent outputs; expected schemas; confidence stream
	- Outputs: QA flags; failed flow alerts; hallucination tags; remediation recommendations
	- Dependencies: Central Orchestrator; Agent 24 (Reporting); all agents
	- Authority: Audit/flag only.
	- Min confidence: 85%
	- Hard boundaries: Cannot modify outputs already delivered to customers; flags route to Orchestrator/humans.
	- Tech tags: QA Audit; Hallucination Detection; Flow Validation
</details>

<details>
	<summary><strong>Agent 26 — Emotional Experience Monitor</strong></summary>

	- Purpose: Tracks happiness score timeline and dissatisfaction triggers; supports root-cause analysis.
	- Inputs: Transcripts; sentiment scores; NPS triggers
	- Outputs: Happiness timeline; dissatisfaction flags; time-stamped evidence
	- Dependencies: Agent 4 (Conflict Predictor); Agent 20 (Conflict Res); Agent 24 (Reporting)
	- Authority: Monitor/report only.
	- Min confidence: 72%
	- Hard boundaries: Cannot trigger customer-facing actions directly.
	- Tech tags: Sentiment Analytics; NPS Tracking; Happiness Score
</details>

<details>
	<summary><strong>Agent 27 — Website Conversion Optimization Agent</strong></summary>

	- Purpose: Finds website funnel drop-offs and UX friction; recommends improvements/A-B tests.
	- Inputs: Web analytics events; heatmaps; funnel analytics
	- Outputs: Friction map; drop-off analysis; recommendations; A/B test suggestions
	- Dependencies: Agent 24 (Reporting); analytics tools/APIs
	- Authority: Recommendations only.
	- Min confidence: 68%
	- Hard boundaries: Cannot deploy website changes automatically; requires human approval.
	- Tech tags: Web Analytics; UX Analysis; Funnel Optimization
</details>

<details>
	<summary><strong>Agent 28 — Reputation Management Agent</strong></summary>

	- Purpose: Monitors reviews/social mentions; drafts responses for human approval; flags urgent negatives.
	- Inputs: Reviews API; social listening feed; timestamps
	- Outputs: Sentiment alert; draft response; priority flag; trend report
	- Dependencies: Agent 24 (Reporting); Google Business/Social APIs
	- Authority: Draft only.
	- Min confidence: 80%
	- Hard boundaries: Cannot post responses without human approval; must escalate 1-star reviews.
	- Tech tags: Review Monitoring; Social Listening; Response Drafting
</details>

<details>
	<summary><strong>Agent 29 — Sales Forecasting Agent</strong></summary>

	- Purpose: Predicts booking volumes, demand spikes, and staffing needs.
	- Inputs: Booking history; lead pipeline; seasonality; event calendar
	- Outputs: Forecasts; demand spike alerts; staffing recommendations
	- Dependencies: Agent 24 (Reporting); Agent 30 (Dynamic Pricing); Agent 11 (Booking)
	- Authority: Forecast/recommend only.
	- Min confidence: 70%
	- Hard boundaries: Cannot adjust staffing/pricing directly.
	- Tech tags: Predictive Analytics; Demand Forecasting; Staffing Model
</details>

<details>
	<summary><strong>Agent 30 — Dynamic Pricing Agent</strong></summary>

	- Purpose: Revenue optimization via pricing recommendations based on demand/occupancy/seasonality.
	- Inputs: Occupancy; demand signals; competitor pricing; seasonal calendar
	- Outputs: Price recommendations; tier updates; optimization report
	- Dependencies: Agent 11 (Booking); Agent 29 (Forecast); Agent 24 (Reporting)
	- Authority: Recommends only.
	- Min confidence: 85%
	- Hard boundaries: Cannot change live pricing without human approval; requires Phase 4 data baseline.
	- Tech tags: Revenue Management; Demand Pricing; Phase 4 Only
</details>

---

<a id="workflow-flows-trigger--action-chains"></a>

## Workflow Flows (Trigger → Action Chains)

These flows are the “happy path + governance” stories that demonstrate how the ecosystem routes and recovers.

### 1) Standard Booking Flow

- Inbound call received → intent detected
- Orchestrator routes to sales chain
- Lead qualification extracts details and scores lead
- Conversion prediction updates temperature
- Upsell + FOMO may trigger (anti-spam guarded)
- Booking reserves slot (single writer)
- WhatsApp sends payment link; payment validates
- Post-booking experience starts; reporting logs success

### 2) Customer Complaint Flow

- Emotional spike detected + conflict risk flagged
- Orchestrator bypasses sales; routes to conflict chain
- Conflict Resolution (Agent 20) attempts up to 2 times
- Mandatory escalation to Supervisor (Agent 21)
- Human notified; reporting/QA updates dashboards

### 3) Abandoned Cart Recovery Flow

- Inactivity threshold reached; CCO state becomes “abandoned”
- Orchestrator triggers recovery chain
- Callback optimizer finds best window
- WhatsApp recovery message sent; then payment alternatives if needed
- Payment validation confirms; booking finalizes; reporting logs recovered revenue

### 4) Live Upsell Flow

- Conversion score becomes hot
- Orchestrator opens upsell window (checks anti-spam gates)
- Live preview sends media
- Upsell offer presented
- Proposal generated and booking updated (with explicit customer confirmation)

### 5) Failure & Recovery Flow

- Booking agent fails (API timeout/503)
- Orchestrator pauses downstream agents
- Retry #1 and #2 with backoff; optional fallback endpoint
- If all retries fail: human queue with full CCO context
- QA + reporting log SLA breach and recovery metrics

---

<a id="edge-scenarios-stress-tests"></a>

## Edge Scenarios (Stress Tests)

These are explicit “break the system” cases that prove governance works.

1. **Standard Happy Path: Birthday Booking** — normal booking + upsell + FOMO + confirmation + reporting
2. **Failure Handling: Agent Crash + Retry** — demonstrates retry engine + fallback + no silent failure
3. **Missing Information: Incomplete Lead** — gracefully routes to nurture rather than forcing booking
4. **Conflicting Agent Outputs** — FOMO vs Booking inventory disagreement; Orchestrator halts actions and resolves by re-query + confidence
5. **Human Override: Taken Over Mid‑Flow** — Orchestrator pauses AI agents; transfers full context; humans override always
6. **AI Identity Challenged** — mandatory transparency and optional immediate human takeover

---

<a id="live-workflow-simulator"></a>

## Live Workflow Simulator

The simulator is a guided “runtime animation” of the orchestration.

### Controls

- **Customer intent**: Birthday booking, Corporate outing, Complaint call, Abandoned checkout
- **Lead temperature**: Hot / Warm / Cold
- **Failure mode**: None / Payment failure / Agent crash / Agent conflict

### What the simulator shows

- A timeline of agent activations (including Orchestrator routing steps)
- Per-step **status** and **confidence**
- A live updating **CCO JSON** snapshot so you can see state change over time

### Status meanings

- **ROUTE (Orchestrator)**: routing, gating, and governance decisions
- **OK**: successful agent output accepted
- **WARN**: something risky (low confidence, retries, dissatisfaction)
- **FAIL**: tool/API failure or a blocked outcome
- **HUMAN**: human queue, human alert, or explicit override

### Recommended simulator combinations to demo

| Intent | Temperature | Failure | What it demonstrates |
|--------|-------------|---------|----------------------|
| Birthday | Hot | None | Happy path, upsell + FOMO + confirmation |
| Birthday | Warm | None | Nurture path, incomplete info handling |
| Complaint | Hot | None | Conflict chain, escalation thresholds |
| Abandoned | Hot | None | Cart recovery, multi-attempt outreach |
| Birthday | Hot | Payment failure | Payment anomaly + re-consent + recovery |
| Birthday | Hot | Agent crash | Retry engine + backoff + fallback endpoint |
| Birthday | Hot | Agent conflict | Conflict detection + re-query + confidence winner |

---

<a id="suggested-demo-script-57-minutes"></a>

## Suggested Demo Script (5–7 Minutes)

If you’re presenting this prototype to someone new:

1. **Open Overview**: “One brain, 30 agents, zero chaos.” Explain orchestrator concept.
2. **Click Architecture nodes**: open 2–3 agents (Inbound Call, Booking, Payment) and call out authority boundaries.
3. **Show governance**: scroll to boundaries (hard stops + ownership rules).
4. **Run Live Sim**: start with “Birthday / Hot / None”, then rerun “Agent crash” and “Agent conflict”.
5. **Show patterns**: briefly point to Event Bus + Validation Gateway as the production scaling path.
6. **Close with roadmap**: explain the 4 phases and why Dynamic Pricing is last.

---

<a id="system-design-patterns-scalable-infrastructure"></a>

## System Design Patterns (Scalable Infrastructure)

These patterns turn the agent list into a system that can run reliably.

### 1) Event Bus Architecture

- Agents communicate through publish/subscribe events
- Enables parallel fan-out after key events (e.g., booking.confirmed triggers post-booking + reporting + QA)
- Supports retries and dead-letter queues to isolate failures

### 2) State Machine Architecture

- Explicit lifecycle: Lead → Qualified → Proposal → Booking → Payment → Completed
- Orchestrator validates allowed transitions and logs “why” with evidence
- Prevents inconsistent states (e.g., completed without payment)

### 3) Validation Gateway

- Central validator for structured outputs + business rules + tool verification
- Converts agent suggestions into safe “patches” to apply to the CCO
- Stops hallucinations from becoming side effects

### 4) Parallel Agent Execution

- Run independent classifiers concurrently (identity, conflict risk, emotion, style)
- Merge results safely using an aggregator before committing state changes

### 5) LangGraph Mapping

- Direct mapping to a graph executor: state (CCO), nodes (agents/gateway), edges (routing), retries, and HITL

---

<a id="4-phase-build-strategy-roadmap"></a>

## 4‑Phase Build Strategy (Roadmap)

This is the recommended sequence to build the real system safely.

### Phase 1 — Core Nervous System (Weeks 1–4, MVP)

- Orchestrator + CCO + retries + basic frontline + booking + payment

### Phase 2 — Revenue Intelligence (Weeks 5–8)

- Conversion prediction, objections, upsell, FOMO, proposals, cart recovery, WhatsApp, follow-ups

### Phase 3 — Experience & Nurture (Weeks 9–12)

- Callback optimizer, nurture, post-booking delight, live preview, conflict resolution, supervisor, human assist, missed opportunity analysis

### Phase 4 — Intelligence Layer (Weeks 13–16)

- Reporting, QA/validation, emotional monitoring, website optimization, reputation, forecasting, dynamic pricing

---

<a id="recommended-tech-stack-implementation-blueprint"></a>

## Recommended Tech Stack (Implementation Blueprint)

This section describes a realistic implementation path for production.

- **Orchestration**: LangGraph / LangChain + custom FSM (retries + confidence)
- **LLM layer**: fast classifier + strong reasoner + fallback model (multi-model strategy)
- **Voice**: Twilio + real-time STT + natural TTS
- **Messaging**: WhatsApp Business API via BSP
- **Memory/state**: Redis (hot state) + Postgres (durable history) + vector DB (semantic recall)
- **CRM/booking**: HubSpot/Zoho + custom booking API
- **Payments**: Razorpay/UPI (webhook-driven validation)
- **Monitoring**: Langfuse traces + infra monitoring + error tracking

---

<a id="how-to-run"></a>

## How to Run

This prototype is a static web app (no build step).

### Option 1 — Double-click

1. Open this folder
2. Double-click `index.html`

### Option 2 — Local server (recommended)

Python:

```bash
python -m http.server 8080
# or on Windows:
py -m http.server 8080
```

Then open `http://localhost:8080`.

Node:

```bash
npx serve .
```

### Option 3 — VS Code

Use any local server extension (for example “Live Server”) and open `index.html`.

---

<a id="optional-hosting"></a>

## Optional Hosting

To share via a URL (e.g., with an interviewer):

1. Go to https://netlify.com → “Deploy manually”
2. Drag and drop the project folder
3. Share the generated URL

---

## Repository Structure

```
agent-workflow/
├── index.html
├── README.md
├── css/
│   └── styles.css
├── js/
│   ├── agents.js
│   ├── simulator.js
│   └── main.js
└── assets/
```

Built with HTML/CSS/Vanilla JS. No frameworks, no dependencies, no build pipeline.
