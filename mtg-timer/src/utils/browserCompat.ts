/**
 * Browser compatibility utilities for MTG Timer
 * Handles various browser-specific features and fallbacks
 */

// Browser detection utilities
export const getBrowserInfo = () => {
  if (typeof navigator === 'undefined') {
    return { name: 'unknown', version: 'unknown' };
  }

  const userAgent = navigator.userAgent;
  
  if (userAgent.includes('Chrome')) {
    return { name: 'chrome', version: userAgent.match(/Chrome\/(\d+)/)?.[1] || 'unknown' };
  } else if (userAgent.includes('Firefox')) {
    return { name: 'firefox', version: userAgent.match(/Firefox\/(\d+)/)?.[1] || 'unknown' };
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    return { name: 'safari', version: userAgent.match(/Version\/(\d+)/)?.[1] || 'unknown' };
  } else if (userAgent.includes('Edge')) {
    return { name: 'edge', version: userAgent.match(/Edge\/(\d+)/)?.[1] || 'unknown' };
  }
  
  return { name: 'unknown', version: 'unknown' };
};

// Performance.now() fallback for older browsers
export const getHighResTime = (): number => {
  if (typeof performance !== 'undefined' && performance.now) {
    return performance.now();
  }
  return Date.now();
};

// RequestAnimationFrame fallback
export const requestAnimFrame = (callback: FrameRequestCallback): number => {
  if (typeof requestAnimationFrame !== 'undefined') {
    return requestAnimationFrame(callback);
  } else if (typeof (window as any).webkitRequestAnimationFrame !== 'undefined') {
    return (window as any).webkitRequestAnimationFrame(callback);
  } else if (typeof (window as any).mozRequestAnimationFrame !== 'undefined') {
    return (window as any).mozRequestAnimationFrame(callback);
  } else {
    return setTimeout(callback, 16); // ~60fps fallback
  }
};

export const cancelAnimFrame = (id: number): void => {
  if (typeof cancelAnimationFrame !== 'undefined') {
    cancelAnimationFrame(id);
  } else if (typeof (window as any).webkitCancelAnimationFrame !== 'undefined') {
    (window as any).webkitCancelAnimationFrame(id);
  } else if (typeof (window as any).mozCancelAnimationFrame !== 'undefined') {
    (window as any).mozCancelAnimationFrame(id);
  } else {
    clearTimeout(id);
  }
};

// Wake Lock API support check (for preventing screen sleep)
export const checkWakeLockSupport = (): boolean => {
  return 'wakeLock' in navigator;
};

// Notification API support check
export const checkNotificationSupport = (): boolean => {
  return 'Notification' in window;
};

// Audio context support check (for sound notifications)
export const checkAudioSupport = (): boolean => {
  return typeof AudioContext !== 'undefined' || typeof (window as any).webkitAudioContext !== 'undefined';
};

// Feature support summary
export const getFeatureSupport = () => {
  return {
    wakeLock: checkWakeLockSupport(),
    notifications: checkNotificationSupport(),
    audio: checkAudioSupport(),
    performanceNow: typeof performance !== 'undefined' && !!performance.now,
    requestAnimationFrame: typeof requestAnimationFrame !== 'undefined',
    pageVisibility: typeof document !== 'undefined' && typeof document.hidden !== 'undefined'
  };
};

// Console warning for unsupported features
export const warnUnsupportedFeatures = () => {
  const support = getFeatureSupport();
  const browser = getBrowserInfo();
  
  console.info(`MTG Timer running on ${browser.name} ${browser.version}`);
  
  if (!support.pageVisibility) {
    console.warn('Page Visibility API not supported - timer may not work correctly when tab is inactive');
  }
  
  if (!support.performanceNow) {
    console.warn('Performance.now() not supported - using Date.now() fallback');
  }
  
  if (!support.wakeLock) {
    console.info('Wake Lock API not supported - screen may sleep during timer');
  }
};