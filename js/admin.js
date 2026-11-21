// CampusPilot AI - Admin & Institutional Content Moderation Module
// Opportunity verification, Community Moderation, Campus Registry & Platform Telemetry

window.Admin = {
  init() {
    this.renderAdminOverview();
    this.renderPendingOpportunities();
    this.renderAuditLogs();
    this.renderCampusRegistry();
  },

  renderAdminOverview() {
    const oppCount = document.getElementById('admin-stat-opps');
    const userCount = document.getElementById('admin-stat-users');
    const groupCount = document.getElementById('admin-stat-groups');
    const auditCount = document.getElementById('admin-stat-audits');

    if (oppCount) oppCount.innerText = window.CampusData.opportunities.length;
    if (userCount) userCount.innerText = window.CampusData.students.length + 1;
    if (groupCount) groupCount.innerText = window.CampusData.studyGroups.length;
    if (auditCount) auditCount.innerText = window.CampusData.auditLogs.length;
  },

  renderPendingOpportunities() {
    const container = document.getElementById('admin-pending-opps-container');
    if (!container) return;

    container.innerHTML = window.CampusData.opportunities.map(opp => `
      <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="font-bold text-white text-sm">${opp.title}</span>
            <span class="badge ${opp.badgeClass} text-[9px]">${opp.category}</span>
          </div>
          <p class="text-slate-400 text-xs">${opp.organizer} · Source: <span class="font-mono text-cyan-300">${opp.source}</span> · ${opp.lastUpdated}</p>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
            ✓ Verified Feed
          </span>
          <button onclick="Admin.removeOpportunity('${opp.id}')" class="px-2.5 py-1 text-[11px] rounded bg-rose-950/80 border border-rose-500/40 text-rose-300 hover:bg-rose-900 transition">
            Delete
          </button>
        </div>
      </div>
    `).join('');
  },

  removeOpportunity(id) {
    const idx = window.CampusData.opportunities.findIndex(o => o.id === id);
    if (idx !== -1) {
      const removed = window.CampusData.opportunities.splice(idx, 1)[0];
      this.renderPendingOpportunities();
      this.renderAdminOverview();
      if (window.Opportunities) window.Opportunities.renderOpportunities();
      window.App.showToast(`Admin deleted: "${removed.title}"`, "info");
    }
  },

  renderAuditLogs() {
    const container = document.getElementById('admin-audit-logs-container');
    if (!container) return;

    container.innerHTML = window.CampusData.auditLogs.map(log => `
      <div class="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs font-mono">
        <div class="flex items-center gap-2">
          <span class="text-cyan-400 font-bold">${log.id}</span>
          <span class="text-slate-300">${log.action}:</span>
          <span class="text-slate-400">${log.detail}</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-slate-500 text-[10px]">${log.time}</span>
          <span class="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400">${log.status}</span>
        </div>
      </div>
    `).join('');
  },

  renderCampusRegistry() {
    const container = document.getElementById('admin-campus-registry-container');
    if (!container) return;

    container.innerHTML = window.CampusData.campuses.map(c => `
      <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
        <div>
          <span class="font-bold text-white block">${c.name}</span>
          <span class="text-[10px] text-slate-400 font-mono">${c.domain} · ${c.location}</span>
        </div>
        <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 border border-indigo-500/40 text-indigo-300">
          ${c.shortCode} Active Node
        </span>
      </div>
    `).join('');
  },

  addNewCampus() {
    const name = prompt("Enter Institution Name (e.g., Stanford University):");
    if (!name) return;
    const code = prompt("Enter Short Code (e.g., SU):", "SU");
    const domain = prompt("Enter Primary Domain (e.g., stanford.edu):", "stanford.edu");

    const newCamp = {
      id: "camp-" + Date.now(),
      name: name,
      shortCode: code || "INST",
      location: "Verified Campus",
      domain: domain || "edu"
    };

    window.CampusData.campuses.push(newCamp);
    this.renderCampusRegistry();
    if (window.Auth) window.Auth.renderCampusOptions();
    window.App.showToast(`Institution "${name}" added to multi-campus registry!`, "success");
  }
};
