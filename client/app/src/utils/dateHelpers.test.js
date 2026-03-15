import { describe, it, expect } from 'vitest';
import { formatISOToMMDDYYYY, parseISODate } from './dateHelpers';

describe('Date Helpers', () => {
  describe('formatISOToMMDDYYYY', () => {
    it('should format valid ISO date to MM/DD/YYYY', () => {
      expect(formatISOToMMDDYYYY('2023-10-05')).toBe('10/05/2023');
    });

    it('should return empty string for empty input', () => {
      expect(formatISOToMMDDYYYY('')).toBe('');
      expect(formatISOToMMDDYYYY(null)).toBe('');
    });
  });

  describe('parseISODate', () => {
    it('should parse valid ISO date to Date object', () => {
      const date = parseISODate('2023-10-05');
      expect(date).toBeInstanceOf(Date);
      expect(date.getFullYear()).toBe(2023);
      expect(date.getMonth()).toBe(9); // Month is 0-indexed
      expect(date.getDate()).toBe(5);
    });

    it('should return null for invalid dates', () => {
      expect(parseISODate('2023-13-05')).toBeNull(); // invalid month
      expect(parseISODate('2023-10-32')).toBeNull(); // invalid day
      expect(parseISODate('')).toBeNull();
    });
  });
});
