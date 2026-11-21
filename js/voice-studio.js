// CampusPilot AI - Voice Intelligence Engine (Fully AI-Powered)
// Multi-Lingual NLP: English, Hindi हिन्दी, Hinglish
// Real-time Web Speech STT & TTS, Conversation History, Analytics
// Powered by: window.CampusAIEngine

window.VoiceStudio = {

  // ─── State ───────────────────────────────────────────────────────────────
  currentAgent: null,
  isRecording: false,
  isSpeaking: false,
  micState: 'idle',
  recognition: null,
  recognitionConstructor: null,
  speechRecognitionFallback: false,
  mediaRecorder: null,
  mediaStream: null,
  transcriptionController: null,
  recordingAttemptId: 0,
  recordedChunks: [],
  currentTranscript: '',
  draftBeforeRecording: '',
  cancelRequested: false,
  transcriptSubmitted: false,
  speechSynth: window.speechSynthesis,
  forcedLanguage: 'auto', // 'auto' | 'en' | 'hi' | 'hinglish'
  conversationHistory: [],   // {sender, text, lang, timestamp}[]  max 20
  analyticsCallCount: 0,
  conversationSessionId: null,
  requestInProgress: false,

  // ─── Init ─────────────────────────────────────────────────────────────────
  init() {
    this.currentAgent = window.CampusData && window.CampusData.initialAgents
      ? window.CampusData.initialAgents[0]
      : null;
    this.renderAgentSelector();
    this.setupSpeechRecognition();
    this.renderTranscriptHistory();
    this.setupLanguageSelector();
  },

  // ─── Language Selector ────────────────────────────────────────────────────
  setupLanguageSelector() {
    const langSelect = document.getElementById('voice-lang-override');
    if (!langSelect) return;
    langSelect.addEventListener('change', (e) => {
      this.forcedLanguage = e.target.value;
      const modeNames = {
        'auto': 'Auto-Detect (Adaptive)',
        'en': 'English 🇬🇧',
        'hi': 'हिन्दी 🇮🇳',
        'hinglish': 'Hinglish 💬'
      };
      if (window.App && window.App.showToast) {
        window.App.showToast(`Language set to: ${modeNames[this.forcedLanguage]}`, 'info');
      }
    });
  },

  // ─── Language Detection ──────────────────────────────────────────────────
  detectLanguage(text) {
    if (this.forcedLanguage && this.forcedLanguage !== 'auto') {
      return this.forcedLanguage;
    }
    // Delegate to AI engine if available
    if (window.CampusAIEngine && typeof window.CampusAIEngine.detectLanguage === 'function') {
      return window.CampusAIEngine.detectLanguage(text);
    }
    // Fallback own logic
    if (/[\u0900-\u097F]/.test(text)) return 'hi';
    const hinglishMarkers = [
      'kya','kaise','kaha','kahan','kab','karo','batao','bataiye','namaste','kaun','kyu','kyun',
      'shukriya','dost','bhai','yaar','mera','meri','mere','mujhe','tum','aap','kripya',
      'kaisa','kaisi','theek','hai','hain','ho','hoga','hogi','chahiye','madad','kaam',
      'padhai','pariksha','kidhar','kitna','kitni','bolo','sunao','achha','accha',
      'nahi','nahin','suno','karna','karenge','chal','raha','bata','samjhao'
    ];
    const words = text.toLowerCase().split(/\s+/);
    if (words.some(w => hinglishMarkers.includes(w.replace(/[^a-z]/g, '')))) return 'hinglish';
    return 'en';
  },

  // ─── Conversation History ─────────────────────────────────────────────────
  addToHistory(sender, text, lang) {
    this.conversationHistory.push({ sender, text, lang, timestamp: Date.now() });
    if (this.conversationHistory.length > 20) {
      this.conversationHistory.shift();
    }
  },

  getRecentHistory() {
    return this.conversationHistory.slice(-8);
  },

  getConversationSessionId() {
    if (this.conversationSessionId) return this.conversationSessionId;
    try {
      this.conversationSessionId = sessionStorage.getItem('campuspilot_ai_session');
    } catch (error) {
      console.warn('[VoiceStudio] Could not read the chat session from session storage.');
    }
    if (!this.conversationSessionId) {
      this.conversationSessionId = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      try {
        sessionStorage.setItem('campuspilot_ai_session', this.conversationSessionId);
      } catch (error) {
        console.warn('[VoiceStudio] Could not persist the chat session in session storage.');
      }
    }
    return this.conversationSessionId;
  },

  // ─── Core Query Handler ───────────────────────────────────────────────────
  async handleUserVoiceInput(text, fromVoice = false) {
    if (!text || !text.trim()) return false;
    text = text.trim();
    if (this.requestInProgress) {
      if (fromVoice) this.setMicState('error', 'Astra is still answering the previous message. Please wait and retry.');
      else if (window.App && window.App.showToast) window.App.showToast('Astra is still answering the previous message. Please wait and retry.', 'warning');
      return false;
    }

    if (fromVoice) this.setMicState('processing');
    const lang = this.detectLanguage(text);
    this.addToHistory('user', text, lang);
    this.addTranscriptItem('user', text, null, null, lang);
    this.setAssistantThinking(true);
    this.requestInProgress = true;
    let timeout;
    try {
      const controller = new AbortController();
      timeout = setTimeout(() => controller.abort(), 35000);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          sessionId: this.getConversationSessionId(),
          language: lang
        }),
        signal: controller.signal
      });
      let data;
      try {
        data = await response.json();
      } catch (error) {
        throw new Error('The AI server returned an invalid response. Please retry.');
      }
      if (!response.ok) throw new Error(data.error || `Astra could not answer (${response.status}).`);
      if (typeof data.reply !== 'string' || !data.reply.trim()) {
        throw new Error('Gemini returned an empty answer. Please retry.');
      }
      const result = {
        reply: data.reply.trim(),
        intent: 'Gemini AI',
        confidence: '',
        sentiment: 'Helpful',
        lang: data.language || lang
      };
      this.addToHistory('agent', result.reply, result.lang);
      this.addTranscriptItem('agent', result.reply, result.intent, result.confidence, result.lang);
      this.speak(result.reply, result.lang);
      this.updateAnalytics(result);
      if (fromVoice) {
        this.setMicState('success');
        setTimeout(() => {
          if (this.micState === 'success') this.setMicState('idle');
        }, 3000);
      }
      return true;
    } catch (error) {
      console.error('[VoiceStudio] Gemini chat request failed:', error);
      const message = error.name === 'AbortError' || error.name === 'TimeoutError'
        ? 'Astra timed out while waiting for Gemini. Please retry.'
        : error.message || 'Could not connect to Astra AI. Check your connection and retry.';
      this.conversationHistory.pop();
      this.addTranscriptItem('agent', message, 'Request failed', '', lang);
      if (fromVoice) this.setMicState('error', message);
      else if (window.App && window.App.showToast) window.App.showToast(message, 'error');
      return false;
    } finally {
      clearTimeout(timeout);
      this.requestInProgress = false;
      this.setAssistantThinking(false);
    }
  },

  // ─── Speech Recognition ───────────────────────────────────────────────────
  setupSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognitionConstructor = typeof SpeechRecognition === 'function'
      ? SpeechRecognition
      : null;
    this.recognition = null;
    if (!this.recognitionConstructor) return;

    try {
      this.recognition = new this.recognitionConstructor();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;
      this.recognition.onstart = () => this.setMicState('listening');
      this.recognition.onresult = (event) => {
        if (this.transcriptSubmitted) return;
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) finalTranscript += result[0].transcript;
          else interimTranscript += result[0].transcript;
        }

        this.currentTranscript = finalTranscript.trim();
        this.updateVoiceInput(finalTranscript || interimTranscript);
        if (this.currentTranscript) this.finalizeVoiceTranscript(this.currentTranscript);
      };
      this.recognition.onerror = (event) => {
        if (this.cancelRequested || event.error === 'aborted') {
          this.finishCancelledRecording();
          return;
        }
        console.warn('[VoiceStudio] Speech recognition error:', event.error);
        if (event.error === 'network' && !this.speechRecognitionFallback) {
          this.speechRecognitionFallback = true;
          this.recognition = null;
          this.startMediaRecorderFallback();
          return;
        }
        this.setMicState('error', this.recognitionErrorMessage(event.error));
      };
      this.recognition.onend = () => {
        if (this.cancelRequested) {
          this.finishCancelledRecording();
        } else if (this.speechRecognitionFallback) {
          return;
        } else if (this.currentTranscript && !this.transcriptSubmitted) {
          this.finalizeVoiceTranscript(this.currentTranscript);
        } else if (!this.currentTranscript
          && (this.micState === 'listening' || this.micState === 'processing')) {
          this.setMicState('error', 'No speech was transcribed. Check your microphone and try again.');
        }
      };
    } catch (error) {
      console.warn('[VoiceStudio] Could not initialize browser speech recognition:', error);
      this.recognition = null;
      this.recognitionConstructor = null;
    }
  },

  toggleVoiceRecording() {
    if (this.micState === 'listening') {
      this.stopVoiceRecording();
      return;
    }
    if (this.micState === 'processing') return;

    this.cancelRequested = false;
    this.speechRecognitionFallback = false;
    this.transcriptSubmitted = false;
    this.currentTranscript = '';
    this.recordedChunks = [];
    const input = document.getElementById('voice-text-input');
    this.draftBeforeRecording = input ? input.value : '';
    this.setupSpeechRecognition();

    if (this.recognition) {
      try {
        this.recognition.lang = this.getRecognitionLanguage();
        this.recognition.start();
        this.setMicState('listening');
      } catch (error) {
        console.error('[VoiceStudio] recognition.start() failed:', error);
        this.setMicState('error', this.recognitionErrorMessage(error.name || 'unknown'));
      }
      return;
    }

    this.startMediaRecorderFallback();
  },

  getRecognitionLanguage() {
    if (this.forcedLanguage === 'hi') return 'hi-IN';
    if (this.forcedLanguage === 'en' || this.forcedLanguage === 'hinglish') return 'en-IN';
    const preferred = (navigator.languages || [navigator.language || '']).find(lang => /^hi(?:-|$)/i.test(lang));
    return preferred ? 'hi-IN' : 'en-IN';
  },

  recognitionErrorMessage(errorCode) {
    const messages = {
      'not-allowed': 'Microphone access was blocked. Allow microphone access for this site in your browser settings, then retry.',
      'permission-denied': 'Microphone access was blocked. Allow microphone access for this site in your browser settings, then retry.',
      'security': 'Microphone access requires localhost or a secure HTTPS connection.',
      'securityerror': 'Microphone access requires localhost or a secure HTTPS connection.',
      'no-speech': 'No speech detected. Check your microphone, then retry and speak clearly.',
      'audio-capture': 'No microphone was found. Connect a microphone and try again.',
      'not-found': 'No microphone was found. Connect a microphone and try again.',
      'network': 'The browser speech service could not be reached. Check your connection and retry.',
      'service-not-allowed': 'The browser speech service is unavailable. Check your browser settings or retry.',
      'invalidstateerror': 'Speech recognition is already active. Stop or cancel it before starting again.'
    };
    return messages[String(errorCode).toLowerCase()]
      || 'Speech recognition could not start. Check microphone permissions and try again.';
  },

  async startMediaRecorderFallback() {
    if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
      this.setMicState('error', 'Microphone access requires localhost or HTTPS. Open this site securely and retry.');
      return;
    }
    if (typeof window.MediaRecorder !== 'function') {
      this.setMicState('error', 'This browser cannot record microphone audio. Try the text box or use Chrome/Edge.');
      return;
    }

    const attemptId = ++this.recordingAttemptId;
    this.setMicState('processing', 'Requesting microphone permission…');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (attemptId !== this.recordingAttemptId || this.cancelRequested) {
        stream.getTracks().forEach(track => track.stop());
        return;
      }
      this.mediaStream = stream;

      const mimeType = typeof window.MediaRecorder.isTypeSupported === 'function'
        ? ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus']
          .find(type => window.MediaRecorder.isTypeSupported(type))
        : '';
      this.mediaRecorder = mimeType
        ? new window.MediaRecorder(this.mediaStream, { mimeType })
        : new window.MediaRecorder(this.mediaStream);
      this.mediaRecorder.ondataavailable = event => {
        if (attemptId === this.recordingAttemptId && event.data && event.data.size) {
          this.recordedChunks.push(event.data);
        }
      };
      this.mediaRecorder.onerror = event => {
        if (attemptId !== this.recordingAttemptId) return;
        console.error('[VoiceStudio] Audio recording failed:', event.error);
        this.recordingAttemptId += 1;
        this.recordedChunks = [];
        this.setMicState('error', 'Audio recording failed. Check microphone permissions and retry.');
        this.releaseMediaStream();
      };
      this.mediaRecorder.onstop = () => {
        if (attemptId !== this.recordingAttemptId) return;
        this.releaseMediaStream();
        if (this.cancelRequested) {
          this.finishCancelledRecording();
          return;
        }
        this.transcribeRecordedAudio();
      };
      this.mediaRecorder.start();
      this.setMicState('listening');
    } catch (error) {
      if (attemptId !== this.recordingAttemptId) return;
      console.warn('[VoiceStudio] Could not access the microphone:', error);
      this.releaseMediaStream();
      const permissionMessages = {
        NotAllowedError: 'Microphone access was blocked. Allow microphone access for this site in browser settings, then retry.',
        SecurityError: 'Microphone access requires localhost or a secure HTTPS connection.',
        NotFoundError: 'No microphone was found. Connect a microphone and try again.',
        NotReadableError: 'The microphone is busy or unavailable. Close other apps using it and retry.'
      };
      this.setMicState('error', permissionMessages[error.name]
        || 'Could not access the microphone. Check its connection and browser permissions, then retry.');
    }
  },

  async transcribeRecordedAudio() {
    const attemptId = this.recordingAttemptId;
    const chunks = this.recordedChunks;
    this.recordedChunks = [];
    const mimeType = (chunks[0] && chunks[0].type) || 'audio/webm';
    const audio = new Blob(chunks, { type: mimeType });
    if (!audio.size) {
      this.setMicState('error', 'No audio was recorded. Check your microphone and try again.');
      return;
    }

    this.setMicState('processing', 'Transcribing audio…');
    const language = this.forcedLanguage === 'hi' || this.forcedLanguage === 'en'
      ? this.forcedLanguage
      : 'auto';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 35000);

    try {
      this.transcriptionController = controller;
      const response = await fetch(`/api/transcribe?language=${encodeURIComponent(language)}`, {
        method: 'POST',
        headers: { 'Content-Type': mimeType },
        body: audio,
        signal: controller.signal
      });
      if (attemptId !== this.recordingAttemptId) return;
      const data = await response.json();
      if (attemptId !== this.recordingAttemptId) return;
      if (!response.ok) throw new Error(data.error || `Transcription failed (${response.status}).`);
      if (!data.text || !data.text.trim()) {
        throw new Error('No speech was transcribed. Check your microphone and try again.');
      }
      this.currentTranscript = data.text.trim();
      this.updateVoiceInput(this.currentTranscript);
      this.finalizeVoiceTranscript(this.currentTranscript);
    } catch (error) {
      if (this.transcriptionController === controller) this.transcriptionController = null;
      if (error.name === 'AbortError' || attemptId !== this.recordingAttemptId) return;
      console.error('[VoiceStudio] Audio transcription failed:', error);
      this.setMicState('error', error.message || 'Audio transcription failed. Please retry.');
    } finally {
      clearTimeout(timeout);
      if (this.transcriptionController === controller) this.transcriptionController = null;
    }
  },

  updateVoiceInput(text) {
    const input = document.getElementById('voice-text-input');
    if (input) input.value = text || this.draftBeforeRecording;
  },

  finalizeVoiceTranscript(text) {
    if (!text || this.transcriptSubmitted) return;
    this.transcriptSubmitted = true;
    this.currentTranscript = text.trim();
    this.updateVoiceInput(this.currentTranscript);
    this.handleUserVoiceInput(this.currentTranscript, true);
  },

  stopVoiceRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.setMicState('processing', 'Preparing audio for transcription…');
      this.mediaRecorder.stop();
    } else if (this.recognition && this.micState === 'listening') {
      this.setMicState('processing', 'Finishing speech recognition…');
      try {
        this.recognition.stop();
      } catch (error) {
        console.error('[VoiceStudio] Could not stop speech recognition:', error);
        this.setMicState('error', 'Could not stop speech recognition. Cancel and retry.');
      }
    }
  },

  cancelVoiceRecording() {
    const shouldAbortRecognition = this.recognition && !this.transcriptSubmitted;
    this.recordingAttemptId += 1;
    this.cancelRequested = true;
    this.transcriptSubmitted = true;
    if (this.transcriptionController) {
      this.transcriptionController.abort();
      this.transcriptionController = null;
    }
    if (shouldAbortRecognition) {
      try { this.recognition.abort(); } catch (error) {
        console.warn('[VoiceStudio] Could not abort speech recognition:', error);
      }
    }
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try { this.mediaRecorder.stop(); } catch (error) {
        console.warn('[VoiceStudio] Could not stop audio recording:', error);
      }
      this.recordedChunks = [];
      this.releaseMediaStream();
      this.currentTranscript = '';
      this.updateVoiceInput(this.draftBeforeRecording);
      this.setMicState('idle');
      return;
    }
    this.recordedChunks = [];
    this.releaseMediaStream();
    this.finishCancelledRecording();
  },

  finishCancelledRecording() {
    this.cancelRequested = false;
    this.currentTranscript = '';
    this.updateVoiceInput(this.draftBeforeRecording);
    this.setMicState('idle');
  },

  retryVoiceRecording() {
    this.toggleVoiceRecording();
  },

  releaseMediaStream() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    this.mediaRecorder = null;
  },

  // ─── UI State: Microphone ─────────────────────────────────────────────────
  setMicState(state, message) {
    this.micState = state;
    this.isRecording = state === 'listening';

    const micBtn = document.getElementById('mic-button');
    const waveEl = document.getElementById('waveform-anim');
    const statusText = document.getElementById('voice-status-text');
    const stopBtn = document.getElementById('voice-stop-button');
    const cancelBtn = document.getElementById('voice-cancel-button');
    const retryBtn = document.getElementById('voice-retry-button');
    const stateMessages = {
      idle: 'Click microphone or type anything in Hindi, Hinglish, or English',
      listening: 'Listening… Speak in English, Hindi हिन्दी, or Hinglish',
      processing: 'Processing your voice request…',
      success: 'Voice request processed. You can speak again or continue typing.',
      error: 'Voice input needs attention. Review the message and retry.'
    };

    if (micBtn) {
      const active = state === 'listening';
      if (active) {
        micBtn.classList.add('recording-active', 'bg-rose-600', 'animate-pulse');
        micBtn.classList.remove('bg-indigo-600');
      } else {
        micBtn.classList.remove('recording-active', 'bg-rose-600', 'animate-pulse');
        micBtn.classList.add('bg-indigo-600');
      }
      micBtn.setAttribute('aria-label', active ? 'Stop microphone' : 'Start microphone');
      micBtn.disabled = state === 'processing';
    }

    if (waveEl) {
      waveEl.classList.toggle('waveform-active', state === 'listening');
    }

    if (statusText) {
      statusText.dataset.state = state;
      statusText.innerText = message || stateMessages[state] || stateMessages.idle;
    }
    if (stopBtn) stopBtn.hidden = state !== 'listening';
    if (cancelBtn) cancelBtn.hidden = state !== 'listening'
      && !(state === 'processing' && !this.transcriptSubmitted);
    if (retryBtn) retryBtn.hidden = state !== 'error';
  },

  // ─── UI State: Thinking Indicator ────────────────────────────────────────
  setAssistantThinking(active) {
    const indicator = document.getElementById('voice-thinking-indicator');
    if (!indicator) return;
    indicator.style.display = active ? 'flex' : 'none';
  },

  // ─── Speech Synthesis ────────────────────────────────────────────────────
  speak(text, lang) {
    if (!window.speechSynthesis || !text) return;

    // Cancel any ongoing speech first
    if (this.isSpeaking) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Voice selection
    const voices = window.speechSynthesis.getVoices();

    if (lang === 'hi') {
      utterance.lang = 'hi-IN';
      const hiVoice = voices.find(v => v.lang === 'hi-IN')
        || voices.find(v => v.lang.startsWith('hi'))
        || voices.find(v => v.name.toLowerCase().includes('hindi')
                         || v.name.includes('Hemant')
                         || v.name.includes('Kalpana'));
      if (hiVoice) utterance.voice = hiVoice;

    } else if (lang === 'hinglish') {
      utterance.lang = 'en-IN';
      const hinglishVoice = voices.find(v => v.lang === 'en-IN')
        || voices.find(v => v.lang === 'hi-IN')
        || voices.find(v => v.lang.includes('IN') || v.name.toLowerCase().includes('india')
                         || v.name.includes('Rishi') || v.name.includes('Veena'));
      if (hinglishVoice) utterance.voice = hinglishVoice;

    } else {
      utterance.lang = 'en-US';
      const enVoice = voices.find(v => (v.lang === 'en-US' || v.lang === 'en-GB')
                                     && (v.name.includes('Natural') || v.name.includes('Google')
                                         || v.name.includes('Zira') || v.name.includes('Microsoft')))
        || voices.find(v => v.lang === 'en-US' || v.lang === 'en-GB');
      if (enVoice) utterance.voice = enVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      const micArea = document.getElementById('mic-button');
      if (micArea) micArea.classList.add('speaking-active');
      const stopBtn = document.getElementById('btn-stop-speaking');
      if (stopBtn) stopBtn.hidden = false;
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      const micArea = document.getElementById('mic-button');
      if (micArea) micArea.classList.remove('speaking-active');
      const stopBtn = document.getElementById('btn-stop-speaking');
      if (stopBtn) stopBtn.hidden = true;
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      const micArea = document.getElementById('mic-button');
      if (micArea) micArea.classList.remove('speaking-active');
      const stopBtn = document.getElementById('btn-stop-speaking');
      if (stopBtn) stopBtn.hidden = true;
    };

    // Some browsers need a small delay after cancel before speak
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 50);
  },

  stopSpeaking() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    const micArea = document.getElementById('mic-button');
    if (micArea) micArea.classList.remove('speaking-active');
    const stopBtn = document.getElementById('btn-stop-speaking');
    if (stopBtn) stopBtn.hidden = true;
  },

  // ─── Text Input Fallback ──────────────────────────────────────────────────
  async sendTextPrompt() {
    const input = document.getElementById('voice-text-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;
    const succeeded = await this.handleUserVoiceInput(text);
    if (succeeded && input.value.trim() === text) input.value = '';
  },

  // ─── Quick Prompts ────────────────────────────────────────────────────────
  quickPrompt(text) {
    this.handleUserVoiceInput(text);
  },

  // ─── Transcript Rendering ─────────────────────────────────────────────────
  addTranscriptItem(sender, text, intent, confidence, lang) {
    // Support both possible container IDs
    const container = document.getElementById('voice-transcript-list')
      || document.getElementById('transcript-container');
    if (!container) return;

    const isUser = sender === 'user';
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const langBadgeColors = {
      'hi':       'bg-orange-950/80 text-orange-300 border-orange-500/40',
      'hinglish': 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40',
      'en':       'bg-indigo-950/80 text-indigo-300 border-indigo-500/40'
    };
    const langLabels = {
      'hi':       'हिन्दी 🇮🇳',
      'hinglish': 'Hinglish 💬',
      'en':       'English 🇬🇧'
    };

    const userInitials = window.CampusData && window.CampusData.activeUser
      ? window.CampusData.activeUser.name.split(' ').map(n => n[0]).join('')
      : 'KS';
    const userName = window.CampusData && window.CampusData.activeUser
      ? window.CampusData.activeUser.name
      : 'Student';

    const langKey = lang || 'en';
    const badgeClass = langBadgeColors[langKey] || langBadgeColors['en'];
    const langLabel = langLabels[langKey] || langKey;

    const itemHtml = `
      <div class="flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in mb-3">
        ${!isUser ? `
          <div class="w-8 h-8 rounded-lg bg-indigo-900/60 flex items-center justify-center text-sm flex-shrink-0">
            ${this.currentAgent ? this.currentAgent.avatar : '🤖'}
          </div>
        ` : ''}

        <div class="max-w-[85%] rounded-2xl px-4 py-2.5 text-xs ${isUser
          ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
          : 'bg-slate-800/80 text-slate-200 border border-slate-700/60 rounded-bl-none shadow-md'}">
          <div class="flex items-center justify-between gap-4 mb-1.5 text-[10px] ${isUser ? 'text-indigo-200' : 'text-slate-400'}">
            <span class="font-bold">${isUser
              ? 'You (' + userName + ')'
              : (this.currentAgent ? this.currentAgent.name : 'CampusAI')}</span>
            <div class="flex items-center gap-2">
              <span class="px-1.5 py-0.5 rounded text-[9px] font-mono border ${badgeClass}">
                ${langLabel}
              </span>
              <span>${time}</span>
            </div>
          </div>
          <p class="leading-relaxed text-[12.5px] whitespace-pre-wrap break-words">${this.escapeHtml(text)}</p>
          ${intent ? `
            <div class="mt-2 pt-1.5 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-cyan-300 font-mono">
              <span>🎯 ${this.escapeHtml(intent)}</span>
              ${confidence ? `<span>⚡ ${confidence}</span>` : ''}
            </div>
          ` : ''}
        </div>

        ${isUser ? `
          <div class="w-8 h-8 rounded-lg bg-cyan-900/60 flex items-center justify-center text-xs font-bold text-cyan-300 flex-shrink-0">
            ${userInitials}
          </div>
        ` : ''}
      </div>
    `;

    container.insertAdjacentHTML('beforeend', itemHtml);
    container.scrollTop = container.scrollHeight;
  },

  escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[character]));
  },

  renderTranscriptHistory() {
    const container = document.getElementById('voice-transcript-list')
      || document.getElementById('transcript-container');
    if (!container) return;

    container.innerHTML = `
      <div class="text-center py-4 text-xs text-slate-500">
        Ask Astra anything in English, हिन्दी, or Hinglish. Answers are generated by Gemini.
      </div>
    `;
  },

  // ─── Analytics Panel ─────────────────────────────────────────────────────
  updateAnalytics(data) {
    this.analyticsCallCount++;

    const totalEl   = document.getElementById('analytics-total-calls');
    const intentEl  = document.getElementById('analytics-last-intent');
    const confEl    = document.getElementById('analytics-confidence');
    const sentEl    = document.getElementById('analytics-sentiment');
    const langEl    = document.getElementById('analytics-lang-detected');

    // Legacy IDs from old file (keep compat)
    const oldIntentEl = document.getElementById('analytics-intent');
    const oldConfEl   = document.getElementById('analytics-conf');
    const oldSentEl   = document.getElementById('analytics-sent');

    if (totalEl)   totalEl.innerText   = this.analyticsCallCount;
    if (intentEl)  intentEl.innerText  = data.intent || '—';
    if (confEl)    confEl.innerText    = data.confidence || '—';
    if (sentEl)    sentEl.innerText    = data.sentiment || '—';

    // Language badge in analytics
    if (langEl) {
      const langLabels = { hi: 'हिन्दी 🇮🇳', hinglish: 'Hinglish 💬', en: 'English 🇬🇧' };
      const langColors = {
        hi:       'bg-orange-900/60 text-orange-300',
        hinglish: 'bg-cyan-900/60 text-cyan-300',
        en:       'bg-indigo-900/60 text-indigo-300'
      };
      const lk = data.lang || 'en';
      langEl.innerHTML = `<span class="px-2 py-0.5 rounded-full text-[10px] font-mono ${langColors[lk] || langColors.en}">${langLabels[lk] || lk}</span>`;
    }

    // Legacy compat
    if (oldIntentEl) oldIntentEl.innerText = data.intent || '—';
    if (oldConfEl)   oldConfEl.innerText   = data.confidence || '—';
    if (oldSentEl)   oldSentEl.innerText   = data.sentiment || '—';
  },

  // ─── Agent Selector ───────────────────────────────────────────────────────
  renderAgentSelector() {
    const list = document.getElementById('agents-list');
    if (!list) return;
    if (!window.CampusData || !window.CampusData.initialAgents) return;

    list.innerHTML = window.CampusData.initialAgents.map(ag => `
      <div onclick="VoiceStudio.selectAgent('${ag.id}')"
        class="p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
          this.currentAgent && this.currentAgent.id === ag.id
            ? 'bg-indigo-950/60 border-indigo-500 shadow-md'
            : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80'
        }">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-indigo-900/50 flex items-center justify-center text-xl">
            ${ag.avatar}
          </div>
          <div>
            <h4 class="font-bold text-sm text-white">${ag.name}</h4>
            <p class="text-xs text-slate-400">${ag.role}</p>
          </div>
        </div>
        <div class="text-right">
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 font-mono">${ag.language}</span>
          <p class="text-[10px] text-slate-500 mt-1">${ag.callsHandled} sessions</p>
        </div>
      </div>
    `).join('');

    this.updateActiveAgentCard();
  },

  selectAgent(id) {
    if (!window.CampusData || !window.CampusData.initialAgents) return;
    const found = window.CampusData.initialAgents.find(a => a.id === id);
    if (!found) return;
    this.currentAgent = found;
    this.renderAgentSelector();
    if (window.App && window.App.showToast) {
      window.App.showToast(`Switched active voice agent to "${found.name}"`, 'info');
    }

    // Clear history when switching agents
    this.conversationHistory = [];

    // Greeting based on agent language
    if (found.language && found.language.includes('Hindi')) {
      this.speak(`नमस्ते! मैं ${found.name} हूँ। आज मैं आपकी क्या सहायता कर सकता हूँ?`, 'hi');
    } else if (found.language && found.language.includes('Hinglish')) {
      this.speak(`Hello dost! Main ${found.name} hoon. Campus study groups, hackathon ya academics ke baare mein kuch bhi pucho!`, 'hinglish');
    } else {
      this.speak(`Hello! I am ${found.name}. How can I assist you with your campus academics and opportunities today?`, 'en');
    }
  },

  updateActiveAgentCard() {
    const nameEl   = document.getElementById('active-agent-name');
    const roleEl   = document.getElementById('active-agent-role');
    const toneEl   = document.getElementById('active-agent-tone');
    const langEl   = document.getElementById('active-agent-lang');
    const avatarEl = document.getElementById('active-agent-avatar');

    if (!this.currentAgent) return;
    if (nameEl) nameEl.innerText = this.currentAgent.name;
    if (roleEl) roleEl.innerText = this.currentAgent.role;
    if (toneEl) toneEl.innerText = this.currentAgent.tone;
    if (langEl) langEl.innerText = this.currentAgent.language;
    if (avatarEl) avatarEl.innerText = this.currentAgent.avatar;
  },

  // ─── Agent Creator ────────────────────────────────────────────────────────
  createNewAgent() {
    const name         = (document.getElementById('new-agent-name')?.value || '').trim();
    const role         = (document.getElementById('new-agent-role')?.value || '').trim();
    const instructions = (document.getElementById('new-agent-instructions')?.value || '').trim();
    const tone         = document.getElementById('new-agent-tone')?.value || 'Professional';
    const language     = document.getElementById('new-agent-lang')?.value || 'English';
    const knowledge    = document.getElementById('new-agent-knowledge')?.value || '';

    if (!name || !instructions) {
      if (window.App && window.App.showToast) {
        window.App.showToast('Please provide an Agent Name and Plain-Language Instructions.', 'warning');
      }
      return;
    }

    const newAgent = {
      id:            'agent-' + Date.now(),
      name:          name,
      role:          role || 'Custom Campus Assistant',
      language:      language,
      tone:          tone,
      instructions:  instructions,
      knowledgeBase: knowledge
        || (window.CampusData && window.CampusData.activeUser ? window.CampusData.activeUser.college + ' Academic Directory' : '')
        || 'CampusPilot Academic Knowledge Base',
      avatar:        '🤖',
      callsHandled:  0
    };

    if (window.CampusData && window.CampusData.initialAgents) {
      window.CampusData.initialAgents.unshift(newAgent);
    }
    this.currentAgent = newAgent;
    this.renderAgentSelector();

    // Reset form fields
    const nameInput = document.getElementById('new-agent-name');
    const roleInput = document.getElementById('new-agent-role');
    const instInput = document.getElementById('new-agent-instructions');
    if (nameInput) nameInput.value = '';
    if (roleInput) roleInput.value = '';
    if (instInput) instInput.value = '';

    if (window.App && window.App.showToast) {
      window.App.showToast(`✨ Voice Agent "${name}" created and deployed successfully!`, 'success');
    }
    this.speak(`Voice Agent ${name} is initialized and ready for campus interactions.`, 'en');
  }

};
