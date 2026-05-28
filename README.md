# NeuralOps — Multi-Agent Workflow Ecosystem
## Final Round Assignment Submission

---

## 🚀 What's Inside

This is a **complete interactive web application** showcasing a 30-agent AI ecosystem design for an escape room / entertainment venue.

### Files
```
neuralops/
├── index.html           # Main application
├── css/
│   └── styles.css       # All styles
├── js/
│   ├── agents.js        # 30 agent definitions + modal
│   ├── simulator.js     # Live workflow simulator + flows
│   └── main.js          # Canvas, navigation, scenarios
└── README.md
```

---

## ✅ How to Run (Manual Steps)

### Option 1 — Just Double-Click (Simplest)
1. Extract the ZIP file to any folder
2. Double-click `index.html`
3. Opens in your default browser — works immediately, no server needed

### Option 2 — Local Server (Recommended for best experience)
If you have Python installed:
```bash
cd neuralops
python3 -m http.server 8080
# Then open: http://localhost:8080
```

If you have Node.js:
```bash
cd neuralops
npx serve .
# Then open the URL shown
```

### Option 3 — VS Code
1. Open the folder in VS Code
2. Install "Live Server" extension
3. Right-click `index.html` → "Open with Live Server"

---

## 🌐 For Online Hosting (Optional)
To share with the interviewer via a URL:
1. Go to https://netlify.com → "Deploy manually"
2. Drag and drop the entire `neuralops` folder
3. Get a live URL instantly (free, no account needed for drag-drop)

---

## 🎯 Features to Demo in Your Video

1. **Hero Section** — Animated node graph showing 30 agents orbiting the Orchestrator
2. **Architecture Diagram** — Click any agent node to see its full definition
3. **30 Agent Cards** — Filter by layer, click for detailed modal (inputs, outputs, boundaries, confidence threshold)
4. **Orchestrator Deep Dive** — 6 cards covering routing, memory, retry, confidence, escalation, conflict resolution
5. **5 Workflow Flows** — Booking, Complaint, Abandoned Cart, Upsell, Failure flows with step-by-step chains
6. **Live Simulator** — Configure intent + temperature + failure type → watch agents activate in real time with live CCO updates
7. **4 Build Phases** — Prioritized roadmap with rationale
8. **6 Scenarios** — Edge cases including failure handling, missing info, conflicts, human override, AI identity challenge
9. **Boundary Cards** — Hard stops, ownership rules, overlap management
10. **Tech Stack** — 8 technology layers with tool recommendations

---

## 📊 Simulator Combinations to Show

| Intent | Temperature | Failure | Showcases |
|--------|-------------|---------|-----------|
| Birthday | Hot | None | Happy path, upsell, FOMO |
| Birthday | Warm | None | Nurture path, partial lead |
| Complaint | Hot | None | Conflict chain, escalation |
| Abandoned | Hot | None | Cart recovery, multi-attempt |
| Birthday | Hot | Payment Failure | Payment retry, recovery |
| Birthday | Hot | Agent Crash | Retry engine, fallback API |
| Birthday | Hot | Agent Conflict | Conflict resolution, confidence winner |

---

## 🧠 Key Design Decisions to Highlight

1. **Central Orchestrator** — Everything routes through one brain. No agent acts alone.
2. **Customer Context Object (CCO)** — Shared versioned state. No stale data.
3. **Confidence Scores** — Every output scored. Below 60 = human review.
4. **3-Retry + Backoff** — Failure is expected; recovery is automatic.
5. **Anti-spam Gates** — FOMO + Upsell can't fire simultaneously.
6. **Hard Boundaries** — Agent 3 can NEVER deny being AI. Agent 9 can NEVER fabricate inventory.
7. **Human-in-the-Loop** — 4 defined escalation points. Human always overrides.
8. **Phase 4 for Dynamic Pricing** — Can't optimize pricing without real data. Deliberate ordering.

---

Built with: HTML5, CSS3 (CSS Variables, Grid, Flexbox), Vanilla JS (Canvas API, IntersectionObserver)
No frameworks, no dependencies, no build step required.
