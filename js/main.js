// ============================================
// NEURALOPS — MAIN JS
// Hero Canvas, Navigation, Scenarios, Misc
// ============================================

// ===== HERO CANVAS — ANIMATED NODE GRAPH =====
function initHeroCanvas() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const W = canvas.width;
  const H = canvas.height;
  const CX = W / 2;
  const CY = H / 2;

  const COLORS = ["#4f6ef7", "#ff5f2e", "#00c896", "#f7c948", "#b14fff", "#ff4d8d", "#00b4d8"];

  // Central node
  const centerNode = { x: CX, y: CY, r: 28, color: "#4f6ef7", label: "⬡", pulse: 0 };

  // Orbiting nodes (30 agents in 3 rings)
  const nodes = [];
  const rings = [
    { count: 8, radius: 100, agents: [1,2,3,4,5,6,7,8] },
    { count: 10, radius: 160, agents: [9,10,11,12,13,14,15,16,17,18] },
    { count: 12, radius: 210, agents: [19,20,21,22,23,24,25,26,27,28,29,30] }
  ];

  rings.forEach((ring, ri) => {
    for (let i = 0; i < ring.count; i++) {
      const angle = (i / ring.count) * Math.PI * 2 - Math.PI / 2;
      const colorIdx = Math.floor(i / ring.count * COLORS.length);
      nodes.push({
        x: CX + Math.cos(angle) * ring.radius,
        y: CY + Math.sin(angle) * ring.radius,
        baseAngle: angle,
        radius: ring.radius,
        speed: (ri + 1) * 0.0003 * (ri % 2 === 0 ? 1 : -1),
        currentAngle: angle,
        r: 7 - ri,
        color: COLORS[colorIdx % COLORS.length],
        ring: ri,
        active: false,
        activePulse: 0,
        agentId: ring.agents[i] || i
      });
    }
  });

  // Active signals
  const signals = [];
  let signalTimer = 0;

  function addSignal() {
    const nodeIdx = Math.floor(Math.random() * nodes.length);
    signals.push({
      fromX: nodes[nodeIdx].x,
      fromY: nodes[nodeIdx].y,
      toX: CX,
      toY: CY,
      progress: 0,
      color: nodes[nodeIdx].color,
      nodeIdx
    });
    nodes[nodeIdx].active = true;
    nodes[nodeIdx].activePulse = 1;
  }

  let animFrame;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Background subtle gradient
    const bgGrad = ctx.createRadialGradient(CX, CY, 0, CX, CY, 260);
    bgGrad.addColorStop(0, "rgba(79,110,247,0.06)");
    bgGrad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Ring circles
    [100, 160, 210].forEach((r, i) => {
      ctx.beginPath();
      ctx.arc(CX, CY, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(79,110,247,${0.08 - i * 0.02})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Update & draw signals
    for (let i = signals.length - 1; i >= 0; i--) {
      const s = signals[i];
      s.progress += 0.025;

      const px = s.fromX + (s.toX - s.fromX) * s.progress;
      const py = s.fromY + (s.toY - s.fromY) * s.progress;

      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = 1 - s.progress;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Trail
      ctx.beginPath();
      ctx.moveTo(s.fromX + (s.toX - s.fromX) * Math.max(0, s.progress - 0.15), s.fromY + (s.toY - s.fromY) * Math.max(0, s.progress - 0.15));
      ctx.lineTo(px, py);
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = (1 - s.progress) * 0.4;
      ctx.stroke();
      ctx.globalAlpha = 1;

      if (s.progress >= 1) {
        signals.splice(i, 1);
        centerNode.pulse = 0.8;
        nodes[s.nodeIdx].active = false;
      }
    }

    // Update node positions
    nodes.forEach(node => {
      node.currentAngle += node.speed;
      node.x = CX + Math.cos(node.currentAngle) * node.radius;
      node.y = CY + Math.sin(node.currentAngle) * node.radius;
      if (node.activePulse > 0) node.activePulse -= 0.02;
    });

    // Draw connections (active nodes to center)
    nodes.forEach(node => {
      if (node.active) {
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(CX, CY);
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 0.8;
        ctx.globalAlpha = 0.3;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      // Pulse ring if active
      if (node.activePulse > 0) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r + 6 * node.activePulse, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.globalAlpha = node.activePulse * 0.3;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      ctx.fillStyle = node.active ? node.color : node.color + "88";
      ctx.fill();

      // White border
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.6)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Center node
    if (centerNode.pulse > 0) {
      const pulseR = 28 + 20 * centerNode.pulse;
      const grad = ctx.createRadialGradient(CX, CY, 20, CX, CY, pulseR);
      grad.addColorStop(0, "rgba(79,110,247," + centerNode.pulse * 0.5 + ")");
      grad.addColorStop(1, "rgba(79,110,247,0)");
      ctx.beginPath();
      ctx.arc(CX, CY, pulseR, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      centerNode.pulse -= 0.02;
    }

    // Center glow
    const centerGrad = ctx.createRadialGradient(CX, CY, 0, CX, CY, 40);
    centerGrad.addColorStop(0, "#4f6ef7");
    centerGrad.addColorStop(0.6, "#3a58e8");
    centerGrad.addColorStop(1, "#2a48d8");
    ctx.beginPath();
    ctx.arc(CX, CY, 34, 0, Math.PI * 2);
    ctx.fillStyle = centerGrad;
    ctx.shadowColor = "#4f6ef7";
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Center label
    ctx.font = "bold 22px sans-serif";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("⬡", CX, CY);

    // Occasional signal emission
    signalTimer++;
    if (signalTimer > 40) {
      addSignal();
      signalTimer = 0;
    }

    animFrame = requestAnimationFrame(draw);
  }

  draw();

  return () => cancelAnimationFrame(animFrame);
}

// ===== SCENARIOS ACCORDION =====
const SCENARIOS_DATA = [
  {
    icon: "✅", color: "#00c896",
    title: "Standard Happy Path: Birthday Booking",
    sub: "High-intent customer, smooth booking, full payment",
    steps: [
      { text: "<strong>Trigger:</strong> Inbound call. Intent classified as birthday booking. Caller score: 78/100." },
      { text: "<strong>Agent 1</strong> greets, captures intent. <strong>Agent 2</strong> adapts tone to match enthusiasm." },
      { text: "<strong>Agent 5</strong> qualifies lead: date, count, budget extracted. Lead scored 78 → warm-hot boundary." },
      { text: "<strong>Agent 6</strong> sees excitement signals — score updates to 85 → HOT. Upsell window enabled by Orchestrator." },
      { text: "<strong>Agent 8 + 9</strong> trigger contextually. FOMO verified with real inventory. Upsell accepted." },
      { text: "<strong>Agent 11</strong> reserves slot. <strong>Agent 14</strong> sends WhatsApp payment link. <strong>Agent 12</strong> confirms payment." },
      { text: "<strong>Agent 18</strong> activates 5-day pre-arrival sequence. <strong>Agent 24</strong> logs to dashboard." }
    ]
  },
  {
    icon: "💥", color: "#ff5f2e",
    title: "Failure Handling: Agent Crash + Retry",
    sub: "Booking API fails mid-flow. Retry engine recovers automatically.",
    steps: [
      { text: "<strong>Trigger:</strong> Booking Agent (11) crashes — external API 503." },
      { text: "<strong>Orchestrator detects failure</strong> immediately via health check. All downstream agents PAUSED." },
      { text: "<strong>Retry 1:</strong> After 2s backoff. API still down. Failure logged by Agent 25 (QA)." },
      { text: "<strong>Retry 2:</strong> After 8s. Orchestrator switches to fallback API endpoint. SUCCESS." },
      { text: "Booking confirmed via fallback. Customer never knew there was an issue — conversation continued." },
      { text: "If Retry 3 had failed: Customer gets 'We'll call you right back in 5 min.' Human queue activated with full CCO." },
      { text: "<strong>Agent 25</strong> flags primary API SLA breach. <strong>Agent 24</strong> logs infrastructure alert. Ops team notified." }
    ]
  },
  {
    icon: "❓", color: "#f7c948",
    title: "Missing Information: Incomplete Lead",
    sub: "Customer can't provide key booking details. System adapts gracefully.",
    steps: [
      { text: "<strong>Trigger:</strong> Customer calls but says 'I'm just exploring, don't have a date yet.'" },
      { text: "<strong>Agent 5</strong> captures partial data. Lead score: 38/100 — below qualification threshold." },
      { text: "<strong>Orchestrator decision:</strong> No booking attempt. Route to nurture chain only." },
      { text: "<strong>Agent 10</strong> generates a light WhatsApp proposal with pricing overview — no specific date required." },
      { text: "<strong>Agent 7</strong> classifies objection: 'decision pending, no date'. Suggestion: social proof content." },
      { text: "<strong>Agent 17</strong> enrolls in 7-day nurture sequence: Day 1 intro, Day 3 testimonials, Day 5 limited offer." },
      { text: "When customer re-engages (clicks a link, replies), CCO re-activates and routes back to qualification." }
    ]
  },
  {
    icon: "⚡", color: "#b14fff",
    title: "Conflicting Agent Outputs",
    sub: "FOMO Agent and Booking Agent disagree on inventory. Orchestrator resolves.",
    steps: [
      { text: "<strong>Trigger:</strong> FOMO Agent (9) fires: '2 Saturday slots remaining.' Booking Agent (11) checks: 'Weekend: 0 slots.'" },
      { text: "<strong>Orchestrator detects conflict</strong> — two agents returning contradictory inventory states." },
      { text: "ALL downstream actions HALTED. Conflict resolution protocol initiated." },
      { text: "Both agents re-queried with fresh data. <strong>FOMO Agent</strong> re-fetches: was using 4-hour stale cache. Result: 0 slots." },
      { text: "<strong>Booking Agent</strong> re-confirms: 0 Saturday slots. Confidence: 98%. Higher confidence wins." },
      { text: "Customer informed: Saturday is full. Next available Saturday offered. Customer accepts." },
      { text: "<strong>Agent 25</strong> flags FOMO Agent cache staleness issue. Engineering ticket created. Cache TTL reduced to 10 min." }
    ]
  },
  {
    icon: "👤", color: "#4f6ef7",
    title: "Human Override: Agent Overridden Mid-Flow",
    sub: "Human operator takes over active AI session. System yields cleanly.",
    steps: [
      { text: "<strong>Trigger:</strong> Human agent monitoring dashboard sees customer is VIP with special pricing arrangement." },
      { text: "Human clicks 'Take Over' in Agent Assist (22) dashboard. Override request sent to Orchestrator." },
      { text: "<strong>Orchestrator immediately pauses all active agents</strong> for this CCO. No agent takes further action." },
      { text: "Full CCO context, conversation history, and suggested scripts transferred to Human Agent (22) UI in real time." },
      { text: "Human agent handles conversation with AI copilot providing live suggestions (Agent 22 reads-only, human decides)." },
      { text: "After call, human marks resolution. Orchestrator re-activates post-booking agents (18, 24) for confirmation flow." },
      { text: "Override logged in audit trail. Reporting dashboard notes human intervention timestamp and outcome." }
    ]
  },
  {
    icon: "🤔", color: "#ff4d8d",
    title: "AI Identity Challenged",
    sub: "Customer directly asks 'Are you a real person or a bot?'",
    steps: [
      { text: "<strong>Trigger:</strong> Customer says 'Wait, am I talking to a real person or a bot?'" },
      { text: "<strong>Agent 3 (AI Identity Monitor)</strong> fires immediately. Confidence score: 97. Direct questioning detected." },
      { text: "<strong>HARD RULE ENFORCED:</strong> Agent 3 raises mandatory flag to Orchestrator. CANNOT proceed without resolution." },
      { text: "Orchestrator has two options: (A) AI discloses identity transparently, (B) Route to human immediately." },
      { text: "Default behavior: AI transparently acknowledges: 'Yes, I'm an AI assistant for [Venue]. I can help with bookings and questions. Would you like to speak with a human team member instead?'" },
      { text: "If customer says yes → Immediate warm transfer to human agent with full CCO context. Zero hold time target." },
      { text: "If customer accepts AI → Conversation continues. Suspicion flag remains in CCO for duration of session." }
    ]
  }
];

function initScenarios() {
  const container = document.getElementById("scenariosAccordion");
  if (!container) return;

  container.innerHTML = SCENARIOS_DATA.map((sc, idx) => `
    <div class="scenario-item" id="scenario-${idx}">
      <div class="scenario-header" onclick="toggleScenario(${idx})">
        <div class="sh-left">
          <div class="sh-icon" style="background:${sc.color}18;border:1px solid ${sc.color}25">
            <span>${sc.icon}</span>
          </div>
          <div>
            <div class="sh-title">${sc.title}</div>
            <div class="sh-sub">${sc.sub}</div>
          </div>
        </div>
        <span class="sh-chevron">▼</span>
      </div>
      <div class="scenario-body">
        ${sc.steps.map((step, si) => `
          <div class="sb-step">
            <div class="sb-num" style="background:${sc.color}">${si + 1}</div>
            <div class="sb-text">${step.text}</div>
          </div>
        `).join("")}
      </div>
    </div>
  `).join("");
}

function toggleScenario(idx) {
  const item = document.getElementById(`scenario-${idx}`);
  if (!item) return;
  item.classList.toggle("open");
}

// ===== NAV ACTIVE STATE =====
function initNavScroll() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link[href^='#']");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  }, { threshold: 0.3, rootMargin: "-64px 0px 0px 0px" });

  sections.forEach(s => observer.observe(s));
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const animTargets = document.querySelectorAll(".phil-card, .orch-detail-card, .phase-card, .tech-card, .agent-card");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animTargets.forEach((el, i) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = `opacity 0.4s ease ${(i % 6) * 0.06}s, transform 0.4s ease ${(i % 6) * 0.06}s`;
    observer.observe(el);
  });
}

// ===== ORCHESTRATOR NODE INTERACTION =====
function initOrchNode() {
  const node = document.getElementById("orchestrator-node");
  if (!node) return;

  node.addEventListener("click", () => {
    openAgentModal(0); // Show orchestrator info
  });
}

// Special orchestrator modal (not in AGENT_DATA)
const origOpenModal = window.openAgentModal;
window.openAgentModal = function(id) {
  if (id === 0) {
    const modal = document.getElementById("modalContent");
    modal.innerHTML = `
      <div class="modal-agent-header">
        <div class="mah-num" style="background:#4f6ef7;font-size:22px">⬡</div>
        <div class="mah-info">
          <h2>Central Orchestrator Agent</h2>
          <div class="mah-layer">Core System — All Layers</div>
        </div>
      </div>
      <div class="modal-section">
        <div class="modal-section-title">Purpose</div>
        <p>The brain of the entire ecosystem. Every event, every agent call, every failure, and every escalation routes through the Orchestrator. It owns routing, memory, retry logic, confidence score enforcement, conflict resolution, and human escalation.</p>
      </div>
      <div class="modal-section">
        <div class="modal-section-title">Core Responsibilities</div>
        <div class="modal-chips">
          <span class="modal-chip">🔀 Event Routing</span>
          <span class="modal-chip">🧠 CCO Memory Mgmt</span>
          <span class="modal-chip">🔁 Retry Engine (3x + backoff)</span>
          <span class="modal-chip">📊 Confidence Enforcement</span>
          <span class="modal-chip">⚡ Conflict Detection</span>
          <span class="modal-chip">🛡️ Anti-spam Gates</span>
          <span class="modal-chip">👤 Human Escalation</span>
          <span class="modal-chip">🔒 Agent Boundary Enforcement</span>
        </div>
      </div>
      <div class="modal-section">
        <div class="modal-section-title">Confidence Score Rules</div>
        <p>≥80: Auto-proceed downstream | 60–79: Trigger verification loop | &lt;60: Queue for human review | Agent crash (0): Immediate retry sequence</p>
      </div>
      <div class="modal-section">
        <div class="modal-section-title">Retry Logic</div>
        <p>Attempt 1 → immediate. Attempt 2 → 2s backoff. Attempt 3 → 8s backoff + fallback endpoint. After 3 failures → human queue with full CCO context.</p>
      </div>
      <div class="modal-section">
        <div class="modal-section-title">🚫 Hard Boundaries</div>
        <div class="modal-notdo">The Orchestrator does NOT make customer-facing decisions itself — it routes to agents. It cannot override a human operator's active session. It does not store persistent memory (uses CCO + Redis). It cannot modify agent logic or prompts at runtime.</div>
      </div>
      <div class="modal-section">
        <div class="modal-section-title">Suggested Implementation</div>
        <p>LangGraph for stateful agent graph management + custom Python FSM for retry/confidence logic + Redis for hot CCO state + Langfuse for observability traces.</p>
      </div>
    `;
    document.getElementById("modalOverlay").classList.add("open");
    return;
  }
  origOpenModal(id);
};

// ===== ANODE CLICKS =====
function initAnodeClicks() {
  document.querySelectorAll(".anode[data-agent]").forEach(el => {
    el.addEventListener("click", () => {
      const agentId = parseInt(el.dataset.agent);
      if (agentId) openAgentModal(agentId);
    });
  });
}

// ===== CONFIDENCE BAR ANIMATION =====
function initConfBars() {
  const bars = document.querySelectorAll(".conf-fill");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // bars already have width set via inline CSS
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  bars.forEach(b => observer.observe(b));
}

// ===== PATTERN VISUALS (INTERACTIVE) =====
function initPatternVisuals() {
  const tabsWrap = document.getElementById("patternVisualTabs");
  const diagramEl = document.getElementById("patternVisualDiagram");
  const logEl = document.getElementById("patternVisualLog");
  const runBtn = document.getElementById("runPatternDemoBtn");
  const resetBtn = document.getElementById("resetPatternDemoBtn");
  const statusEl = document.getElementById("patternVisualStatus");

  if (!tabsWrap || !diagramEl || !logEl || !runBtn || !resetBtn || !statusEl) return;

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const nowMs = () => (typeof performance !== "undefined" && performance.now) ? performance.now() : Date.now();

  const state = {
    pattern: "event-bus",
    running: false,
    t0: 0,
  };

  const patterns = {
    "event-bus": {
      label: "Event Bus",
      base: () => ({ producer: "idle", outbox: "idle", bus: "idle", cA: "idle", cB: "idle", dlq: "idle", human: "idle" }),
      render: (s) => {
        const b = (name, v) => {
          const m = { idle: "  ", active: ">>", ok: "OK", fail: "!!" };
          return `[${m[v] || "  "}] ${name}`;
        };
        return [
          `${b("Producer (BookingConfirmed)", s.producer)}  ──▶  ${b("Outbox (CCO+event)", s.outbox)}  ──▶  ${b("Event Bus", s.bus)}`,
          `                                   │`,
          `                                   ├──▶  ${b("Consumer A (Post-Booking)", s.cA)}`,
          `                                   ├──▶  ${b("Consumer B (Reporting)", s.cB)}`,
          `                                   └──▶  ${b("DLQ", s.dlq)}  ──▶  ${b("Human Queue", s.human)}`,
          ``,
          `Notes: consumer B fails once → retry → DLQ → human review`,
        ].join("\n");
      },
      steps: [
        { ms: 300, msg: "Emit booking.confirmed (idempotency_key=BK8821:confirmed)", apply: (s) => { s.producer = "active"; } },
        { ms: 450, msg: "Write CCO patch + outbox record (atomic)", apply: (s) => { s.producer = "ok"; s.outbox = "active"; } },
        { ms: 450, msg: "Publish event to bus: topic=booking.confirmed", apply: (s) => { s.outbox = "ok"; s.bus = "active"; } },
        { ms: 400, msg: "Fan-out: start Consumer A and B in parallel", apply: (s) => { s.bus = "ok"; s.cA = "active"; s.cB = "active"; } },
        { ms: 550, msg: "Consumer A OK: schedule pre-arrival sequence", apply: (s) => { s.cA = "ok"; } },
        { ms: 450, msg: "Consumer B FAIL: downstream DB timeout → retry backoff", apply: (s) => { s.cB = "fail"; } },
        { ms: 500, msg: "Max retries hit → route message to DLQ", apply: (s) => { s.dlq = "active"; } },
        { ms: 450, msg: "DLQ triage → create human ticket with trace_id", apply: (s) => { s.dlq = "ok"; s.human = "active"; } },
        { ms: 350, msg: "Human review queued (no customer impact)", apply: (s) => { s.human = "ok"; } },
      ]
    },

    "state-machine": {
      label: "State Machine",
      base: () => ({ stage: "lead", invalid: false }),
      render: (s) => {
        const stages = ["lead", "qualified", "proposal", "booking", "payment", "completed"];
        const show = stages.map(st => {
          if (st === s.stage) return `[*${st.toUpperCase()}*]`;
          return `[ ${st} ]`;
        }).join(" → ");
        const warn = s.invalid ? "\n\nINVALID transition detected → rejected (state unchanged)" : "";
        return `${show}${warn}`;
      },
      steps: [
        { ms: 400, msg: "Start: state=lead", apply: () => {} },
        { ms: 450, msg: "Agent 5 proposes lead → qualified (evidence: intent + budget)", apply: (s) => { s.stage = "qualified"; } },
        { ms: 500, msg: "Agent 10 generates proposal → proposal state committed", apply: (s) => { s.stage = "proposal"; } },
        { ms: 500, msg: "Agent 11 reserves slot → booking", apply: (s) => { s.stage = "booking"; } },
        { ms: 550, msg: "Agent 12 verifies payment webhook → payment", apply: (s) => { s.stage = "payment"; } },
        { ms: 500, msg: "Attempt invalid jump: lead → completed (blocked by Orchestrator)", apply: (s) => { s.invalid = true; } },
        { ms: 600, msg: "Orchestrator commits payment → completed", apply: (s) => { s.invalid = false; s.stage = "completed"; } },
      ]
    },

    "validation-gateway": {
      label: "Validation Gateway",
      base: () => ({ agent: "idle", schema: "idle", rules: "idle", tools: "idle", decision: "idle", result: "" }),
      render: (s) => {
        const b = (name, v) => {
          const m = { idle: "  ", active: ">>", ok: "OK", fail: "!!" };
          return `[${m[v] || "  "}] ${name}`;
        };
        const tail = s.result ? `\n\nDecision: ${s.result}` : "";
        return [
          `${b("Agent Output (JSON+confidence)", s.agent)}`,
          `   └─▶ ${b("Schema Validation", s.schema)}`,
          `       └─▶ ${b("Business Rules", s.rules)}`,
          `           └─▶ ${b("Tool Verification", s.tools)}`,
          `               └─▶ ${b("Decision", s.decision)}`,
          tail
        ].join("\n");
      },
      steps: [
        { ms: 350, msg: "Agent 9 proposes: ‘Only 2 slots left’ (confidence=72)", apply: (s) => { s.agent = "active"; } },
        { ms: 450, msg: "Schema OK: required fields present", apply: (s) => { s.agent = "ok"; s.schema = "active"; } },
        { ms: 450, msg: "Rules check: scarcity claims require inventory proof", apply: (s) => { s.schema = "ok"; s.rules = "active"; } },
        { ms: 550, msg: "Tool call: inventory API timeout → cannot verify", apply: (s) => { s.rules = "ok"; s.tools = "fail"; } },
        { ms: 500, msg: "Decision: RETRY with constraints (no scarcity claim)", apply: (s) => { s.decision = "active"; s.result = "RETRY (remove unverified scarcity claim)"; } },
        { ms: 550, msg: "Retry output validated → APPROVE patched message", apply: (s) => { s.tools = "ok"; s.decision = "ok"; s.result = "APPROVE (safe customer message + trace logged)"; } },
      ]
    },

    "parallel-execution": {
      label: "Parallel Execution",
      base: () => ({ snap: "idle", a: "idle", b: "idle", c: "idle", agg: "idle", gate: "idle", commit: "idle" }),
      render: (s) => {
        const b = (name, v) => {
          const m = { idle: "  ", active: ">>", ok: "OK", fail: "!!" };
          return `[${m[v] || "  "}] ${name}`;
        };
        return [
          `${b("Load CCO snapshot vN", s.snap)}`,
          ``,
          `Parallel agents:`,
          `  ├─ ${b("Agent 3 Identity Monitor", s.a)}`,
          `  ├─ ${b("Agent 4 Conflict Predictor", s.b)}`,
          `  └─ ${b("Agent 26 Emotional Monitor", s.c)}`,
          ``,
          `${b("Aggregator merge", s.agg)}  ──▶  ${b("Validation Gateway", s.gate)}  ──▶  ${b("Commit patch vN+1", s.commit)}`,
        ].join("\n");
      },
      steps: [
        { ms: 350, msg: "Read-only snapshot loaded: CCO@v41", apply: (s) => { s.snap = "active"; } },
        { ms: 350, msg: "Kick off 3 classifiers in parallel", apply: (s) => { s.snap = "ok"; s.a = "active"; s.b = "active"; s.c = "active"; } },
        { ms: 550, msg: "Identity OK (AI disclosure safe)", apply: (s) => { s.a = "ok"; } },
        { ms: 550, msg: "Conflict risk=low (no escalation)", apply: (s) => { s.b = "ok"; } },
        { ms: 550, msg: "Emotion=anxious → tone=calm + reassurance", apply: (s) => { s.c = "ok"; } },
        { ms: 450, msg: "Aggregator merges patches + picks next agent route", apply: (s) => { s.agg = "active"; } },
        { ms: 450, msg: "Gateway approves merged patch", apply: (s) => { s.agg = "ok"; s.gate = "active"; } },
        { ms: 450, msg: "Commit CCO patch v42 + emit context.updated", apply: (s) => { s.gate = "ok"; s.commit = "ok"; } },
      ]
    },

    "langgraph": {
      label: "LangGraph Path",
      base: () => ({ node: "start" }),
      render: (s) => {
        const nodes = [
          "START",
          "validate_input",
          "parallel_classifiers",
          "router",
          "lead_qualify",
          "validation_gateway",
          "booking_reserve",
          "payment_validate",
          "validation_gateway",
          "post_booking",
          "END",
        ];
        const active = s.node;
        const lines = nodes.map((n) => {
          const key = n.toLowerCase();
          if (key === active) return `▶ ${n}`;
          return `  ${n}`;
        });
        return lines.join("\n");
      },
      steps: [
        { ms: 350, msg: "Graph start", apply: (s) => { s.node = "start"; } },
        { ms: 450, msg: "Node: validate_input", apply: (s) => { s.node = "validate_input"; } },
        { ms: 550, msg: "Node: parallel_classifiers (style/identity/conflict)", apply: (s) => { s.node = "parallel_classifiers"; } },
        { ms: 450, msg: "Node: router (intent=booking)", apply: (s) => { s.node = "router"; } },
        { ms: 550, msg: "Node: lead_qualify", apply: (s) => { s.node = "lead_qualify"; } },
        { ms: 550, msg: "Node: validation_gateway", apply: (s) => { s.node = "validation_gateway"; } },
        { ms: 500, msg: "Node: booking_reserve", apply: (s) => { s.node = "booking_reserve"; } },
        { ms: 550, msg: "Node: payment_validate", apply: (s) => { s.node = "payment_validate"; } },
        { ms: 550, msg: "Node: validation_gateway (pre-side-effect commit)", apply: (s) => { s.node = "validation_gateway"; } },
        { ms: 450, msg: "Node: post_booking", apply: (s) => { s.node = "post_booking"; } },
        { ms: 400, msg: "Graph end", apply: (s) => { s.node = "end"; } },
      ]
    }
  };

  const getActivePattern = () => patterns[state.pattern] || patterns["event-bus"];

  const setStatus = (txt) => {
    statusEl.textContent = txt;
  };

  const clearLog = () => {
    logEl.innerHTML = "";
  };

  const log = (msg) => {
    const t = state.t0 ? (nowMs() - state.t0) : 0;
    const timeStr = `T+${(t / 1000).toFixed(2)}s`;
    const line = document.createElement("div");
    line.className = "pv-logline";
    const time = document.createElement("div");
    time.className = "pv-logtime";
    time.textContent = timeStr;
    const text = document.createElement("div");
    text.className = "pv-logmsg";
    text.textContent = msg;
    line.appendChild(time);
    line.appendChild(text);
    logEl.appendChild(line);
    logEl.scrollTop = logEl.scrollHeight;
  };

  let renderState = getActivePattern().base();

  const render = () => {
    const p = getActivePattern();
    diagramEl.textContent = p.render(renderState);
  };

  const setPattern = (patternKey) => {
    if (!patterns[patternKey]) return;
    if (state.running) return;
    state.pattern = patternKey;
    renderState = getActivePattern().base();
    clearLog();
    setStatus("Ready");
    render();
  };

  const setDisabled = (disabled) => {
    tabsWrap.querySelectorAll(".pv-tab").forEach(b => (b.disabled = disabled));
    runBtn.disabled = disabled;
  };

  const updateTabsUI = () => {
    tabsWrap.querySelectorAll(".pv-tab").forEach(btn => {
      const active = btn.dataset.pattern === state.pattern;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
    });
  };

  tabsWrap.addEventListener("click", (e) => {
    const btn = e.target.closest(".pv-tab");
    if (!btn) return;
    setPattern(btn.dataset.pattern);
    updateTabsUI();
  });

  resetBtn.addEventListener("click", () => {
    if (state.running) return;
    renderState = getActivePattern().base();
    clearLog();
    setStatus("Ready");
    render();
  });

  runBtn.addEventListener("click", async () => {
    if (state.running) return;

    state.running = true;
    state.t0 = nowMs();
    clearLog();
    setDisabled(true);
    setStatus("Running…");
    updateTabsUI();

    const p = getActivePattern();
    renderState = p.base();
    render();

    try {
      for (const step of p.steps) {
        step.apply(renderState);
        render();
        log(step.msg);
        await sleep(step.ms);
      }
      setStatus("Done");
    } finally {
      state.running = false;
      setDisabled(false);
      updateTabsUI();
    }
  });

  // Initial paint
  render();
  updateTabsUI();
}

// ===== INIT ALL =====
document.addEventListener("DOMContentLoaded", () => {
  initHeroCanvas();
  initScenarios();
  initNavScroll();
  initOrchNode();
  initAnodeClicks();
  initConfBars();
  initPatternVisuals();

  // Delay scroll animations slightly to let DOM settle
  setTimeout(initScrollAnimations, 100);
});
