// ============================================
// NEURALOPS — WORKFLOW FLOWS & SIMULATOR
// ============================================

// ===== WORKFLOW FLOW DEFINITIONS =====
const FLOWS = {
  booking: {
    title: "Standard Booking Flow",
    steps: [
      {
        icon: "📞", color: "#4f6ef7", title: "Inbound Call Received",
        desc: "Customer calls. Inbound Call Agent answers instantly, detects intent as 'booking inquiry', classifies as potential lead.",
        agents: ["Agent 1: Inbound Call", "Agent 2: Style Adapt", "Agent 3: AI Identity Monitor"],
        outcome: "success", outcomeText: "Intent: Birthday Booking | Conf: 88%"
      },
      {
        icon: "⬡", color: "#4f6ef7", title: "Orchestrator Routes to Sales Chain",
        desc: "Orchestrator reads CCO, confirms intent, routes to Lead Qualification Agent. Conversation Style Agent wraps all communication.",
        agents: ["Central Orchestrator", "CCO State: active_lead"],
        outcome: "success", outcomeText: "Route: Lead Qualify → Conversion Predict"
      },
      {
        icon: "📋", color: "#ff5f2e", title: "Lead Qualification Captures Data",
        desc: "Lead Qualify Agent extracts: date = Oct 15, guests = 8, budget = ₹3000–5000, location = Pune. Scores lead at 74/100.",
        agents: ["Agent 5: Lead Qualify", "Agent 6: Conversion Predict"],
        outcome: "success", outcomeText: "Lead Score: 74 | Tier: WARM"
      },
      {
        icon: "⬆️", color: "#00c896", title: "Upsell & FOMO Triggered",
        desc: "Conversion score hits 81 after customer expresses excitement. Orchestrator triggers Upsell Agent. FOMO Agent fires: '2 Saturday slots remaining this month'.",
        agents: ["Agent 8: Upsell", "Agent 9: FOMO (inventory-verified)"],
        outcome: "success", outcomeText: "Upsell: Birthday Premium Package +₹800"
      },
      {
        icon: "📅", color: "#00c896", title: "Booking Agent Reserves Slot",
        desc: "Customer confirms. Booking Agent checks real-time availability, reserves Oct 15 7pm slot, creates booking record. SOLE write authority on slots.",
        agents: ["Agent 11: Booking"],
        outcome: "success", outcomeText: "Slot Reserved: Oct 15, 7pm | Booking #BK8821"
      },
      {
        icon: "💳", color: "#b14fff", title: "Payment Validation",
        desc: "WhatsApp Booking Agent sends payment link. Razorpay webhook fires. Payment Validation Agent confirms ₹4800 received. Triggers confirmation flow.",
        agents: ["Agent 14: WhatsApp", "Agent 12: Payment Validation"],
        outcome: "success", outcomeText: "Payment: ₹4800 ✓ | TXN #RZP992"
      },
      {
        icon: "🎉", color: "#00c896", title: "Post-Booking Experience Activated",
        desc: "Post-Booking Agent kicks in. Sends confirmation, maps, parking info, what-to-bring guide, and excitement-building videos over 5 days pre-arrival.",
        agents: ["Agent 18: Post-Booking Experience"],
        outcome: "success", outcomeText: "5-day pre-arrival sequence initiated"
      }
    ]
  },
  complaint: {
    title: "Customer Complaint Flow",
    steps: [
      {
        icon: "😠", color: "#ff5f2e", title: "Complaint Call — Emotional Spike Detected",
        desc: "Customer calls angry about a previous booking experience. Inbound Agent detects high frustration. Conflict Predictor fires: escalation risk 87/100.",
        agents: ["Agent 1: Inbound Call", "Agent 4: Conflict Predictor"],
        outcome: "warning", outcomeText: "Conflict Risk: 87 → Escalation path activated"
      },
      {
        icon: "⬡", color: "#4f6ef7", title: "Orchestrator Reroutes to Conflict Chain",
        desc: "Orchestrator reads conflict flag, bypasses sales agents entirely, routes directly to Conflict Resolution Agent. Emotional Monitor begins tracking.",
        agents: ["Central Orchestrator", "Agent 26: Emotional Monitor"],
        outcome: "warning", outcomeText: "Route: Conflict Resolution | Priority: HIGH"
      },
      {
        icon: "🤝", color: "#b14fff", title: "Conflict Resolution Agent — Level 1",
        desc: "Agent delivers empathy-first script, acknowledges issue, explains policy, offers resolution within authority: 20% credit on next booking.",
        agents: ["Agent 20: Conflict Resolution"],
        outcome: "warning", outcomeText: "Resolution attempt 1 | Customer: still unhappy"
      },
      {
        icon: "🔄", color: "#ff5f2e", title: "Second Attempt — Offer Upgraded",
        desc: "Resolution Agent escalates offer to free game upgrade + partial refund within policy limit. Customer still unsatisfied with explanation.",
        agents: ["Agent 20: Conflict Resolution"],
        outcome: "warning", outcomeText: "Resolution attempt 2 | HARD LIMIT: 2 attempts reached"
      },
      {
        icon: "🆙", color: "#b14fff", title: "Supervisor Escalation — Agent 21",
        desc: "After 2 failed attempts, Orchestrator mandatorily triggers Supervisor Agent. Advanced resolution attempted. Full refund capability within escalation authority.",
        agents: ["Agent 21: Supervisor Escalation", "Central Orchestrator"],
        outcome: "escalate", outcomeText: "Supervisor level | Refund approved: ₹800"
      },
      {
        icon: "👤", color: "#ff4d8d", title: "Human Operator Notification",
        desc: "QA Agent logs the interaction. Reporting Agent updates complaint metrics. Human manager gets post-resolution summary with coaching recommendations.",
        agents: ["Agent 25: QA", "Agent 24: Reporting", "Agent 23: Missed Opportunity"],
        outcome: "human", outcomeText: "Human review: recommended script update"
      }
    ]
  },
  abandoned: {
    title: "Abandoned Cart Recovery Flow",
    steps: [
      {
        icon: "🛒", color: "#f7c948", title: "Abandonment Detected",
        desc: "Customer started booking flow, reached payment page, then went inactive for 18 minutes. CCO status set to 'abandoned' by Booking Agent activity monitor.",
        agents: ["Agent 11: Booking (activity monitor)", "Central Orchestrator"],
        outcome: "warning", outcomeText: "CCO Status: ABANDONED | Inactivity: 18min"
      },
      {
        icon: "⬡", color: "#4f6ef7", title: "Orchestrator Triggers Recovery Chain",
        desc: "Orchestrator detects abandoned CCO flag. Callback Timing Optimizer predicts best re-engagement window. Abandoned Cart Agent activated.",
        agents: ["Central Orchestrator", "Agent 16: Callback Timer", "Agent 13: Cart Recovery"],
        outcome: "warning", outcomeText: "Best re-engage window: 45 minutes"
      },
      {
        icon: "💬", color: "#00c896", title: "WhatsApp Recovery Message (Attempt 1)",
        desc: "Cart Recovery Agent sends WhatsApp message via Agent 14: 'Your slot is still held! Complete your ₹4800 booking' with direct payment link. Friendly, not pushy.",
        agents: ["Agent 13: Cart Recovery", "Agent 14: WhatsApp"],
        outcome: "warning", outcomeText: "Message sent | Awaiting response"
      },
      {
        icon: "💳", color: "#ff5f2e", title: "Attempt 1 — No Response. Diagnose Issue.",
        desc: "30 minutes, no response. Recovery Agent diagnoses likely cause: payment friction (most common). Sends alternate payment method (UPI QR).",
        agents: ["Agent 13: Cart Recovery", "Agent 12: Payment (diagnosis)"],
        outcome: "warning", outcomeText: "Attempt 2: UPI alternative sent"
      },
      {
        icon: "✅", color: "#00c896", title: "Booking Recovered",
        desc: "Customer completes payment via UPI. Payment Validation Agent confirms. Booking confirmed. Post-booking sequence begins.",
        agents: ["Agent 12: Payment Validation", "Agent 11: Booking", "Agent 18: Post-Booking"],
        outcome: "success", outcomeText: "Recovery SUCCESS | Revenue recovered: ₹4800"
      }
    ]
  },
  upsell: {
    title: "Live Upsell Flow",
    steps: [
      {
        icon: "📊", color: "#ff5f2e", title: "Conversion Signal Detected",
        desc: "During booking call, Conversion Prediction Agent scores customer at 88/100. Signals: excitement language, no price objection, direct date commitment.",
        agents: ["Agent 6: Conversion Predict"],
        outcome: "success", outcomeText: "Conversion Score: 88 → HOT LEAD"
      },
      {
        icon: "⬡", color: "#4f6ef7", title: "Orchestrator Enables Upsell Window",
        desc: "Orchestrator checks: Is FOMO Agent active? No. Is Upsell Agent already triggered? No. Anti-spam gate: CLEAR. Enables upsell window.",
        agents: ["Central Orchestrator", "Anti-spam gate: CLEAR"],
        outcome: "success", outcomeText: "Upsell window: OPEN (anti-spam verified)"
      },
      {
        icon: "🎬", color: "#b14fff", title: "Live Preview Agent Sends Media",
        desc: "Live Experience Preview Agent sends birthday room walkthrough video to customer's WhatsApp while call continues. Creates visual excitement.",
        agents: ["Agent 19: Live Preview", "Agent 14: WhatsApp"],
        outcome: "success", outcomeText: "Video sent: Birthday Premium Room tour"
      },
      {
        icon: "⬆️", color: "#ff5f2e", title: "Upsell Agent Activates",
        desc: "Upsell Agent presents: Birthday Premium Package (dedicated host + birthday cake + extended time + photo booth). Value framing based on event type.",
        agents: ["Agent 8: Upsell"],
        outcome: "success", outcomeText: "Offer: +₹1200 premium package"
      },
      {
        icon: "✅", color: "#00c896", title: "Customer Accepts — Proposal Generated",
        desc: "Customer agrees. Proposal Generation Agent creates custom HTML proposal + WhatsApp-friendly invoice with full package details.",
        agents: ["Agent 10: Proposal Gen", "Agent 11: Booking (updated)"],
        outcome: "success", outcomeText: "Upsell converted | Total: ₹6000 (+₹1200)"
      }
    ]
  },
  failure: {
    title: "System Failure & Recovery Flow",
    steps: [
      {
        icon: "💥", color: "#ff5f2e", title: "Agent Crash — Booking Agent Fails",
        desc: "Customer is mid-booking flow. Booking Agent times out — external slot reservation API returns 503 error. Orchestrator catches failure immediately.",
        agents: ["Agent 11: Booking", "Central Orchestrator"],
        outcome: "escalate", outcomeText: "FAILURE: 503 on slot reservation API | Attempt 1"
      },
      {
        icon: "🔁", color: "#f7c948", title: "Retry #1 — Exponential Backoff",
        desc: "Orchestrator waits 2 seconds, retries Booking Agent with same parameters. QA Agent begins monitoring the failure event. Attempt 2.",
        agents: ["Central Orchestrator (retry engine)", "Agent 25: QA"],
        outcome: "warning", outcomeText: "Retry 1 (2s delay) | FAIL AGAIN: API still down"
      },
      {
        icon: "🔁", color: "#f7c948", title: "Retry #2 — Extended Backoff",
        desc: "Orchestrator waits 8 seconds. Attempts with fallback booking API endpoint. This is the final automated retry before human escalation.",
        agents: ["Central Orchestrator (retry engine)"],
        outcome: "warning", outcomeText: "Retry 2 (8s delay) | API restored"
      },
      {
        icon: "✅", color: "#00c896", title: "Retry #2 Succeeds",
        desc: "Fallback API endpoint responds. Booking Agent successfully reserves slot. Confidence score validated at 96%. Booking proceeds normally.",
        agents: ["Agent 11: Booking (fallback API)", "Agent 25: QA"],
        outcome: "success", outcomeText: "RECOVERY: Booking confirmed via fallback | Slot reserved"
      },
      {
        icon: "📋", color: "#00b4d8", title: "Failure Logged — QA & Reporting",
        desc: "QA Agent flags the API failure event. Reporting Agent logs it in SLA dashboard. Human ops team alerted about primary API instability.",
        agents: ["Agent 25: QA", "Agent 24: Reporting"],
        outcome: "human", outcomeText: "Alert sent: Primary booking API SLA breach"
      },
      {
        icon: "👤", color: "#ff4d8d", title: "Human Review — What if Retry 3 Also Failed?",
        desc: "If all 3 retries fail, Orchestrator queues the booking, sends customer 'We'll call you back in 5 mins', and pushes to human agent queue with full CCO context.",
        agents: ["Human Queue", "Agent 22: Human Assist"],
        outcome: "human", outcomeText: "Human handoff: Full CCO context delivered"
      }
    ]
  }
};

