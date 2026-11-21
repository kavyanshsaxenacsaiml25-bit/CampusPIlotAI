// CampusPilot AI - Multi-Campus Authentication & Identity System
// First-Experience Auth Gateway, Multi-Campus Onboarding, Role-Based Access & Session Persistence

window.Auth = {
  isLoggedIn: false,
  currentUser: null,
  activeAuthTab: 'signin', // 'signin', 'signup', 'demo'
  activeRole: 'student',

  // Pre-configured Demo Accounts across different institutions and roles
  demoProfiles: [
    {
      id: "kavyansh",
      name: "Kavyansh Saxena",
      studentId: "STU-2026-8812",
      email: "kavyansh.saxena@apextech.edu",
      roleTitle: "System Architect & AI Orchestrator",
      role: "student",
      branch: "Computer Science (AI/ML)",
      semester: "Semester 6",
      college: "Apex Institute of Technology",
      campusId: "apex",
      team: "AstraNova",
      cgpa: "8.94",
      avatarBadge: "KS",
      gradient: "from-indigo-500 to-cyan-400",
      skills: ["AI Systems", "Python", "Tool Calling", "Azure"]
    },
    {
      id: "priyanshi",
      name: "Priyanshi Mishra",
      studentId: "STU-2026-7731",
      email: "priyanshi.mishra@metrostate.edu",
      roleTitle: "Phase 1 Lead · Frontend & Ecosystem",
      role: "student",
      branch: "Software Systems Engineering",
      semester: "Semester 6",
      college: "Metro State University",
      campusId: "metro",
      team: "AstraNova",
      cgpa: "9.12",
      avatarBadge: "PM",
      gradient: "from-pink-500 to-purple-500",
      skills: ["React", "Flutter Web", "UI/UX", "Product Strategy"]
    },
    {
      id: "anushka",
      name: "Anushka Shukla",
      studentId: "STU-2026-6642",
      email: "anushka.shukla@nationalsci.ac",
      roleTitle: "Phase 2 Lead · Voice AI Studio & NLP",
      role: "student",
      branch: "Data Science & Artificial Intelligence",
      semester: "Semester 6",
      college: "National Science University",
      campusId: "national",
      team: "AstraNova",
      cgpa: "8.85",
      avatarBadge: "AS",
      gradient: "from-cyan-400 to-emerald-500",
      skills: ["Speech Recognition", "NLP", "Audio DSP", "Python"]
    },
    {
      id: "dhruv",
      name: "Dhruv Mishra",
      studentId: "STU-2026-5519",
      email: "dhruv.mishra@pacificpoly.edu",
      roleTitle: "Phase 3 Lead · Autonomous Worker & Backend",
      role: "student",
      branch: "Distributed Computer Systems",
      semester: "Semester 6",
      college: "Pacific Polytech Institute",
      campusId: "pacific",
      team: "AstraNova",
      cgpa: "8.76",
      avatarBadge: "DM",
      gradient: "from-amber-400 to-rose-500",
      skills: ["Playwright", "Distributed Queues", "Node.js", "Docker"]
    },
    {
      id: "mitchell",
      name: "Dr. Sarah Mitchell",
      studentId: "FAC-9012",
      email: "s.mitchell@academic-council.org",
      roleTitle: "Faculty Evaluator & Academic Admin",
      role: "admin",
      branch: "Department of Computer Science",
      semester: "Faculty",
      college: "Global Academic Consortium",
      campusId: "global",
      team: "Academic Review",
      cgpa: "Ph.D.",
      avatarBadge: "SM",
      gradient: "from-emerald-500 to-teal-400",
      skills: ["Accreditation", "Curriculum Design", "Research Grants"]
    }
  ],

  init() {
    this.renderCampusOptions();
    this.renderDemoProfiles();

    // Check for saved session in localStorage
    const saved = localStorage.getItem('campuspilot_session');
    if (saved) {
      try {
        const user = JSON.parse(saved);
        this.loginUser(user, false);
      } catch (e) {
        this.showAuthScreen();
      }
    } else {
      // First Experience: Show professional Auth Portal
      this.showAuthScreen();
    }
  },

  showAuthScreen() {
    this.isLoggedIn = false;
    const authScreen = document.getElementById('auth-screen');
    const appShell = document.getElementById('app-shell');

    if (authScreen) authScreen.classList.remove('hidden');
    if (appShell) appShell.classList.add('hidden');
  },

  hideAuthScreen() {
    this.isLoggedIn = true;
    const authScreen = document.getElementById('auth-screen');
    const appShell = document.getElementById('app-shell');

    if (authScreen) authScreen.classList.add('hidden');
    if (appShell) appShell.classList.remove('hidden');
  },

  renderCampusOptions() {
    const campusSelects = document.querySelectorAll('.campus-dropdown-target');
    const optionsHtml = window.CampusData.campuses.map(c => `
      <option value="${c.id}">${c.name} (${c.shortCode})</option>
    `).join('') + `<option value="custom">+ Other / Enter My Institution</option>`;

    campusSelects.forEach(sel => {
      sel.innerHTML = optionsHtml;
    });
  },

  renderDemoProfiles() {
    const container = document.getElementById('demo-roster-container');
    if (!container) return;

    container.innerHTML = this.demoProfiles.map(member => `
      <div onclick="Auth.quickLogin('${member.id}')" 
        class="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 hover:border-cyan-400/80 hover:bg-slate-800/90 transition-all duration-300 cursor-pointer group flex flex-col justify-between hover:scale-[1.01] shadow-md">
        <div>
          <div class="flex items-center justify-between mb-2.5">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr ${member.gradient} p-0.5 shadow-md flex items-center justify-center font-bold text-xs text-white">
              <span class="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center">
                ${member.avatarBadge}
              </span>
            </div>
            <span class="text-[9px] font-mono px-2 py-0.5 rounded-full ${member.role === 'admin' ? 'bg-emerald-950 border border-emerald-500/60 text-emerald-300' : 'bg-slate-800 border border-slate-700 text-cyan-300'}">
              ${member.role === 'admin' ? 'Admin Role' : '1-Click Login'}
            </span>
          </div>

          <h4 class="font-bold text-white text-xs group-hover:text-cyan-300 transition leading-tight">${member.name}</h4>
          <p class="text-[10px] text-indigo-300 font-medium mb-1">${member.roleTitle}</p>
          <p class="text-[9px] text-slate-400 font-mono mb-2">${member.college}</p>
        </div>

        <div class="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
          <span class="text-slate-500">${member.branch.split(' ')[0]}</span>
          <span class="text-indigo-400 font-bold group-hover:translate-x-1 transition-transform">Sign in →</span>
        </div>
      </div>
    `).join('');
  },

  switchAuthTab(tab) {
    this.activeAuthTab = tab;
    ['signin', 'signup', 'demo'].forEach(t => {
      const btn = document.getElementById(`tab-btn-${t}`);
      const pane = document.getElementById(`auth-pane-${t}`);
      if (btn) {
        if (t === tab) {
          btn.className = "px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white shadow-md transition";
        } else {
          btn.className = "px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition";
        }
      }
      if (pane) {
        if (t === tab) pane.classList.remove('hidden');
        else pane.classList.add('hidden');
      }
    });
  },

  quickLogin(profileId) {
    const profile = this.demoProfiles.find(p => p.id === profileId);
    if (!profile) return;
    this.playUnlockSequence(profile);
  },

  handleSignIn(event) {
    if (event) event.preventDefault();
    const email = document.getElementById('signin-email')?.value.trim() || 'kavyansh.saxena@apextech.edu';
    
    // Check if matches known demo or create custom
    let user = this.demoProfiles.find(p => p.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      user = {
        id: "usr-" + Date.now(),
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        studentId: "STU-" + Math.floor(1000 + Math.random() * 9000),
        email: email,
        roleTitle: "Student Scholar",
        role: "student",
        branch: "Computer Science",
        semester: "Semester 6",
        college: "Apex Institute of Technology",
        campusId: "apex",
        team: "AstraNova",
        cgpa: "8.80",
        avatarBadge: email.substring(0, 2).toUpperCase(),
        skills: ["Software Engineering", "AI"]
      };
    }

    this.playUnlockSequence(user);
  },

  handleSignUp(event) {
    if (event) event.preventDefault();
    const name = document.getElementById('signup-name')?.value.trim();
    const email = document.getElementById('signup-email')?.value.trim();
    const campusId = document.getElementById('signup-campus')?.value;
    const branch = document.getElementById('signup-branch')?.value.trim() || 'Computer Science';
    const semester = document.getElementById('signup-semester')?.value || 'Semester 6';

    if (!name || !email) {
      window.App.showToast("Please provide your name and institutional email.", "warning");
      return;
    }

    const matchedCampus = window.CampusData.campuses.find(c => c.id === campusId);
    const collegeName = matchedCampus ? matchedCampus.name : "Autonomous Campus Partner";

    const newUser = {
      id: "usr-" + Date.now(),
      name: name,
      studentId: "STU-" + Math.floor(1000 + Math.random() * 9000),
      email: email,
      roleTitle: "Student Scholar",
      role: "student",
      branch: branch,
      semester: semester,
      college: collegeName,
      campusId: campusId,
      team: "Independent",
      cgpa: "8.90",
      avatarBadge: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      skills: ["Computer Science", "AI Systems"]
    };

    this.playUnlockSequence(newUser);
  },

  loginWithGoogle() {
    window.App.showToast("Connecting to Google Identity Provider...", "info");
    setTimeout(() => {
      this.quickLogin('kavyansh');
    }, 800);
  },

  simulateBiometricScan() {
    const laser = document.getElementById('biometric-laser');
    const statusText = document.getElementById('biometric-status-text');

    if (laser) laser.classList.remove('hidden');
    if (statusText) statusText.innerText = "Scanning Secure Identity Hash...";

    setTimeout(() => {
      if (statusText) statusText.innerText = "✓ Fingerprint Verified. Generating Token...";
      setTimeout(() => {
        if (laser) laser.classList.add('hidden');
        this.quickLogin('kavyansh');
      }, 600);
    }, 1100);
  },

  playUnlockSequence(user) {
    const hud = document.getElementById('login-unlock-banner');
    const userNameSpan = document.getElementById('unlock-user-name');

    if (userNameSpan) userNameSpan.innerText = user.name;
    if (hud) hud.classList.remove('hidden');

    setTimeout(() => {
      if (hud) hud.classList.add('hidden');
      this.loginUser(user, true);
    }, 850);
  },

  loginUser(user, showToast = true) {
    this.currentUser = user;
    this.isLoggedIn = true;

    // Persist in localStorage
    localStorage.setItem('campuspilot_session', JSON.stringify(user));

    // Sync user data to CampusData
    window.CampusData.activeUser = { ...user };

    // Update Header & UI
    this.syncProfileWithApp();
    this.hideAuthScreen();

    // Trigger Admin tab visibility if admin
    const adminNav = document.getElementById('nav-item-admin');
    if (adminNav) {
      if (user.role === 'admin') adminNav.classList.remove('hidden');
      else adminNav.classList.add('hidden');
    }

    if (showToast) {
      window.App.showToast(`✨ Welcome to CampusPilot AI, ${user.name}! Workspace initialized for ${user.college}.`, "success");
      
      // Voice greeting
      setTimeout(() => {
        if (window.VoiceStudio) {
          window.VoiceStudio.speak(`Welcome back, ${user.name.split(' ')[0]}! CampusPilot workspace is online.`, 'en');
        }
      }, 500);
    }
  },

  logout() {
    localStorage.removeItem('campuspilot_session');
    this.currentUser = null;
    this.isLoggedIn = false;
    this.showAuthScreen();
    window.App.showToast("Signed out. Authentication portal locked.", "info");
  },

  openCampusSwitcherModal() {
    const modal = document.getElementById('campus-switcher-modal');
    if (modal) modal.classList.remove('hidden');
  },

  closeCampusSwitcherModal() {
    const modal = document.getElementById('campus-switcher-modal');
    if (modal) modal.classList.add('hidden');
  },

  switchCampus(newCampusId) {
    const campus = window.CampusData.campuses.find(c => c.id === newCampusId);
    if (!campus) return;

    this.currentUser.college = campus.name;
    this.currentUser.campusId = campus.id;
    window.CampusData.activeUser.college = campus.name;
    window.CampusData.activeUser.campusId = campus.id;

    localStorage.setItem('campuspilot_session', JSON.stringify(this.currentUser));
    this.syncProfileWithApp();
    this.closeCampusSwitcherModal();

    window.App.showToast(`Switched active institution to: ${campus.name}`, "success");
    
    // Refresh relevant views
    if (window.CampusEcosystem) window.CampusEcosystem.renderNotices();
    if (window.Opportunities) window.Opportunities.renderOpportunities();
  },

  togglePassword(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (input) {
      if (input.type === 'password') {
        input.type = 'text';
        icon?.classList.replace('fa-eye', 'fa-eye-slash');
      } else {
        input.type = 'password';
        icon?.classList.replace('fa-eye-slash', 'fa-eye');
      }
    }
  },

  openForgotPasswordModal() {
    const modal = document.getElementById('forgot-password-modal');
    if (modal) modal.classList.remove('hidden');
  },

  closeForgotPasswordModal() {
    const modal = document.getElementById('forgot-password-modal');
    if (modal) modal.classList.add('hidden');
  },

  sendPasswordReset() {
    const email = document.getElementById('forgot-email')?.value.trim();
    if (!email) {
      window.App.showToast("Please enter your registered institutional email.", "warning");
      return;
    }
    this.closeForgotPasswordModal();
    window.App.showToast(`Password recovery link dispatched to ${email}!`, "success");
  },

  syncProfileWithApp() {
    if (!this.currentUser) return;

    // Header updates
    const headerName = document.getElementById('header-user-name');
    const headerCollege = document.getElementById('header-user-college');
    const headerAvatar = document.getElementById('header-user-avatar');
    const headerRole = document.getElementById('header-user-role-badge');

    if (headerName) headerName.innerText = this.currentUser.name;
    if (headerCollege) headerCollege.innerText = this.currentUser.college;
    if (headerAvatar) headerAvatar.innerText = this.currentUser.avatarBadge || 'KS';
    if (headerRole) {
      headerRole.innerText = this.currentUser.role === 'admin' ? 'Admin' : (this.currentUser.branch.split(' ')[0] || 'Student');
    }

    // Dashboard hero update
    const heroName = document.getElementById('dashboard-hero-user-name');
    const heroCollege = document.getElementById('dashboard-hero-college');
    if (heroName) heroName.innerText = this.currentUser.name.split(' ')[0];
    if (heroCollege) heroCollege.innerText = this.currentUser.college;
  }
};
