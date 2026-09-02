import express from 'express';
import path from 'path';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

// Lazy Gemini client helper
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// 1. Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 2. AI Triage Endpoint (Ultra-fast classification)
app.post('/api/triage', async (req, res) => {
  const { title, description, company, userSelectedCategory } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required for AI triage.' });
  }

  const ai = getAI();

  // If Gemini API Key is available, run high-speed model classification
  if (ai) {
    try {
      const prompt = `You are the AI Triage Engine for TechnoResolve Desk, an IT support desk.
Classify the following incoming support ticket:
Title: "${title}"
Description: "${description}"
Company: "${company || 'Not provided'}"
User Selected Category: "${userSelectedCategory || 'None'}"

Categories: "hardware" | "software" | "network" | "access" | "security" | "billing" | "general"
Priorities: "low" | "medium" | "high" | "urgent"

Respond ONLY with valid JSON:
{
  "category": "hardware|software|network|access|security|billing|general",
  "priority": "low|medium|high|urgent",
  "confidence": 0.95,
  "reasoning": "Brief 1-sentence reason.",
  "suggested_first_response": "Polite initial acknowledgement."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.LOW,
          },
        },
      });

      const text = response.text?.trim() || '{}';
      const parsed = JSON.parse(text);
      return res.json({
        success: true,
        ai: {
          category: parsed.category || userSelectedCategory || 'general',
          priority: parsed.priority || 'medium',
          confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.95,
          reasoning: parsed.reasoning || 'Automated triage based on request scope and keywords.',
          suggested_first_response: parsed.suggested_first_response || '',
        },
      });
    } catch (err: any) {
      console.warn('AI triage notice, using instant heuristic fallback:', err?.message || err);
    }
  }

  // Instant Smart Heuristic Fallback
  const lowerText = `${title} ${description}`.toLowerCase();
  let category = userSelectedCategory || 'general';
  let priority = 'medium';
  let reasoning = 'Categorized based on instant natural language heuristic analysis.';

  if (/502|500|crash|bug|exception|runtime|api|error|deploy|build|code|license/i.test(lowerText)) {
    category = 'software';
    priority = /502|500|crash|production|outage|down|block/i.test(lowerText) ? 'urgent' : 'high';
    reasoning = 'Identified software error or system runtime incident.';
  } else if (/phish|malware|hack|breach|fraud|scam|suspicious|gift card|threat/i.test(lowerText)) {
    category = 'security';
    priority = 'urgent';
    reasoning = 'Flagged security or phishing threat requiring prompt mitigation.';
  } else if (/wifi|wi-fi|vpn|dns|gateway|internet|ping|connection|latency|drop/i.test(lowerText)) {
    category = 'network';
    priority = /down|cannot connect|offline/i.test(lowerText) ? 'high' : 'medium';
    reasoning = 'Network and connectivity routing diagnostics indicated.';
  } else if (/password|mfa|2fa|sso|okta|login|lock|access|permission|account/i.test(lowerText)) {
    category = 'access';
    priority = /locked out|cannot login/i.test(lowerText) ? 'high' : 'medium';
    reasoning = 'Account authentication or IAM access permissions request.';
  } else if (/card|invoice|bill|payment|charge|declined|subscription|renew|seat/i.test(lowerText)) {
    category = 'billing';
    priority = /declined|cancelled|due/i.test(lowerText) ? 'high' : 'medium';
    reasoning = 'Commercial transaction, subscription renewal or invoicing request.';
  } else if (/laptop|dock|screen|monitor|display|printer|mouse|keyboard|macbook|hardware/i.test(lowerText)) {
    category = 'hardware';
    priority = 'medium';
    reasoning = 'Physical workstation or device peripheral troubleshooting.';
  }

  return res.json({
    success: true,
    ai: {
      category,
      priority,
      confidence: 0.92,
      reasoning,
      suggested_first_response: `Thank you for contacting TechnoResolve. We have logged your ${category} request and routed it to our specialized team.`,
    },
  });
});

// 3. AI Reply Drafting for Technicians (Low Latency)
app.post('/api/ai-draft-reply', async (req, res) => {
  const { title, description, category, priority, messages, technicianName } = req.body;

  const ai = getAI();

  if (ai) {
    try {
      const prompt = `You are an expert IT technician named "${technicianName || 'Support Tech'}".
Quickly draft a concise, empathetic, and professional reply for the customer.

Ticket Context:
Title: ${title}
Category: ${category}
Priority: ${priority}
Description: ${description}

Recent Messages:
${(messages || []).slice(-4).map((m: any) => `[${m.author_role} - ${m.author_name}]: ${m.body}`).join('\n')}

Reply directly with just the clean message body. No markdown backticks or commentary.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          temperature: 0.2,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.LOW,
          },
        },
      });

      const suggestion = response.text?.trim();
      if (suggestion) {
        return res.json({ suggestion });
      }
    } catch (err: any) {
      console.warn('AI reply draft notice, using fast template fallback:', err?.message || err);
    }
  }

  // Fallback template
  const suggestion = `Hi there,\n\nThanks for reaching out about "${title}". I've reviewed your request regarding the ${category} issue.\n\nTo help us resolve this swiftly, could you please confirm if you are still experiencing this and share any recent error codes or timestamps? I am actively monitoring this ticket.\n\nBest regards,\n${technicianName || 'TechnoResolve Support'}`;
  return res.json({ suggestion });
});


