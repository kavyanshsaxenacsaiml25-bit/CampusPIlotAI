# ⚡ CAMPUSPILOT AI · One Campus. One Intelligent Workspace.

> **Product:** CAMPUSPILOT AI  
> **Tagline:** One Campus. One Intelligent Workspace.  
> **Team:** ASTRANOVA  
> **Hackathon Track:** Unified AI-Powered Multi-Campus Operating System  
> **Architecture:** Modern Multi-Campus SaaS / Single-Page Application (SPA) + Zero-Dependency REST API  

---

## 👥 Team AstraNova
* **Priyanshi Mishra** — *Product Architect & Campus Ecosystem Lead*
* **Kavyansh Saxena** — *System Architect, AI Orchestration Layer & Full-Stack Integration*
* **Anushka Shukla** — *Voice AI Studio & Adaptive Tri-Lingual Processing Lead*
* **Dhruv Mishra** — *Autonomous Agent Lead & AVA Safety Framework Engineer*

---

## 🎯 The Vision: Breaking Chronic Campus Fragmentation
College students and campus communities face severe context switching across dozens of isolated portals, chat channels, and notice boards. **CampusPilot AI** consolidates the entire collegiate journey into an institution-independent, intelligent platform:

1. **Authentication-First Experience:** A clean, cybernetic, and secure onboarding gateway with biometric simulation, email/password, Google sign-in simulation, 1-click evaluation profiles, and campus registry onboarding.
2. **Multi-Campus Data Isolation:** Designed for students across any university or college (Apex Institute of Technology, Metro State, Pacific Polytech, National Science, Imperial College, or custom institutions).
3. **Campus Study Matcher & Group Study Workspace:** AI-driven peer synergy matching and a comprehensive group study hub supporting 3–4+ members with live group discussions, interactive milestone progress, shared research resources, and calendar scheduling.
4. **Campus Opportunities & Discovery Engine:** Live auto-discovery feed syncing verified hackathons, corporate internships, coding competitions, research workshops, and scholarships with application tracking.
5. **Adaptive Tri-Lingual Voice Assistant:** In-browser Web Speech STT/TTS engine that seamlessly detects English, हिन्दी (Hindi), and Hinglish, conversing back in the user's chosen language with live audio waveforms.
6. **Autonomous AI Companion with AVA Safety:** Multi-step planning agent with a virtual Playwright browser simulator, an **AVA Human Approval Checkpoint** (Approval, Verification, Takeover), and downloadable cryptographic evidence receipts.
7. **Institutional Admin Gateway:** Moderation of reported content, pending opportunity approvals, and multi-campus registry management.

---

## 🚀 Key Modules & Product Capabilities

### 1. 🔐 Authentication & Onboarding Gateway (First Experience)
When someone opens CampusPilot AI, they are greeted by a modern, full-screen authentication experience before accessing private dashboard data:
* **Multiple Auth Methods:** Sign In with email/password, Sign Up with custom institution onboarding, Google Sign-in simulation, and Holographic Biometric Laser Scan.
* **1-Click Hackathon Evaluator Profiles:** Instant evaluation access for all 4 AstraNova core members plus faculty evaluator profiles.
* **Session Persistence:** Secure session management stored locally in `localStorage`.
* **Campus Selector:** Switch or search for any institution globally with isolated campus feeds and directory.

### 2. 👥 Campus Study Matcher & Multi-Member Study Groups
* **Peer Synergy Matcher:** Calculates compatibility scores based on subject, major, semester, and study style.
* **Study Invitations:** Send, accept, and decline peer study invitations in real time.
* **Multi-Member Group Study Workspace:**
  * Supports groups of 3–4+ students (e.g., *Deep Learning Research Sprint*, *DSA & LeetCode 150 Squad*, *Full-Stack SaaS & Agent Jam*).
  * **Interactive Milestone Progress:** Check off group goals with an animated progress bar.
  * **Live Group Discussion Thread:** Real-time collaborative chat for active study sessions.
  * **Shared Resources & References:** Instant access to shared GitHub repos, arXiv papers, and Drive folders.
  * **Scheduling & Reminders:** Sync meeting sessions directly with Google/Apple calendar.
  * **Invite Peer Modal:** Add additional students to any group instantly.

