// ============================================
// NEURALOPS — 30 AGENT DEFINITIONS
// ============================================

const AGENT_DATA = [
  {
    id: 1, num: "01", name: "Intelligent Inbound Call Agent",
    layer: "cx", layerName: "Frontline CX",
    purpose: "AI receptionist and first-contact sales responder. Instantly answers all inbound calls, identifies intent, classifies caller type, and dispatches to correct workflow.",
    inputs: ["Inbound call audio", "Caller ID", "Time of call"],
    outputs: ["Structured call summary", "Intent classification", "Caller type tag", "CCO entry"],
    dependencies: ["Central Orchestrator", "Agent 2 (Style Adapt)", "Agent 5 (Lead Qualify)"],
    notDo: "Cannot make promises about pricing, availability, or special packages. Cannot close a booking directly — must hand off to Booking Agent.",
    confThreshold: 75,
    tags: ["STT", "Intent NLP", "Call Routing", "CRM Write"],
    authority: "Classify and route. No transactional authority."
  },
  {
    id: 2, num: "02", name: "Communication Style Adaptation Agent",
    layer: "cx", layerName: "Frontline CX",
    purpose: "Wraps all AI-to-customer communication to feel natural and human. Detects language comfort, accent, vocabulary level, emotional state, and adapts tone in real time.",
    inputs: ["Live speech/text", "Prior conversation context"],
    outputs: ["Adapted response tone", "Pacing config", "Language complexity setting"],
    dependencies: ["Agent 1 (Inbound Call)", "Agent 14 (WhatsApp)", "Central Orchestrator"],
    notDo: "Cannot change factual content of messages. Does not override other agents' outputs — only wraps them in appropriate style.",
    confThreshold: 65,
    tags: ["Sentiment NLP", "Tone Classifier", "Realtime Adaptation"],
    authority: "Wrapper layer. No decision authority."
  },
  {
    id: 3, num: "03", name: "AI Identity Suspicion Monitor",
    layer: "cx", layerName: "Frontline CX",
    purpose: "Detects when customers suspect or directly ask if they're talking to AI. Tracks hesitation patterns, direct questioning, and suspicious behavioral signals.",
    inputs: ["Transcript stream", "Tone signals", "Keyword triggers"],
    outputs: ["Confidence score (0–100)", "Tagged transcript", "Escalation flag"],
    dependencies: ["Agent 1 (Inbound Call)", "Central Orchestrator", "Agent 21 (Supervisor Escalation)"],
    notDo: "HARD STOP: Must NEVER deny being an AI after direct questioning. Cannot suppress or hide the identity flag from the Orchestrator.",
    confThreshold: 80,
    tags: ["Trust Detection", "Transcript Tagging", "Ethics Guard"],
    authority: "Flag and report only. Cannot decide to deceive."
  },
  {
    id: 4, num: "04", name: "Conflict Predictor Agent",
    layer: "cx", layerName: "Frontline CX",
    purpose: "Monitors real-time emotional state to predict escalation before it happens. Detects frustration, anger, repetitive objections, and emotional spikes.",
    inputs: ["Audio tone analysis", "Transcript sentiment", "Repeat pattern detection"],
    outputs: ["Escalation risk score", "Recommended action: continue/transfer/soothe"],
    dependencies: ["Agent 1 (Inbound)", "Agent 20 (Conflict Resolution)", "Central Orchestrator"],
    notDo: "Cannot initiate human handoff directly — must flag to Orchestrator which decides routing. Cannot fabricate emotional state from neutral signals.",
    confThreshold: 70,
    tags: ["Emotion AI", "Risk Scoring", "Proactive Escalation"],
    authority: "Advisory. Flags risk to Orchestrator for action."
  },
  {
    id: 5, num: "05", name: "Lead Qualification Agent",
    layer: "sales", layerName: "Sales Acceleration",
    purpose: "Captures all lead parameters through conversational flow and builds a structured CRM-ready lead object. Sole authority on lead score assignment.",
    inputs: ["Date/event type", "Guest count", "Age group", "Budget signals", "Location preference"],
    outputs: ["Structured lead object (JSON)", "Lead score 0–100", "CRM push"],
    dependencies: ["Agent 1 (Inbound)", "Agent 6 (Conversion Predict)", "CRM system"],
    notDo: "Cannot assume lead parameters not explicitly provided. Does not share lead scores externally without Orchestrator approval. Cannot modify scores assigned by the Conversion Prediction Agent.",
    confThreshold: 80,
    tags: ["Lead Capture", "NLP Extraction", "CRM Integration", "Scoring"],
    authority: "Full authority on lead data collection and scoring."
  },
  {
    id: 6, num: "06", name: "Conversion Prediction Agent",
    layer: "sales", layerName: "Sales Acceleration",
    purpose: "Live scoring engine that reads lead signals in real time and outputs conversion probability. Classifies leads as hot/warm/cold and recommends next action.",
    inputs: ["CCO lead object", "Excitement signals", "Urgency markers", "Objection patterns"],
    outputs: ["Conversion probability score", "Lead tier: hot/warm/cold", "Recommended next agent"],
    dependencies: ["Agent 5 (Lead Qualify)", "Agent 7 (Objection Intel)", "Agent 15 (Follow-Up)"],
    notDo: "Cannot override the Lead Qualification Agent's base lead score. Does not directly contact the customer — read-only on live call data.",
    confThreshold: 72,
    tags: ["Predictive Scoring", "ML Model", "Real-time Analytics"],
    authority: "Advisory scoring. No direct action authority."
  },
  {
    id: 7, num: "07", name: "Objection Intelligence Agent",
    layer: "sales", layerName: "Sales Acceleration",
    purpose: "Captures, classifies, and analyzes customer objections in real time. Builds a root-cause objection dashboard for sales coaching and script optimization.",
    inputs: ["Live transcript", "Objection keyword patterns", "Historical objection data"],
    outputs: ["Classified objection type", "Root cause analysis", "Suggested rebuttal", "Dashboard update"],
    dependencies: ["Agent 5 (Lead Qualify)", "Agent 22 (Human Assist)", "Agent 23 (Missed Opportunity)"],
    notDo: "Cannot fabricate rebuttals that make false claims. Does not modify pricing or offers — only suggests. Cannot override customer's stated objection classification.",
    confThreshold: 68,
    tags: ["Objection NLP", "Sales Intelligence", "Script Engine"],
    authority: "Suggests rebuttals. No authority to make commitments."
  },
  {
    id: 8, num: "08", name: "Upsell Agent",
    layer: "sales", layerName: "Sales Acceleration",
    purpose: "Dynamically identifies and presents upsell opportunities based on event type, budget signals, and conversation context. Triggers contextually, never spammily.",
    inputs: ["Event type", "Budget signal", "Booking context", "Sentiment score"],
    outputs: ["Contextual upsell offer", "Package recommendation", "CCO upsell flag"],
    dependencies: ["Agent 5 (Lead Qualify)", "Agent 9 (FOMO)", "Agent 11 (Booking)", "Central Orchestrator"],
    notDo: "HARD STOP: Cannot add items to any booking or cart without explicit customer confirmation. Cannot trigger simultaneously with FOMO Agent (anti-spam gate enforced by Orchestrator).",
    confThreshold: 75,
    tags: ["Personalization", "Revenue Optimization", "Anti-Spam Gate"],
    authority: "Recommend only. Customer confirmation required before any upsell is applied."
  },
  {
    id: 9, num: "09", name: "FOMO Conversion Agent",
    layer: "sales", layerName: "Sales Acceleration",
    purpose: "Uses real-time inventory data to create ethical, factual urgency signals. Triggers only when inventory data genuinely supports the claim.",
    inputs: ["Real-time slot availability", "Weekend/peak day flags", "Lead score threshold"],
    outputs: ["Urgency message", "Inventory-backed availability signal"],
    dependencies: ["Agent 11 (Booking)", "Agent 6 (Conversion Predict)", "Central Orchestrator"],
    notDo: "HARD STOP: Cannot fabricate or exaggerate inventory scarcity. Must only trigger when actual data supports the claim. Cannot trigger if Upsell Agent is already active in the same session.",
    confThreshold: 90,
    tags: ["Inventory API", "Ethical Urgency", "Anti-Fabrication Guard"],
    authority: "Read-only on inventory. Cannot write or modify slot data."
  },
  {
    id: 10, num: "10", name: "Proposal Generation Agent",
    layer: "sales", layerName: "Sales Acceleration",
    purpose: "Automatically builds custom, personalized proposals in HTML, WhatsApp-friendly format, invoices, brochures, and package sheets. Can embed rich media.",
    inputs: ["Lead object", "Package selection", "Customer name/event details", "Pricing data"],
    outputs: ["Custom HTML proposal", "WhatsApp proposal", "PDF invoice", "Package sheet"],
    dependencies: ["Agent 5 (Lead Qualify)", "Agent 11 (Booking)", "Agent 30 (Dynamic Pricing)"],
    notDo: "Cannot generate proposals with pricing that deviates from current pricing engine output. Does not send proposals without Orchestrator routing approval.",
    confThreshold: 85,
    tags: ["Template Engine", "PDF Gen", "Rich Media", "Personalization"],
    authority: "Generate and format only. Pricing sourced from Pricing Agent."
  },
  {
    id: 11, num: "11", name: "Booking Agent",
    layer: "booking", layerName: "Booking & Revenue",
    purpose: "End-to-end reservation automation. Checks availability, reserves slots, collects attendee details, confirms bookings, and writes to the booking system.",
    inputs: ["Date/time preference", "Guest count", "Package selection", "Customer details"],
    outputs: ["Booking confirmation", "Slot reservation", "Confirmation message", "CCO booking status"],
    dependencies: ["Agent 5 (Lead Qualify)", "Agent 12 (Payment)", "Agent 9 (FOMO)"],
    notDo: "Cannot reserve slots based on unconfirmed intent — requires explicit booking signal. Cannot proceed to confirmation without payment validation signal from Agent 12.",
    confThreshold: 95,
    tags: ["Booking API", "Slot Management", "Availability Check", "CRM Write"],
    authority: "SOLE AUTHORITY on slot reservation. No other agent can write to slot availability."
  },
  {
    id: 12, num: "12", name: "Payment Validation Agent",
    layer: "booking", layerName: "Booking & Revenue",
    purpose: "Handles the full payment lifecycle: success, failure, pending, and reconciliation. Triggers instant booking confirmation on successful payment.",
    inputs: ["Payment webhook", "Transaction ID", "Payment status"],
    outputs: ["Validation status", "Confirmation trigger", "Reconciliation flag"],
    dependencies: ["Agent 11 (Booking)", "Agent 13 (Cart Recovery)", "Payment Gateway (Razorpay/UPI)"],
    notDo: "HARD STOP: Cannot retry a failed payment without explicit customer re-consent. Cannot approve refunds > ₹500 without human review flag. Does not handle customer communication directly.",
    confThreshold: 99,
    tags: ["Payment API", "Webhook Handler", "Reconciliation", "High Security"],
    authority: "SOLE AUTHORITY on transaction status. Highest security classification."
  },
  {
    id: 13, num: "13", name: "Abandoned Cart Recovery Agent",
    layer: "booking", layerName: "Booking & Revenue",
    purpose: "Detects checkout abandonment after inactivity threshold, waits intelligently, and initiates multi-channel re-engagement to recover the booking.",
    inputs: ["CCO booking status", "Last activity timestamp", "Inactivity threshold"],
    outputs: ["Recovery outreach message", "Payment issue diagnosis", "CCO recovery attempt log"],
    dependencies: ["Agent 12 (Payment)", "Agent 14 (WhatsApp)", "Agent 15 (Follow-Up)", "Central Orchestrator"],
    notDo: "Cannot spam recovery messages — maximum 3 attempts across channels. Must respect opt-out signals. Cannot offer discounts without explicit approval from pricing rules.",
    confThreshold: 70,
    tags: ["Abandonment Detection", "Multi-channel", "Recovery Workflow"],
    authority: "Can initiate outreach. Cannot modify pricing or guarantee slots."
  },
  {
    id: 14, num: "14", name: "WhatsApp Booking Agent",
    layer: "booking", layerName: "Booking & Revenue",
    purpose: "Moves the booking journey from voice to WhatsApp for frictionless checkout. Enables async, mobile-native payment and confirmation flows.",
    inputs: ["Lead object", "Booking intent signal", "WhatsApp opt-in"],
    outputs: ["WhatsApp booking link", "Payment request message", "Async conversation flow"],
    dependencies: ["Agent 1 (Inbound)", "Agent 11 (Booking)", "Agent 12 (Payment)", "WhatsApp Business API"],
    notDo: "Cannot initiate WhatsApp without customer opt-in. Does not operate in parallel with an active voice call session — sequential only.",
    confThreshold: 80,
    tags: ["WhatsApp API", "Async Checkout", "Mobile Native", "UPI Pay"],
    authority: "Channel management only. Booking authority delegated to Agent 11."
  },
  {
    id: 15, num: "15", name: "Follow-Up Automation Agent",
    layer: "nurture", layerName: "Follow-Up & Nurture",
    purpose: "Orchestrates intelligent follow-up sequences across calls, WhatsApp, and email. Logic adapts based on intent score, lead score, and response timing.",
    inputs: ["Lead score", "Intent classification", "Response history", "Time-since-contact"],
    outputs: ["Scheduled follow-up", "Channel selection", "Message content", "CCO follow-up log"],
    dependencies: ["Agent 6 (Conversion Predict)", "Agent 16 (Callback Timer)", "Agent 17 (Lead Nurture)"],
    notDo: "Cannot run simultaneously with Lead Nurture Agent (15 handles high-intent, 17 handles medium — mutually exclusive via CCO booking status flag).",
    confThreshold: 72,
    tags: ["Sequence Builder", "Multi-channel", "Adaptive Logic"],
    authority: "Scheduling authority. Content subject to template library rules."
  },
  {
    id: 16, num: "16", name: "Callback Timing Optimizer",
    layer: "nurture", layerName: "Follow-Up & Nurture",
    purpose: "Predicts the optimal time to callback each lead based on prior responsiveness patterns, time-of-day behavior, and engagement signals.",
    inputs: ["Call history timestamps", "Response times", "Timezone", "Engagement patterns"],
    outputs: ["Optimal callback window", "Priority score", "Calendar slot recommendation"],
    dependencies: ["Agent 15 (Follow-Up)", "Central Orchestrator", "Calendar API"],
    notDo: "Cannot schedule callbacks outside 9am–9pm local time. Does not override a human agent's manually set callback time.",
    confThreshold: 65,
    tags: ["Predictive Timing", "ML Pattern", "Calendar Integration"],
    authority: "Recommends timing. Final scheduling requires Orchestrator approval."
  },
  {
    id: 17, num: "17", name: "Lead Nurture Agent",
    layer: "nurture", layerName: "Follow-Up & Nurture",
    purpose: "Runs long-term nurture campaigns for medium-intent leads who aren't ready to book. Uses reminders, offers, social proof, and educational content.",
    inputs: ["Lead score 30–70", "Event timeline", "Objection history", "Engagement data"],
    outputs: ["Nurture sequence", "Content selection", "Engagement report"],
    dependencies: ["Agent 6 (Conversion Predict)", "Agent 15 (Follow-Up)", "Agent 7 (Objection Intel)"],
    notDo: "Cannot run for high-intent leads (Agent 15 handles those). Must not send competing messages if Agent 15 is active in same CCO. Cannot make booking-confirmed promises.",
    confThreshold: 68,
    tags: ["Drip Campaign", "Social Proof", "Long-term Nurture"],
    authority: "Content and sequencing. No booking or pricing authority."
  },
  {
    id: 18, num: "18", name: "Post-Booking Experience Agent",
    layer: "exp", layerName: "Customer Experience",
    purpose: "Drives pre-arrival excitement and preparedness. Sends timely reminders, maps, parking info, FAQs, how-to videos, and what-to-expect content.",
    inputs: ["Confirmed booking data", "Booking date/time", "Guest profile"],
    outputs: ["Reminder messages", "Location/parking info", "Preparation content", "Excitement builders"],
    dependencies: ["Agent 11 (Booking)", "Agent 12 (Payment)", "WhatsApp/Email API"],
    notDo: "Cannot send any pre-arrival messages before payment confirmation. Does not modify booking details — read-only on booking data.",
    confThreshold: 85,
    tags: ["Pre-arrival CX", "Drip Messaging", "Rich Media", "WhatsApp"],
    authority: "Communication only. No booking modification rights."
  },
  {
    id: 19, num: "19", name: "Live Experience Preview Agent",
    layer: "exp", layerName: "Customer Experience",
    purpose: "During active sales calls, sends contextually relevant videos, images, walkthroughs, and testimonials to the prospect's WhatsApp in real time to accelerate decision.",
    inputs: ["Active call context", "Lead interest signals", "Media library"],
    outputs: ["Real-time WhatsApp media push", "Contextual testimonials", "Room walkthrough links"],
    dependencies: ["Agent 1 (Inbound)", "Agent 14 (WhatsApp)", "Agent 8 (Upsell)"],
    notDo: "Only activates during live sales conversations. Cannot send media post-booking without explicit trigger from Agent 18. Cannot send more than 3 media items in 5 minutes (anti-spam).",
    confThreshold: 70,
    tags: ["Real-time Media", "Companion Agent", "Anti-Spam Gate"],
    authority: "Send contextual media only. Does not write to CCO directly."
  },
  {
    id: 20, num: "20", name: "Conflict Resolution Agent",
    layer: "exp", layerName: "Customer Experience",
    purpose: "Handles customer complaints with empathy, clarity, and de-escalation. First line of resolution before Supervisor escalation.",
    inputs: ["Complaint transcript", "Customer history", "Policy database"],
    outputs: ["Resolution offer", "Apology message", "Policy explanation", "Escalation flag if needed"],
    dependencies: ["Agent 4 (Conflict Predictor)", "Agent 21 (Supervisor)", "Central Orchestrator"],
    notDo: "Cannot promise full refunds or compensation beyond defined policy limits. After 2 failed resolution attempts, MUST escalate to Agent 21 — cannot keep trying indefinitely.",
    confThreshold: 78,
    tags: ["Empathy NLP", "Policy Engine", "De-escalation", "Resolution"],
    authority: "Can offer resolutions within defined policy. Escalates beyond policy."
  },
  {
    id: 21, num: "21", name: "Supervisor Escalation Agent",
    layer: "exp", layerName: "Customer Experience",
    purpose: "Advanced fallback and high-complexity intervention layer. Acts as AI senior support when lower agents fail or when situation requires elevated authority.",
    inputs: ["Escalated CCO object", "Prior resolution attempts", "Customer complaint severity score"],
    outputs: ["High-authority resolution", "Human handoff packet", "Escalation log"],
    dependencies: ["Agent 20 (Conflict Res)", "Agent 4 (Conflict Predictor)", "Human Queue"],
    notDo: "Cannot override payment decisions. Cannot make legal commitments on behalf of the venue. When uncertain, MUST hand off to human — no further AI attempts.",
    confThreshold: 80,
    tags: ["High Authority", "Human Handoff", "Severity Assessment"],
    authority: "Highest AI authority. Direct path to human operator."
  },
  {
    id: 22, num: "22", name: "Human Agent Assistant",
    layer: "human", layerName: "Human Augmentation",
    purpose: "Real-time AI copilot for human sales agents. Provides live customer history, suggested scripts, objection responses, availability data, and upsell prompts in their dashboard.",
    inputs: ["Active human agent session", "CCO data", "Live conversation transcript"],
    outputs: ["Suggested script overlay", "Objection response library", "Availability data", "Upsell prompt"],
    dependencies: ["Agent 5 (Lead Qualify)", "Agent 7 (Objection Intel)", "Agent 11 (Booking)", "Human Agent UI"],
    notDo: "Cannot speak to customers directly. Does not override human agent decisions. Cannot write to CCO without human agent confirmation.",
    confThreshold: 75,
    tags: ["Copilot UI", "Real-time Assist", "Human-in-Loop"],
    authority: "Suggests only. Human has final say on all outputs."
  },
  {
    id: 23, num: "23", name: "Missed Opportunity Agent",
    layer: "human", layerName: "Human Augmentation",
    purpose: "Post-call analytics engine that identifies 'what should have converted but didn't.' Compares wins vs losses and outputs actionable coaching insights.",
    inputs: ["Completed call logs", "Conversion outcomes", "CCO history"],
    outputs: ["Miss analysis report", "Win/loss patterns", "Coaching recommendations", "Script gap analysis"],
    dependencies: ["Agent 6 (Conversion Predict)", "Agent 7 (Objection Intel)", "Agent 24 (Reporting)"],
    notDo: "Purely analytical — cannot initiate any outreach or customer-facing action. Read-only access to all data.",
    confThreshold: 70,
    tags: ["Post-call Analytics", "Win/Loss Analysis", "Coaching Insights"],
    authority: "Analytics only. Zero write permissions."
  },
  {
    id: 24, num: "24", name: "Reporting Agent",
    layer: "intel", layerName: "Intelligence & Analytics",
    purpose: "Live dashboard aggregating all operational metrics: total calls, conversion %, bookings, revenue, AI resolution rate, SLA adherence, and missed calls.",
    inputs: ["All agent event logs", "CCO aggregate data", "Payment records"],
    outputs: ["Real-time dashboard", "Period reports", "Alert triggers", "Exported CSV/PDF"],
    dependencies: ["All agents (read)", "Central Orchestrator", "BI Dashboard Tool"],
    notDo: "STRICT READ-ONLY — zero write permissions across entire system. Cannot trigger actions based on reports (alerts go to human operators, not other agents).",
    confThreshold: 95,
    tags: ["Business Intelligence", "Real-time Metrics", "Read-Only"],
    authority: "Read-only analytics. No action authority whatsoever."
  },
  {
    id: 25, num: "25", name: "Validation / QA Agent",
    layer: "intel", layerName: "Intelligence & Analytics",
    purpose: "Continuously audits agent outputs for failed flows, unexpected intent classification, broken script paths, and hallucination risks.",
    inputs: ["All agent outputs", "Expected output schema", "Confidence score stream"],
    outputs: ["QA flag", "Failed flow alert", "Hallucination risk tag", "Remediation recommendation"],
    dependencies: ["Central Orchestrator", "Agent 24 (Reporting)", "All agents"],
    notDo: "Cannot modify agent outputs after they've been delivered to customers. QA flags go to Orchestrator for retry or human review — not directly to other agents.",
    confThreshold: 85,
    tags: ["QA Audit", "Hallucination Detection", "Flow Validation"],
    authority: "Audit and flag only. No ability to modify delivered outputs."
  },
  {
    id: 26, num: "26", name: "Emotional Experience Monitor",
    layer: "intel", layerName: "Intelligence & Analytics",
    purpose: "Tracks customer happiness scores across interactions. Flags dissatisfaction, confusion, and frustration with timestamps for root-cause analysis.",
    inputs: ["All conversation transcripts", "Sentiment scores", "NPS triggers"],
    outputs: ["Happiness score timeline", "Dissatisfaction flags", "Time-stamped evidence"],
    dependencies: ["Agent 4 (Conflict Predictor)", "Agent 20 (Conflict Res)", "Agent 24 (Reporting)"],
    notDo: "Monitoring only — cannot trigger customer-facing actions directly. Feeds data to Conflict Predictor and Reporting agents rather than acting independently.",
    confThreshold: 72,
    tags: ["Sentiment Analytics", "NPS Tracking", "Happiness Score"],
    authority: "Monitor and report only."
  },
  {
    id: 27, num: "27", name: "Website Conversion Optimization Agent",
    layer: "intel", layerName: "Growth Intelligence",
    purpose: "Analyzes website behavior through analytics tools (Microsoft Clarity, GA4) to identify drop-offs, broken UX, and friction points. Outputs conversion improvement recommendations.",
    inputs: ["Web analytics events", "Heatmap data", "Funnel analytics"],
    outputs: ["Friction point map", "Drop-off analysis", "Conversion recommendations", "A/B test suggestions"],
    dependencies: ["Agent 24 (Reporting)", "Microsoft Clarity API", "Google Analytics API"],
    notDo: "Cannot automatically implement changes to the website. Recommendations require human approval before deployment.",
    confThreshold: 68,
    tags: ["Web Analytics", "UX Analysis", "Funnel Optimization"],
    authority: "Recommendations only. Zero write permissions on website."
  },
  {
    id: 28, num: "28", name: "Reputation Management Agent",
    layer: "intel", layerName: "Growth Intelligence",
    purpose: "Monitors Google reviews, social mentions, and public sentiment. Urgently flags negative reviews and drafts response options for human approval.",
    inputs: ["Google Reviews API", "Social listening feed", "Review timestamps"],
    outputs: ["Sentiment alert", "Draft response", "Priority flag", "Trend report"],
    dependencies: ["Agent 24 (Reporting)", "Google Business API", "Social API"],
    notDo: "Cannot post responses to reviews without human approval. Cannot engage in social media debates. Must escalate all 1-star reviews immediately to human team.",
    confThreshold: 80,
    tags: ["Review Monitoring", "Social Listening", "Response Drafting"],
    authority: "Draft only. Human posts all public responses."
  },
  {
    id: 29, num: "29", name: "Sales Forecasting Agent",
    layer: "intel", layerName: "Growth Intelligence",
    purpose: "Predicts future booking volumes, lead flow patterns, seasonal demand spikes, and staffing needs using historical data and current pipeline signals.",
    inputs: ["Booking history", "Lead pipeline", "Seasonal patterns", "Event calendar"],
    outputs: ["Weekly/monthly forecast", "Demand spike alerts", "Staffing recommendations"],
    dependencies: ["Agent 24 (Reporting)", "Agent 30 (Dynamic Pricing)", "Agent 11 (Booking)"],
    notDo: "Forecasting only — cannot adjust pricing or staffing directly. All recommendations require human review before operational changes.",
    confThreshold: 70,
    tags: ["Predictive Analytics", "Demand Forecasting", "Staffing Model"],
    authority: "Forecast and recommend. No operational authority."
  },
  {
    id: 30, num: "30", name: "Dynamic Pricing Agent",
    layer: "intel", layerName: "Growth Intelligence",
    purpose: "Optimizes revenue by adjusting pricing recommendations based on demand, occupancy, seasonality, and event timing. Phase 4 — requires real booking history to operate accurately.",
    inputs: ["Occupancy data", "Demand signals", "Competitor pricing", "Seasonal calendar"],
    outputs: ["Price recommendation", "Pricing tier update", "Revenue optimization report"],
    dependencies: ["Agent 11 (Booking)", "Agent 29 (Sales Forecast)", "Agent 24 (Reporting)"],
    notDo: "Cannot change live pricing without human approval. Cannot apply dynamic pricing until Phase 4 data baseline is established. Must maintain published pricing until override is confirmed.",
    confThreshold: 85,
    tags: ["Revenue Management", "Demand Pricing", "Phase 4 Only"],
    authority: "Recommends price changes. Requires human confirmation to implement."
  }
];

