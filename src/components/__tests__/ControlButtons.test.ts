/**
 * Unit tests for ControlButtons component
 * Tests the timer control functionality and reset confirmation
 */
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ControlButtons from '../ControlButtons.vue';

describe('ControlButtons', () => {
  describe('Button Display Logic - Requirements 1.2, 1.4, 3.1, 3.2', () => {
    it('should show start button when timer is not running and not paused', () => {
      const wrapper = mount(ControlButtons, {
        props: {
          isRunning: false,
          isPaused: false
        }
      });

      expect(wrapper.find('.btn-start').exists()).toBe(true);
      expect(wrapper.find('.btn-start').text()).toBe('開始');
      expect(wrapper.find('.btn-pause').exists()).toBe(false);
      expect(wrapper.find('.btn-resume').exists()).toBe(false);
      expect(wrapper.find('.btn-reset').exists()).toBe(false);
    });

    it('should show pause and reset buttons when timer is running', () => {
      const wrapper = mount(ControlButtons, {
        props: {
          isRunning: true,
          isPaused: false
        }
      });

      expect(wrapper.find('.btn-start').exists()).toBe(false);
      expect(wrapper.find('.btn-pause').exists()).toBe(true);
      expect(wrapper.find('.btn-pause').text()).toBe('一時停止');
      expect(wrapper.find('.btn-resume').exists()).toBe(false);
      expect(wrapper.find('.btn-reset').exists()).toBe(true);
      expect(wrapper.find('.btn-reset').text()).toBe('リセット');
    });

    it('should show resume and reset buttons when timer is paused', () => {
      const wrapper = mount(ControlButtons, {
        props: {
          isRunning: false,
          isPaused: true
        }
      });

      expect(wrapper.find('.btn-start').exists()).toBe(false);
      expect(wrapper.find('.btn-pause').exists()).toBe(false);
      expect(wrapper.find('.btn-resume').exists()).toBe(true);
      expect(wrapper.find('.btn-resume').text()).toBe('再開');
      expect(wrapper.find('.btn-reset').exists()).toBe(true);
    });
  });

  describe('Button Events', () => {
    it('should emit start event when start button is clicked', async () => {
      const wrapper = mount(ControlButtons, {
        props: {
          isRunning: false,
          isPaused: false
        }
      });

      await wrapper.find('.btn-start').trigger('click');

      expect(wrapper.emitted('start')).toHaveLength(1);
    });

    it('should emit pause event when pause button is clicked', async () => {
      const wrapper = mount(ControlButtons, {
        props: {
          isRunning: true,
          isPaused: false
        }
      });

      await wrapper.find('.btn-pause').trigger('click');

      expect(wrapper.emitted('pause')).toHaveLength(1);
    });

    it('should emit start event when resume button is clicked', async () => {
      const wrapper = mount(ControlButtons, {
        props: {
          isRunning: false,
          isPaused: true
        }
      });

      await wrapper.find('.btn-resume').trigger('click');

      expect(wrapper.emitted('start')).toHaveLength(1);
    });
  });

  describe('Reset Confirmation - Requirements 3.3, 3.4', () => {
    it('should show confirmation dialog when reset button is clicked', async () => {
      const wrapper = mount(ControlButtons, {
        props: {
          isRunning: true,
          isPaused: false
        }
      });

      expect(wrapper.find('.confirmation-overlay').exists()).toBe(false);

      await wrapper.find('.btn-reset').trigger('click');

      expect(wrapper.find('.confirmation-overlay').exists()).toBe(true);
      expect(wrapper.find('.confirmation-dialog').exists()).toBe(true);
      expect(wrapper.find('.confirmation-title').text()).toBe('タイマーをリセットしますか？');
      expect(wrapper.find('.confirmation-message').text()).toContain('現在の進行状況が失われ');
    });

    it('should emit reset event when reset is confirmed', async () => {
      const wrapper = mount(ControlButtons, {
        props: {
          isRunning: true,
          isPaused: false
        }
      });

      // Open confirmation dialog
      await wrapper.find('.btn-reset').trigger('click');
      expect(wrapper.find('.confirmation-overlay').exists()).toBe(true);

      // Confirm reset
      await wrapper.find('.btn-confirm').trigger('click');

      expect(wrapper.emitted('reset')).toHaveLength(1);
      expect(wrapper.find('.confirmation-overlay').exists()).toBe(false);
    });

    it('should close dialog without emitting reset when cancelled', async () => {
      const wrapper = mount(ControlButtons, {
        props: {
          isRunning: true,
          isPaused: false
        }
      });

      // Open confirmation dialog
      await wrapper.find('.btn-reset').trigger('click');
      expect(wrapper.find('.confirmation-overlay').exists()).toBe(true);

      // Cancel reset
      await wrapper.find('.btn-cancel').trigger('click');

      expect(wrapper.emitted('reset')).toBeUndefined();
      expect(wrapper.find('.confirmation-overlay').exists()).toBe(false);
    });

    it('should close dialog when clicking overlay background', async () => {
      const wrapper = mount(ControlButtons, {
        props: {
          isRunning: true,
          isPaused: false
        }
      });

      // Open confirmation dialog
      await wrapper.find('.btn-reset').trigger('click');
      expect(wrapper.find('.confirmation-overlay').exists()).toBe(true);

      // Click overlay background
      await wrapper.find('.confirmation-overlay').trigger('click');

      expect(wrapper.emitted('reset')).toBeUndefined();
      expect(wrapper.find('.confirmation-overlay').exists()).toBe(false);
    });

    it('should not close dialog when clicking dialog content', async () => {
      const wrapper = mount(ControlButtons, {
        props: {
          isRunning: true,
          isPaused: false
        }
      });

      // Open confirmation dialog
      await wrapper.find('.btn-reset').trigger('click');
      expect(wrapper.find('.confirmation-overlay').exists()).toBe(true);

      // Click dialog content (should not close)
      await wrapper.find('.confirmation-dialog').trigger('click');

      expect(wrapper.find('.confirmation-overlay').exists()).toBe(true);
    });
  });

  describe('Disabled State', () => {
    it('should disable all buttons when disabled prop is true', () => {
      const wrapper = mount(ControlButtons, {
        props: {
          isRunning: false,
          isPaused: false,
          disabled: true
        }
      });

      const startButton = wrapper.find('.btn-start');
      expect(startButton.attributes('disabled')).toBeDefined();
    });

    it('should disable buttons in running state when disabled', () => {
      const wrapper = mount(ControlButtons, {
        props: {
          isRunning: true,
          isPaused: false,
          disabled: true
        }
      });

      expect(wrapper.find('.btn-pause').attributes('disabled')).toBeDefined();
      expect(wrapper.find('.btn-reset').attributes('disabled')).toBeDefined();
    });

    it('should disable buttons in paused state when disabled', () => {
      const wrapper = mount(ControlButtons, {
        props: {
          isRunning: false,
          isPaused: true,
          disabled: true
        }
      });

      expect(wrapper.find('.btn-resume').attributes('disabled')).toBeDefined();
      expect(wrapper.find('.btn-reset').attributes('disabled')).toBeDefined();
    });

    it('should not emit events when buttons are disabled', async () => {
      const wrapper = mount(ControlButtons, {
        props: {
          isRunning: false,
          isPaused: false,
          disabled: true
        }
      });

      await wrapper.find('.btn-start').trigger('click');

      expect(wrapper.emitted('start')).toBeUndefined();
    });
  });

  describe('Default Props', () => {
    it('should use default disabled value of false', () => {
      const wrapper = mount(ControlButtons, {
        props: {
          isRunning: false,
          isPaused: false
        }
      });

      const startButton = wrapper.find('.btn-start');
      expect(startButton.attributes('disabled')).toBeUndefined();
    });
  });

  describe('Button Styling and Classes', () => {
    it('should apply correct CSS classes to buttons', () => {
      const wrapper = mount(ControlButtons, {
        props: {
          isRunning: true,
          isPaused: false
        }
      });

      const pauseButton = wrapper.find('.btn-pause');
      const resetButton = wrapper.find('.btn-reset');

      expect(pauseButton.classes()).toContain('btn');
      expect(pauseButton.classes()).toContain('btn-warning');
      expect(pauseButton.classes()).toContain('btn-pause');

      expect(resetButton.classes()).toContain('btn');
      expect(resetButton.classes()).toContain('btn-secondary');
      expect(resetButton.classes()).toContain('btn-reset');
    });

    it('should apply correct classes to confirmation dialog buttons', async () => {
      const wrapper = mount(ControlButtons, {
        props: {
          isRunning: true,
          isPaused: false
        }
      });

      await wrapper.find('.btn-reset').trigger('click');

      const cancelButton = wrapper.find('.btn-cancel');
      const confirmButton = wrapper.find('.btn-confirm');

      expect(cancelButton.classes()).toContain('btn-secondary');
      expect(confirmButton.classes()).toContain('btn-urgent');
    });
  });

  describe('Accessibility - Requirements 4.1, 4.2', () => {
    it('should have proper button types', () => {
      const wrapper = mount(ControlButtons, {
        props: {
          isRunning: true,
          isPaused: false
        }
      });

      expect(wrapper.find('.btn-pause').attributes('type')).toBe('button');
      expect(wrapper.find('.btn-reset').attributes('type')).toBe('button');
    });

    it('should have proper button types in confirmation dialog', async () => {
      const wrapper = mount(ControlButtons, {
        props: {
          isRunning: true,
          isPaused: false
        }
      });

      await wrapper.find('.btn-reset').trigger('click');

      expect(wrapper.find('.btn-cancel').attributes('type')).toBe('button');
      expect(wrapper.find('.btn-confirm').attributes('type')).toBe('button');
    });

    it('should have touch-friendly button sizing', () => {
      const wrapper = mount(ControlButtons, {
        props: {
          isRunning: false,
          isPaused: false
        }
      });

      const button = wrapper.find('.btn-start');
      expect(button.classes()).toContain('btn');
      // The actual sizing is handled by CSS, but we can verify the class is applied
    });
  });

  describe('State Transitions', () => {
    it('should handle state transitions correctly', async () => {
      const wrapper = mount(ControlButtons, {
        props: {
          isRunning: false,
          isPaused: false
        }
      });

      // Initial state - should show start button
      expect(wrapper.find('.btn-start').exists()).toBe(true);

      // Change to running state
      await wrapper.setProps({ isRunning: true, isPaused: false });
      expect(wrapper.find('.btn-start').exists()).toBe(false);
      expect(wrapper.find('.btn-pause').exists()).toBe(true);
      expect(wrapper.find('.btn-reset').exists()).toBe(true);

      // Change to paused state
      await wrapper.setProps({ isRunning: false, isPaused: true });
      expect(wrapper.find('.btn-pause').exists()).toBe(false);
      expect(wrapper.find('.btn-resume').exists()).toBe(true);
      expect(wrapper.find('.btn-reset').exists()).toBe(true);

      // Back to initial state
      await wrapper.setProps({ isRunning: false, isPaused: false });
      expect(wrapper.find('.btn-start').exists()).toBe(true);
      expect(wrapper.find('.btn-resume').exists()).toBe(false);
      expect(wrapper.find('.btn-reset').exists()).toBe(false);
    });
  });

  describe('Component Structure', () => {
    it('should have proper component structure', () => {
      const wrapper = mount(ControlButtons, {
        props: {
          isRunning: false,
          isPaused: false
        }
      });

      expect(wrapper.find('.control-buttons-container').exists()).toBe(true);
      expect(wrapper.find('.control-buttons').exists()).toBe(true);
    });

    it('should maintain structure with confirmation dialog', async () => {
      const wrapper = mount(ControlButtons, {
        props: {
          isRunning: true,
          isPaused: false
        }
      });

      await wrapper.find('.btn-reset').trigger('click');

      expect(wrapper.find('.control-buttons-container').exists()).toBe(true);
      expect(wrapper.find('.control-buttons').exists()).toBe(true);
      expect(wrapper.find('.confirmation-overlay').exists()).toBe(true);
      expect(wrapper.find('.confirmation-dialog').exists()).toBe(true);
    });
  });
});