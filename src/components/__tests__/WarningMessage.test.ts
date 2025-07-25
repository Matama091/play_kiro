/**
 * Unit tests for WarningMessage component
 * Tests the 5-minute warning functionality
 */
import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import WarningMessage from '../WarningMessage.vue';

describe('WarningMessage', () => {
  it('renders warning message when show is true', () => {
    const wrapper = mount(WarningMessage, {
      props: {
        show: true,
        message: '家づくりを前向きに進めるか検討する時間です',
        considerationItems: ['次回も商談を行うかどうか', 'その日にちはいつにするか']
      }
    });

    expect(wrapper.find('.warning-title').text()).toBe('家づくりを前向きに進めるか検討する時間です');
    expect(wrapper.find('.consideration-section').exists()).toBe(true);
    expect(wrapper.findAll('.consideration-item')).toHaveLength(2);
  });

  it('does not render when show is false', () => {
    const wrapper = mount(WarningMessage, {
      props: {
        show: false,
        message: 'Test message'
      }
    });

    expect(wrapper.find('.warning-overlay').exists()).toBe(false);
  });

  it('emits close event when close button is clicked', async () => {
    const wrapper = mount(WarningMessage, {
      props: {
        show: true,
        message: 'Test message'
      }
    });

    await wrapper.find('.warning-close-btn').trigger('click');
    expect(wrapper.emitted('close')).toHaveLength(1);
  });

  it('applies correct CSS class based on type prop', () => {
    const wrapper = mount(WarningMessage, {
      props: {
        show: true,
        message: 'Test message',
        type: 'error'
      }
    });

    expect(wrapper.find('.warning-container').classes()).toContain('warning-error');
  });

  it('renders consideration items correctly', () => {
    const considerationItems = ['Item 1', 'Item 2', 'Item 3'];
    const wrapper = mount(WarningMessage, {
      props: {
        show: true,
        message: 'Test message',
        considerationItems
      }
    });

    const items = wrapper.findAll('.consideration-item');
    expect(items).toHaveLength(3);
    expect(items[0].text()).toBe('Item 1');
    expect(items[1].text()).toBe('Item 2');
    expect(items[2].text()).toBe('Item 3');
  });
});