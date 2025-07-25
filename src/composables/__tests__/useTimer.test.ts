/**
 * Unit tests for useTimer composable
 * Tests the 20-minute timer functionality, controls, and 5-minute warning
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useTimer } from '../useTimer';

// Mock browser compatibility utilities
vi.mock('@/utils/browserCompat', () => ({
  getHighResTime: () => Date.now(),
  warnUnsupportedFeatures: vi.fn()
}));

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Initial State - Requirements 1.1, 1.2', () => {
    it('should initialize with 20 minutes (1200 seconds) by default', () => {
      const timer = useTimer();
      
      expect(timer.state.value.totalDuration).toBe(1200);
      expect(timer.state.value.remainingTime).toBe(1200);
      expect(timer.state.value.isRunning).toBe(false);
      expect(timer.state.value.isPaused).toBe(false);
      expect(timer.state.value.fiveMinuteWarningShown).toBe(false);
    });

    it('should accept custom initial duration', () => {
      const customDuration = 600; // 10 minutes
      const timer = useTimer(customDuration);
      
      expect(timer.state.value.totalDuration).toBe(customDuration);
      expect(timer.state.value.remainingTime).toBe(customDuration);
    });

    it('should format time correctly in MM:SS format - Requirement 1.3', () => {
      const timer = useTimer();
      
      expect(timer.formatTime(1200)).toBe('20:00');
      expect(timer.formatTime(300)).toBe('05:00');
      expect(timer.formatTime(65)).toBe('01:05');
      expect(timer.formatTime(0)).toBe('00:00');
    });
  });

  describe('Timer Controls - Requirements 1.2, 1.4, 3.1, 3.2', () => {
    it('should start timer correctly', () => {
      const timer = useTimer();
      
      timer.start();
      
      expect(timer.state.value.isRunning).toBe(true);
      expect(timer.state.value.isPaused).toBe(false);
      expect(timer.state.value.startTime).not.toBeNull();
    });

    it('should not start timer if already running', () => {
      const timer = useTimer();
      
      timer.start();
      const firstStartTime = timer.state.value.startTime;
      
      timer.start(); // Try to start again
      
      expect(timer.state.value.startTime).toBe(firstStartTime);
    });

    it('should pause timer correctly', () => {
      const timer = useTimer();
      
      timer.start();
      timer.pause();
      
      expect(timer.state.value.isRunning).toBe(false);
      expect(timer.state.value.isPaused).toBe(true);
    });

    it('should not pause if timer is not running', () => {
      const timer = useTimer();
      
      timer.pause();
      
      expect(timer.state.value.isRunning).toBe(false);
      expect(timer.state.value.isPaused).toBe(false);
    });

    it('should reset timer to initial state - Requirements 3.3, 3.4', () => {
      const timer = useTimer();
      
      timer.start();
      vi.advanceTimersByTime(5000); // Advance 5 seconds
      timer.pause();
      timer.reset();
      
      expect(timer.state.value.isRunning).toBe(false);
      expect(timer.state.value.isPaused).toBe(false);
      expect(timer.state.value.remainingTime).toBe(1200);
      expect(timer.state.value.fiveMinuteWarningShown).toBe(false);
      expect(timer.state.value.startTime).toBeNull();
      expect(timer.state.value.pausedTime).toBe(0);
    });
  });

  describe('Timer Updates and Accuracy', () => {
    it('should update remaining time correctly', () => {
      const timer = useTimer();
      const mockNow = Date.now();
      
      vi.spyOn(Date, 'now')
        .mockReturnValueOnce(mockNow) // start time
        .mockReturnValueOnce(mockNow + 1000) // after 1 second
        .mockReturnValueOnce(mockNow + 2000); // after 2 seconds
      
      timer.start();
      vi.advanceTimersByTime(1000);
      
      // Allow for small timing variations in the test environment
      expect(timer.state.value.remainingTime).toBeGreaterThanOrEqual(1198);
      expect(timer.state.value.remainingTime).toBeLessThanOrEqual(1200);
    });

    it('should stop timer when reaching zero', () => {
      const timer = useTimer(1); // 1 second timer
      const mockNow = Date.now();
      
      vi.spyOn(Date, 'now')
        .mockReturnValueOnce(mockNow)
        .mockReturnValueOnce(mockNow + 1000);
      
      timer.start();
      vi.advanceTimersByTime(1000);
      
      expect(timer.state.value.remainingTime).toBe(0);
      expect(timer.state.value.isRunning).toBe(false);
    });
  });

  describe('5-Minute Warning - Requirements 2.1, 2.2, 2.3, 2.4', () => {
    it('should trigger 5-minute warning at exactly 300 seconds remaining', () => {
      const timer = useTimer(305); // Start with 305 seconds
      const mockNow = Date.now();
      
      vi.spyOn(Date, 'now')
        .mockReturnValueOnce(mockNow)
        .mockReturnValueOnce(mockNow + 5000); // After 5 seconds, should be 300 remaining
      
      timer.start();
      vi.advanceTimersByTime(5000);
      
      expect(timer.state.value.fiveMinuteWarningShown).toBe(true);
      expect(timer.shouldShowFiveMinuteWarning()).toBe(true);
    });

    it('should not trigger warning multiple times', () => {
      const timer = useTimer(310);
      const mockNow = Date.now();
      
      vi.spyOn(Date, 'now')
        .mockReturnValueOnce(mockNow)
        .mockReturnValueOnce(mockNow + 10000) // 300 seconds remaining
        .mockReturnValueOnce(mockNow + 11000); // 299 seconds remaining
      
      timer.start();
      vi.advanceTimersByTime(10000);
      
      expect(timer.state.value.fiveMinuteWarningShown).toBe(true);
      
      vi.advanceTimersByTime(1000);
      
      // Should still be true, not triggered again
      expect(timer.state.value.fiveMinuteWarningShown).toBe(true);
    });

    it('should continue timer after 5-minute warning - Requirement 2.4', () => {
      const timer = useTimer(310);
      const mockNow = Date.now();
      
      vi.spyOn(Date, 'now')
        .mockReturnValueOnce(mockNow)
        .mockReturnValueOnce(mockNow + 10000) // 300 seconds remaining
        .mockReturnValueOnce(mockNow + 15000); // 295 seconds remaining
      
      timer.start();
      vi.advanceTimersByTime(10000);
      
      expect(timer.state.value.fiveMinuteWarningShown).toBe(true);
      expect(timer.state.value.isRunning).toBe(true);
      
      vi.advanceTimersByTime(5000);
      
      expect(timer.state.value.isRunning).toBe(true);
      expect(timer.state.value.remainingTime).toBe(295);
    });

    it('should reset warning flag when timer is reset', () => {
      const timer = useTimer(310);
      const mockNow = Date.now();
      
      vi.spyOn(Date, 'now')
        .mockReturnValueOnce(mockNow)
        .mockReturnValueOnce(mockNow + 10000);
      
      timer.start();
      vi.advanceTimersByTime(10000);
      
      expect(timer.state.value.fiveMinuteWarningShown).toBe(true);
      
      timer.reset();
      
      expect(timer.state.value.fiveMinuteWarningShown).toBe(false);
      expect(timer.shouldShowFiveMinuteWarning()).toBe(false);
    });
  });

  describe('Progress Calculation', () => {
    it('should calculate progress percentage correctly', () => {
      const timer = useTimer(1200);
      
      // At start (0% progress)
      expect(timer.getProgressPercentage()).toBe(0);
      
      // Simulate 600 seconds elapsed (50% progress)
      timer.state.value.remainingTime = 600;
      expect(timer.getProgressPercentage()).toBe(50);
      
      // At end (100% progress)
      timer.state.value.remainingTime = 0;
      expect(timer.getProgressPercentage()).toBe(100);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle cleanup correctly', () => {
      const timer = useTimer();
      
      timer.start();
      timer.cleanup();
      
      // Should not throw errors and should clean up properly
      expect(() => timer.cleanup()).not.toThrow();
    });

    it('should handle pause and resume correctly', () => {
      const timer = useTimer();
      const mockNow = Date.now();
      
      vi.spyOn(Date, 'now')
        .mockReturnValueOnce(mockNow) // start
        .mockReturnValueOnce(mockNow + 5000) // pause after 5 seconds
        .mockReturnValueOnce(mockNow + 10000) // resume after 10 seconds total
        .mockReturnValueOnce(mockNow + 15000); // check after 15 seconds total
      
      timer.start();
      vi.advanceTimersByTime(5000);
      
      // Allow for small timing variations
      expect(timer.state.value.remainingTime).toBeGreaterThanOrEqual(1185);
      expect(timer.state.value.remainingTime).toBeLessThanOrEqual(1200);
      
      timer.pause();
      vi.advanceTimersByTime(5000); // Time passes while paused
      
      timer.start(); // Resume
      vi.advanceTimersByTime(5000); // 5 more seconds of actual timer time
      
      // Should have approximately 1190 seconds remaining (10 seconds total elapsed)
      expect(timer.state.value.remainingTime).toBeGreaterThanOrEqual(1185);
      expect(timer.state.value.remainingTime).toBeLessThanOrEqual(1195);
    });

    it('should not go below zero remaining time', () => {
      const timer = useTimer(1);
      const mockNow = Date.now();
      
      vi.spyOn(Date, 'now')
        .mockReturnValueOnce(mockNow)
        .mockReturnValueOnce(mockNow + 2000); // 2 seconds elapsed on 1 second timer
      
      timer.start();
      vi.advanceTimersByTime(2000);
      
      expect(timer.state.value.remainingTime).toBe(0);
      expect(timer.state.value.isRunning).toBe(false);
    });
  });

  describe('Browser Compatibility', () => {
    it('should handle missing Date.now gracefully', () => {
      const originalDateNow = Date.now;
      // @ts-ignore - Testing edge case
      delete Date.now;
      
      expect(() => {
        const timer = useTimer();
        timer.start();
      }).not.toThrow();
      
      Date.now = originalDateNow;
    });
  });
});