// ===== RENDER FLOW DISPLAY =====
function renderFlow(flowKey) {
  const flow = FLOWS[flowKey];
  if (!flow) return;

  const display = document.getElementById("flowDisplay");
  const outcomeColors = {
    success: "#00c896", warning: "#f7c948", escalate: "#ff5f2e", human: "#b14fff"
  };

  display.innerHTML = `
    <div style="margin-bottom:28px">
      <h3 style="font-family:var(--font-display);font-size:20px;font-weight:800;color:var(--text-primary)">${flow.title}</h3>
    </div>
    <div class="flow-diagram">
      ${flow.steps.map((step, i) => `
        <div class="flow-step">
          <div class="fs-icon-wrap" style="background:${step.color}18;border:1.5px solid ${step.color}30">
            <span>${step.icon}</span>
          </div>
          <div class="fs-body">
            <div class="fs-title" style="color:${step.color}">${i + 1}. ${step.title}</div>
            <div class="fs-desc">${step.desc}</div>
            <div class="fs-agents">
              ${step.agents.map(a => `<span class="fs-agent-tag">${a}</span>`).join("")}
            </div>
            <span class="fs-outcome ${step.outcome}">${step.outcomeText}</span>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

// Flow tab listeners
document.addEventListener("DOMContentLoaded", () => {
  renderFlow("booking");

  document.querySelectorAll(".ftab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".ftab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      renderFlow(tab.dataset.flow);
    });
  });
});

