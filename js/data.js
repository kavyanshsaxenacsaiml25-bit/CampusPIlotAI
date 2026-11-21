// CampusPilot AI - Multi-Campus Master Data Store
// Independent, Institutional-Neutral Campus Operating System

window.CampusData = {
  // Institutional Registry
  campuses: [
    { id: "apex", name: "Apex Institute of Technology", shortCode: "AIT", location: "Metropolis Campus", domain: "apextech.edu" },
    { id: "metro", name: "Metro State University", shortCode: "MSU", location: "Central Campus", domain: "metrostate.edu" },
    { id: "pacific", name: "Pacific Polytech Institute", shortCode: "PPI", location: "Tech Valley Campus", domain: "pacificpoly.edu" },
    { id: "national", name: "National Science University", shortCode: "NSU", location: "Science Park", domain: "nationalsci.ac" },
    { id: "imperial", name: "Imperial College of Engineering", shortCode: "ICE", location: "Global City", domain: "imperial.edu" }
  ],

  // Active Authenticated User Session
  activeUser: {
    name: "Kavyansh Saxena",
    studentId: "STU-2026-8812",
    email: "kavyansh.saxena@apextech.edu",
    branch: "Computer Science & Engineering (AI/ML)",
    semester: "Semester 6",
    college: "Apex Institute of Technology",
    campusId: "apex",
    team: "AstraNova",
    cgpa: "8.94",
    avatarBadge: "KS",
    role: "student",
    skills: ["AI/ML", "Python", "Tool Calling", "System Architecture", "NLP"]
  },

  // Peer Network Across Multi-Campus Ecosystem
  students: [
    {
      id: "std-1",
      name: "Priyanshi Mishra",
      branch: "Computer Science & Engineering",
      semester: "Semester 6",
      college: "Metro State University",
      campusId: "metro",
      skills: ["React", "Flutter", "UI/UX", "Product Strategy", "Figma"],
      subjects: ["Deep Learning", "Cloud Architecture", "Software Engineering"],
      studyPreference: "Late Night Sprints",
      bio: "Product-minded frontend architect and UI designer. Love building frictionless user workflows.",
      matchScore: 97,
      status: "online"
    },
    {
      id: "std-2",
      name: "Anushka Shukla",
      branch: "Data Science & Artificial Intelligence",
      semester: "Semester 6",
      college: "National Science University",
      campusId: "national",
      skills: ["NLP", "Speech Processing", "Python", "Transformers", "Audio DSP"],
      subjects: ["Natural Language Processing", "Machine Learning", "DSA with Java"],
      studyPreference: "Weekend Deep Work",
      bio: "Conversational AI researcher. Specializing in speech-to-text and sub-second voice synthesis models.",
      matchScore: 94,
      status: "online"
    },
    {
      id: "std-3",
      name: "Dhruv Mishra",
      branch: "Computer Science & Engineering",
      semester: "Semester 6",
      college: "Pacific Polytech Institute",
      campusId: "pacific",
      skills: ["Node.js", "Distributed Systems", "Playwright", "PostgreSQL", "Docker"],
      subjects: ["Operating Systems", "Cloud Architecture", "Distributed Databases"],
      studyPreference: "Daily Revision",
      bio: "Backend orchestration and autonomous worker pipelines. Playwright automation specialist.",
      matchScore: 92,
      status: "online"
    },
    {
      id: "std-4",
      name: "Elena Vance",
      branch: "Artificial Intelligence & Robotics",
      semester: "Semester 6",
      college: "Apex Institute of Technology",
      campusId: "apex",
      skills: ["Computer Vision", "PyTorch", "OpenCV", "Deep Reinforcement Learning"],
      subjects: ["Deep Learning", "Computer Vision", "Robotics Dynamics"],
      studyPreference: "Weekend Deep Work",
      bio: "Researching visual transformer architectures and multi-agent coordination.",
      matchScore: 89,
      status: "offline"
    },
    {
      id: "std-5",
      name: "Marcus Chen",
      branch: "Software Systems Engineering",
      semester: "Semester 4",
      college: "Metro State University",
      campusId: "metro",
      skills: ["Java", "DSA", "Spring Boot", "High-Performance Systems"],
      subjects: ["DSA with Java", "Algorithm Analysis", "Database Management"],
      studyPreference: "Daily Revision",
      bio: "Competitive programming enthusiast. Solved 400+ LeetCode problems, preparing for placement interviews.",
      matchScore: 86,
      status: "online"
    },
    {
      id: "std-6",
      name: "Riya Sharma",
      branch: "Cybersecurity & Information Defense",
      semester: "Semester 6",
      college: "Imperial College of Engineering",
      campusId: "imperial",
      skills: ["Cybersecurity", "Network Defense", "Linux Kernel", "Reverse Engineering"],
      subjects: ["Network Security", "Cryptography", "Secure Software Design"],
      studyPreference: "Late Night Sprints",
      bio: "CTF player and zero-trust protocol researcher. Focusing on verifiable agent safety boundaries.",
      matchScore: 82,
      status: "offline"
    }
  ],

  // Real Multi-Member Collaborative Study Groups (3–4+ members)
  studyGroups: [
    {
      id: "grp-101",
      name: "Deep Learning Research Sprint",
      subject: "Deep Learning & Vision Transformers",
      campusId: "global",
      creator: "Kavyansh Saxena",
      createdAt: "3 days ago",
      meetingSchedule: "Wednesdays & Saturdays · 6:00 PM (Virtual Lab)",
      description: "Collaborative paper reading and PyTorch implementations of attention mechanisms and generative vision models.",
      members: [
        { name: "Kavyansh Saxena", role: "Organizer", avatar: "KS", status: "online" },
        { name: "Priyanshi Mishra", role: "Member", avatar: "PM", status: "online" },
        { name: "Anushka Shukla", role: "Member", avatar: "AS", status: "online" },
        { name: "Elena Vance", role: "Member", avatar: "EV", status: "offline" }
      ],
      goals: [
        { id: "g1", text: "Implement Multi-Head Attention in pure PyTorch", completed: true },
        { id: "g2", text: "Read ViT (Vision Transformer) original paper", completed: true },
        { id: "g3", text: "Fine-tune model on campus dataset", completed: false },
        { id: "g4", text: "Prepare 15-minute presentation slides", completed: false }
      ],
      resources: [
        { title: "PyTorch Attention Documentation", link: "https://pytorch.org/docs/stable/nn.html#multiheadattention", type: "Docs" },
        { title: "Shared Experiment Weights Repo", link: "https://github.com/astranova/dl-sprint-2026", type: "GitHub" },
        { title: "Lecture Notes Chapter 5: Attention", link: "https://drive.google.com", type: "Notes" }
      ],
      chatMessages: [
        { sender: "Kavyansh Saxena", time: "5:30 PM", text: "Hey squad! I uploaded the PyTorch baseline notebook in our resources tab." },
        { sender: "Priyanshi Mishra", time: "5:32 PM", text: "Awesome! I'll test the training pipeline with our sample data." },
        { sender: "Anushka Shukla", time: "5:35 PM", text: "I completed the tokenization step, results look super clean!" }
      ]
    },
    {
      id: "grp-102",
      name: "DSA & LeetCode 150 Squad",
      subject: "Data Structures & Competitive Algorithms",
      campusId: "global",
      creator: "Marcus Chen",
      createdAt: "1 week ago",
      meetingSchedule: "Daily · 9:00 PM (Discussion Room B / Discord)",
      description: "Solving 2 medium-hard LeetCode problems every day with live whiteboard sessions and peer code reviews.",
      members: [
        { name: "Marcus Chen", role: "Organizer", avatar: "MC", status: "online" },
        { name: "Dhruv Mishra", role: "Member", avatar: "DM", status: "online" },
        { name: "Aryan Verma", role: "Member", avatar: "AV", status: "online" },
        { name: "Kavyansh Saxena", role: "Member", avatar: "KS", status: "online" },
        { name: "Riya Sharma", role: "Member", avatar: "RS", status: "offline" }
      ],
      goals: [
        { id: "d1", text: "Solve 20 Dynamic Programming problems", completed: true },
        { id: "d2", text: "Graph Traversal (Dijkstra, Topological Sort)", completed: true },
        { id: "d3", text: "Segment Trees and Binary Lifting", completed: false }
      ],
      resources: [
        { title: "NeetCode 150 Practice Roadmap", link: "https://neetcode.io", type: "Roadmap" },
        { title: "Algorithm Visualization Tool", link: "https://visualgo.net", type: "Tool" }
      ],
      chatMessages: [
        { sender: "Marcus Chen", time: "Yesterday", text: "Today's problem: Course Schedule II (Topological Sort). Check the board!" },
        { sender: "Dhruv Mishra", time: "Yesterday", text: "Solved using Kahn's BFS algorithm, running in O(V+E)." }
      ]
    },
    {
      id: "grp-103",
      name: "Full-Stack SaaS & Autonomous Agent Jam",
      subject: "Distributed Systems & Agentic Workflows",
      campusId: "global",
      creator: "Dhruv Mishra",
      createdAt: "4 days ago",
      meetingSchedule: "Fridays · 4:00 PM (Innovation Hub)",
      description: "Building production full-stack tools integrating Playwright worker queues, real-time WebSockets, and AVA safety guardrails.",
      members: [
        { name: "Dhruv Mishra", role: "Organizer", avatar: "DM", status: "online" },
        { name: "Priyanshi Mishra", role: "Member", avatar: "PM", status: "online" },
        { name: "Kavyansh Saxena", role: "Member", avatar: "KS", status: "online" }
      ],
      goals: [
        { id: "s1", text: "Design distributed worker architecture", completed: true },
        { id: "s2", text: "Implement AVA human-in-the-loop checkpoint", completed: true },
        { id: "s3", text: "Setup end-to-end telemetry and verification token logging", completed: true }
      ],
      resources: [
        { title: "Playwright Python API Docs", link: "https://playwright.dev", type: "Docs" },
        { title: "FastAPI Async Architecture Guide", link: "https://fastapi.tiangolo.com", type: "Guide" }
      ],
      chatMessages: [
        { sender: "Dhruv Mishra", time: "10:14 AM", text: "The AVA checkpoint modal passed all safety test cases with 100% human sign-off." },
        { sender: "Kavyansh Saxena", time: "10:18 AM", text: "Great! Let's integrate it directly with the autonomous browser runner." }
      ]
    }
  ],

  // Peer Study Invitations
  studyInvitations: [
    {
      id: "inv-201",
      sender: "Marcus Chen",
      senderAvatar: "MC",
      senderCollege: "Metro State University",
      subject: "DSA with Java & Graphs",
      message: "Hey! Saw your profile in the Study Matcher. Want to collaborate on Graph algorithms this weekend?",
      timestamp: "2 hours ago",
      status: "pending"
    },
    {
      id: "inv-202",
      sender: "Elena Vance",
      senderAvatar: "EV",
      senderCollege: "Apex Institute of Technology",
      subject: "Deep Learning & PyTorch",
      message: "Looking for a study partner to co-author a computer vision project. Let me know if you are open!",
      timestamp: "Yesterday",
      status: "accepted"
    }
  ],

  // Global & Institutional Opportunities (Hackathons, Internships, Competitions, Workshops, Scholarships)
  opportunities: [
    {
      id: "opp-101",
      title: "Global GenAI & Autonomous Systems Hackathon 2026",
      category: "Hackathons",
      organizer: "BuildersHub & Open Source Collective",
      source: "Devpost RSS · Verified Feed",
      lastUpdated: "Synced 10m ago",
      date: "March 20 - 22, 2026",
      deadline: "March 15, 2026",
      location: "Hybrid (Virtual + Partner Hubs)",
      prizePool: "$50,000 Prize Pool",
      description: "Flagship global hackathon focused on autonomous browser agents, tool-calling LLMs, and multi-agent coordination.",
      badge: "Featured Hackathon",
      badgeClass: "badge-purple",
      applyLink: "https://devpost.com",
      campusId: "global",
      hasDelegation: true,
      status: "applied"
    },
    {
      id: "opp-102",
      title: "AI Research & Machine Learning Engineering Intern",
      category: "Internships",
      organizer: "DecodeLabs AI Systems",
      source: "Industry Career API · Verified",
      lastUpdated: "Synced 25m ago",
      date: "Summer 2026 (3 Months)",
      deadline: "April 1, 2026",
      location: "Remote / Hybrid",
      prizePool: "$4,500 / Month + Mentorship",
      description: "Work on speech-to-text models, cosine recommendation algorithms, and real-time inference latency optimization.",
      badge: "Paid Internship",
      badgeClass: "badge-cyan",
      applyLink: "https://decodelabs.ai/careers",
      campusId: "global",
      hasDelegation: true,
      status: "saved"
    },
    {
      id: "opp-103",
      title: "ACM Collegiate Algorithm & Competitive Coding Cup",
      category: "Competitions",
      organizer: "International ACM Student Chapter",
      source: "ACM Regional Portal",
      lastUpdated: "Synced 1h ago",
      date: "April 12, 2026",
      deadline: "April 5, 2026",
      location: "Inter-University Arena",
      prizePool: "$15,000 + Global Ranking",
      description: "Speed algorithm contest testing dynamic programming, graph theory, and advanced data structures.",
      badge: "Coding Contest",
      badgeClass: "badge-green",
      applyLink: "https://acm.org",
      campusId: "global",
      hasDelegation: false,
      status: "none"
    },
    {
      id: "opp-104",
      title: "Masterclass: Browser Automation & Playwright Tool-Calling",
      category: "Workshops",
      organizer: "Developer Student Clubs",
      source: "Campus Tech Feed",
      lastUpdated: "Synced 40m ago",
      date: "March 8, 2026 · 4:00 PM EST",
      deadline: "March 7, 2026",
      location: "Virtual Hands-On Session",
      prizePool: "Free Verified Certificate",
      description: "Deep dive into building reliable Playwright headless workers, DOM parsing, and safe human-in-the-loop checkpoints.",
      badge: "Hands-on Masterclass",
      badgeClass: "badge-cyan",
      applyLink: "https://community.dev",
      campusId: "global",
      hasDelegation: true,
      status: "none"
    },
    {
      id: "opp-105",
      title: "NextGen Tech Pioneers STEM Excellence Scholarship",
      category: "Scholarships",
      organizer: "Global Technology Foundation",
      source: "Official Education Grant Portal",
      lastUpdated: "Synced 2h ago",
      date: "Academic Year 2026-27",
      deadline: "May 1, 2026",
      location: "Open to All Engineering Undergrads",
      prizePool: "$10,000 Tuition Grant",
      description: "Merit and innovation scholarship for students building open-source projects in artificial intelligence and systems engineering.",
      badge: "Merit Grant",
      badgeClass: "badge-amber",
      applyLink: "https://scholarships.org",
      campusId: "global",
      hasDelegation: false,
      status: "none"
    },
    {
      id: "opp-106",
      title: "Distributed Cloud Infrastructure & Kubernetes Residency",
      category: "Internships",
      organizer: "CloudScale Systems",
      source: "GitHub Campus Talent Hub",
      lastUpdated: "Synced 1h ago",
      date: "6-Month Co-Op",
      deadline: "April 15, 2026",
      location: "San Francisco / Remote",
      prizePool: "$5,200 / Month",
      description: "Architecting zero-downtime microservices, containerized worker nodes, and telemetry pipelines.",
      badge: "Engineering Co-Op",
      badgeClass: "badge-purple",
      applyLink: "https://cloudscale.io/internships",
      campusId: "global",
      hasDelegation: true,
      status: "none"
    }
  ],

  // Pre-configured Campus AI Voice Agents
  initialAgents: [
    {
      id: "agent-1",
      name: "Astra Campus Guide",
      role: "Universal Campus Advisor & Navigation",
      language: "Hinglish (Hindi + English)",
      tone: "Friendly Peer",
      instructions: "You are Astra, the intelligent voice assistant for CampusPilot AI. You assist students from any college or university. You help find study groups, answer academic questions, navigate campus spaces, and discover hackathons.",
      knowledgeBase: "Academic course directories, peer study matching protocols, campus opportunity database.",
      avatar: "🎙️",
      callsHandled: 184
    },
    {
      id: "agent-2",
      name: "Opportunity & Hackathon Scout",
      role: "Hackathon & Career Strategist",
      language: "English",
      tone: "Energetic Mentor",
      instructions: "You help students discover relevant hackathons, internships, and research grants. You explain eligibility, deadlines, and provide tips for winning team presentations.",
      knowledgeBase: "Global hackathon rules, internship application deadlines, Devpost & GitHub APIs.",
      avatar: "⚡",
      callsHandled: 126
    },
    {
      id: "agent-3",
      name: "MentorAI Subject Quizzer",
      role: "Instant Subject Quiz & Academic Coach",
      language: "English",
      tone: "Academic Coach",
      instructions: "You quiz students on DSA, Machine Learning, Operating Systems, and Cloud Architectures. Give concise feedback, point out edge cases, and clarify complex concepts.",
      knowledgeBase: "Engineering CS curriculum: Algorithms, Deep Learning, Distributed Systems, Database Management.",
      avatar: "🧠",
      callsHandled: 92
    }
  ],

  // Platform Audit Logs (For Admin View)
  auditLogs: [
    { id: "LOG-901", action: "Opportunity Sync", detail: "Synced 6 opportunities from Devpost RSS & GitHub Talent Hub", time: "10 mins ago", status: "SUCCESS" },
    { id: "LOG-902", action: "AVA Safety Check", detail: "Human cryptographic approval recorded for Task TSK-8041", time: "1 hour ago", status: "VERIFIED" },
    { id: "LOG-903", action: "Study Group Formed", detail: "New collaborative study group 'Deep Learning Research Sprint' initialized", time: "3 hours ago", status: "ACTIVE" }
  ]
};
