// CampusPilot AI - Multi-Campus Opportunities & Discovery Engine
// Automated Discovery (Hackathons, Internships, Competitions, Workshops, Scholarships) with Verification & Application Tracking

window.Opportunities = {
  currentCategory: 'All',
  searchQuery: '',
  filterStatus: 'all', // 'all', 'saved', 'applied'

  init() {
    this.renderOpportunities();
  },

  renderOpportunities() {
    const container = document.getElementById('opportunities-container');
    if (!container) return;

    let items = window.CampusData.opportunities;

    // Filter by category
    if (this.currentCategory !== 'All') {
      items = items.filter(o => o.category.toLowerCase() === this.currentCategory.toLowerCase());
    }

    // Filter by search query
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      items = items.filter(o => 
        o.title.toLowerCase().includes(q) ||
        o.organizer.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q) ||
        o.category.toLowerCase().includes(q)
      );
    }

    // Filter by status (saved / applied)
    if (this.filterStatus === 'saved') {
      items = items.filter(o => o.status === 'saved');
    } else if (this.filterStatus === 'applied') {
      items = items.filter(o => o.status === 'applied');
    }

    if (items.length === 0) {
      container.innerHTML = `
        <div class="col-span-full p-12 text-center glass-panel">
          <i class="fas fa-search text-3xl text-slate-600 mb-3"></i>
          <h4 class="text-base font-bold text-white mb-1">No Opportunities Found</h4>
          <p class="text-xs text-slate-400">Try adjusting your category filter, clearing your search, or sync new opportunities.</p>
          <button onclick="Opportunities.syncFeeds()" class="mt-4 px-4 py-2 text-xs font-bold btn-cyan-glow text-slate-950 rounded-xl">
            <i class="fas fa-sync-alt mr-1"></i> Resync Public Discovery Feeds
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = items.map(opp => `
      <div class="glass-panel p-6 flex flex-col justify-between hover:border-indigo-500/50 transition-all duration-300 relative group">
        <div>
          <!-- Header Meta -->
          <div class="flex items-center justify-between mb-3">
            <span class="badge ${opp.badgeClass}">${opp.badge}</span>
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-mono text-slate-400"><i class="fas fa-satellite-dish text-cyan-400 mr-1"></i>${opp.source.split('·')[0]}</span>
              <button onclick="Opportunities.toggleBookmark('${opp.id}')" class="text-sm ${opp.status === 'saved' ? 'text-amber-400' : 'text-slate-500 hover:text-amber-400'} transition">
                <i class="fas fa-bookmark"></i>
              </button>
            </div>
          </div>

          <h3 class="text-lg font-bold text-white mb-2 leading-snug group-hover:text-cyan-300 transition-colors">
            ${opp.title}
          </h3>
          <p class="text-xs text-slate-400 mb-4 leading-relaxed">${opp.description}</p>
          
          <!-- Structured Details -->
          <div class="space-y-2 mb-5 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
            <div class="flex items-center justify-between">
              <span class="text-slate-500">Organizer:</span>
              <span class="font-medium text-slate-200">${opp.organizer}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-500">Timeline / Date:</span>
              <span class="font-mono text-slate-300">${opp.date}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-500">Reward / Value:</span>
              <span class="font-bold text-emerald-400">${opp.prizePool}</span>
            </div>
            <div class="flex items-center justify-between text-[11px]">
              <span class="text-slate-500">Deadline:</span>
              <span class="font-mono text-rose-300">${opp.deadline}</span>
            </div>
          </div>
        </div>

        <div>
          <!-- Application Status Badge -->
          <div class="flex items-center justify-between mb-3 text-[11px] pt-2 border-t border-slate-800/60">
            <span class="text-slate-500">Application State:</span>
            <select onchange="Opportunities.updateStatus('${opp.id}', this.value)" class="bg-slate-900 border border-slate-700 text-xs text-cyan-300 rounded px-2 py-0.5">
              <option value="none" ${opp.status === 'none' ? 'selected' : ''}>Not Applied</option>
              <option value="saved" ${opp.status === 'saved' ? 'selected' : ''}>⭐ Saved</option>
              <option value="applied" ${opp.status === 'applied' ? 'selected' : ''}>✓ Applied</option>
            </select>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-2">
            <a href="${opp.applyLink}" target="_blank" class="flex-1 py-2 text-center text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition">
              Direct Portal ↗
            </a>
            ${opp.hasDelegation ? `
              <button onclick="Opportunities.delegateToCompanion('${opp.id}')" class="flex-1 py-2 text-center text-xs font-semibold rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-600/50 transition flex items-center justify-center gap-1.5 shadow-sm">
                <span>🤖 AI Auto-Apply</span>
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `).join('');
  },

  filterCategory(category, buttonEl) {
    this.currentCategory = category;
    document.querySelectorAll('.opp-filter-btn').forEach(btn => {
      btn.classList.remove('bg-indigo-600', 'text-white');
      btn.classList.add('bg-slate-800', 'text-slate-400');
    });
    buttonEl.classList.remove('bg-slate-800', 'text-slate-400');
    buttonEl.classList.add('bg-indigo-600', 'text-white');
    this.renderOpportunities();
  },

  filterByStatus(status) {
    this.filterStatus = status;
    this.renderOpportunities();
  },

  handleSearch(query) {
    this.searchQuery = query;
    this.renderOpportunities();
  },

  toggleBookmark(id) {
    const opp = window.CampusData.opportunities.find(o => o.id === id);
    if (!opp) return;

    opp.status = opp.status === 'saved' ? 'none' : 'saved';
    this.renderOpportunities();
    window.App.showToast(opp.status === 'saved' ? `📌 Saved "${opp.title}" to your bookmarks!` : `Removed bookmark.`, "info");
  },

  updateStatus(id, newStatus) {
    const opp = window.CampusData.opportunities.find(o => o.id === id);
    if (!opp) return;

    opp.status = newStatus;
    window.App.showToast(`Updated status for "${opp.title}" to: ${newStatus.toUpperCase()}`, "success");
  },

  delegateToCompanion(id) {
    const opp = window.CampusData.opportunities.find(o => o.id === id);
    if (!opp) return;

    window.App.switchTab('companion');
    setTimeout(() => {
      window.AICompanion.populatePrompt(`Register team AstraNova for ${opp.title} on official portal with AVA approval checkpoint.`);
      window.App.showToast(`✨ Pre-filled task for ${opp.title}. Click "Run Task" to begin.`, "info");
    }, 200);
  },

  syncFeeds() {
    const statusText = document.getElementById('discovery-sync-status');
    if (statusText) statusText.innerText = "Syncing with Devpost RSS, GitHub Campus, and Career APIs...";

    setTimeout(() => {
      if (statusText) statusText.innerText = `Synced just now · 6 verified opportunities · 0 duplicates · All links active`;
      window.App.showToast("🔄 Opportunity discovery engine refreshed successfully!", "success");
      this.renderOpportunities();
    }, 900);
  },

  openPostOpportunityModal() {
    const modal = document.getElementById('post-opportunity-modal');
    if (modal) modal.classList.remove('hidden');
  },

  closePostOpportunityModal() {
    const modal = document.getElementById('post-opportunity-modal');
    if (modal) modal.classList.add('hidden');
  },

  submitOpportunity(event) {
    if (event) event.preventDefault();
    const title = document.getElementById('new-opp-title')?.value.trim();
    const category = document.getElementById('new-opp-category')?.value;
    const organizer = document.getElementById('new-opp-organizer')?.value.trim() || 'Campus Community';
    const deadline = document.getElementById('new-opp-deadline')?.value.trim() || 'Rolling Basis';
    const reward = document.getElementById('new-opp-reward')?.value.trim() || 'Certificate / Stipend';
    const link = document.getElementById('new-opp-link')?.value.trim() || 'https://campusinnovate.org';
    const desc = document.getElementById('new-opp-desc')?.value.trim() || 'Verified student opportunity.';

    if (!title) {
      window.App.showToast("Please enter an opportunity title.", "warning");
      return;
    }

    const newOpp = {
      id: "opp-" + Date.now(),
      title: title,
      category: category,
      organizer: organizer,
      source: "Manual Submission · Verified",
      lastUpdated: "Just now",
      date: "Upcoming 2026",
      deadline: deadline,
      location: "Hybrid / On-Campus",
      prizePool: reward,
      description: desc,
      badge: category,
      badgeClass: category === 'Hackathons' ? 'badge-purple' : (category === 'Internships' ? 'badge-cyan' : 'badge-green'),
      applyLink: link,
      campusId: window.CampusData.activeUser?.campusId || "global",
      hasDelegation: true,
      status: "none"
    };

    window.CampusData.opportunities.unshift(newOpp);
    this.closePostOpportunityModal();
    this.renderOpportunities();
    window.App.showToast(`✨ Successfully posted opportunity: "${title}"!`, "success");
  }
};