// 4. Email Endpoint
app.post('/api/send-email', async (req, res) => {
  const { to, subject, text } = req.body;

  // We check if SMTP credentials are provided
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('Mock sending email (SMTP credentials missing in Environment Variables):', { to, subject, text });
    return res.json({ success: true, mocked: true });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"TechnoResolve Desk" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
    });

    res.json({ success: true });
  } catch (err: any) {
    console.error('Email send error:', err);
    res.status(500).json({ error: 'Failed to send email: ' + err.message });
  }
});

// 5. Audio Voice Transcription Endpoint with Gemini
app.post('/api/transcribe', async (req, res) => {
  const { audioData, mimeType } = req.body;

  if (!audioData) {
    return res.status(400).json({ error: 'audioData base64 is required.' });
  }

  const ai = getAI();
  if (ai) {
    // List of viable models in priority order
    const modelsToTry = ['gemini-3.7-flash', 'gemini-3.6-flash', 'gemini-2.5-flash'];
    let lastError: any = null;

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    for (const model of modelsToTry) {
      // Try with retry and backoff on transient errors like 503 / 429
      const maxRetries = 2;
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          if (attempt > 0) {
            await sleep(attempt * 600);
          }

          const response = await ai.models.generateContent({
            model,
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    inlineData: {
                      mimeType: mimeType || 'audio/webm',
                      data: audioData,
                    },
                  },
                  {
                    text: 'Accurately transcribe the spoken words in this audio recording. Return ONLY the transcribed text verbatim without any introductory remarks, markdown formatting, explanations, or quotes.',
                  },
                ],
              },
            ],
            config: {
              temperature: 0.1,
              thinkingConfig: {
                thinkingLevel: ThinkingLevel.LOW,
              },
            },
          });

          const transcript = response.text?.trim() || '';
          return res.json({ success: true, transcript });
        } catch (err: any) {
          lastError = err;
          const status = err?.status || err?.code || (err?.message?.includes('503') ? 503 : (err?.message?.includes('404') ? 404 : null));
          console.warn(`Model ${model} (attempt ${attempt + 1}/${maxRetries + 1}) transcription notice:`, err?.message || err);

          // If model is 404 (not found / deprecated), do not retry this model; jump to next
          if (status === 404 || err?.message?.includes('404') || err?.message?.includes('no longer available')) {
            break;
          }

          // If not the last attempt and error is 503 / 429 / overloaded, retry with backoff
          if (attempt < maxRetries && (status === 503 || status === 429 || err?.message?.includes('high demand') || err?.message?.includes('UNAVAILABLE') || err?.message?.includes('RESOURCE_EXHAUSTED'))) {
            continue;
          }
        }
      }
    }

    console.error('Audio transcription all models exhausted:', lastError);
    return res.status(500).json({
      error: 'AI transcription service temporarily busy. Please try speaking again or type your message.',
      details: lastError?.message || 'Server demand peak'
    });
  }

  return res.status(503).json({ error: 'AI audio transcription service unavailable (missing GEMINI_API_KEY).' });
});

// Setup Vite / Static handling
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TechnoResolve Desk Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
