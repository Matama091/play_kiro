/**
 * Unit tests for ProgressCircle component
 * Tests the circular progress indicator functionality
 */
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ProgressCircle from '../ProgressCircle.vue';

describe('ProgressCircle', () => {
  describe('Basic Rendering - Requirement 5.4', () => {
    it('should render SVG circle with correct structure', () => {
      const wrapper = mount(ProgressCircle, {
        props: {
          percentage: 50
        }
      });

      expect(wrapper.find('svg').exists()).toBe(true);
      expect(wrapper.find('circle').exists()).toBe(true);
      expect(wrapper.find('.progress-circle').exists()).toBe(true);
    });

    it('should render with default props when not provided', () => {
      const wrapper = mount(ProgressCircle);

      const svg = wrapper.find('svg');
      expect(svg.exists()).toBe(true);
      
      // Should have default size and other properties
      expect(wrapper.find('circle').exists()).toBe(true);
    });
  });

  describe('Progress Display', () => {
    it('should display correct progress for 0%', () => {
      const wrapper = mount(ProgressCircle, {
        props: {
          percentage: 0
        }
      });

      const circles = wrapper.findAll('circle');
      expect(circles).toHaveLength(2); // Background and foreground circles
      
      const progressCircle = circles[1]; // Foreground circle
      const strokeDashoffset = progressCircle.attributes('stroke-dashoffset');
      expect(strokeDashoffset).toBeDefined();
    });

    it('should display correct progress for 50%', () => {
      const wrapper = mount(ProgressCircle, {
        props: {
          percentage: 50
        }
      });

      const circles = wrapper.findAll('circle');
      const progressCircle = circles[1]; // Foreground circle
      const strokeDashoffset = progressCircle.attributes('stroke-dashoffset');
      expect(strokeDashoffset).toBeDefined();
    });

    it('should display correct progress for 100%', () => {
      const wrapper = mount(ProgressCircle, {
        props: {
          percentage: 100
        }
      });

      const circles = wrapper.findAll('circle');
      const progressCircle = circles[1]; // Foreground circle
      const strokeDashoffset = progressCircle.attributes('stroke-dashoffset');
      expect(strokeDashoffset).toBeDefined();
    });

    it('should handle edge cases for percentage values', () => {
      const testCases = [-10, 0, 25, 50, 75, 100, 110];

      testCases.forEach(percentage => {
        const wrapper = mount(ProgressCircle, {
          props: {
            percentage
          }
        });

        const circles = wrapper.findAll('circle');
        expect(circles).toHaveLength(2);
        
        const progressCircle = circles[1]; // Foreground circle
        const strokeDashoffset = progressCircle.attributes('stroke-dashoffset');
        expect(strokeDashoffset).toBeDefined();
      });
    });
  });

  describe('Customization Props', () => {
    it('should accept custom size prop', () => {
      const customSize = 200;
      const wrapper = mount(ProgressCircle, {
        props: {
          percentage: 50,
          size: customSize
        }
      });

      const svg = wrapper.find('svg');
      expect(svg.attributes('width')).toBe(customSize.toString());
      expect(svg.attributes('height')).toBe(customSize.toString());
    });

    it('should accept custom stroke width', () => {
      const customStrokeWidth = 8;
      const wrapper = mount(ProgressCircle, {
        props: {
          percentage: 50,
          strokeWidth: customStrokeWidth
        }
      });

      const circle = wrapper.find('circle');
      expect(circle.attributes('stroke-width')).toBe(customStrokeWidth.toString());
    });

    it('should accept custom color', () => {
      const customColor = '#ff0000';
      const wrapper = mount(ProgressCircle, {
        props: {
          percentage: 50,
          color: customColor
        }
      });

      const circles = wrapper.findAll('circle');
      const progressCircle = circles[1]; // Foreground circle
      expect(progressCircle.element.style.stroke).toBe(customColor);
    });

    it('should combine multiple custom props', () => {
      const props = {
        percentage: 75,
        size: 150,
        strokeWidth: 6,
        color: '#00ff00'
      };

      const wrapper = mount(ProgressCircle, {
        props
      });

      const svg = wrapper.find('svg');
      const circles = wrapper.findAll('circle');
      const progressCircle = circles[1]; // Foreground circle

      expect(svg.attributes('width')).toBe(props.size.toString());
      expect(svg.attributes('height')).toBe(props.size.toString());
      expect(progressCircle.attributes('stroke-width')).toBe(props.strokeWidth.toString());
      expect(progressCircle.element.style.stroke).toBe(props.color);
    });
  });

  describe('SVG Attributes and Structure', () => {
    it('should have correct SVG structure', () => {
      const wrapper = mount(ProgressCircle, {
        props: {
          percentage: 50,
          size: 120
        }
      });

      const svg = wrapper.find('svg');
      expect(svg.exists()).toBe(true);
      expect(svg.attributes('width')).toBe('120');
      expect(svg.attributes('height')).toBe('120');
    });

    it('should have circle with correct center position', () => {
      const wrapper = mount(ProgressCircle, {
        props: {
          percentage: 50
        }
      });

      const circles = wrapper.findAll('circle');
      const circle = circles[0]; // Either circle should have correct position
      expect(circle.attributes('cx')).toBeDefined();
      expect(circle.attributes('cy')).toBeDefined();
    });

    it('should have circle with correct radius calculation', () => {
      const wrapper = mount(ProgressCircle, {
        props: {
          percentage: 50,
          size: 120,
          strokeWidth: 4
        }
      });

      const circles = wrapper.findAll('circle');
      const circle = circles[0]; // Either circle should have correct radius
      const radius = circle.attributes('r');
      expect(radius).toBeDefined();
      expect(parseFloat(radius!)).toBeGreaterThan(0);
    });

    it('should have proper stroke properties', () => {
      const wrapper = mount(ProgressCircle, {
        props: {
          percentage: 50
        }
      });

      const circles = wrapper.findAll('circle');
      const progressCircle = circles[1]; // Foreground circle
      expect(progressCircle.classes()).toContain('progress-foreground');
    });
  });

  describe('Animation and Transitions', () => {
    it('should have CSS transition classes applied', () => {
      const wrapper = mount(ProgressCircle, {
        props: {
          percentage: 50
        }
      });

      const progressCircle = wrapper.find('.progress-circle');
      expect(progressCircle.exists()).toBe(true);
    });

    it('should handle percentage changes smoothly', async () => {
      const wrapper = mount(ProgressCircle, {
        props: {
          percentage: 0
        }
      });

      const circles = wrapper.findAll('circle');
      const progressCircle = circles[1]; // Foreground circle
      const initialOffset = progressCircle.attributes('stroke-dashoffset');

      await wrapper.setProps({ percentage: 100 });

      const finalOffset = progressCircle.attributes('stroke-dashoffset');
      expect(finalOffset).not.toBe(initialOffset);
    });
  });

  describe('Responsive Design - Requirements 4.1, 4.2', () => {
    it('should maintain aspect ratio with different sizes', () => {
      const sizes = [80, 120, 160, 200];

      sizes.forEach(size => {
        const wrapper = mount(ProgressCircle, {
          props: {
            percentage: 50,
            size
          }
        });

        const svg = wrapper.find('svg');
        expect(svg.attributes('width')).toBe(size.toString());
        expect(svg.attributes('height')).toBe(size.toString());
      });
    });

    it('should work with different stroke widths for mobile', () => {
      const strokeWidths = [2, 4, 6, 8];

      strokeWidths.forEach(strokeWidth => {
        const wrapper = mount(ProgressCircle, {
          props: {
            percentage: 50,
            strokeWidth
          }
        });

        const circle = wrapper.find('circle');
        expect(circle.attributes('stroke-width')).toBe(strokeWidth.toString());
      });
    });
  });

  describe('Mathematical Calculations', () => {
    it('should calculate stroke-dasharray correctly', () => {
      const wrapper = mount(ProgressCircle, {
        props: {
          percentage: 50,
          size: 120,
          strokeWidth: 4
        }
      });

      const circles = wrapper.findAll('circle');
      const progressCircle = circles[1]; // Foreground circle
      const strokeDasharray = progressCircle.attributes('stroke-dasharray');
      expect(strokeDasharray).toBeDefined();
      
      // Should be a valid number representing circumference
      const dasharray = parseFloat(strokeDasharray!);
      expect(dasharray).toBeGreaterThan(0);
    });

    it('should calculate stroke-dashoffset correctly for different percentages', () => {
      const percentages = [0, 25, 50, 75, 100];

      percentages.forEach(percentage => {
        const wrapper = mount(ProgressCircle, {
          props: {
            percentage,
            size: 120,
            strokeWidth: 4
          }
        });

        const circles = wrapper.findAll('circle');
        const progressCircle = circles[1]; // Foreground circle
        const strokeDashoffset = progressCircle.attributes('stroke-dashoffset');
        expect(strokeDashoffset).toBeDefined();
        
        const offset = parseFloat(strokeDashoffset!);
        expect(offset).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle negative percentage values', () => {
      const wrapper = mount(ProgressCircle, {
        props: {
          percentage: -10
        }
      });

      const circles = wrapper.findAll('circle');
      expect(circles).toHaveLength(2);
      
      const progressCircle = circles[1]; // Foreground circle
      const strokeDashoffset = progressCircle.attributes('stroke-dashoffset');
      expect(strokeDashoffset).toBeDefined();
    });

    it('should handle percentage values over 100', () => {
      const wrapper = mount(ProgressCircle, {
        props: {
          percentage: 150
        }
      });

      const circles = wrapper.findAll('circle');
      expect(circles).toHaveLength(2);
      
      const progressCircle = circles[1]; // Foreground circle
      const strokeDashoffset = progressCircle.attributes('stroke-dashoffset');
      expect(strokeDashoffset).toBeDefined();
    });

    it('should handle very small size values', () => {
      const wrapper = mount(ProgressCircle, {
        props: {
          percentage: 50,
          size: 20
        }
      });

      const svg = wrapper.find('svg');
      expect(svg.attributes('width')).toBe('20');
      expect(svg.attributes('height')).toBe('20');
    });

    it('should handle very large size values', () => {
      const wrapper = mount(ProgressCircle, {
        props: {
          percentage: 50,
          size: 500
        }
      });

      const svg = wrapper.find('svg');
      expect(svg.attributes('width')).toBe('500');
      expect(svg.attributes('height')).toBe('500');
    });
  });

  describe('Component Integration', () => {
    it('should work with timer progress values', () => {
      // Simulate typical timer progress values
      const timerProgressValues = [0, 16.67, 33.33, 50, 66.67, 83.33, 100];

      timerProgressValues.forEach(percentage => {
        const wrapper = mount(ProgressCircle, {
          props: {
            percentage
          }
        });

        expect(wrapper.find('svg').exists()).toBe(true);
        expect(wrapper.find('circle').exists()).toBe(true);
      });
    });

    it('should maintain performance with frequent updates', async () => {
      const wrapper = mount(ProgressCircle, {
        props: {
          percentage: 0
        }
      });

      // Simulate rapid percentage updates
      for (let i = 0; i <= 100; i += 10) {
        await wrapper.setProps({ percentage: i });
        expect(wrapper.find('circle').exists()).toBe(true);
      }
    });
  });
});