/**
 * Notification composable for 5-minute warning functionality
 * Manages the display of warning messages and consideration prompts
 */
import { ref } from 'vue';
import type { NotificationState, UseNotificationReturn } from '@/types/timer';

export function useNotification(): UseNotificationReturn {
  const state = ref<NotificationState>({
    showFiveMinuteWarning: false,
    warningMessage: '',
    considerationItems: []
  });

  /**
   * Triggers the 5-minute warning with the specified message and consideration content
   * Requirements: 2.1, 2.2
   */
  const triggerFiveMinuteWarning = (): void => {
    state.value.showFiveMinuteWarning = true;
    state.value.warningMessage = '家づくりを前向きに進めるか検討する時間です';
    state.value.considerationItems = [
      '次回も商談を行うかどうか',
      'その日にちはいつにするか'
    ];
  };

  /**
   * Hides the warning message and clears consideration items
   */
  const hideWarning = (): void => {
    state.value.showFiveMinuteWarning = false;
    state.value.warningMessage = '';
    state.value.considerationItems = [];
  };

  /**
   * Gets the consideration items for the 5-minute warning
   * Requirements: 2.2
   */
  const getConsiderationItems = (): string[] => {
    return state.value.considerationItems;
  };

  /**
   * Optional sound notification for 5-minute warning
   * Can be extended in the future for audio alerts
   */
  const playSound = async (): Promise<void> => {
    // Optional implementation for future audio notifications
    // For now, this is a placeholder that can be extended
    try {
      // Future implementation could include:
      // - Web Audio API for custom sounds
      // - HTML5 Audio element for sound files
      // - Browser notification sounds
      console.log('Sound notification triggered (placeholder)');
    } catch (error) {
      console.warn('Sound notification failed:', error);
    }
  };

  return {
    state,
    triggerFiveMinuteWarning,
    hideWarning,
    getConsiderationItems,
    playSound
  };
}