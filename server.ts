import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy Gemini client helper
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// 1. Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 2. AI Triage Endpoint
app.post('/api/triage', async (req, res) => {
  const { title, description, company, userSelectedCategory } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required for AI triage.' });
  }

  const ai = getAI();

  // If Gemini API Key is available, run real model classification
  if (ai) {
    try {
      const prompt = `You are the AI Triage Engine for TechnoResolve Desk, an enterprise IT & business support desk.
Classify the following incoming support ticket:
Title: "${title}"
Description: "${description}"
Company: "${company || 'Not provided'}"
User Selected Category: "${userSelectedCategory || 'None'}"

Allowed Categories (pick exactly one value):
- "hardware" (Laptops, desktops, monitors, docking stations, peripherals)
- "software" (Installs, updates, runtime crashes, licenses, SaaS tooling)
- "network" (Office Wi-Fi, VPN, LAN, remote connection drops)
- "access" (SSO passwords, MFA tokens, Okta lockouts, IAM permissions)
- "security" (Phishing attempts, malware, suspicious security incidents)
- "billing" (Invoices, seat renewals, payment card issues, subscriptions)
- "general" (General inquiries, consultations, custom workflows)

Allowed Priorities (pick exactly one):
- "urgent" (Business halted, security breach, production outage, severe billing block)
- "high" (Significant productivity block, recurring VPN drops, executive request)
- "medium" (Standard inquiry, routine hardware/software glitch, new user onboard)
- "low" (Minor question, cosmetic feedback, non-blocking request)

Respond ONLY with valid JSON in this exact structure:
{
  "category": "hardware|software|network|access|security|billing|general",
  "priority": "low|medium|high|urgent",
  "confidence": 0.95,
  "reasoning": "One concise sentence explaining why this ticket was classified this way.",
  "suggested_first_response": "A polite, helpful initial response sentence."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const text = response.text?.trim() || '{}';
      const parsed = JSON.parse(text);
      return res.json({
        success: true,
        ai: {
          category: parsed.category || userSelectedCategory || 'general',
          priority: parsed.priority || 'medium',
          confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.94,
          reasoning: parsed.reasoning || 'Automated triage based on request scope and keywords.',
          suggested_first_response: parsed.suggested_first_response || '',
        },
      });
    } catch (err: any) {
      console.warn('Gemini triage fallback triggered:', err?.message);
    }
  }

  // Smart Heuristic Fallback
  const lowerText = `${title} ${description}`.toLowerCase();
  let category = userSelectedCategory || 'general';
  let priority = 'medium';
  let reasoning = 'Categorized based on natural language heuristic inspection.';

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
      confidence: 0.91,
      reasoning,
      suggested_first_response: `Thank you for contacting TechnoResolve. We have logged your ${category} request and routed it to our specialized team.`,
    },
  });
});

// 3. AI Reply Drafting for Technicians
app.post('/api/ai-draft-reply', async (req, res) => {
  const { title, description, category, priority, messages, technicianName } = req.body;

  const ai = getAI();

  if (ai) {
    try {
      const prompt = `You are an expert IT support technician named "${technicianName || 'Support Tech'}" on TechnoResolve Desk.
Draft a professional, helpful, empathetic, and technically concrete response for the customer.

Ticket Context:
Title: ${title}
Category: ${category}
Priority: ${priority}
Initial Description: ${description}

Message History:
${(messages || []).map((m: any) => `[${m.author_role.toUpperCase()} - ${m.author_name}]: ${m.body}`).join('\n')}

Guidelines:
- Acknowledge the user's issue with empathy.
- Provide clear, actionable next steps or diagnostic questions.
- Keep the tone concise, friendly, and professional.
- Do not use markdown codeblocks for the entire reply, just write the clean reply text.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          temperature: 0.3,
        },
      });

      const suggestion = response.text?.trim();
      if (suggestion) {
        return res.json({ suggestion });
      }
    } catch (err: any) {
      console.warn('AI reply generation fallback:', err?.message);
    }
  }

  // Fallback template
  const suggestion = `Hi there,\n\nThanks for reaching out about "${title}". I've reviewed your request regarding the ${category} issue.\n\nTo help us resolve this swiftly, could you please confirm if you are still experiencing this and share any recent error codes or timestamps? I am actively monitoring this ticket.\n\nBest regards,\n${technicianName || 'TechnoResolve Support'}`;
  return res.json({ suggestion });
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
