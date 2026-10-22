import { describe, it, expect } from 'vitest';
import { CreateLeadSchema } from '../src/validators/leadValidator.js';

describe('Lead Schema Validation', () => {
  const validLead = {
    name: 'Siddharth Roy',
    phone: '9830123456',
    email: 'siddharth@example.com',
    projectType: 'Modular Kitchens',
    locality: 'Garia, Kolkata',
    budgetRange: '₹3 - ₹6 Lakh',
    description: 'Planning an L-shaped kitchen layout with tandem drawers.',
    preferredContactMethod: 'WhatsApp',
    source: 'homepage',
    consentGiven: true
  };

  it('passes validation for valid lead payload', () => {
    const result = CreateLeadSchema.safeParse(validLead);
    expect(result.success).toBe(true);
  });

  it('fails when consentGiven is false or missing', () => {
    const withoutConsent = { ...validLead, consentGiven: false };
    const result = CreateLeadSchema.safeParse(withoutConsent);
    expect(result.success).toBe(false);
  });

  it('fails when Indian phone number is invalid', () => {
    const invalidPhone = { ...validLead, phone: '1234567890' };
    const result = CreateLeadSchema.safeParse(invalidPhone);
    expect(result.success).toBe(false);
  });

  it('fails when name is too short', () => {
    const shortName = { ...validLead, name: 'A' };
    const result = CreateLeadSchema.safeParse(shortName);
    expect(result.success).toBe(false);
  });

  it('allows optional email to be empty string or omitted', () => {
    const noEmail = { ...validLead, email: '' };
    const result = CreateLeadSchema.safeParse(noEmail);
    expect(result.success).toBe(true);
  });

  it('rejects unsupported project categories', () => {
    const badCategory = { ...validLead, projectType: 'Commercial Skybridge' };
    const result = CreateLeadSchema.safeParse(badCategory);
    expect(result.success).toBe(false);
  });
});