// Layer badge classes
const LAYER_BADGES = {
  cx: "cx",
  sales: "sales",
  booking: "booking",
  nurture: "nurture",
  exp: "exp",
  human: "human",
  intel: "intel"
};

const LAYER_COLORS = {
  cx: "#4f6ef7",
  sales: "#ff5f2e",
  booking: "#00c896",
  nurture: "#f7c948",
  exp: "#b14fff",
  human: "#ff4d8d",
  intel: "#00b4d8"
};

// ============================================
// RENDER AGENTS GRID
// ============================================
function renderAgents(filter = "all") {
  const grid = document.getElementById("agentsGrid");
  if (!grid) return;

  const filtered = filter === "all"
    ? AGENT_DATA
    : AGENT_DATA.filter(a => a.layer === filter);

  grid.innerHTML = filtered.map(agent => `
    <div class="agent-card" data-layer="${agent.layer}" data-agent="${agent.id}"
         onclick="openAgentModal(${agent.id})">
      <div class="ac-header">
        <span class="ac-num">Agent ${agent.num}</span>
        <span class="ac-badge ${LAYER_BADGES[agent.layer]}">${agent.layerName}</span>
      </div>
      <div class="ac-name">${agent.name}</div>
      <div class="ac-purpose">${agent.purpose.substring(0, 120)}...</div>
      <div class="ac-chips">
        ${agent.tags.slice(0,3).map(t => `<span class="ac-chip">${t}</span>`).join("")}
      </div>
      <div class="ac-footer">
        <div class="ac-conf">
          <span class="ac-conf-dot"></span>
          Min Confidence: ${agent.confThreshold}%
        </div>
        <span class="ac-view">View details →</span>
      </div>
    </div>
  `).join("");
}

