// CampusPilot AI - Multi-Campus Operating System Backend Server
// Team AstraNova · One Campus. One Intelligent Workspace.

const http = require('http');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const MAX_TRANSCRIPTION_BYTES = 20 * 1024 * 1024;
const MAX_GEMINI_INLINE_AUDIO_BYTES = 14 * 1024 * 1024;
const MAX_CHAT_BODY_BYTES = 32 * 1024;
const MAX_CHAT_MESSAGE_LENGTH = 10000;
const MAX_CHAT_HISTORY_TURNS = 20;
const GEMINI_REQUEST_TIMEOUT_MS = 30000;
const CHAT_SESSION_TTL_MS = 2 * 60 * 60 * 1000;
const MAX_CHAT_SESSIONS = 1000;
const TRANSCRIPTION_RATE_LIMIT = 10;
const TRANSCRIPTION_RATE_WINDOW_MS = 15 * 60 * 1000;
const MAX_RATE_LIMIT_CLIENTS = 5000;
const transcriptionRateLimits = new Map();
const chatSessions = new Map();
const AUDIO_CONTENT_TYPES = new Set([
  'audio/aac',
  'audio/mp4',
  'audio/mpeg',
  'audio/ogg',
  'audio/wav',
  'audio/webm',
  'audio/x-wav'
]);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// In-memory data store for persistent live hackathon demo
const memoryStore = {
  tasks: [
    {
      id: "TSK-8041",
      title: "Register for Global GenAI & Autonomous Systems Hackathon",
      status: "COMPLETED",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      module: "Autonomous AI Companion",
      approvalGranted: true,
      evidenceId: "REG-GLOBAL-2026-9812",
      notes: "Auto-filled Devpost form, verified with confirmation banner."
    }
  ],
  agents: [
    {
      id: "agent-1",
      name: "Astra Campus Guide",
      role: "Universal Campus Advisor & Navigation",
      language: "Hinglish (Hindi + English)",
      tone: "Friendly Peer",
      instructions: "Assist university students across partner institutions with classroom locations, event deadlines, and study group formation.",
      knowledgeBase: "Academic Directories, Partner Campus Catalogs, Global Hackathons",
      avatar: "🎙️",
      callsHandled: 184
    },
    {
      id: "agent-2",
      name: "Opportunity & Hackathon Scout",
      role: "Career & Hackathon Strategist",
      language: "English",
      tone: "Energetic Mentor",
      instructions: "Answer queries about hackathon tracks, research internships, rulebooks, and submission requirements.",
      knowledgeBase: "Opportunity Database, Devpost & GitHub APIs, Grants",
      avatar: "⚡",
      callsHandled: 126
    }
  ]
};

const server = http.createServer((req, res) => {
  // CORS Headers for seamless API usage
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // API Endpoints
  if (pathname.startsWith('/api/')) {
    handleApiRequest(req, res, pathname, url);
    return;
  }

  if (pathname.split('/').some(segment => /^\.env(?:\..+)?$/i.test(segment))) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
    return;
  }

  // Static File Serving
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  
  // Security check: prevent directory traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA-like experience
      filePath = path.join(PUBLIC_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

function handleApiRequest(req, res, pathname, requestUrl) {
  if (pathname === '/api/chat') {
    if (req.method !== 'POST') {
      sendJson(res, 405, { error: 'Use POST to send a chat message.' });
      return;
    }
    chat(req, res);
    return;
  }

  if (pathname === '/api/transcribe') {
    if (req.method !== 'POST') {
      sendJson(res, 405, { error: 'Use POST to transcribe audio.' });
      return;
    }
    transcribeAudio(req, res, requestUrl);
    return;
  }

  if (pathname === '/api/status' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ONLINE',
      system: 'CampusPilot AI Unified OS',
      platform: 'Multi-Campus Cloud Gateway',
      team: 'AstraNova',
      modules: {
        campusHub: 'Active',
        studyGroups: 'Active',
        opportunitiesDiscovery: 'Active',
        voiceStudio: 'Active',
        autonomousCompanion: 'Active',
        adminPortal: 'Active'
      },
      uptime: process.uptime()
    }));
    return;
  }

  if (pathname === '/api/agents' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(memoryStore.agents));
    return;
  }

  if (pathname === '/api/agents' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const newAgent = JSON.parse(body);
        newAgent.id = 'agent-' + (memoryStore.agents.length + 1);
        newAgent.callsHandled = 0;
        newAgent.avatar = newAgent.avatar || '🤖';
        memoryStore.agents.unshift(newAgent);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, agent: newAgent }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  if (pathname === '/api/tasks' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(memoryStore.tasks));
    return;
  }

  if (pathname === '/api/tasks' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const newTask = JSON.parse(body);
        newTask.id = 'TSK-' + Math.floor(1000 + Math.random() * 9000);
        newTask.timestamp = new Date().toISOString();
        memoryStore.tasks.unshift(newTask);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, task: newTask }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // Not found endpoint
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
}

