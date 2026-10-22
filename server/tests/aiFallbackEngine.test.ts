import { describe, it, expect } from 'vitest';
import { fallbackEngine } from '../src/services/ai/fallbackEngine.js';

describe('AI Fallback Conversation Engine', () => {
  it('correctly extracts property type, project type, locality, and budget from natural speech', () => {
    const userMessage = "I've just bought a 2BHK flat in Garia and want a modular kitchen and living room design within ₹3 lakh.";
    const req = fallbackEngine.extractRequirements([
      { role: 'user', content: userMessage }
    ]);

    expect(req.propertyType).toBe('2BHK Apartment');
    expect(req.projectType).toBe('Modular Kitchens');
    expect(req.locality).toBe('Garia');
    expect(req.budget).toBe('₹3 Lakh');
  });

  it('greets customer politely when no prior context exists', () => {
    const res = fallbackEngine.process([
      { role: 'user', content: 'Hello, looking for interior design' }
    ]);

    expect(res.isFallbackMode).toBe(true);
    expect(res.assistantMessage).toContain('Welcome to Homeline Interio');
    expect(res.suggestedActions.length).toBeGreaterThan(0);
    expect(res.leadCaptureRecommended).toBe(false);
  });

  it('asks for missing locality when project type is known', () => {
    const res = fallbackEngine.process([
      { role: 'user', content: 'I want a modular kitchen design' }
    ]);

    expect(res.extractedRequirements.projectType).toBe('Modular Kitchens');
    expect(res.assistantMessage).toContain('Which locality in or around Kolkata');
    expect(res.leadCaptureRecommended).toBe(false);
  });

  it('offers lead capture handover when requirements are gathered', () => {
    const res = fallbackEngine.process([
      { role: 'user', content: 'We need full home interiors for our 3BHK in New Town with budget ₹8 Lakh' },
      { role: 'assistant', content: 'Understood. Let us help organize your requirements.' },
      { role: 'user', content: 'Please submit enquiry for the consultation' }
    ]);

    expect(res.leadCaptureRecommended).toBe(true);
    expect(res.assistantMessage).toContain('design brief');
    expect(res.suggestedActions).toContain('Yes, Prepare Enquiry');
  });

  it('answers grounded FAQ regarding Kolkata operating regions without hallucinating', () => {
    const res = fallbackEngine.process([
      { role: 'user', content: 'Where does Homeline Interio operate in Kolkata?' }
    ]);

    expect(res.assistantMessage).toContain('Garia, Salt Lake, New Town');
    expect(res.isFallbackMode).toBe(true);
  });
});
