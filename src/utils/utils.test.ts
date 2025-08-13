import { describe, it, expect, beforeEach, vi } from 'vitest';
import { formatTime, getCurrentYear, formatDate, isBusinessOpen, getTodaysHours } from './utils';

describe('Utils Functions', () => {
  describe('formatTime', () => {
    it('should format 24-hour time to 12-hour format', () => {
      expect(formatTime('09:30')).toBe('9:30 AM');
      expect(formatTime('14:45')).toBe('2:45 PM');
      expect(formatTime('00:00')).toBe('12:00 AM');
      expect(formatTime('12:00')).toBe('12:00 PM');
      expect(formatTime('23:59')).toBe('11:59 PM');
    });

    it('should handle edge cases', () => {
      expect(formatTime('')).toBe('');
      expect(formatTime('01:05')).toBe('1:05 AM');
      expect(formatTime('13:00')).toBe('1:00 PM');
    });
  });

  describe('getCurrentYear', () => {
    it('should return current year as number', () => {
      const year = getCurrentYear();
      expect(typeof year).toBe('number');
      expect(year).toBeGreaterThan(2020);
      expect(year).toBeLessThan(3000);
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2023-12-25');
      const formatted = formatDate(date);
      expect(formatted).toBe('Dec 25, 2023');
    });

    it('should handle string date input', () => {
      const formatted = formatDate('2023-01-01');
      expect(formatted).toBe('Jan 1, 2023');
    });

    it('should handle different date formats', () => {
      expect(formatDate('2023-06-15')).toBe('Jun 15, 2023');
      expect(formatDate('2023-12-31')).toBe('Dec 31, 2023');
    });
  });

  describe('isBusinessOpen', () => {
    beforeEach(() => {
      // Mock current time to Wednesday 2:30 PM
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2023-11-15T14:30:00')); // Wednesday
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    const mockBusinessHours = {
      monday: { open: '09:00', close: '17:00', closed: false },
      tuesday: { open: '09:00', close: '17:00', closed: false },
      wednesday: { open: '09:00', close: '17:00', closed: false },
      thursday: { open: '09:00', close: '17:00', closed: false },
      friday: { open: '09:00', close: '17:00', closed: false },
      saturday: { open: '10:00', close: '15:00', closed: false },
      sunday: { open: '', close: '', closed: true }
    };

    it('should return true when business is open', () => {
      const isOpen = isBusinessOpen(mockBusinessHours);
      expect(isOpen).toBe(true);
    });

    it('should return false when business is closed on Sunday', () => {
      // Set time to Sunday
      vi.setSystemTime(new Date('2023-11-19T14:30:00')); // Sunday
      const isOpen = isBusinessOpen(mockBusinessHours);
      expect(isOpen).toBe(false);
    });

    it('should return false when outside business hours', () => {
      // Set time to Wednesday 6 PM (after closing)
      vi.setSystemTime(new Date('2023-11-15T18:00:00')); // Wednesday 6 PM
      const isOpen = isBusinessOpen(mockBusinessHours);
      expect(isOpen).toBe(false);
    });

    it('should return false when before opening hours', () => {
      // Set time to Wednesday 8 AM (before opening)
      vi.setSystemTime(new Date('2023-11-15T08:00:00')); // Wednesday 8 AM
      const isOpen = isBusinessOpen(mockBusinessHours);
      expect(isOpen).toBe(false);
    });

    it('should handle boundary times correctly', () => {
      // Set time to exactly opening time
      vi.setSystemTime(new Date('2023-11-15T09:00:00')); // Wednesday 9 AM
      expect(isBusinessOpen(mockBusinessHours)).toBe(true);
      
      // Set time to exactly closing time
      vi.setSystemTime(new Date('2023-11-15T17:00:00')); // Wednesday 5 PM
      expect(isBusinessOpen(mockBusinessHours)).toBe(true);
    });
  });

  describe('getTodaysHours', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2023-11-15T14:30:00')); // Wednesday
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    const mockBusinessHours = {
      monday: { open: '09:00', close: '17:00', closed: false },
      tuesday: { open: '09:00', close: '17:00', closed: false },
      wednesday: { open: '09:00', close: '17:00', closed: false },
      thursday: { open: '09:00', close: '17:00', closed: false },
      friday: { open: '09:00', close: '17:00', closed: false },
      saturday: { open: '10:00', close: '15:00', closed: false },
      sunday: { open: '', close: '', closed: true }
    };

    it('should return formatted hours for current day', () => {
      const hours = getTodaysHours(mockBusinessHours);
      expect(hours).toBe('9:00 AM - 5:00 PM');
    });

    it('should return "Closed" for closed days', () => {
      // Set time to Sunday
      vi.setSystemTime(new Date('2023-11-19T14:30:00')); // Sunday
      const hours = getTodaysHours(mockBusinessHours);
      expect(hours).toBe('Closed');
    });

    it('should handle different hours for Saturday', () => {
      // Set time to Saturday
      vi.setSystemTime(new Date('2023-11-18T14:30:00')); // Saturday
      const hours = getTodaysHours(mockBusinessHours);
      expect(hours).toBe('10:00 AM - 3:00 PM');
    });

    it('should handle different days of the week', () => {
      // Monday
      vi.setSystemTime(new Date('2023-11-13T14:30:00'));
      expect(getTodaysHours(mockBusinessHours)).toBe('9:00 AM - 5:00 PM');
      
      // Tuesday
      vi.setSystemTime(new Date('2023-11-14T14:30:00'));
      expect(getTodaysHours(mockBusinessHours)).toBe('9:00 AM - 5:00 PM');
    });
  });
});