// ============================================
// LIVE SIMULATOR
// ============================================

const SIM_SCENARIOS = {
  birthday_hot_none: [
    { agent: "⬡ Central Orchestrator", desc: "Inbound event received. Loading CCO. Classifying intent...", status: "orch", conf: 95, delay: 400 },
    { agent: " Agent 1: Inbound Call", desc: "Call answered. Intent detected: Birthday party booking. Caller classified as prospective customer.", status: "ok", conf: 88, delay: 700 },
    { agent: " Agent 2: Style Adaptation", desc: "Detected: conversational tone, mid-vocabulary, enthusiastic. Adapting response style to match.", status: "ok", conf: 82, delay: 500 },
    { agent: " Agent 3: AI Identity Monitor", desc: "Monitoring... No suspicion signals detected. Confidence: 94%", status: "ok", conf: 94, delay: 400 },
    { agent: "⬡ Central Orchestrator", desc: "Routing to Sales chain. Anti-spam gates: CLEAR.", status: "orch", conf: 100, delay: 300 },
    { agent: " Agent 5: Lead Qualification", desc: "Capturing: Date=Oct 15, Guests=8, Budget=₹4000, Event=birthday. Lead score computed: 78/100.", status: "ok", conf: 85, delay: 800 },
    { agent: " Agent 6: Conversion Prediction", desc: "Excitement signals high. No objections. Urgency detected. Conversion probability: 89% → HOT LEAD", status: "ok", conf: 89, delay: 600 },
    { agent: "⬡ Central Orchestrator", desc: "HOT lead confirmed. Enabling Upsell window. Checking anti-spam gate...", status: "orch", conf: 100, delay: 300 },
    { agent: "⬆ Agent 8: Upsell", desc: "Presenting: Birthday Premium Package (+₹1200). Customer responds positively.", status: "ok", conf: 82, delay: 700 },
    { agent: " Agent 9: FOMO Conversion", desc: "Inventory check: 2 Saturday slots remaining in October. FOMO message sent (inventory-verified).", status: "ok", conf: 92, delay: 500 },
    { agent: " Agent 11: Booking Agent", desc: "Reserving slot: Oct 15, 7pm. Writing to booking system. Slot confirmed.", status: "ok", conf: 97, delay: 600 },
    { agent: " Agent 14: WhatsApp Booking", desc: "Sending payment link via WhatsApp for frictionless checkout.", status: "ok", conf: 90, delay: 400 },
    { agent: " Agent 12: Payment Validation", desc: "Payment received: ₹5200 (with premium package). Transaction validated. Confirmation triggered.", status: "ok", conf: 99, delay: 500 },
    { agent: " Agent 18: Post-Booking Experience", desc: "Pre-arrival sequence initiated: confirmation, map, parking, preparation guide. Excitement campaign live.", status: "ok", conf: 95, delay: 400 },
    { agent: " Agent 24: Reporting", desc: "Booking logged to dashboard. Revenue +₹5200. Lead conversion: success. SLA: met.", status: "ok", conf: 100, delay: 300 },
  ],
  birthday_warm_none: [
    { agent: "⬡ Central Orchestrator", desc: "Inbound event received. Loading CCO. Classifying intent...", status: "orch", conf: 95, delay: 400 },
    { agent: " Agent 1: Inbound Call", desc: "Call answered. Intent: Birthday inquiry. Hesitation detected — caller seems uncertain about date.", status: "ok", conf: 78, delay: 700 },
    { agent: " Agent 5: Lead Qualification", desc: "Partial capture: Guests=6, Budget unclear, Date TBD. Lead score: 51/100 → WARM.", status: "ok", conf: 72, delay: 800 },
    { agent: " Agent 6: Conversion Prediction", desc: "Conversion probability: 54%. Nurture path recommended. Not ready to book today.", status: "ok", conf: 68, delay: 600 },
    { agent: "⬡ Central Orchestrator", desc: "Warm lead detected. Routing to nurture chain. Sales agents held.", status: "orch", conf: 100, delay: 300 },
    { agent: " Agent 7: Objection Intelligence", desc: "Objection detected: 'need to check with friends'. Classification: social approval barrier.", status: "ok", conf: 76, delay: 500 },
    { agent: " Agent 10: Proposal Gen", desc: "Generating light proposal: WhatsApp-friendly package overview with pricing tiers.", status: "ok", conf: 84, delay: 600 },
    { agent: "⏱ Agent 16: Callback Optimizer", desc: "Analyzing engagement patterns. Optimal callback window: Tomorrow 11am–1pm.", status: "ok", conf: 71, delay: 400 },
    { agent: " Agent 17: Lead Nurture", desc: "Enrolling in nurture sequence: Day 1 proposal, Day 3 testimonials, Day 5 urgency nudge.", status: "ok", conf: 80, delay: 500 },
    { agent: " Agent 24: Reporting", desc: "Lead logged: WARM. Nurture sequence active. Callback scheduled.", status: "ok", conf: 100, delay: 300 },
  ],
  complaint_hot_none: [
    { agent: "⬡ Central Orchestrator", desc: "Inbound call. CCO lookup: returning customer, prior booking complaint flag.", status: "orch", conf: 95, delay: 400 },
    { agent: " Agent 1: Inbound Call", desc: "Call answered. High frustration detected immediately. Tone: angry. Intent: complaint.", status: "ok", conf: 82, delay: 600 },
    { agent: " Agent 4: Conflict Predictor", desc: "Escalation risk score: 91/100. Immediate routing change required.", status: "warn", conf: 91, delay: 400 },
    { agent: "⬡ Central Orchestrator", desc: "ALERT: Conflict risk 91. Bypassing sales chain. Routing direct to Conflict Resolution.", status: "orch", conf: 100, delay: 300 },
    { agent: " Agent 20: Conflict Resolution", desc: "Empathy-first script deployed. Acknowledging issue. Policy explanation. Offering 20% credit.", status: "ok", conf: 76, delay: 800 },
    { agent: " Agent 26: Emotional Monitor", desc: "Customer sentiment: still negative. Frustration: -0.72. Stamping timestamp.", status: "warn", conf: 70, delay: 500 },
    { agent: " Agent 20: Conflict Resolution", desc: "Attempt 2: Escalating offer to free upgrade + partial refund. Customer: partially satisfied.", status: "warn", conf: 72, delay: 700 },
    { agent: "⬡ Central Orchestrator", desc: "2 resolution attempts reached. Hard limit hit. Mandatory Supervisor escalation triggered.", status: "orch", conf: 100, delay: 300 },
    { agent: " Agent 21: Supervisor Escalation", desc: "High authority mode. Full refund authorized: ₹800. Customer satisfaction recovered.", status: "ok", conf: 85, delay: 700 },
    { agent: " Human Queue", desc: "Post-interaction summary sent to human manager. Coaching insight flagged.", status: "human", conf: 100, delay: 400 },
    { agent: " Agent 24: Reporting", desc: "Complaint resolved. Refund: ₹800. Resolution: 3 attempts. NPS impact logged.", status: "ok", conf: 100, delay: 300 },
  ],
  abandoned_hot_none: [
    { agent: "⬡ Central Orchestrator", desc: "CCO status changed to ABANDONED. Inactivity threshold reached: 18 minutes.", status: "orch", conf: 100, delay: 400 },
    { agent: " Agent 13: Cart Recovery", desc: "Abandonment confirmed. Diagnosing likely cause: payment friction (78% of cases).", status: "warn", conf: 75, delay: 600 },
    { agent: "⏱ Agent 16: Callback Optimizer", desc: "Optimal re-engagement: 45 minutes post-abandonment.", status: "ok", conf: 70, delay: 400 },
    { agent: " Agent 14: WhatsApp", desc: "Sending recovery message: 'Your slot is still held!' with direct payment link.", status: "ok", conf: 85, delay: 500 },
    { agent: " Agent 13: Cart Recovery", desc: "Attempt 1: No response after 30 min. Switching to UPI QR fallback.", status: "warn", conf: 68, delay: 700 },
    { agent: " Agent 14: WhatsApp", desc: "UPI QR code sent as alternative payment method.", status: "ok", conf: 88, delay: 400 },
    { agent: " Agent 12: Payment Validation", desc: "UPI payment received: ₹4800. Transaction validated.", status: "ok", conf: 99, delay: 500 },
    { agent: " Agent 11: Booking", desc: "Booking confirmed from recovery flow. Slot secured.", status: "ok", conf: 97, delay: 400 },
    { agent: " Agent 18: Post-Booking", desc: "Pre-arrival sequence activated.", status: "ok", conf: 95, delay: 300 },
    { agent: " Agent 24: Reporting", desc: "Recovery: SUCCESS. Revenue recovered: ₹4800. Recovery rate metric updated.", status: "ok", conf: 100, delay: 300 },
  ],
  birthday_hot_payment: [
    { agent: "⬡ Central Orchestrator", desc: "Inbound call. Hot lead confirmed. Booking flow initiated.", status: "orch", conf: 95, delay: 400 },
    { agent: " Agent 5: Lead Qualification", desc: "Lead qualified. Score: 82/100. Hot lead.", status: "ok", conf: 85, delay: 600 },
    { agent: " Agent 11: Booking", desc: "Slot reserved successfully. Awaiting payment.", status: "ok", conf: 97, delay: 500 },
    { agent: " Agent 12: Payment Validation", desc: "PAYMENT FAILURE: Razorpay webhook returned error. Transaction declined.", status: "fail", conf: 30, delay: 600 },
    { agent: "⬡ Central Orchestrator", desc: "Payment failure detected. Confidence: 30 (below threshold). Initiating recovery.", status: "orch", conf: 100, delay: 300 },
    { agent: " Agent 14: WhatsApp", desc: "Customer notified: 'Payment didn't go through. Trying again...' Slot held for 15 min.", status: "warn", conf: 80, delay: 500 },
    { agent: " Agent 12: Payment Validation", desc: "RETRY 1: Customer retries payment. New transaction initiated.", status: "warn", conf: 60, delay: 700 },
    { agent: " Agent 12: Payment Validation", desc: "Payment SUCCESS on retry. ₹5200 confirmed. Transaction validated.", status: "ok", conf: 99, delay: 500 },
    { agent: " Agent 11: Booking", desc: "Booking confirmed. Payment success logged.", status: "ok", conf: 97, delay: 400 },
    { agent: " Agent 18: Post-Booking", desc: "Pre-arrival sequence initiated.", status: "ok", conf: 95, delay: 300 },
  ],
  birthday_hot_agent_crash: [
    { agent: "⬡ Central Orchestrator", desc: "Hot lead confirmed. Routing to booking chain.", status: "orch", conf: 95, delay: 400 },
    { agent: " Agent 11: Booking", desc: "CRASH: External booking API returned 503 Service Unavailable.", status: "fail", conf: 0, delay: 600 },
    { agent: "⬡ Central Orchestrator", desc: "Agent failure detected. Initiating retry sequence. Attempt 1/3. Backoff: 2s.", status: "orch", conf: 100, delay: 800 },
    { agent: " Agent 11: Booking", desc: "RETRY 1: API still returning 503. Attempt failed.", status: "fail", conf: 0, delay: 700 },
    { agent: "⬡ Central Orchestrator", desc: "Retry 1 failed. Escalating backoff: 8s. Switching to fallback API endpoint. Attempt 2/3.", status: "orch", conf: 100, delay: 1200 },
    { agent: " Agent 11: Booking (fallback)", desc: "RETRY 2 via fallback endpoint: SUCCESS. Slot reserved.", status: "ok", conf: 94, delay: 600 },
    { agent: " Agent 25: QA/Validation", desc: "API failure event logged. Primary endpoint SLA breach flagged.", status: "warn", conf: 100, delay: 400 },
    { agent: " Agent 12: Payment Validation", desc: "Payment flow continues normally. ₹4800 validated.", status: "ok", conf: 99, delay: 500 },
    { agent: " Human Alert", desc: "Ops team notified: Primary booking API instability. Review required.", status: "human", conf: 100, delay: 400 },
    { agent: " Agent 24: Reporting", desc: "SLA dashboard updated. Retry event logged. Booking: SUCCESS via fallback.", status: "ok", conf: 100, delay: 300 },
  ],
  birthday_hot_conflict: [
    { agent: "⬡ Central Orchestrator", desc: "Hot lead. Booking chain activated.", status: "orch", conf: 95, delay: 400 },
    { agent: "  Agent 9: FOMO", desc: "FOMO signal: '2 slots remaining this weekend'", status: "ok", conf: 88, delay: 500 },
    { agent: " Agent 11: Booking", desc: "CONFLICT: Booking Agent says 'weekend is FULL'. FOMO Agent said '2 remaining'.", status: "fail", conf: 45, delay: 600 },
    { agent: "⬡ Central Orchestrator", desc: "CONFLICT DETECTED: Agent outputs contradict each other. Holding all downstream actions. Initiating conflict resolution protocol.", status: "orch", conf: 100, delay: 500 },
    { agent: " Agent 9: FOMO (re-query)", desc: "Re-queried: Inventory re-fetched. Result: Actually 0 slots this weekend. Prior data was stale.", status: "warn", conf: 52, delay: 700 },
    { agent: " Agent 11: Booking (re-query)", desc: "Booking confirmed: Weekend full. Confidence: 98%. Higher confidence wins.", status: "ok", conf: 98, delay: 600 },
    { agent: "⬡ Central Orchestrator", desc: "Conflict resolved: Higher confidence output (Booking Agent, 98%) accepted. Weekend shown as unavailable.", status: "orch", conf: 100, delay: 300 },
    { agent: " Agent 1: Inbound Call", desc: "Customer offered next available slot: Following Saturday. FOMO stale data incident logged.", status: "ok", conf: 90, delay: 500 },
    { agent: " Agent 25: QA", desc: "Conflict event logged. FOMO Agent data freshness issue flagged for engineering review.", status: "warn", conf: 100, delay: 400 },
    { agent: " Agent 11: Booking", desc: "Customer accepts next Saturday. Slot reserved successfully.", status: "ok", conf: 97, delay: 500 },
  ]
};