### 3. 🎯 Campus Opportunities & Discovery Engine
* **Verified Multi-Category Feed:**
  * 🏆 **Hackathons** (e.g., *The Corporate Glitch '26*, *Global AI Agents Hackathon*)
  * 💼 **Internships** (e.g., *Google DeepMind Research Intern*, *Microsoft Software Engineering*)
  * ⚡ **Competitions** (e.g., *ACM-ICPC Regional Qualifiers*)
  * 🔬 **Workshops** (e.g., *Autonomous Agents with LangGraph Masterclass*)
  * 🎓 **Scholarships** (e.g., *Grace Hopper Tech Scholars Award*)
* **Automated Discovery Feed:** Background sync simulator fetching permitted RSS feeds and public developer portals with last-synced telemetry.
* **Application Tracker:** Filter by category, search by keyword, bookmark favorite opportunities, and toggle application status ("Saved" vs "Applied").
* **Post Opportunity Modal:** Allow authorized campus leads to submit new opportunities for admin review.

### 4. 🎙️ Voice AI Studio (English, हिन्दी Hindi, Hinglish)
* **Adaptive Multi-Lingual Engine:**
  * Uses browser Web Speech Recognition (`SpeechRecognition` or `webkitSpeechRecognition`) and Speech Synthesis (`SpeechSynthesisUtterance`).
  * Shows interim recognition in the prompt field, supports Hindi/English/Hinglish language hints, and routes the final transcript through the active agent.
  * If browser recognition is unavailable, records audio with `MediaRecorder` and sends it to the server's configured OpenAI-compatible transcription endpoint.
  * Microphone permission is requested only after the user starts voice input. Listening, processing, success, and error states include stop, cancel, and retry controls.
  * Responds dynamically in the **exact same language** with tailored native speech voices (`hi-IN`, `en-IN`, `en-US`).
* **Visual Voice UI:** Animated audio waveforms, live speech-to-text transcripts, intent classification chips, sentiment score meters, and language badges.
* **Custom Agent Studio:** Define custom campus assistants by simply providing plain-language instructions.

### 5. 🤖 Autonomous AI Companion & The AVA Safety Framework
* **Multi-Step Action Planner:** Decomposes complex student requests (e.g., event registration, hostel maintenance tickets, scholarship submissions) into executable browser pipelines.
* **Virtual Playwright Browser Simulation:** Watch the agent navigate the web, inspect DOM elements, and populate fields step by step.
* **🛡️ AVA Safety Framework:**
  * **Approval Checkpoint (A):** The agent halts automatically before any high-consequence action (submitting applications, financial commitments) to request explicit human confirmation.
  * **Outcome Verification (V):** Asserts DOM verification tokens and status badges before finalizing.
  * **Manual Takeover:** Allows the user to pause or take over browser execution at any moment.
* **Cryptographic Evidence Tickets:** Generates downloadable verified receipts (e.g., `REG-GLITCH-2026-9812`) containing timestamps, payload hashes, and execution logs.

### 6. 🛡️ Administrative Portal
* **Moderation Queue:** Approve or flag user-submitted campus opportunities.
* **Campus Registry:** Add new university nodes and manage domain verification.
* **Platform Audit Logs:** Live system telemetry monitoring security events and autonomous agent execution.

---

## 🛠️ Architecture & Technology Stack
| Layer | Technology | Key Responsibility |
|---|---|---|
| **Frontend** | Vanilla JS (ES6+), HTML5, Tailwind CSS, FontAwesome | High-performance, zero-dependency responsive client SPA |
| **Backend** | Node.js HTTP / REST Server | API endpoints plus a server-side audio transcription proxy |
| **Speech Engine** | Web Speech API, MediaRecorder, Speech Synthesis | Browser STT with configured server fallback and TTS playback |
| **Agent Engine** | Playwright Simulation + AVA Checkpoints | Autonomous browser execution with human-in-the-loop safety |
| **State & Auth** | LocalStorage + In-Memory Reactive Bus | Multi-campus persistence, session tokens, dynamic UI state |

---

## ⚡ Quick Start Guide

### Option 1: One-Click Windows Batch Runner (Recommended)
Double-click the included launcher in the project root:
```cmd
run_demo.bat
```
This starts the local Node.js server and launches `http://localhost:3000` in your default browser.

### Option 2: Using Node.js CLI
Node.js 18 or newer is required. Astra's text and voice conversations use Gemini; set `GEMINI_API_KEY` in the root `.env` file. The server loads that file before handling requests, and `.env` is excluded from Git and static-file access. Never put API keys in browser code. Voice input first uses browser speech recognition; if its network service fails, Voice Studio falls back to MediaRecorder and server-side transcription. Configure `STT_API_KEY`/`STT_API_URL` to use an OpenAI-compatible transcription service, or leave them unset to transcribe through Gemini with `GEMINI_API_KEY`.

Create or edit the root `.env` file:

```env
GEMINI_API_KEY=your-new-gemini-api-key
```

Save the file, then restart the Node.js server so dotenv can load it.

```powershell
# Optional: default is gemini-3.1-flash-lite
$env:GEMINI_MODEL = "gemini-3.1-flash-lite"
# Optional: use GOOGLE_API_KEY if that is the name configured by your deployment
# $env:GOOGLE_API_KEY = "your-gemini-api-key"
$env:STT_API_KEY = "your-provider-key"
# Optional: default is https://api.openai.com/v1/audio/transcriptions
$env:STT_API_URL = "https://api.openai.com/v1/audio/transcriptions"
# Optional: default is whisper-1
$env:STT_MODEL = "whisper-1"
npm start
```

The `/api/chat` endpoint calls Gemini server-side and retains the most recent conversation turns in process memory for the current browser session. A missing or rejected Gemini key, quota limit, provider error, or timeout is reported as an error rather than replaced with a canned answer. The server reads `GEMINI_API_KEY` (or `GOOGLE_API_KEY`) from its process environment, with the root `.env` loaded at startup; an environment variable already set by the host takes precedence. The default model is `gemini-3.1-flash-lite`, verified against this key's `generateContent` model list and a real generation request. Minimal thinking is configured for responsive chat, with a 30-second server timeout. `GEMINI_MODEL` can optionally be set in the server environment.

When `STT_API_KEY` is set, `STT_API_URL` must be an OpenAI-compatible audio-transcriptions endpoint returning JSON with a `text` field. Both transcription and Gemini keys remain server-side. Deployments should configure these values as environment secrets and serve the app over HTTPS. Microphone access is not available from a `file://` URL.

```bash
# Navigate to the project directory
cd campuspilot-ai

# Start the server
npm start
# or: node server.js
```
Then visit `http://localhost:3000` in your web browser.

### Option 3: Direct In-Browser Open (Limited Client-Side Demo)
No Node.js installed? You can still open `index.html` directly for the client-side demo. The MediaRecorder transcription fallback requires the Node.js server; for microphone speech recognition and all backend features, use `http://localhost:3000` or the deployed HTTPS site.

---

## 🏆 Hackathon 3-Minute Presentation Walkthrough

1. **Minute 1 — Modern SaaS Auth Gateway & Multi-Campus Registry:**
   * Open the app: Show the **First-Experience Authentication Portal**.
   * Demonstrate the **Holographic Biometric Scanner** or click a **1-Click AstraNova Roster Profile** (e.g., *Kavyansh Saxena*).
   * Note the institution selector: Point out how CampusPilot AI operates across multiple independent institutions seamlessly.

2. **Minute 2 — Voice AI Studio & Multi-Member Study Groups:**
   * Navigate to **Voice AI Studio**: Click the microphone or type in **Hinglish** (*"Corporate Glitch 26 kya hai?"*), **Hindi** (*"हैकथॉन कैसे जीतें?"*), or **English**.
   * Observe the dynamic language detection, real speech synthesis in native accents, and live audio waveforms.
   * Switch to **Study Groups**: Show real 3–4+ member group collaboration (*Deep Learning Research Sprint*), toggle interactive milestones, show live group discussion, and demonstrate the Peer Study Matcher radar.

3. **Minute 3 — Opportunities Engine & Autonomous AI Companion (AVA Safety):**
   * Visit **Opportunities**: Show the auto-discovery feed syncing hackathons, internships, and scholarships with application status badges.
   * Switch to **AI Companion**: Click *"Run Task"*. Watch the Playwright browser simulation navigate and fill out the registration form.
   * Highlight the **AVA Human Approval Checkpoint**: The autonomous worker pauses before consequential actions, requiring manual confirmation.
   * Click *"Approve & Execute"*, download the cryptographic evidence ticket, and conclude!