function chat(req, res) {
  let body = '';
  let tooLarge = false;
  req.on('data', chunk => {
    if (res.destroyed || res.writableEnded) return;
    body += chunk;
    if (Buffer.byteLength(body, 'utf8') > MAX_CHAT_BODY_BYTES) {
      tooLarge = true;
      req.resume();
    }
  });
  req.on('error', error => {
    console.error('[Gemini] Chat request upload failed:', error.message);
    sendJson(res, 400, { error: 'The chat request could not be received. Please retry.' });
  });
  req.on('end', async () => {
    if (tooLarge) {
      sendJson(res, 413, { error: 'That message is too long. Shorten it and try again.' });
      return;
    }

    let input;
    try {
      input = JSON.parse(body);
    } catch (error) {
      sendJson(res, 400, { error: 'The chat request must contain valid JSON.' });
      return;
    }

    const message = typeof input.message === 'string' ? input.message.trim() : '';
    const sessionId = typeof input.sessionId === 'string' ? input.sessionId : '';
    const language = ['en', 'hi', 'hinglish'].includes(input.language) ? input.language : 'en';
    if (!message) {
      sendJson(res, 400, { error: 'Enter a message before sending it.' });
      return;
    }
    if (message.length > MAX_CHAT_MESSAGE_LENGTH) {
      sendJson(res, 413, { error: 'That message is too long. Shorten it and try again.' });
      return;
    }
    if (!/^[A-Za-z0-9._-]{1,128}$/.test(sessionId)) {
      sendJson(res, 400, { error: 'The chat session is invalid. Refresh the page and try again.' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      sendJson(res, 503, {
        error: 'Astra AI is not configured on this server. Set GEMINI_API_KEY and restart the server.'
      });
      return;
    }
    if (typeof fetch !== 'function') {
      sendJson(res, 500, { error: 'The server needs Node.js 18 or newer to connect to Gemini.' });
      return;
    }

    const now = Date.now();
    for (const [id, session] of chatSessions) {
      if (now - session.updatedAt > CHAT_SESSION_TTL_MS) chatSessions.delete(id);
    }
    const session = chatSessions.get(sessionId);
    const previousTurns = session ? session.turns : [];
    if (!session && chatSessions.size >= MAX_CHAT_SESSIONS) {
      sendJson(res, 503, { error: 'Astra AI is busy. Please retry in a few minutes.' });
      return;
    }

    const model = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
    const languageInstruction = {
      en: 'Reply in English.',
      hi: 'Reply in natural Hindi using Devanagari script.',
      hinglish: 'Reply in natural Hinglish using Roman script, matching the user’s Hindi-English mix and keeping common technical terms in English.'
    }[language];
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
    const requestBody = {
      systemInstruction: {
        parts: [{
          text: `You are Astra, a helpful, accurate conversational assistant for college students and the general public. Answer questions across general knowledge, computer science, programming, AI, mathematics, engineering, education, careers, opportunities, and everyday topics; do not limit yourself to campus questions. Use the full conversation context for follow-ups. ${languageInstruction} Match the user's communication style. Give a direct, useful answer with appropriate detail. Never invent live or upcoming opportunities or claim current information you cannot verify; clearly state uncertainty when needed.`
        }]
      },
      contents: [
        ...previousTurns,
        { role: 'user', parts: [{ text: message }] }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
        thinkingConfig: { thinkingLevel: 'minimal' }
      }
    };
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), GEMINI_REQUEST_TIMEOUT_MS);

    try {
      const providerResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      if (!providerResponse.ok) {
        await logGeminiProviderError(providerResponse, model, apiKey, 'Gemini');
        if (providerResponse.status === 401 || providerResponse.status === 403) {
          sendJson(res, 502, { error: 'Gemini rejected the server credentials or model access. Check GEMINI_API_KEY and model permissions.' });
        } else if (providerResponse.status === 429) {
          sendJson(res, 429, { error: 'Gemini quota or rate limit reached. Check the project quota and retry later.' });
        } else if (providerResponse.status === 404) {
          sendJson(res, 502, { error: 'The configured Gemini model is unavailable for this API key. Check GEMINI_MODEL and model access.' });
        } else if (providerResponse.status >= 500) {
          sendJson(res, 502, { error: 'Gemini is temporarily unavailable. Please retry shortly.' });
        } else {
          sendJson(res, 502, { error: 'Gemini rejected the request. Check GEMINI_MODEL and the server configuration.' });
        }
        return;
      }

      let result;
      try {
        result = await providerResponse.json();
      } catch (error) {
        console.error('[Gemini] Provider returned invalid JSON.');
        sendJson(res, 502, { error: 'Gemini returned an invalid response. Please retry.' });
        return;
      }

      const candidate = result.candidates && result.candidates[0];
      const reply = candidate && candidate.content && Array.isArray(candidate.content.parts)
        ? candidate.content.parts.map(part => typeof part.text === 'string' ? part.text : '').join('').trim()
        : '';
      if (!reply) {
        console.error('[Gemini] Provider response contained no text. Finish reason:', candidate && candidate.finishReason);
        sendJson(res, 502, {
          error: candidate && candidate.finishReason === 'SAFETY'
            ? 'Gemini could not answer that request because it was blocked by its safety filters.'
            : 'Gemini returned no answer. Please rephrase the question and retry.'
        });
        return;
      }

      const updatedTurns = [
        ...previousTurns,
        { role: 'user', parts: [{ text: message }] },
        { role: 'model', parts: [{ text: reply }] }
      ].slice(-MAX_CHAT_HISTORY_TURNS * 2);
      chatSessions.set(sessionId, { turns: updatedTurns, updatedAt: Date.now() });
      sendJson(res, 200, { reply, language });
    } catch (error) {
      const timedOut = error.name === 'AbortError' || error.name === 'TimeoutError';
      if (timedOut) {
        console.error(`[Gemini] Request timed out after ${GEMINI_REQUEST_TIMEOUT_MS} ms.`);
      } else {
        console.error('[Gemini] Request failed:', error.message);
      }
      sendJson(res, timedOut ? 504 : 502, {
        error: timedOut
          ? 'Gemini took too long to respond. Please retry.'
          : 'Could not reach Gemini. Check the server connection and retry.'
      });
    } finally {
      clearTimeout(timeout);
    }
  });
}

