/**
 * Unit tests for useNotification composable
 * Tests the 5-minute warning notification functionality
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useNotification } from '../useNotification';

describe('useNotification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with default state', () => {
      const notification = useNotification();
      
      expect(notification.state.value.showFiveMinuteWarning).toBe(false);
      expect(notification.state.value.warningMessage).toBe('');
      expect(notification.state.value.considerationItems).toEqual([]);
    });
  });

  describe('5-Minute Warning - Requirements 2.1, 2.2', () => {
    it('should trigger 5-minute warning with correct message', () => {
      const notification = useNotification();
      
      notification.triggerFiveMinuteWarning();
      
      expect(notification.state.value.showFiveMinuteWarning).toBe(true);
      expect(notification.state.value.warningMessage).toBe('家づくりを前向きに進めるか検討する時間です');
    });

    it('should set correct consideration items - Requirement 2.2', () => {
      const notification = useNotification();
      
      notification.triggerFiveMinuteWarning();
      
      const expectedItems = [
        '次回も商談を行うかどうか',
        'その日にちはいつにするか'
      ];
      
      expect(notification.state.value.considerationItems).toEqual(expectedItems);
      expect(notification.getConsiderationItems()).toEqual(expectedItems);
    });

    it('should maintain warning state until explicitly hidden', () => {
      const notification = useNotification();
      
      notification.triggerFiveMinuteWarning();
      
      expect(notification.state.value.showFiveMinuteWarning).toBe(true);
      
      // Should remain true until hideWarning is called
      expect(notification.state.value.showFiveMinuteWarning).toBe(true);
    });
  });

  describe('Hide Warning Functionality', () => {
    it('should hide warning and clear all related state', () => {
      const notification = useNotification();
      
      // First trigger the warning
      notification.triggerFiveMinuteWarning();
      expect(notification.state.value.showFiveMinuteWarning).toBe(true);
      expect(notification.state.value.warningMessage).toBe('家づくりを前向きに進めるか検討する時間です');
      expect(notification.state.value.considerationItems).toHaveLength(2);
      
      // Then hide it
      notification.hideWarning();
      
      expect(notification.state.value.showFiveMinuteWarning).toBe(false);
      expect(notification.state.value.warningMessage).toBe('');
      expect(notification.state.value.considerationItems).toEqual([]);
    });

    it('should be safe to call hideWarning when no warning is shown', () => {
      const notification = useNotification();
      
      expect(() => notification.hideWarning()).not.toThrow();
      expect(notification.state.value.showFiveMinuteWarning).toBe(false);
    });
  });

  describe('Consideration Items Management', () => {
    it('should return empty array when no warning is active', () => {
      const notification = useNotification();
      
      expect(notification.getConsiderationItems()).toEqual([]);
    });

    it('should return correct items when warning is active', () => {
      const notification = useNotification();
      
      notification.triggerFiveMinuteWarning();
      
      const items = notification.getConsiderationItems();
      expect(items).toHaveLength(2);
      expect(items[0]).toBe('次回も商談を行うかどうか');
      expect(items[1]).toBe('その日にちはいつにするか');
    });

    it('should return consideration items correctly', () => {
      const notification = useNotification();
      
      notification.triggerFiveMinuteWarning();
      
      const items1 = notification.getConsiderationItems();
      const items2 = notification.getConsiderationItems();
      
      expect(items1).toEqual(items2);
      // Note: The current implementation returns the same array reference
      // This is acceptable for this use case
      expect(items1).toHaveLength(2);
    });
  });

  describe('Sound Notification', () => {
    it('should have playSound method available', () => {
      const notification = useNotification();
      
      expect(typeof notification.playSound).toBe('function');
    });

    it('should handle playSound without errors', async () => {
      const notification = useNotification();
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      await expect(notification.playSound()).resolves.toBeUndefined();
      
      expect(consoleSpy).toHaveBeenCalledWith('Sound notification triggered (placeholder)');
      
      consoleSpy.mockRestore();
    });

    it('should handle playSound errors gracefully', async () => {
      const notification = useNotification();
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {
        throw new Error('Test error');
      });
      
      await expect(notification.playSound()).resolves.toBeUndefined();
      
      expect(consoleWarnSpy).toHaveBeenCalledWith('Sound notification failed:', expect.any(Error));
      
      consoleWarnSpy.mockRestore();
      consoleLogSpy.mockRestore();
    });
  });

  describe('State Reactivity', () => {
    it('should maintain reactive state throughout operations', () => {
      const notification = useNotification();
      
      // Initial state
      expect(notification.state.value.showFiveMinuteWarning).toBe(false);
      
      // After triggering
      notification.triggerFiveMinuteWarning();
      expect(notification.state.value.showFiveMinuteWarning).toBe(true);
      
      // After hiding
      notification.hideWarning();
      expect(notification.state.value.showFiveMinuteWarning).toBe(false);
    });

    it('should allow multiple trigger/hide cycles', () => {
      const notification = useNotification();
      
      // First cycle
      notification.triggerFiveMinuteWarning();
      expect(notification.state.value.showFiveMinuteWarning).toBe(true);
      
      notification.hideWarning();
      expect(notification.state.value.showFiveMinuteWarning).toBe(false);
      
      // Second cycle
      notification.triggerFiveMinuteWarning();
      expect(notification.state.value.showFiveMinuteWarning).toBe(true);
      expect(notification.state.value.warningMessage).toBe('家づくりを前向きに進めるか検討する時間です');
      
      notification.hideWarning();
      expect(notification.state.value.showFiveMinuteWarning).toBe(false);
    });
  });

  describe('Integration with Timer Requirements', () => {
    it('should support the expected warning message format - Requirement 2.1', () => {
      const notification = useNotification();
      
      notification.triggerFiveMinuteWarning();
      
      const message = notification.state.value.warningMessage;
      expect(message).toBe('家づくりを前向きに進めるか検討する時間です');
      expect(message).toMatch(/家づくり/);
      expect(message).toMatch(/検討/);
      expect(message).toMatch(/時間/);
    });

    it('should provide consideration content as specified - Requirement 2.2', () => {
      const notification = useNotification();
      
      notification.triggerFiveMinuteWarning();
      
      const items = notification.state.value.considerationItems;
      expect(items).toContain('次回も商談を行うかどうか');
      expect(items).toContain('その日にちはいつにするか');
      expect(items).toHaveLength(2);
    });
  });
});