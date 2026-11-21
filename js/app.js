// CampusPilot AI - Master Application Controller
// One Campus. One Intelligent Workspace. | Team AstraNova

window.App = {
  currentTab: 'dashboard',
  _settingsOpen: false,

  // ─────────────────────────────────────────────
  // THEME SYSTEM
  // ─────────────────────────────────────────────
  Theme: {
    _mode: 'dark',          // 'dark' | 'light' | 'system'
    _mediaQuery: null,
    _mediaListener: null,

    initTheme() {
      const saved = localStorage.getItem('campuspilot_theme');
      if (saved && ['dark', 'light', 'system'].includes(saved)) {
        this._mode = saved;
      } else {
        // Fall back to OS preference, default dark
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this._mode = prefersDark ? 'dark' : 'light';
      }
      this._applyTheme();
    },

    setTheme(mode) {
      if (!['dark', 'light', 'system'].includes(mode)) return;
      // Remove previous system listener if any
      if (this._mediaListener && this._mediaQuery) {
        this._mediaQuery.removeEventListener('change', this._mediaListener);
        this._mediaListener = null;
      }
      this._mode = mode;
      localStorage.setItem('campuspilot_theme', mode);
      if (mode === 'system') {
        this._mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this._mediaListener = () => this._applyTheme();
        this._mediaQuery.addEventListener('change', this._mediaListener);
      }
      this._applyTheme();
    },

    getEffectiveTheme() {
      if (this._mode === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return this._mode;
    },

    toggleTheme() {
      const eff = this.getEffectiveTheme();
      this.setTheme(eff === 'dark' ? 'light' : 'dark');
    },

    _applyTheme() {
      const eff = this.getEffectiveTheme();
      if (eff === 'light') {
        document.body.classList.add('light-theme');
      } else {
        document.body.classList.remove('light-theme');
      }
    }
  },

  // ─────────────────────────────────────────────
  // SETTINGS PANEL
  // ─────────────────────────────────────────────
  toggleSettings() {
    this._settingsOpen = !this._settingsOpen;
    const backdrop = document.getElementById('settings-backdrop');
    if (this._settingsOpen) {
      document.body.classList.add('settings-open');
      if (backdrop) backdrop.classList.remove('hidden');
      this._populateSettingsProfile();
      this.refreshThemePills();
      this._syncNotifToggle();
    } else {
      document.body.classList.remove('settings-open');
      if (backdrop) backdrop.classList.add('hidden');
    }
  },

  refreshThemePills() {
    const mode = this.Theme._mode;
    const eff = this.Theme.getEffectiveTheme();

    const pills = {
      dark: document.getElementById('theme-pill-dark'),
      light: document.getElementById('theme-pill-light'),
      system: document.getElementById('theme-pill-system')
    };

    const activeClasses = ['border-indigo-500', 'bg-indigo-900/40', 'text-indigo-300'];
    const inactiveClasses = ['border-slate-700', 'text-slate-400'];

    Object.entries(pills).forEach(([key, pill]) => {
      if (!pill) return;
      if (key === mode) {
        pill.classList.add(...activeClasses);
        pill.classList.remove(...inactiveClasses);
      } else {
        pill.classList.remove(...activeClasses);
        pill.classList.add(...inactiveClasses);
      }
    });

    const label = document.getElementById('theme-status-label');
    if (label) {
      if (mode === 'system') {
        label.textContent = `System preference → ${eff === 'dark' ? 'Dark' : 'Light'} Mode`;
      } else {
        label.textContent = `Currently using ${mode === 'dark' ? 'Dark' : 'Light'} Mode`;
      }
    }
  },

  saveNotifPreference(enabled) {
    localStorage.setItem('campuspilot_notifications', enabled ? 'true' : 'false');
    // Update custom toggle visual
    const track = document.getElementById('notif-track');
    const thumb = document.getElementById('notif-thumb');
    if (enabled) {
      if (track) { track.classList.remove('bg-slate-700'); track.classList.add('bg-indigo-600'); }
      if (thumb) thumb.style.transform = 'translateX(20px)';
    } else {
      if (track) { track.classList.add('bg-slate-700'); track.classList.remove('bg-indigo-600'); }
      if (thumb) thumb.style.transform = 'translateX(0)';
    }
  },

  _syncNotifToggle() {
    const saved = localStorage.getItem('campuspilot_notifications');
    const checkbox = document.getElementById('notif-toggle');
    const enabled = saved === 'true';
    if (checkbox) checkbox.checked = enabled;
    this.saveNotifPreference(enabled);
  },

  _populateSettingsProfile() {
    const user = (window.CampusData && window.CampusData.activeUser) || {};
    const nameEl = document.getElementById('settings-user-name');
    const emailEl = document.getElementById('settings-user-email');
    const collegeEl = document.getElementById('settings-user-college');
    const roleEl = document.getElementById('settings-user-role');
    if (nameEl) nameEl.textContent = user.name || '—';
    if (emailEl) emailEl.textContent = user.email || '—';
    if (collegeEl) collegeEl.textContent = user.college || '—';
    if (roleEl) roleEl.textContent = user.role || 'Student';
  },

  // ─────────────────────────────────────────────
  // NAVIGATION
  // ─────────────────────────────────────────────
  setupNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const target = tab.getAttribute('data-tab');
        this.switchTab(target);
      });
    });
  },

  switchTab(tabName) {
    this.currentTab = tabName;

    // Update nav links
    document.querySelectorAll('.nav-tab').forEach(tab => {
      if (tab.getAttribute('data-tab') === tabName) {
        tab.classList.add('active', 'text-white');
        tab.classList.remove('text-slate-400');
      } else {
        tab.classList.remove('active', 'text-white');
        tab.classList.add('text-slate-400');
      }
    });

    // Hide all views, show targeted view
    document.querySelectorAll('.view-section').forEach(view => {
      view.classList.add('hidden');
    });

    const activeView = document.getElementById(`view-${tabName}`);
    if (activeView) {
      activeView.classList.remove('hidden');
      activeView.classList.add('animate-fade-in');
    }

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // ─────────────────────────────────────────────
  // DASHBOARD STATS
  // ─────────────────────────────────────────────
  renderDashboardStats() {
    const oppCount = document.getElementById('stat-opps-count');
    const grpCount = document.getElementById('stat-groups-count');
    const buddyCount = document.getElementById('stat-buddies-count');
    const taskCount = document.getElementById('stat-tasks-count');

    if (oppCount) oppCount.innerText = window.CampusData.opportunities?.length || 6;
    if (grpCount) grpCount.innerText = window.CampusData.studyGroups?.length || 3;
    if (buddyCount) buddyCount.innerText = window.CampusData.students?.length || 6;
    if (taskCount) taskCount.innerText = (window.CampusData.tasks?.length || 1);
  },

  // ─────────────────────────────────────────────
  // TOAST NOTIFICATIONS
  // ─────────────────────────────────────────────
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const colors = {
      success: 'bg-emerald-950/90 border border-emerald-500 text-emerald-200',
      warning: 'bg-amber-950/90 border border-amber-500 text-amber-200',
      error: 'bg-rose-950/90 border border-rose-500 text-rose-200',
      info: 'bg-indigo-950/90 border border-indigo-500 text-indigo-200'
    };

    const icons = {
      success: '✓',
      warning: '⚠️',
      error: '✕',
      info: 'ℹ️'
    };

    toast.setAttribute('role', 'alert');
    toast.className = `p-3.5 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-3 text-xs font-medium animate-fade-in transition-all ${colors[type] || colors.info}`;
    toast.innerHTML = `
      <span class="text-sm font-bold">${icons[type] || '•'}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  // ─────────────────────────────────────────────
  // BACKEND HEALTH CHECK
  // ─────────────────────────────────────────────
  checkBackendHealth() {
    fetch('/api/status')
      .then(r => r.json())
      .then(data => {
        const dot = document.getElementById('system-status-dot');
        const text = document.getElementById('system-status-text');
        if (dot) dot.className = "w-2 h-2 rounded-full bg-emerald-400 animate-pulse";
        if (text) text.innerText = "Multi-Campus Cloud Gateway Online";
      })
      .catch(() => {
        const dot = document.getElementById('system-status-dot');
        const text = document.getElementById('system-status-text');
        if (dot) dot.className = "w-2 h-2 rounded-full bg-cyan-400";
        if (text) text.innerText = "Multi-Campus Node Active";
      });
  },

  // ─────────────────────────────────────────────
  // INIT
  // ─────────────────────────────────────────────
  init() {
    this.Theme.initTheme();
    this.setupNavigation();

    // 1. Initialize Authentication & Identity (Enforces First Experience)
    if (window.Auth) {
      window.Auth.init();
    }

    // 2. Initialize Feature Modules
    if (window.CampusEcosystem) window.CampusEcosystem.init();
    if (window.StudyGroups) window.StudyGroups.init();
    if (window.Opportunities) window.Opportunities.init();
    if (window.VoiceStudio) window.VoiceStudio.init();
    if (window.AICompanion) window.AICompanion.init();
    if (window.Admin) window.Admin.init();

    this.renderDashboardStats();
    this.checkBackendHealth();
  }
};

// Auto boot on DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
  window.App.init();
});
