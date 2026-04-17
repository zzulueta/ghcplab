import { describe, it, expect } from 'vitest';
import { formatPrice, calculateTotal, validateEmail } from './helpers';

describe('helpers', () => {
  describe('formatPrice', () => {
    it('should format price as USD currency', () => {
      expect(formatPrice(10)).toBe('$10.00');
      expect(formatPrice(10.5)).toBe('$10.50');
      expect(formatPrice(10.99)).toBe('$10.99');
    });

    it('should handle zero', () => {
      expect(formatPrice(0)).toBe('$0.00');
    });

    it('should handle large numbers', () => {
      expect(formatPrice(1000)).toBe('$1,000.00');
      expect(formatPrice(1000000)).toBe('$1,000,000.00');
    });

    it('should handle decimal precision', () => {
      expect(formatPrice(10.999)).toBe('$11.00');
      expect(formatPrice(10.001)).toBe('$10.00');
    });

    it('should handle negative numbers', () => {
      expect(formatPrice(-10)).toBe('-$10.00');
    });
  });

  describe('calculateTotal', () => {
    it('should calculate total for single item', () => {
      const items = [{ price: 10, quantity: 2 }];
      expect(calculateTotal(items)).toBe(20);
    });

    it('should calculate total for multiple items', () => {
      const items = [
        { price: 10, quantity: 2 },
        { price: 5.5, quantity: 3 },
        { price: 7.25, quantity: 1 }
      ];
      expect(calculateTotal(items)).toBe(43.75);
    });

    it('should return 0 for empty array', () => {
      expect(calculateTotal([])).toBe(0);
    });

    it('should handle zero quantities', () => {
      const items = [
        { price: 10, quantity: 0 },
        { price: 5, quantity: 2 }
      ];
      expect(calculateTotal(items)).toBe(10);
    });

    it('should handle zero prices', () => {
      const items = [
        { price: 0, quantity: 5 },
        { price: 10, quantity: 1 }
      ];
      expect(calculateTotal(items)).toBe(10);
    });

    it('should handle decimal quantities', () => {
      const items = [{ price: 10.50, quantity: 2.5 }];
      expect(calculateTotal(items)).toBe(26.25);
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@example.com')).toBe(true);
      expect(validateEmail('user+tag@example.co.uk')).toBe(true);
      expect(validateEmail('test123@test-domain.com')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('invalid@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('invalid@.com')).toBe(false);
      expect(validateEmail('invalid@domain')).toBe(false);
    });

    it('should reject emails with spaces', () => {
      expect(validateEmail('test @example.com')).toBe(false);
      expect(validateEmail('test@ example.com')).toBe(false);
      expect(validateEmail('test @example .com')).toBe(false);
    });

    it('should reject empty string', () => {
      expect(validateEmail('')).toBe(false);
    });

    it('should reject emails without domain extension', () => {
      expect(validateEmail('test@domain')).toBe(false);
    });

    it('should handle multiple @ symbols', () => {
      expect(validateEmail('test@@example.com')).toBe(false);
      expect(validateEmail('test@test@example.com')).toBe(false);
    });
  });
});
