// CampusPilot AI - Phase 3: Autonomous AI Companion Module
// Multi-step Planner, Simulated Playwright Browser Worker, AVA Checkpoints, Execution Evidence

window.AICompanion = {
  isRunning: false,
  isPausedForApproval: false,
  isManualTakeover: false,
  currentTask: null,
  currentStepIndex: 0,
  executionTimer: null,

  init() {
    this.renderTaskHistory();
  },

  populatePrompt(promptText) {
    const input = document.getElementById('companion-task-input');
    if (input) {
      input.value = promptText;
      input.focus();
    }
  },

  startTask() {
    const input = document.getElementById('companion-task-input');
    const taskText = input.value.trim();

    if (!taskText) {
      window.App.showToast("Please enter a task for the Autonomous Companion.", "warning");
      return;
    }

    if (this.isRunning) {
      window.App.showToast("An autonomous task is already running. Please wait or stop it.", "warning");
      return;
    }

    this.isRunning = true;
    this.isManualTakeover = false;
    this.currentStepIndex = 0;

    // Build Execution Plan based on task
    const college = window.CampusData.activeUser?.college || "Partner Campus";
    const user = window.CampusData.activeUser?.name || "Student";

    this.currentTask = {
      id: "TSK-" + Math.floor(1000 + Math.random() * 9000),
      title: taskText,
      startTime: new Date().toLocaleTimeString(),
      steps: [
        { name: "Intent Analysis & Security Boundary Check", desc: `Verifying permissions for student ${user} (${college})`, status: "pending" },
        { name: "Browser Worker Initialization", desc: "Spawning virtual Playwright container & navigating to target portal", status: "pending" },
        { name: "DOM Form Discovery & Field Mapping", desc: "Injecting campus profile parameters (AstraNova team roster)", status: "pending" },
        { name: "AVA Approval Checkpoint [PAUSE]", desc: "Awaiting explicit human confirmation before form submission", status: "pending", isCheckpoint: true },
        { name: "Consequential Execution", desc: "Submitting registration payload to portal gateway", status: "pending" },
        { name: "Outcome Verification & Evidence Generation", desc: "Extracting confirmation token & generating audit receipt", status: "pending" }
      ]
    };

    this.renderPlan();
    this.showExecutionViews();
    this.executeNextStep();
  },

  renderPlan() {
    const planContainer = document.getElementById('execution-steps-list');
    if (!planContainer) return;

    planContainer.innerHTML = this.currentTask.steps.map((st, idx) => `
      <div id="step-row-${idx}" class="p-3 rounded-lg border transition-all duration-300 ${idx === 0 ? 'bg-indigo-950/40 border-indigo-500' : 'bg-slate-800/30 border-slate-700/40'}">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs font-bold text-slate-200 flex items-center gap-2">
            <span id="step-icon-${idx}" class="w-4 h-4 rounded-full flex items-center justify-center text-[10px] bg-slate-700 text-slate-400">
              ${idx + 1}
            </span>
            ${st.name}
          </span>
          <span id="step-badge-${idx}" class="text-[10px] px-2 py-0.5 rounded-full font-mono bg-slate-800 text-slate-400">
            WAITING
          </span>
        </div>
        <p class="text-[11px] text-slate-400 ml-6">${st.desc}</p>
      </div>
    `).join('');
  },

  showExecutionViews() {
    document.getElementById('browser-mockup')?.classList.remove('hidden');
    document.getElementById('execution-logs-card')?.classList.remove('hidden');
    this.clearLogs();
    const college = window.CampusData.activeUser?.college || "Partner Campus";
    this.log(`[ORCHESTRATOR] Initialized task: "${this.currentTask.title}"`);
    this.log(`[SECURITY] Active Profile: ${window.CampusData.activeUser.name} | Role: ${window.CampusData.activeUser.role} | Node: CAMPUS-PILOT-01 (${college})`);
  },

  executeNextStep() {
    if (!this.isRunning) return;

    if (this.currentStepIndex >= this.currentTask.steps.length) {
      this.finishTask();
      return;
    }

    const step = this.currentTask.steps[this.currentStepIndex];
    const idx = this.currentStepIndex;

    // Update UI for current running step
    const row = document.getElementById(`step-row-${idx}`);
    const badge = document.getElementById(`step-badge-${idx}`);
    const icon = document.getElementById(`step-icon-${idx}`);

    row?.classList.remove('bg-slate-800/30', 'border-slate-700/40');
    row?.classList.add('bg-indigo-950/70', 'border-indigo-400', 'shadow-lg');
    if (badge) {
      badge.innerText = "RUNNING...";
      badge.className = "text-[10px] px-2 py-0.5 rounded-full font-mono bg-indigo-900 text-indigo-300 animate-pulse";
    }
    if (icon) {
      icon.innerHTML = `<i class="fas fa-circle-notch fa-spin text-indigo-400"></i>`;
    }

    // Step Logic
    if (idx === 0) {
      this.log(`[ANALYZER] Target: Global Hackathon Gateway | Operation: Multi-page Registration`);
      this.updateBrowserURL("https://portal.campusinnovate.org/events/autonomous-sprint");
      this.renderBrowserDOM("loading");
      this.scheduleNext(1200);
    } 
    else if (idx === 1) {
      this.log(`[PLAYWRIGHT] Chromium headless session connected via DevTools Protocol`);
      this.log(`[NAVIGATE] HTTP 200 OK received from https://portal.campusinnovate.org`);
      this.renderBrowserDOM("portal_loaded");
      this.scheduleNext(1500);
    }
    else if (idx === 2) {
      this.log(`[DOM_PARSER] Located form elements: #teamName, #college, #leadEmail, #track`);
      this.log(`[AUTOFILL] Injecting AstraNova roster: Priyanshi, Kavyansh, Anushka, Dhruv`);
      this.renderBrowserDOM("form_filled");
      this.scheduleNext(1600);
    }
    else if (idx === 3) {
      // AVA APPROVAL CHECKPOINT TRIGGER!
      this.isPausedForApproval = true;
      this.log(`[AVA_CHECKPOINT] Consequential action detected: Official Team Registration Submission.`);
      this.log(`[AVA_CHECKPOINT] Halting autonomous execution. Requesting human signature...`);
      this.showApprovalModal();
    }
    else if (idx === 4) {
      this.log(`[GATEWAY] Dispatching authenticated POST request with cryptographic token`);
      this.log(`[NETWORK] Response Status: 201 Created | Payload: 1.4KB`);
      this.renderBrowserDOM("submission_confirmed");
      this.scheduleNext(1400);
    }
    else if (idx === 5) {
      this.log(`[VERIFIER] Confirming evidence on live DOM... Found banner: "Registration Confirmed"`);
      this.log(`[VERIFIER] Extracted Evidence Token: REG-GLOBAL-2026-9812`);
      this.scheduleNext(1000);
    }
  },

  scheduleNext(delay) {
    this.executionTimer = setTimeout(() => {
      this.completeStep(this.currentStepIndex);
      this.currentStepIndex++;
      this.executeNextStep();
    }, delay);
  },

  completeStep(idx) {
    const row = document.getElementById(`step-row-${idx}`);
    const badge = document.getElementById(`step-badge-${idx}`);
    const icon = document.getElementById(`step-icon-${idx}`);

    row?.classList.remove('bg-indigo-950/70', 'border-indigo-400', 'shadow-lg');
    row?.classList.add('bg-emerald-950/30', 'border-emerald-500/40');
    if (badge) {
      badge.innerText = "VERIFIED";
      badge.className = "text-[10px] px-2 py-0.5 rounded-full font-mono bg-emerald-900/60 text-emerald-300";
    }
    if (icon) {
      icon.innerHTML = `✓`;
      icon.className = "w-4 h-4 rounded-full flex items-center justify-center text-[10px] bg-emerald-700 text-white";
    }
  },

  // AVA Checkpoint Modal
  showApprovalModal() {
    const modal = document.getElementById('ava-modal');
    if (!modal) return;
    modal.classList.add('active');

    // Fill modal details
    const college = window.CampusData.activeUser?.college || "Partner Campus";
    document.getElementById('ava-task-title').innerText = this.currentTask.title;
    document.getElementById('ava-payload-team').innerText = `AstraNova (${college})`;
    document.getElementById('ava-payload-track').innerText = "Autonomous Systems & Unified Workspace";
    document.getElementById('ava-payload-members').innerText = "Priyanshi Mishra, Kavyansh Saxena, Anushka Shukla, Dhruv Mishra";
  },

  approveAction() {
    const modal = document.getElementById('ava-modal');
    modal?.classList.remove('active');
    this.isPausedForApproval = false;

    window.App.showToast("✅ Human Approval Granted. Proceeding to consequential step.", "success");
    this.log(`[AVA_CHECKPOINT] Human signature validated for Kavyansh Saxena. Execution unlocked.`);

    this.completeStep(this.currentStepIndex);
    this.currentStepIndex++;
    this.executeNextStep();
  },

  rejectAction() {
    const modal = document.getElementById('ava-modal');
    modal?.classList.remove('active');
    this.isRunning = false;
    this.isPausedForApproval = false;

    window.App.showToast("🛑 Task cancelled by user at approval checkpoint.", "warning");
    this.log(`[AVA_CHECKPOINT] Action ABORTED by human operator. No external state was modified.`);
    this.renderBrowserDOM("aborted");
  },

  toggleManualTakeover() {
    this.isManualTakeover = !this.isManualTakeover;
    const btn = document.getElementById('btn-manual-takeover');
    if (this.isManualTakeover) {
      btn?.classList.add('bg-amber-600', 'text-black');
      btn?.classList.remove('bg-slate-800', 'text-slate-300');
      window.App.showToast("🕹️ Manual Takeover Active. You now have direct control over browser elements.", "info");
      this.log(`[OVERRIDE] Manual takeover enabled by user. Autonomous worker paused.`);
    } else {
      btn?.classList.remove('bg-amber-600', 'text-black');
      btn?.classList.add('bg-slate-800', 'text-slate-300');
      window.App.showToast("🤖 Returned control back to Autonomous AI Companion.", "info");
      this.log(`[OVERRIDE] Manual takeover disabled. Resuming autonomous scheduler.`);
    }
  },

  finishTask() {
    this.isRunning = false;
    this.log(`[COMPLETE] Task executed with 100% verification score.`);
    window.App.showToast("🎉 Autonomous task completed and verified! Evidence generated.", "success");

    // Add to history
    const historyItem = {
      id: this.currentTask.id,
      title: this.currentTask.title,
      status: "COMPLETED",
      timestamp: new Date().toLocaleTimeString(),
      module: "Autonomous AI Companion",
      evidenceId: "REG-GLITCH-2026-9812",
      approvalGranted: true
    };
    window.CampusData.tasks = window.CampusData.tasks || [];
    window.CampusData.tasks.unshift(historyItem);
    this.renderTaskHistory();

    // Show Evidence Card
    this.renderEvidenceCard(historyItem);
  },

  renderEvidenceCard(task) {
    const container = document.getElementById('evidence-card-container');
    if (!container) return;

    container.innerHTML = `
      <div class="glass-panel p-5 border-emerald-500/50 bg-emerald-950/20 animate-fade-in">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2 text-emerald-400">
            <span class="text-xl">🛡️</span>
            <h4 class="font-bold text-sm text-white">Execution Evidence & Verification Record</h4>
          </div>
          <span class="badge badge-green">Cryptographically Verified</span>
        </div>

        <p class="text-xs text-slate-300 mb-4">
          All external changes executed under the AVA Framework with human approval timestamp and proof receipt.
        </p>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
          <div class="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <span class="text-[10px] text-slate-500 uppercase block">Task Reference</span>
            <span class="font-mono text-cyan-300 font-bold">${task.id}</span>
          </div>
          <div class="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <span class="text-[10px] text-slate-500 uppercase block">Registration ID</span>
            <span class="font-mono text-emerald-400 font-bold">${task.evidenceId}</span>
          </div>
          <div class="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <span class="text-[10px] text-slate-500 uppercase block">Human Sign-off</span>
            <span class="text-indigo-300 font-medium">Kavyansh Saxena</span>
          </div>
          <div class="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <span class="text-[10px] text-slate-500 uppercase block">Verification Status</span>
            <span class="text-emerald-400 font-bold">100% Passed</span>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button onclick="AICompanion.downloadReceipt('${task.id}')" class="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 transition flex items-center gap-1.5 shadow-md">
            <span>📥 Download Evidence PDF</span>
          </button>
          <button onclick="AICompanion.openPortalProof()" class="px-4 py-2 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition">
            View Live Portal Confirmation
          </button>
        </div>
      </div>
    `;
  },

  downloadReceipt(taskId) {
    const college = window.CampusData.activeUser?.college || "Partner Campus";
    const user = window.CampusData.activeUser?.name || "Student";
    const receiptContent = `========================================================
CAMPUSPILOT AI - VERIFIABLE TASK EXECUTION EVIDENCE
One Campus. One Intelligent Workspace. | Team AstraNova
========================================================
Task Reference: ${taskId}
Timestamp: ${new Date().toISOString()}
Institution: ${college}
Signee: ${user}
Team: AstraNova
Track: Autonomous Systems & Unified Workspace

AVA FRAMEWORK AUDIT RECORD:
- Approval Checkpoint: VALIDATED BY HUMAN SIGNATURE
- Consequential Action: SUBMITTED OFFICIAL APPLICATION
- Gateway Response: 201 CREATED
- Confirmation Token: REG-GLOBAL-2026-9812
- DOM Verification: CONFIRMED

Integrity Hash: SHA256-e9b4d8301c22bf88e178a9c4
CampusPilot AI Core Engine © 2026 AstraNova
========================================================`;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CampusPilot_Evidence_${taskId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    window.App.showToast("📄 Verification Evidence ticket downloaded!", "success");
  },

  openPortalProof() {
    window.App.showToast("Displaying confirmed portal view in browser sandbox.", "info");
    this.renderBrowserDOM("submission_confirmed");
  },

  renderTaskHistory() {
    const container = document.getElementById('task-history-list');
    if (!container) return;

    const list = window.CampusData.tasks || [
      {
        id: "TSK-8041",
        title: "Register for The Corporate Glitch '26",
        status: "COMPLETED",
        timestamp: "Just now",
        evidenceId: "REG-GLITCH-2026-9812"
      }
    ];

    container.innerHTML = list.map(t => `
      <div class="p-3 rounded-lg bg-slate-800/40 border border-slate-700/60 flex items-center justify-between text-xs hover:bg-slate-800/70 transition">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="font-bold text-white">${t.title}</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 font-mono">VERIFIED</span>
          </div>
          <p class="text-[10px] text-slate-400">Ref: ${t.id} · Token: ${t.evidenceId} · ${t.timestamp}</p>
        </div>
        <button onclick="AICompanion.downloadReceipt('${t.id}')" class="text-xs text-cyan-400 hover:text-cyan-300 font-mono">
          [Receipt]
        </button>
      </div>
    `).join('');
  },

  updateBrowserURL(url) {
    const el = document.getElementById('browser-address-text');
    if (el) el.innerText = url;
  },

  renderBrowserDOM(state) {
    const dom = document.getElementById('browser-dom-content');
    if (!dom) return;

    if (state === "loading") {
      dom.innerHTML = `
        <div class="flex flex-col items-center justify-center h-64 text-slate-400">
          <i class="fas fa-circle-notch fa-spin text-3xl text-indigo-500 mb-3"></i>
          <p class="text-xs font-mono">Connecting to BuildersHub Gateway...</p>
        </div>
      `;
    }
    else if (state === "portal_loaded") {
      const college = window.CampusData.activeUser?.college || "Apex Institute of Technology";
      dom.innerHTML = `
        <div class="p-6">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div>
              <h2 class="text-lg font-bold text-white">CampusInnovate Global Hackathon Portal</h2>
              <p class="text-xs text-slate-400">Institutional Gateway · ${college}</p>
            </div>
            <span class="px-2.5 py-1 rounded bg-amber-950/80 border border-amber-600/60 text-amber-300 text-xs font-mono">Submissions Open</span>
          </div>
          <div class="space-y-3 max-w-md opacity-70">
            <div class="h-4 bg-slate-800 rounded w-3/4"></div>
            <div class="h-8 bg-slate-800/60 rounded border border-slate-700"></div>
            <div class="h-8 bg-slate-800/60 rounded border border-slate-700"></div>
          </div>
        </div>
      `;
    }
    else if (state === "form_filled") {
      const college = window.CampusData.activeUser?.college || "Apex Institute of Technology";
      dom.innerHTML = `
        <div class="p-6">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div>
              <h2 class="text-lg font-bold text-white">CampusInnovate · Hackathon Registration</h2>
              <p class="text-xs text-slate-400">Autonomous Form Injection (Playwright Node)</p>
            </div>
            <span class="px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-300 text-xs font-mono">Form Populated</span>
          </div>
          <div class="space-y-3 text-xs">
            <div>
              <label class="text-slate-400 block mb-1">Team Name:</label>
              <input type="text" value="AstraNova" class="w-full bg-slate-900 border border-indigo-500 text-indigo-300 px-3 py-1.5 rounded" readonly>
            </div>
            <div>
              <label class="text-slate-400 block mb-1">Affiliated Institution:</label>
              <input type="text" value="${college}" class="w-full bg-slate-900 border border-slate-700 text-slate-200 px-3 py-1.5 rounded" readonly>
            </div>
            <div>
              <label class="text-slate-400 block mb-1">Problem Statement Track:</label>
              <input type="text" value="Unified AI-Powered Campus Operating System" class="w-full bg-slate-900 border border-cyan-500 text-cyan-300 px-3 py-1.5 rounded" readonly>
            </div>
            <div>
              <label class="text-slate-400 block mb-1">Team Roster:</label>
              <div class="p-2 bg-slate-900 border border-slate-700 rounded text-slate-300 space-y-1 text-[11px]">
                <p>1. Priyanshi Mishra (Lead Frontend & Ecosystem)</p>
                <p>2. Kavyansh Saxena (Architect & AI Orchestrator)</p>
                <p>3. Anushka Shukla (Lead Voice AI Studio)</p>
                <p>4. Dhruv Mishra (Autonomous Worker & Backend)</p>
              </div>
            </div>
            <div class="pt-2">
              <button class="w-full py-2 bg-indigo-600/60 border border-indigo-400 text-white rounded font-bold text-xs animate-pulse">
                Awaiting AVA Human Approval Checkpoint...
              </button>
            </div>
          </div>
        </div>
      `;
    }
    else if (state === "submission_confirmed") {
      dom.innerHTML = `
        <div class="p-6 text-center animate-fade-in">
          <div class="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center text-3xl mx-auto mb-4">
            ✓
          </div>
          <h2 class="text-xl font-bold text-white mb-1">Registration Confirmed!</h2>
          <p class="text-xs text-emerald-300 font-mono mb-4">CONFIRMATION TICKET: #REG-GLOBAL-2026-9812</p>

          <div class="max-w-md mx-auto p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-left text-xs space-y-2 mb-4">
            <div class="flex justify-between text-slate-400">
              <span>Target:</span>
              <span class="text-white font-medium">Autonomous Systems & GenAI Hackathon</span>
            </div>
            <div class="flex justify-between text-slate-400">
              <span>Team:</span>
              <span class="text-indigo-400 font-bold">AstraNova</span>
            </div>
            <div class="flex justify-between text-slate-400">
              <span>Institution:</span>
              <span class="text-white">${window.CampusData.activeUser?.college || 'Partner Campus'}</span>
            </div>
            <div class="flex justify-between text-slate-400">
              <span>Verification Stamp:</span>
              <span class="text-emerald-400 font-mono">HMAC-SHA256: 7f8a9...b1</span>
            </div>
          </div>

          <p class="text-[11px] text-slate-400">
            A confirmation receipt has been automatically added to your unified CampusPilot task history.
          </p>
        </div>
      `;
    }
    else if (state === "aborted") {
      dom.innerHTML = `
        <div class="p-8 text-center text-rose-400">
          <i class="fas fa-ban text-4xl mb-3"></i>
          <h3 class="text-lg font-bold text-white mb-1">Operation Aborted</h3>
          <p class="text-xs text-slate-400">Human checkpoint rejected execution. Zero modifications were submitted.</p>
        </div>
      `;
    }
  },

  clearLogs() {
    const el = document.getElementById('terminal-logs-content');
    if (el) el.innerHTML = '';
  },

  log(msg) {
    const el = document.getElementById('terminal-logs-content');
    if (!el) return;

    const time = new Date().toLocaleTimeString([], { hour12: false });
    const line = document.createElement('div');
    line.className = 'terminal-line text-slate-300 py-0.5';
    line.innerHTML = `<span class="text-slate-500 font-mono">[${time}]</span> ${msg}`;
    el.appendChild(line);
    el.scrollTop = el.scrollHeight;
  }
};