function getScenarioKey(intent, temp, failure) {
  const intentMap = { birthday: "birthday", corporate: "birthday", complaint: "complaint", abandoned: "abandoned" };
  const base = `${intentMap[intent] || "birthday"}_${temp}_${failure === "none" ? "none" : failure.replace("-", "_")}`;
  if (SIM_SCENARIOS[base]) return base;
  // fallback
  return `birthday_hot_none`;
}

function getStatusColor(status) {
  return {
    ok: "#00c896",
    warn: "#f7c948",
    fail: "#ff5f2e",
    human: "#b14fff",
    orch: "#4f6ef7"
  }[status] || "#8b95a6";
}

function buildCCO(intent, temp, step, events) {
  const intentMap = { birthday: "birthday_booking", corporate: "corporate_booking", complaint: "complaint", abandoned: "abandoned_checkout" };
  const tempMap = { hot: 82, warm: 54, cold: 28 };
  const statusMap = step < 3 ? "active" : step < events.length - 2 ? "in_progress" : "resolved";

  return {
    id: "cust_" + Math.floor(Math.random() * 9000 + 1000),
    intent: intentMap[intent] || "birthday_booking",
    lead_score: tempMap[temp] || 54,
    conversation_step: step + 1,
    last_agent: events[step]?.agent?.replace(/^[^A-Za-z]*/, "").split(":")[0] || "Orchestrator",
    status: statusMap,
    conf_score: events[step]?.conf || 80,
    retry_count: events[step]?.status === "fail" ? 1 : 0,
    human_review: events[step]?.status === "human" ? true : false,
    timestamp: new Date().toISOString()
  };
}

