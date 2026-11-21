// CampusPilot AI - Campus Hub & Study Partner Discovery
// Multi-Campus Notice Board, Study-Buddy Matching Engine & Invitation Management

window.CampusEcosystem = {
  currentNoticeFilter: 'All',

  init() {
    this.renderNotices();
    this.renderStudyBuddyList(window.CampusData.students);
    this.renderInvitations();
    this.renderTeamSquad();
  },

  // 1. Campus Notices
  renderNotices() {
    const container = document.getElementById('campus-notices-container');
    if (!container) return;

    const currentCollege = window.CampusData.activeUser?.college || "Campus";
    const notices = [
      {
        id: "ntc-1",
        title: "Even Semester Examination Schedule & Portal Guidelines Released",
        category: "Academic",
        source: `Office of the Controller of Examinations · ${currentCollege}`,
        date: "March 15 - 30, 2026",
        badge: "Academic Notice",
        badgeClass: "badge-amber",
        desc: "Final examination dates published for all engineering cohorts. Verify your registered course codes and minimum 75% attendance quota.",
        link: "https://portal.campusinnovate.org/exams"
      },
      {
        id: "ntc-2",
        title: "Annual Undergraduate AI & Systems Research Grant Nominations",
        category: "Research",
        source: "Dean of Research & Innovation",
        date: "Deadline: March 25, 2026",
        badge: "Research Grant",
        badgeClass: "badge-cyan",
        desc: "Seed funding of up to $5,000 for student-led prototypes in artificial intelligence, autonomous robotics, and distributed databases.",
        link: "https://grants.campusinnovate.org"
      },
      {
        id: "ntc-3",
        title: "Campus Innovation & Maker Fest 'Abhyudaya 2026' Registrations",
        category: "Clubs",
        source: "Student Innovation Council",
        date: "April 4 - 6, 2026",
        badge: "Campus Fest",
        badgeClass: "badge-green",
        desc: "Inter-collegiate robotics battle arena, speed hackathons, paper presentations, and cultural night.",
        link: "https://fest.campusinnovate.org"
      }
    ];

    container.innerHTML = notices.map(ntc => `
      <div class="glass-panel p-5 flex flex-col justify-between hover:border-indigo-500/40 transition-all">
        <div>
          <div class="flex items-center justify-between mb-2.5">
            <span class="badge ${ntc.badgeClass}">${ntc.badge}</span>
            <span class="text-[10px] font-mono text-slate-400">${ntc.date}</span>
          </div>
          <h4 class="font-bold text-white text-base mb-2 leading-snug">${ntc.title}</h4>
          <p class="text-xs text-slate-400 mb-4 leading-relaxed">${ntc.desc}</p>
        </div>

        <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span class="text-slate-500 text-[11px] truncate max-w-[200px]">${ntc.source}</span>
          <a href="${ntc.link}" target="_blank" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 transition text-xs font-semibold">
            View Details ↗
          </a>
        </div>
      </div>
    `).join('');
  },

  // 2. Smart Study-Buddy Matcher
  matchStudyBuddies() {
    const subject = document.getElementById('matcher-subject').value;
    const style = document.getElementById('matcher-style').value;
    const resultsContainer = document.getElementById('buddy-results-container');
    const scannerOverlay = document.getElementById('matcher-scanner');

    scannerOverlay?.classList.remove('hidden');
    resultsContainer?.classList.add('opacity-30');

    setTimeout(() => {
      scannerOverlay?.classList.add('hidden');
      resultsContainer?.classList.remove('opacity-30');

      // Cosine synergy score calculation
      const scored = window.CampusData.students.map(student => {
        let score = 72;
        if (student.subjects.some(s => s.toLowerCase().includes(subject.toLowerCase()))) {
          score += 18;
        }
        if (student.studyPreference.toLowerCase() === style.toLowerCase()) {
          score += 9;
        }
        score = Math.min(score, 99);
        return { ...student, dynamicScore: score };
      });

      scored.sort((a, b) => b.dynamicScore - a.dynamicScore);
      this.renderStudyBuddyList(scored);

      window.App.showToast(`Found ${scored.length} matching peers for ${subject}!`, "success");
    }, 1100);
  },

  renderStudyBuddyList(students) {
    const container = document.getElementById('buddy-results-container');
    if (!container) return;

    container.innerHTML = students.map(s => `
      <div class="glass-panel p-5 relative overflow-hidden flex flex-col justify-between hover:border-cyan-500/40 transition-all">
        <div class="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
          <span>⚡ ${s.dynamicScore || s.matchScore}% Synergy</span>
        </div>

        <div>
          <div class="flex items-center gap-3 mb-3">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5 flex items-center justify-center font-bold text-base text-white">
              <span class="w-full h-full rounded-[10px] bg-slate-900 flex items-center justify-center">
                ${s.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h4 class="font-bold text-white text-sm leading-tight">${s.name}</h4>
              <p class="text-[11px] text-indigo-300">${s.college}</p>
              <p class="text-[10px] text-slate-400 font-mono">${s.branch} · ${s.semester}</p>
            </div>
          </div>

          <p class="text-xs text-slate-300 mb-3 italic">"${s.bio}"</p>

          <div class="mb-3">
            <span class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Top Skills:</span>
            <div class="flex flex-wrap gap-1">
              ${s.skills.map(sk => `<span class="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-indigo-300 border border-slate-700">${sk}</span>`).join('')}
            </div>
          </div>

          <div class="mb-4">
            <span class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Focus Subjects:</span>
            <div class="flex flex-wrap gap-1">
              ${s.subjects.map(sub => `<span class="px-2 py-0.5 rounded text-[10px] bg-cyan-950/40 text-cyan-300 border border-cyan-900/60">${sub}</span>`).join('')}
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 pt-3 border-t border-slate-800/80">
          <button onclick="CampusEcosystem.sendInvitePrompt('${s.name}', '${s.subjects[0]}')" class="flex-1 py-2 text-center text-xs font-bold rounded-lg btn-cyan-glow text-slate-950 transition flex items-center justify-center gap-1.5 shadow-md">
            <span>🤝 Send Study Invite</span>
          </button>
        </div>
      </div>
    `).join('');
  },

  sendInvitePrompt(name, subject) {
    const note = prompt(`Send study invitation to ${name} for ${subject}:`, `Hey ${name}, let's collaborate on ${subject} this week!`);
    if (!note) return;

    window.CampusData.studyInvitations.unshift({
      id: "inv-" + Date.now(),
      sender: window.CampusData.activeUser?.name || "You",
      senderAvatar: window.CampusData.activeUser?.avatarBadge || "ME",
      senderCollege: window.CampusData.activeUser?.college || "Campus",
      subject: subject,
      message: note,
      timestamp: "Just now",
      status: "pending"
    });

    this.renderInvitations();
    window.App.showToast(`📩 Study invite dispatched to ${name}!`, "success");
  },

  // 3. Invitations Manager
  renderInvitations() {
    const container = document.getElementById('study-invitations-container');
    if (!container) return;

    const list = window.CampusData.studyInvitations;
    if (list.length === 0) {
      container.innerHTML = `<p class="text-xs text-slate-500 py-4 text-center">No active study invitations.</p>`;
      return;
    }

    container.innerHTML = list.map(inv => `
      <div class="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-500/40 flex items-center justify-center font-bold text-xs text-indigo-300 flex-shrink-0">
            ${inv.senderAvatar}
          </div>
          <div>
            <div class="flex items-center gap-2 mb-0.5">
              <span class="font-bold text-white">${inv.sender}</span>
              <span class="text-[10px] text-slate-400">(${inv.senderCollege})</span>
              <span class="text-[10px] text-slate-500 font-mono">· ${inv.timestamp}</span>
            </div>
            <p class="text-[11px] text-cyan-300 font-semibold mb-1">Subject: ${inv.subject}</p>
            <p class="text-slate-300 text-xs italic">"${inv.message}"</p>
          </div>
        </div>

        <div class="flex items-center gap-2 self-end sm:self-center">
          ${inv.status === 'pending' ? `
            <button onclick="CampusEcosystem.respondInvite('${inv.id}', 'accepted')" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-slate-950 transition">
              Accept
            </button>
            <button onclick="CampusEcosystem.respondInvite('${inv.id}', 'declined')" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition">
              Decline
            </button>
          ` : `
            <span class="text-xs font-mono font-bold ${inv.status === 'accepted' ? 'text-emerald-400' : 'text-slate-500'}">
              ${inv.status.toUpperCase()}
            </span>
          `}
        </div>
      </div>
    `).join('');
  },

  respondInvite(invId, response) {
    const inv = window.CampusData.studyInvitations.find(i => i.id === invId);
    if (!inv) return;

    inv.status = response;
    this.renderInvitations();
    window.App.showToast(response === 'accepted' ? `🎉 Accepted study session with ${inv.sender}!` : `Invitation declined.`, response === 'accepted' ? "success" : "info");
  },

  // 4. Team AstraNova Showcase
  renderTeamSquad() {
    const container = document.getElementById('team-squad-container');
    if (!container) return;

    container.innerHTML = `
      <div class="glass-panel p-6 border-indigo-500/30">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl shadow-lg">
              🚀
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">Team AstraNova · Core Architects</h3>
              <p class="text-xs text-indigo-400 font-mono">Creators of CampusPilot AI · One Campus. One Intelligent Workspace.</p>
            </div>
          </div>
          <span class="badge badge-purple">Core Roster</span>
        </div>

        <p class="text-xs text-slate-300 mb-5 leading-relaxed">
          Engineered by a multi-disciplinary team uniting distributed backend orchestration, adaptive multi-lingual voice intelligence, and autonomous browser execution into an institution-independent campus operating system.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div class="flex items-center justify-between mb-1">
              <span class="font-bold text-white text-xs">Priyanshi Mishra</span>
              <span class="text-[9px] px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300">Phase 1</span>
            </div>
            <p class="text-[11px] text-slate-400 mb-2">Frontend Architecture & Campus Hub UI</p>
            <div class="flex flex-wrap gap-1 text-[9px] text-slate-300">
              <span class="bg-slate-950 px-1.5 py-0.5 rounded">UI/UX</span>
              <span class="bg-slate-950 px-1.5 py-0.5 rounded">Ecosystem</span>
            </div>
          </div>

          <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div class="flex items-center justify-between mb-1">
              <span class="font-bold text-white text-xs">Kavyansh Saxena</span>
              <span class="text-[9px] px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300">Architect</span>
            </div>
            <p class="text-[11px] text-slate-400 mb-2">System Architect & AI Layer</p>
            <div class="flex flex-wrap gap-1 text-[9px] text-slate-300">
              <span class="bg-slate-950 px-1.5 py-0.5 rounded">Python/LLM</span>
              <span class="bg-slate-950 px-1.5 py-0.5 rounded">Tool Calling</span>
            </div>
          </div>

          <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div class="flex items-center justify-between mb-1">
              <span class="font-bold text-white text-xs">Anushka Shukla</span>
              <span class="text-[9px] px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300">Phase 2</span>
            </div>
            <p class="text-[11px] text-slate-400 mb-2">Voice AI Studio & Multilingual NLP</p>
            <div class="flex flex-wrap gap-1 text-[9px] text-slate-300">
              <span class="bg-slate-950 px-1.5 py-0.5 rounded">Speech AI</span>
              <span class="bg-slate-950 px-1.5 py-0.5 rounded">Hinglish</span>
            </div>
          </div>

          <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div class="flex items-center justify-between mb-1">
              <span class="font-bold text-white text-xs">Dhruv Mishra</span>
              <span class="text-[9px] px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300">Phase 3</span>
            </div>
            <p class="text-[11px] text-slate-400 mb-2">Playwright Automation & AVA Guardrails</p>
            <div class="flex flex-wrap gap-1 text-[9px] text-slate-300">
              <span class="bg-slate-950 px-1.5 py-0.5 rounded">Playwright</span>
              <span class="bg-slate-950 px-1.5 py-0.5 rounded">Workers</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};