// ============================================
// AGENT MODAL
// ============================================
function openAgentModal(agentId) {
  const agent = AGENT_DATA.find(a => a.id === agentId);
  if (!agent) return;

  const color = LAYER_COLORS[agent.layer];
  const modal = document.getElementById("modalContent");

  modal.innerHTML = `
    <div class="modal-agent-header">
      <div class="mah-num" style="background:${color}">${agent.num}</div>
      <div class="mah-info">
        <h2>${agent.name}</h2>
        <div class="mah-layer">${agent.layerName} Layer</div>
      </div>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Purpose</div>
      <p>${agent.purpose}</p>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Inputs</div>
      <div class="modal-chips">
        ${agent.inputs.map(i => `<span class="modal-chip">📥 ${i}</span>`).join("")}
      </div>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Outputs</div>
      <div class="modal-chips">
        ${agent.outputs.map(o => `<span class="modal-chip">📤 ${o}</span>`).join("")}
      </div>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Dependencies</div>
      <div class="modal-deps">
        ${agent.dependencies.map(d => `<span class="modal-dep">🔗 ${d}</span>`).join("")}
      </div>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Decision Authority</div>
      <p>${agent.authority}</p>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Confidence Threshold</div>
      <p>Minimum ${agent.confThreshold}% confidence required before output is accepted by Orchestrator. Below threshold triggers verification loop or human review.</p>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">🚫 Hard Boundaries — What This Agent Does NOT Do</div>
      <div class="modal-notdo">${agent.notDo}</div>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Tech Tags</div>
      <div class="modal-chips">
        ${agent.tags.map(t => `<span class="modal-chip" style="background:rgba(79,110,247,0.08);color:#4f6ef7;border-color:rgba(79,110,247,0.15)">⚡ ${t}</span>`).join("")}
      </div>
    </div>
  `;

  document.getElementById("modalOverlay").classList.add("open");
}

// Filter buttons
document.addEventListener("DOMContentLoaded", () => {
  renderAgents("all");

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderAgents(btn.dataset.filter);
    });
  });

  document.getElementById("modalClose").addEventListener("click", () => {
    document.getElementById("modalOverlay").classList.remove("open");
  });

  document.getElementById("modalOverlay").addEventListener("click", (e) => {
    if (e.target === document.getElementById("modalOverlay")) {
      document.getElementById("modalOverlay").classList.remove("open");
    }
  });
});