function sendJson(res, status, data) {
  if (res.destroyed || res.writableEnded) return;
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

async function logGeminiProviderError(providerResponse, model, apiKey, source) {
  let providerMessage = '';
  try {
    const providerError = await providerResponse.json();
    providerMessage = providerError.error && typeof providerError.error.message === 'string'
      ? providerError.error.message.replaceAll(apiKey, '[redacted]')
      : '';
  } catch (error) {
    console.error(`[${source}] Provider returned an unreadable error response.`);
  }
  console.error(`[${source}] Provider returned HTTP ${providerResponse.status} for model ${model}.${providerMessage ? ` ${providerMessage}` : ''}`);
}

function allowTranscriptionRequest(req, res) {
  const now = Date.now();
  const client = req.socket.remoteAddress || 'unknown';
  let record = transcriptionRateLimits.get(client);

  if (!record || now - record.startedAt >= TRANSCRIPTION_RATE_WINDOW_MS) {
    if (!record && transcriptionRateLimits.size >= MAX_RATE_LIMIT_CLIENTS) {
      for (const [address, entry] of transcriptionRateLimits) {
        if (now - entry.startedAt >= TRANSCRIPTION_RATE_WINDOW_MS) {
          transcriptionRateLimits.delete(address);
        }
      }
      if (transcriptionRateLimits.size >= MAX_RATE_LIMIT_CLIENTS) {
        sendJson(res, 429, { error: 'Audio transcription is temporarily busy. Please retry later.' });
        req.resume();
        return false;
      }
    }
    record = { startedAt: now, count: 0 };
    transcriptionRateLimits.set(client, record);
  }

  if (record.count >= TRANSCRIPTION_RATE_LIMIT) {
    const retryAfter = Math.ceil((record.startedAt + TRANSCRIPTION_RATE_WINDOW_MS - now) / 1000);
    res.setHeader('Retry-After', String(Math.max(retryAfter, 1)));
    sendJson(res, 429, { error: 'Too many transcription requests. Please retry in a few minutes.' });
    req.resume();
    return false;
  }

  record.count += 1;
  return true;
}

async function transcribeAudioWithGemini(res, audio, contentType, language) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    sendJson(res, 503, { error: 'Audio transcription requires GEMINI_API_KEY or STT_API_KEY on this server.' });
    return;
  }
  if (typeof fetch !== 'function') {
    sendJson(res, 500, { error: 'The server needs Node.js 18 or newer for audio transcription.' });
    return;
  }

  const model = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
  const languageInstruction = language === 'hi'
    ? 'Transcribe Hindi speech using Devanagari script.'
    : language === 'en'
      ? 'Transcribe English speech.'
      : 'Detect the spoken language and preserve the original language and any code-switching.';
  const prompt = `Transcribe the spoken words accurately. ${languageInstruction} Return only the transcript, with no translation or commentary.`;
  const mimeType = contentType === 'audio/x-wav' ? 'audio/wav' : contentType;
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const requestBody = {
    contents: [{
      role: 'user',
      parts: [
        { text: prompt },
        { inlineData: { mimeType, data: audio.toString('base64') } }
      ]
    }],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 2048,
      thinkingConfig: { thinkingLevel: 'minimal' }
    }
  };
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GEMINI_REQUEST_TIMEOUT_MS);

  try {
    const providerResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });
    if (!providerResponse.ok) {
      await logGeminiProviderError(providerResponse, model, apiKey, 'VoiceStudio/Gemini');
      if (providerResponse.status === 429) {
        sendJson(res, 429, { error: 'Gemini quota or rate limit reached while transcribing. Retry later.' });
      } else if (providerResponse.status >= 500) {
        sendJson(res, 502, { error: 'Gemini transcription is temporarily unavailable. Please retry.' });
      } else {
        sendJson(res, 502, { error: 'Gemini could not transcribe this audio. Check the audio format and model access.' });
      }
      return;
    }

    let result;
    try {
      result = await providerResponse.json();
    } catch (error) {
      console.error('[VoiceStudio/Gemini] Provider returned invalid JSON.');
      sendJson(res, 502, { error: 'Gemini returned an invalid transcription response.' });
      return;
    }
    const candidate = result.candidates && result.candidates[0];
    const text = candidate && candidate.content && Array.isArray(candidate.content.parts)
      ? candidate.content.parts.map(part => typeof part.text === 'string' ? part.text : '').join('').trim()
      : '';
    if (!text) {
      console.error('[VoiceStudio/Gemini] Provider response contained no transcript. Finish reason:', candidate && candidate.finishReason);
      sendJson(res, 502, { error: 'Gemini could not hear clear speech. Please record and retry.' });
      return;
    }
    sendJson(res, 200, { text });
  } catch (error) {
    const timedOut = error.name === 'AbortError' || error.name === 'TimeoutError';
    console.error(timedOut
      ? `[VoiceStudio/Gemini] Transcription timed out after ${GEMINI_REQUEST_TIMEOUT_MS} ms.`
      : '[VoiceStudio/Gemini] Transcription request failed:', error.message);
    sendJson(res, timedOut ? 504 : 502, {
      error: timedOut
        ? 'Gemini transcription took too long. Please try a shorter recording.'
        : 'Could not reach Gemini for transcription. Check the server connection and retry.'
    });
  } finally {
    clearTimeout(timeout);
  }
}

