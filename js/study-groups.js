// CampusPilot AI - Multi-Member Collaborative Study Groups Module
// Real Group Collaboration: 3-4+ Members, Shared Goals, Group Chat, Scheduled Sessions & Resources

window.StudyGroups = {
  activeGroupId: "grp-101",

  init() {
    this.renderGroupsList();
    this.renderActiveGroupWorkspace();
  },

  renderGroupsList() {
    const container = document.getElementById('study-groups-list-container');
    if (!container) return;

    container.innerHTML = window.CampusData.studyGroups.map(grp => {
      const isSelected = grp.id === this.activeGroupId;
      const completedGoals = grp.goals.filter(g => g.completed).length;
      const progressPercent = Math.round((completedGoals / grp.goals.length) * 100) || 0;

      return `
        <div onclick="StudyGroups.selectGroup('${grp.id}')"
          class="p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${isSelected ? 'bg-indigo-950/70 border-indigo-400 shadow-xl scale-[1.01]' : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'}">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                ${grp.subject}
              </span>
              <span class="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                <i class="fas fa-users text-indigo-400"></i> ${grp.members.length} members
              </span>
            </div>

            <h4 class="font-bold text-white text-sm mb-1.5 leading-snug">${grp.name}</h4>
            <p class="text-xs text-slate-400 line-clamp-2 mb-3">${grp.description}</p>
          </div>

          <div>
            <div class="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span>Goal Progress:</span>
              <span class="font-bold text-emerald-400">${progressPercent}%</span>
            </div>
            <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
              <div class="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500" style="width: ${progressPercent}%"></div>
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
              <div class="flex -space-x-1.5">
                ${grp.members.slice(0, 4).map(m => `
                  <div class="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[9px] font-bold text-cyan-300" title="${m.name} (${m.status})">
                    ${m.avatar}
                  </div>
                `).join('')}
              </div>
              <span class="font-mono text-indigo-300">Open Workspace →</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  selectGroup(groupId) {
    this.activeGroupId = groupId;
    this.renderGroupsList();
    this.renderActiveGroupWorkspace();
  },

  renderActiveGroupWorkspace() {
    const container = document.getElementById('active-group-workspace-container');
    if (!container) return;

    const grp = window.CampusData.studyGroups.find(g => g.id === this.activeGroupId);
    if (!grp) return;

    const completedGoals = grp.goals.filter(g => g.completed).length;
    const progressPercent = Math.round((completedGoals / grp.goals.length) * 100) || 0;

    container.innerHTML = `
      <div class="glass-panel p-6 border-indigo-500/40">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="badge badge-purple">${grp.subject}</span>
              <span class="text-xs font-mono text-slate-400"><i class="fas fa-clock mr-1"></i>Next Session: ${grp.meetingSchedule}</span>
            </div>
            <h3 class="text-2xl font-extrabold text-white mb-1">${grp.name}</h3>
            <p class="text-xs text-slate-300">${grp.description}</p>
          </div>

          <div class="flex items-center gap-3">
            <button onclick="StudyGroups.openInviteModal()" class="px-3.5 py-2 rounded-xl text-xs font-bold btn-cyan-glow text-slate-950 flex items-center gap-1.5 shadow-md">
              <i class="fas fa-user-plus"></i> <span>Invite Peers</span>
            </button>
            <button onclick="StudyGroups.joinLiveSession()" class="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-1.5 shadow-md">
              <i class="fas fa-video"></i> <span>Join Session</span>
            </button>
          </div>
        </div>

        <!-- 3-Column Collaboration Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <!-- Left: Members & Study Goals (4 Cols) -->
          <div class="lg:col-span-4 space-y-6">
            <!-- Members Roster (4+ members) -->
            <div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <i class="fas fa-users text-cyan-400"></i> Members Roster (${grp.members.length})
                </span>
                <span class="text-[10px] text-emerald-400 font-mono">
                  ${grp.members.filter(m => m.status === 'online').length} online
                </span>
              </div>

              <div class="space-y-2.5">
                ${grp.members.map(m => `
                  <div class="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div class="flex items-center gap-2.5">
                      <div class="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-500/40 flex items-center justify-center font-bold text-[10px] text-indigo-300">
                        ${m.avatar}
                      </div>
                      <div>
                        <span class="font-bold text-white block leading-tight">${m.name}</span>
                        <span class="text-[10px] text-slate-500">${m.role}</span>
                      </div>
                    </div>
                    <span class="w-2 h-2 rounded-full ${m.status === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}"></span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Study Goals Checklist -->
            <div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <i class="fas fa-check-square text-emerald-400"></i> Study Milestones
                </span>
                <span class="text-xs font-mono font-bold text-emerald-400">${progressPercent}%</span>
              </div>
              <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
                <div class="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all" style="width: ${progressPercent}%"></div>
              </div>

              <div class="space-y-2 text-xs">
                ${grp.goals.map(g => `
                  <label class="flex items-start gap-2.5 p-2 rounded-lg bg-slate-950/50 border border-slate-800/60 text-slate-300 hover:text-white cursor-pointer transition">
                    <input type="checkbox" ${g.completed ? 'checked' : ''} onchange="StudyGroups.toggleGoal('${grp.id}', '${g.id}')" class="mt-0.5 accent-indigo-500 rounded">
                    <span class="${g.completed ? 'line-through text-slate-500' : 'text-slate-200'}">${g.text}</span>
                  </label>
                `).join('')}
              </div>

              <div class="mt-3 pt-3 border-t border-slate-800">
                <div class="flex items-center gap-2">
                  <input id="new-group-goal-input" type="text" placeholder="Add study goal..." class="flex-1 bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-1.5 focus:border-cyan-400 focus:outline-none">
                  <button onclick="StudyGroups.addGoal('${grp.id}')" class="px-3 py-1.5 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg">
                    + Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Middle: Group Chat & Discussion (5 Cols) -->
          <div class="lg:col-span-5 flex flex-col justify-between p-4 rounded-2xl bg-slate-900/80 border border-slate-800 min-h-[420px]">
            <div>
              <div class="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
                <span class="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <i class="fas fa-comments text-indigo-400"></i> Group Study Discussion
                </span>
                <span class="text-[10px] text-slate-500 font-mono">End-to-End Synced</span>
              </div>

              <div id="group-chat-messages-box" class="h-64 overflow-y-auto space-y-2.5 pr-2">
                ${grp.chatMessages.map(msg => `
                  <div class="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs">
                    <div class="flex items-center justify-between gap-2 mb-1">
                      <span class="font-bold text-cyan-300 text-[11px]">${msg.sender}</span>
                      <span class="text-[10px] text-slate-500 font-mono">${msg.time}</span>
                    </div>
                    <p class="text-slate-300 text-[11.5px] leading-relaxed">${msg.text}</p>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Chat Input -->
            <div class="pt-3 border-t border-slate-800 flex items-center gap-2">
              <input id="group-chat-input" type="text" placeholder="Type message to group..." class="flex-1 bg-slate-950 border border-slate-700 text-xs text-white rounded-xl px-3.5 py-2 focus:border-indigo-400 focus:outline-none" onkeydown="if(event.key === 'Enter') StudyGroups.sendChatMessage('${grp.id}')">
              <button onclick="StudyGroups.sendChatMessage('${grp.id}')" class="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition">
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>

          <!-- Right: Shared Notes & Resources (3 Cols) -->
          <div class="lg:col-span-3 space-y-4">
            <div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <i class="fas fa-book-open text-purple-400"></i> Shared Resources
                </span>
                <span class="text-[10px] text-slate-500">${grp.resources.length} links</span>
              </div>

              <div class="space-y-2.5">
                ${grp.resources.map(res => `
                  <a href="${res.link}" target="_blank" class="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-purple-500/50 flex items-center justify-between text-xs group transition">
                    <div>
                      <span class="text-[11px] font-bold text-slate-200 group-hover:text-cyan-300 transition block leading-tight">${res.title}</span>
                      <span class="text-[9px] text-slate-500 uppercase font-mono">${res.type}</span>
                    </div>
                    <i class="fas fa-external-link-alt text-[10px] text-slate-500 group-hover:text-cyan-400"></i>
                  </a>
                `).join('')}
              </div>

              <button onclick="StudyGroups.addResourceLink('${grp.id}')" class="w-full mt-3 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center justify-center gap-1">
                <i class="fas fa-link text-[10px]"></i> + Add Resource Link
              </button>
            </div>

            <!-- Study Session Card -->
            <div class="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-xs">
              <span class="text-indigo-400 font-bold block mb-1 uppercase tracking-wider text-[10px]">📅 Next Collaborative Sprint</span>
              <p class="font-bold text-white text-sm mb-1">${grp.meetingSchedule.split('·')[0]}</p>
              <p class="text-slate-400 text-[11px] mb-3">${grp.meetingSchedule.split('·')[1] || 'Virtual Room'}</p>
              <button onclick="window.App.showToast('✅ Study session synced to your calendar!', 'success')" class="w-full py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition">
                Add to My Calendar
              </button>
            </div>
          </div>

        </div>
      </div>
    `;
  },

  toggleGoal(groupId, goalId) {
    const grp = window.CampusData.studyGroups.find(g => g.id === groupId);
    if (!grp) return;
    const goal = grp.goals.find(g => g.id === goalId);
    if (goal) {
      goal.completed = !goal.completed;
      this.renderGroupsList();
      this.renderActiveGroupWorkspace();
      window.App.showToast(goal.completed ? "Goal marked as completed! 🎉" : "Goal marked pending.", "info");
    }
  },

  addGoal(groupId) {
    const input = document.getElementById('new-group-goal-input');
    const text = input?.value.trim();
    if (!text) return;
    const grp = window.CampusData.studyGroups.find(g => g.id === groupId);
    if (grp) {
      grp.goals.push({ id: "g-" + Date.now(), text: text, completed: false });
      this.renderGroupsList();
      this.renderActiveGroupWorkspace();
      window.App.showToast(`New study milestone added to ${grp.name}!`, "success");
    }
  },

  sendChatMessage(groupId) {
    const input = document.getElementById('group-chat-input');
    const text = input?.value.trim();
    if (!text) return;
    input.value = '';

    const grp = window.CampusData.studyGroups.find(g => g.id === groupId);
    if (grp) {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      grp.chatMessages.push({
        sender: window.CampusData.activeUser?.name || 'You',
        time: time,
        text: text
      });
      this.renderActiveGroupWorkspace();
      
      const chatBox = document.getElementById('group-chat-messages-box');
      if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
    }
  },

  addResourceLink(groupId) {
    const title = prompt("Enter Resource Title (e.g., PyTorch Transformer Notes):");
    if (!title) return;
    const link = prompt("Enter URL (or Google Drive / GitHub link):", "https://github.com");
    if (!link) return;

    const grp = window.CampusData.studyGroups.find(g => g.id === groupId);
    if (grp) {
      grp.resources.push({ title: title, link: link, type: "Web" });
      this.renderActiveGroupWorkspace();
      window.App.showToast("Resource link added to group workspace!", "success");
    }
  },

  joinLiveSession() {
    window.App.showToast("🚀 Connecting to Virtual Group Study Room... Audio & code editor initialized.", "success");
  },

  openCreateGroupModal() {
    const modal = document.getElementById('create-group-modal');
    if (modal) modal.classList.remove('hidden');
  },

  closeCreateGroupModal() {
    const modal = document.getElementById('create-group-modal');
    if (modal) modal.classList.add('hidden');
  },

  createNewGroup(event) {
    if (event) event.preventDefault();
    const name = document.getElementById('create-group-name')?.value.trim();
    const subject = document.getElementById('create-group-subject')?.value.trim();
    const schedule = document.getElementById('create-group-schedule')?.value.trim() || 'Tuesdays & Thursdays · 7:00 PM';
    const desc = document.getElementById('create-group-desc')?.value.trim() || 'Collaborative study group for course milestone mastery.';

    if (!name || !subject) {
      window.App.showToast("Please enter a Group Name and Focus Subject.", "warning");
      return;
    }

    const newGroup = {
      id: "grp-" + Date.now(),
      name: name,
      subject: subject,
      campusId: "global",
      creator: window.CampusData.activeUser?.name || "Student",
      createdAt: "Just now",
      meetingSchedule: schedule,
      description: desc,
      members: [
        { name: window.CampusData.activeUser?.name || "You", role: "Organizer", avatar: window.CampusData.activeUser?.avatarBadge || "ME", status: "online" }
      ],
      goals: [
        { id: "g1", text: "Complete syllabus orientation & project milestone 1", completed: false }
      ],
      resources: [],
      chatMessages: [
        { sender: window.CampusData.activeUser?.name || "You", time: "Just now", text: `Welcome to ${name}! Let's achieve top grades together.` }
      ]
    };

    window.CampusData.studyGroups.unshift(newGroup);
    this.activeGroupId = newGroup.id;
    this.closeCreateGroupModal();
    this.renderGroupsList();
    this.renderActiveGroupWorkspace();
    window.App.showToast(`🎉 Study group '${name}' created! You can now invite peers.`, "success");
  },

  openInviteModal() {
    const modal = document.getElementById('invite-members-modal');
    const container = document.getElementById('invite-members-list');
    if (!modal || !container) return;

    modal.classList.remove('hidden');

    container.innerHTML = window.CampusData.students.map(s => `
      <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-500/40 flex items-center justify-center font-bold text-indigo-300">
            ${s.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h5 class="font-bold text-white leading-tight">${s.name}</h5>
            <p class="text-[10px] text-slate-400">${s.college} · ${s.branch.split(' ')[0]}</p>
          </div>
        </div>
        <button onclick="StudyGroups.inviteStudentToGroup('${s.name}')" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition">
          + Add
        </button>
      </div>
    `).join('');
  },

  closeInviteModal() {
    const modal = document.getElementById('invite-members-modal');
    if (modal) modal.classList.add('hidden');
  },

  inviteStudentToGroup(studentName) {
    const grp = window.CampusData.studyGroups.find(g => g.id === this.activeGroupId);
    if (!grp) return;

    if (grp.members.some(m => m.name === studentName)) {
      window.App.showToast(`${studentName} is already a member of this study group!`, "info");
      return;
    }

    grp.members.push({
      name: studentName,
      role: "Member",
      avatar: studentName.split(' ').map(n => n[0]).join(''),
      status: "online"
    });

    this.renderGroupsList();
    this.renderActiveGroupWorkspace();
    window.App.showToast(`📩 Added ${studentName} to ${grp.name}!`, "success");
  }
};
