import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate } from '../format';

describe('formatCurrency', () => {
  it('should format USD currency correctly', () => {
    expect(formatCurrency(1000, 'USD')).toBe('$1,000.00');
    expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
    expect(formatCurrency(0, 'USD')).toBe('$0.00');
  });

  it('should format EUR currency correctly', () => {
    const result = formatCurrency(1000, 'EUR');
    expect(result).toContain('1,000.00');
    expect(result).toContain('€');
  });

  it('should format GBP currency correctly', () => {
    const result = formatCurrency(1000, 'GBP');
    expect(result).toContain('1,000.00');
    expect(result).toContain('£');
  });

  it('should handle negative amounts', () => {
    expect(formatCurrency(-100, 'USD')).toBe('-$100.00');
  });

  it('should default to USD if currency not provided', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00');
  });

  it('should handle decimal amounts', () => {
    expect(formatCurrency(99.99, 'USD')).toBe('$99.99');
    expect(formatCurrency(0.01, 'USD')).toBe('$0.01');
  });
});

describe('formatDate', () => {
  it('should format date string correctly', () => {
    const date = '2024-01-15';
    const formatted = formatDate(date);
    expect(formatted).toBeTruthy();
    expect(typeof formatted).toBe('string');
  });

  it('should handle ISO date strings', () => {
    const date = '2024-12-31T00:00:00.000Z';
    const formatted = formatDate(date);
    expect(formatted).toBeTruthy();
  });

  it('should handle different date formats', () => {
    const date = '2024-06-15';
    const formatted = formatDate(date);
    expect(formatted).toContain('2024');
  });
});
