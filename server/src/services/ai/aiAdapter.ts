import { env } from '../../config/env.js';
import { BUSINESS_CONFIG } from '../../config/business.js';
import { ChatMessage, ExtractedRequirements, AIChatResponse } from './types.js';
import { fallbackEngine } from './fallbackEngine.js';

export interface AIProviderAdapter {
  generateReply(
    messages: ChatMessage[],
    currentProject?: string,
    existingRequirements?: Partial<ExtractedRequirements>
  ): Promise<AIChatResponse>;
}

export class GeminiAIAdapter implements AIProviderAdapter {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model = 'gemini-1.5-flash') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generateReply(
    messages: ChatMessage[],
    currentProject?: string,
    existingRequirements: Partial<ExtractedRequirements> = {}
  ): Promise<AIChatResponse> {
    const systemPrompt = `You are the AI Design Consultant for "Homeline Interio", an interior design and residential consultation studio in Kolkata, India.
Demo developed by Nats LAB.

KNOWLEDGE GROUNDING & STRICT RULES:
- Brand: Homeline Interio (Kolkata).
- Approved Services: Full Home Interiors, Modular Kitchens, Living Room Design, Bedroom Interiors, Space Planning, Renovation Consultation.
- Primary Localities: Garia, Salt Lake, New Town, Rajarhat, South City, Ballygunge, Behala, Jadavpur, Alipore, and surrounding Kolkata neighborhoods.
- You must NOT invent exact pricing, price per sq.ft., warranties, delivery dates, or claims of awards/testimonials.
- Explain that budget estimates depend on room dimensions, core materials (marine ply, HDHMR, BWR), hardware brands, and custom finishes, which are tailored during consultation.
- Tone: Warm, professional, design-aware, polite, concise (2-4 sentences max per message), non-pushy. Ask ONLY ONE follow-up question at a time.
- If user asks something outside your knowledge, gracefully advise that the human design team will address it during consultation.

OUTPUT FORMAT:
You MUST respond with valid JSON adhering strictly to this schema:
{
  "assistantMessage": "string (the natural response to the customer, asking one follow-up or summarizing brief)",
  "extractedRequirements": {
    "propertyType": "string or null (e.g. 2BHK Apartment)",
    "projectType": "string or null (e.g. Modular Kitchens)",
    "locality": "string or null (e.g. Garia)",
    "budget": "string or null (e.g. ₹3 Lakh)",
    "style": "string or null (e.g. Modern Contemporary)",
    "scopeOrDimensions": "string or null"
  },
  "suggestedActions": ["2 to 4 short pill actions for the user"],
  "leadCaptureRecommended": boolean (true when projectType and locality/propertyType are identified or user asks to proceed)
}`;

    // Convert conversation to Gemini contents format
    const contents = [
      {
        role: 'user',
        parts: [{ text: `${systemPrompt}\n\nContext Seed: currentProject=${currentProject || 'none'}, existingRequirements=${JSON.stringify(existingRequirements)}` }]
      },
      {
        role: 'model',
        parts: [{ text: '{"assistantMessage": "Understood. I will strictly follow all Homeline Interio knowledge grounding rules and output pure JSON.", "extractedRequirements": {}, "suggestedActions": [], "leadCaptureRecommended": false}' }]
      },
      ...messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }))
    ];

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 600,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API error ${res.status}: ${errText}`);
    }

    const data = (await res.json()) as any;
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error('No candidate content received from Gemini.');
    }

    const parsed = JSON.parse(candidateText);

    // Merge with deterministic extractor for robustness
    const fallbackExtracted = fallbackEngine.extractRequirements(messages, {
      ...existingRequirements,
      ...(parsed.extractedRequirements || {})
    });

    return {
      assistantMessage: parsed.assistantMessage || 'How can I assist with your interior design project?',
      extractedRequirements: {
        ...fallbackExtracted,
        propertyType: parsed.extractedRequirements?.propertyType || fallbackExtracted.propertyType,
        projectType: parsed.extractedRequirements?.projectType || fallbackExtracted.projectType,
        locality: parsed.extractedRequirements?.locality || fallbackExtracted.locality,
        budget: parsed.extractedRequirements?.budget || fallbackExtracted.budget,
        style: parsed.extractedRequirements?.style || fallbackExtracted.style,
      },
      suggestedActions: Array.isArray(parsed.suggestedActions) && parsed.suggestedActions.length > 0
        ? parsed.suggestedActions
        : ['View Kitchens', 'Full Home Planning', 'Book Consultation'],
      leadCaptureRecommended: Boolean(parsed.leadCaptureRecommended),
      isFallbackMode: false,
      provider: `Google Gemini (${this.model})`
    };
  }
}

/**
 * AI Service Manager with automatic fallback
 */
export class AIService {
  private adapter?: AIProviderAdapter;

  constructor() {
    this.initAdapter();
  }

  private initAdapter() {
    if (env.AI_PROVIDER === 'gemini' && env.AI_API_KEY) {
      this.adapter = new GeminiAIAdapter(env.AI_API_KEY, env.AI_MODEL);
    }
  }

  async chat(
    messages: ChatMessage[],
    currentProject?: string,
    existingRequirements: Partial<ExtractedRequirements> = {}
  ): Promise<AIChatResponse> {
    if (this.adapter) {
      try {
        return await this.adapter.generateReply(messages, currentProject, existingRequirements);
      } catch (err: any) {
        console.warn(`[AI Service] Provider failed (${err.message}). Falling back to deterministic knowledge engine.`);
        const fallbackRes = fallbackEngine.process(messages, currentProject, existingRequirements);
        return {
          ...fallbackRes,
          assistantMessage: `${fallbackRes.assistantMessage}`
        };
      }
    }

    // Default Fallback deterministic engine (No API key needed)
    return fallbackEngine.process(messages, currentProject, existingRequirements);
  }
}

export const aiService = new AIService();
