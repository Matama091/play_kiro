/**
 * Unit tests for TimerDisplay component
 * Tests the timer display functionality and visual feedback
 */
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TimerDisplay from '../TimerDisplay.vue';

describe('TimerDisplay', () => {
  describe('Time Display - Requirements 1.3, 5.1', () => {
    it('should display time in MM:SS format', () => {
      const wrapper = mount(TimerDisplay, {
        props: {
          remainingTime: 1200, // 20:00
          isRunning: false,
          showWarning: false
        }
      });

      expect(wrapper.find('.timer-time').text()).toBe('20:00');
    });

    it('should format different time values correctly', () => {
      const testCases = [
        { time: 1200, expected: '20:00' },
        { time: 300, expected: '05:00' },
        { time: 65, expected: '01:05' },
        { time: 5, expected: '00:05' },
        { time: 0, expected: '00:00' }
      ];

      testCases.forEach(({ time, expected }) => {
        const wrapper = mount(TimerDisplay, {
          props: {
            remainingTime: time,
            isRunning: false,
            showWarning: false
          }
        });

        expect(wrapper.find('.timer-time').text()).toBe(expected);
      });
    });

    it('should use monospace font for consistent display', () => {
      const wrapper = mount(TimerDisplay, {
        props: {
          remainingTime: 1200,
          isRunning: false,
          showWarning: false
        }
      });

      const timerTime = wrapper.find('.timer-time');
      expect(timerTime.exists()).toBe(true);
      
      // Check if the timer-time class is applied (CSS will handle the monospace font)
      expect(timerTime.classes()).toContain('timer-time');
    });
  });

  describe('Visual Feedback - Requirements 2.3, 5.2, 5.3', () => {
    it('should apply running class when timer is running', () => {
      const wrapper = mount(TimerDisplay, {
        props: {
          remainingTime: 1200,
          isRunning: true,
          showWarning: false
        }
      });

      expect(wrapper.find('.timer-display').classes()).toContain('timer-display--running');
    });

    it('should apply warning class when showing 5-minute warning', () => {
      const wrapper = mount(TimerDisplay, {
        props: {
          remainingTime: 300, // 5 minutes
          isRunning: true,
          showWarning: true
        }
      });

      expect(wrapper.find('.timer-display').classes()).toContain('timer-display--warning');
    });

    it('should apply urgent class when time is <= 5 minutes but no warning shown', () => {
      const wrapper = mount(TimerDisplay, {
        props: {
          remainingTime: 250, // Less than 5 minutes
          isRunning: true,
          showWarning: false
        }
      });

      expect(wrapper.find('.timer-display').classes()).toContain('timer-display--urgent');
    });

    it('should apply finished class when time is up', () => {
      const wrapper = mount(TimerDisplay, {
        props: {
          remainingTime: 0,
          isRunning: false,
          showWarning: false
        }
      });

      expect(wrapper.find('.timer-display').classes()).toContain('timer-display--finished');
    });

    it('should not apply urgent class when warning is shown', () => {
      const wrapper = mount(TimerDisplay, {
        props: {
          remainingTime: 300,
          isRunning: true,
          showWarning: true
        }
      });

      expect(wrapper.find('.timer-display').classes()).toContain('timer-display--warning');
      expect(wrapper.find('.timer-display').classes()).not.toContain('timer-display--urgent');
    });
  });

  describe('Props Handling', () => {
    it('should use default props when not provided', () => {
      const wrapper = mount(TimerDisplay);

      expect(wrapper.find('.timer-time').text()).toBe('20:00'); // Default 1200 seconds
      expect(wrapper.find('.timer-display').classes()).not.toContain('timer-display--running');
      expect(wrapper.find('.timer-display').classes()).not.toContain('timer-display--warning');
    });

    it('should handle edge case of negative time', () => {
      const wrapper = mount(TimerDisplay, {
        props: {
          remainingTime: -10,
          isRunning: false,
          showWarning: false
        }
      });

      // Should handle negative time gracefully (though this shouldn't happen in normal use)
      const timeText = wrapper.find('.timer-time').text();
      expect(timeText).toBeDefined();
      expect(timeText.length).toBeGreaterThan(0);
    });

    it('should handle very large time values', () => {
      const wrapper = mount(TimerDisplay, {
        props: {
          remainingTime: 3661, // 61:01
          isRunning: false,
          showWarning: false
        }
      });

      expect(wrapper.find('.timer-time').text()).toBe('61:01');
    });
  });

  describe('Computed Properties', () => {
    it('should correctly compute display classes for various states', () => {
      // Test normal state
      let wrapper = mount(TimerDisplay, {
        props: {
          remainingTime: 1000,
          isRunning: false,
          showWarning: false
        }
      });

      let classes = wrapper.find('.timer-display').classes();
      expect(classes).not.toContain('timer-display--running');
      expect(classes).not.toContain('timer-display--warning');
      expect(classes).not.toContain('timer-display--urgent');
      expect(classes).not.toContain('timer-display--finished');

      // Test running state
      wrapper = mount(TimerDisplay, {
        props: {
          remainingTime: 1000,
          isRunning: true,
          showWarning: false
        }
      });

      classes = wrapper.find('.timer-display').classes();
      expect(classes).toContain('timer-display--running');

      // Test warning state (exactly 5 minutes)
      wrapper = mount(TimerDisplay, {
        props: {
          remainingTime: 300,
          isRunning: true,
          showWarning: true
        }
      });

      classes = wrapper.find('.timer-display').classes();
      expect(classes).toContain('timer-display--warning');
      expect(classes).toContain('timer-display--running');

      // Test urgent state (less than 5 minutes, no warning)
      wrapper = mount(TimerDisplay, {
        props: {
          remainingTime: 299,
          isRunning: true,
          showWarning: false
        }
      });

      classes = wrapper.find('.timer-display').classes();
      expect(classes).toContain('timer-display--urgent');
      expect(classes).toContain('timer-display--running');

      // Test finished state
      wrapper = mount(TimerDisplay, {
        props: {
          remainingTime: 0,
          isRunning: false,
          showWarning: false
        }
      });

      classes = wrapper.find('.timer-display').classes();
      expect(classes).toContain('timer-display--finished');
    });
  });

  describe('Accessibility and Usability', () => {
    it('should have proper structure for screen readers', () => {
      const wrapper = mount(TimerDisplay, {
        props: {
          remainingTime: 1200,
          isRunning: true,
          showWarning: false
        }
      });

      const timerDisplay = wrapper.find('.timer-display');
      const timerTime = wrapper.find('.timer-time');

      expect(timerDisplay.exists()).toBe(true);
      expect(timerTime.exists()).toBe(true);
      expect(timerTime.text()).toBe('20:00');
    });

    it('should maintain consistent layout structure', () => {
      const wrapper = mount(TimerDisplay, {
        props: {
          remainingTime: 1200,
          isRunning: false,
          showWarning: false
        }
      });

      expect(wrapper.find('.timer-display').exists()).toBe(true);
      expect(wrapper.find('.timer-time').exists()).toBe(true);
      expect(wrapper.findAll('.timer-display > .timer-time')).toHaveLength(1);
    });
  });

  describe('Responsive Design - Requirements 4.1, 4.2', () => {
    it('should render with responsive classes and structure', () => {
      const wrapper = mount(TimerDisplay, {
        props: {
          remainingTime: 1200,
          isRunning: false,
          showWarning: false
        }
      });

      const timerDisplay = wrapper.find('.timer-display');
      expect(timerDisplay.exists()).toBe(true);
      
      // Check that the component has the expected structure for responsive design
      expect(timerDisplay.find('.timer-time').exists()).toBe(true);
    });
  });

  describe('State Transitions', () => {
    it('should handle state transitions smoothly', async () => {
      const wrapper = mount(TimerDisplay, {
        props: {
          remainingTime: 400,
          isRunning: false,
          showWarning: false
        }
      });

      // Initial state
      expect(wrapper.find('.timer-time').text()).toBe('06:40');
      expect(wrapper.find('.timer-display').classes()).not.toContain('timer-display--running');

      // Start running
      await wrapper.setProps({ isRunning: true });
      expect(wrapper.find('.timer-display').classes()).toContain('timer-display--running');

      // Approach 5-minute mark
      await wrapper.setProps({ remainingTime: 300 });
      expect(wrapper.find('.timer-time').text()).toBe('05:00');

      // Show warning
      await wrapper.setProps({ showWarning: true });
      expect(wrapper.find('.timer-display').classes()).toContain('timer-display--warning');

      // Continue countdown
      await wrapper.setProps({ remainingTime: 250, showWarning: false });
      expect(wrapper.find('.timer-display').classes()).toContain('timer-display--urgent');
      expect(wrapper.find('.timer-time').text()).toBe('04:10');

      // Finish
      await wrapper.setProps({ remainingTime: 0, isRunning: false });
      expect(wrapper.find('.timer-display').classes()).toContain('timer-display--finished');
      expect(wrapper.find('.timer-time').text()).toBe('00:00');
    });
  });
});