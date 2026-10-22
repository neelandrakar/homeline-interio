import { describe, it, expect } from 'vitest';
import { normalizeIndianPhoneNumber } from '../src/utils/phoneNormalizer.js';

describe('Indian Phone Number Normalization', () => {
  it('accepts standard 10-digit Indian numbers starting with 9, 8, 7, or 6', () => {
    const res1 = normalizeIndianPhoneNumber('9876543210');
    expect(res1.isValid).toBe(true);
    expect(res1.formattedE164).toBe('+919876543210');
    expect(res1.formattedDisplay).toBe('+91 98765 43210');

    const res2 = normalizeIndianPhoneNumber('8123456789');
    expect(res2.isValid).toBe(true);

    const res3 = normalizeIndianPhoneNumber('7980123456');
    expect(res3.isValid).toBe(true);

    const res4 = normalizeIndianPhoneNumber('6290123456');
    expect(res4.isValid).toBe(true);
  });

  it('normalizes numbers with +91 country prefix', () => {
    const res = normalizeIndianPhoneNumber('+91 98765 43210');
    expect(res.isValid).toBe(true);
    expect(res.digits).toBe('9876543210');
    expect(res.formattedE164).toBe('+919876543210');
  });

  it('normalizes numbers with 91 prefix without plus', () => {
    const res = normalizeIndianPhoneNumber('919876543210');
    expect(res.isValid).toBe(true);
    expect(res.digits).toBe('9876543210');
  });

  it('normalizes numbers with trunk prefix 0', () => {
    const res = normalizeIndianPhoneNumber('09876543210');
    expect(res.isValid).toBe(true);
    expect(res.digits).toBe('9876543210');
  });

  it('rejects numbers starting with invalid leading digits (1-5)', () => {
    const res = normalizeIndianPhoneNumber('5555555555');
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('must begin with 6, 7, 8, or 9');
  });

  it('rejects numbers with invalid lengths or non-digit characters', () => {
    expect(normalizeIndianPhoneNumber('12345').isValid).toBe(false);
    expect(normalizeIndianPhoneNumber('9876543210000').isValid).toBe(false);
    expect(normalizeIndianPhoneNumber('abcdefghij').isValid).toBe(false);
    expect(normalizeIndianPhoneNumber('').isValid).toBe(false);
  });
});