let simRunning = false;
let simTimeout = null;

document.addEventListener("DOMContentLoaded", () => {
  const runBtn = document.getElementById("runSimBtn");
  const resetBtn = document.getElementById("resetSimBtn");

  if (!runBtn) return;

  runBtn.addEventListener("click", () => {
    if (simRunning) return;

    const intent = document.getElementById("simIntent").value;
    const temp = document.getElementById("simTemp").value;
    const failure = document.getElementById("simFailure").value;

    const key = getScenarioKey(intent, temp, failure);
    const events = SIM_SCENARIOS[key];

    runSimulation(events, intent, temp);
  });

  resetBtn.addEventListener("click", () => {
    simRunning = false;
    if (simTimeout) clearTimeout(simTimeout);
    document.getElementById("simTimeline").innerHTML = `
      <div class="sim-placeholder">
        <div class="sp-icon">▶</div>
        <p>Run a simulation to see the agent workflow in action</p>
      </div>`;
    document.getElementById("ccoPre").textContent = `{
  "status": "waiting",
  "message": "Configure and run a simulation"
}`;
    document.getElementById("runSimBtn").disabled = false;
  });
});

function runSimulation(events, intent, temp) {
  simRunning = true;
  document.getElementById("runSimBtn").disabled = true;

  const timeline = document.getElementById("simTimeline");
  timeline.innerHTML = '<div style="font-family:var(--font-display);font-size:14px;font-weight:700;padding:8px 0;color:var(--text-muted)">⟳ Simulation running...</div>';

  let i = 0;

  function addEvent() {
    if (i >= events.length) {
      simRunning = false;
      document.getElementById("runSimBtn").disabled = false;
      // Add completion marker
      const done = document.createElement("div");
      done.style.cssText = "padding:16px;text-align:center;font-family:var(--font-display);font-size:13px;font-weight:700;color:#00c896;background:rgba(0,200,150,0.08);border-radius:10px;margin-top:8px;border:1px solid rgba(0,200,150,0.15)";
      done.textContent = "✓ Simulation Complete";
      timeline.appendChild(done);
      timeline.scrollTop = timeline.scrollHeight;
      return;
    }

    const ev = events[i];
    const color = getStatusColor(ev.status);
    const statusLabels = { ok: "✓ OK", warn: "⚠ WARN", fail: "✗ FAIL", human: "👤 HUMAN", orch: "⬡ ROUTE" };
    const confColor = ev.conf >= 80 ? "#00c896" : ev.conf >= 60 ? "#f7c948" : "#ff5f2e";

    const item = document.createElement("div");
    item.className = "sim-event";
    item.innerHTML = `
      <div class="se-dot-wrap">
        <div class="se-dot" style="background:${color}"></div>
        ${i < events.length - 1 ? '<div class="se-line"></div>' : ''}
      </div>
      <div class="se-body">
        <div class="se-agent se-status-${ev.status}">${ev.agent}</div>
        <div class="se-desc">${ev.desc}</div>
        <div class="se-meta">
          <span style="color:${color}">${statusLabels[ev.status] || "OK"}</span>
          <span class="se-conf-badge" style="background:${confColor}20;color:${confColor}">Conf: ${ev.conf}%</span>
        </div>
      </div>
    `;
    timeline.appendChild(item);
    timeline.scrollTop = timeline.scrollHeight;

    // Update CCO
    const cco = buildCCO(intent, temp, i, events);
    document.getElementById("ccoPre").textContent = JSON.stringify(cco, null, 2);

    i++;
    simTimeout = setTimeout(addEvent, ev.delay || 600);
  }

  addEvent();
}