function transcribeAudio(req, res, requestUrl) {
  const contentType = String(req.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
  if (!AUDIO_CONTENT_TYPES.has(contentType)) {
    sendJson(res, 415, { error: 'Unsupported audio format. Record audio in WebM, MP4, Ogg, WAV, or AAC.' });
    req.resume();
    return;
  }
  if (!allowTranscriptionRequest(req, res)) return;

  const chunks = [];
  let bytesRead = 0;
  let tooLarge = false;
  req.on('data', chunk => {
    bytesRead += chunk.length;
    if (bytesRead > MAX_TRANSCRIPTION_BYTES) {
      tooLarge = true;
      return;
    }
    chunks.push(chunk);
  });
  req.on('error', error => {
    console.error('[VoiceStudio] Audio upload failed:', error.message);
    if (!res.headersSent) sendJson(res, 400, { error: 'Audio upload failed. Please record and retry.' });
  });
  req.on('end', async () => {
    if (tooLarge) {
      sendJson(res, 413, { error: 'Audio is too large. Keep recordings under 20 MB and retry.' });
      return;
    }
    if (!bytesRead) {
      sendJson(res, 400, { error: 'No audio was received. Record a message and retry.' });
      return;
    }

    const apiKey = process.env.STT_API_KEY;
    const language = requestUrl.searchParams.get('language');
    if (!apiKey) {
      const audio = Buffer.concat(chunks);
      if (audio.length > MAX_GEMINI_INLINE_AUDIO_BYTES) {
        sendJson(res, 413, { error: 'Keep recordings under 14 MB when using Gemini transcription.' });
        return;
      }
      transcribeAudioWithGemini(res, audio, contentType, language);
      return;
    }

    const endpoint = process.env.STT_API_URL || 'https://api.openai.com/v1/audio/transcriptions';
    let providerUrl;
    try {
      providerUrl = new URL(endpoint);
    } catch (error) {
      sendJson(res, 500, { error: 'The configured speech-to-text endpoint URL is invalid.' });
      return;
    }
    const isLocalHttp = providerUrl.protocol === 'http:'
      && ['localhost', '127.0.0.1', '::1'].includes(providerUrl.hostname);
    if (providerUrl.protocol !== 'https:' && !isLocalHttp) {
      sendJson(res, 500, { error: 'The speech-to-text endpoint must use HTTPS (HTTP is allowed for localhost only).' });
      return;
    }
    if (typeof fetch !== 'function' || typeof FormData !== 'function' || typeof Blob !== 'function') {
      sendJson(res, 500, { error: 'The server needs Node.js 18 or newer for audio transcription.' });
      return;
    }

    const extension = {
      'audio/aac': 'aac',
      'audio/mp4': 'mp4',
      'audio/mpeg': 'mp3',
      'audio/ogg': 'ogg',
      'audio/wav': 'wav',
      'audio/webm': 'webm',
      'audio/x-wav': 'wav'
    }[contentType];
    const form = new FormData();
    form.append('file', new Blob([Buffer.concat(chunks)], { type: contentType }), `voice.${extension}`);
    form.append('model', process.env.STT_MODEL || 'whisper-1');
    form.append('response_format', 'json');
    if (language === 'en' || language === 'hi') form.append('language', language);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);
    try {
      const providerResponse = await fetch(endpoint, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}` },
        body: form,
        signal: controller.signal
      });
      if (!providerResponse.ok) {
        console.error('[VoiceStudio] Speech-to-text provider returned status:', providerResponse.status);
        sendJson(res, 502, { error: 'The speech-to-text service could not process this audio. Please retry.' });
        return;
      }

      let result;
      try {
        result = await providerResponse.json();
      } catch (error) {
        sendJson(res, 502, { error: 'The speech-to-text service returned an invalid response.' });
        return;
      }
      if (typeof result.text !== 'string') {
        sendJson(res, 502, { error: 'The speech-to-text service returned an invalid response.' });
        return;
      }
      sendJson(res, 200, { text: result.text });
    } catch (error) {
      console.error('[VoiceStudio] Speech-to-text request failed:', error.message);
      sendJson(res, 502, {
        error: error.name === 'AbortError'
          ? 'Speech-to-text timed out. Please try a shorter recording.'
          : 'Could not reach the speech-to-text service. Check the server connection and retry.'
      });
    } finally {
      clearTimeout(timeout);
    }
  });
}

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 CAMPUSPILOT AI Server is running!`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🌐 Architecture: Multi-Campus Independent Platform`);
  console.log(`👥 Team: AstraNova (Priyanshi, Kavyansh, Anushka, Dhruv)`);
  console.log(`=======================================================`);
});
