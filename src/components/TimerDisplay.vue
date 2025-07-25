<template>
  <div class="timer-display" :class="displayClasses">
    <div class="timer-time">
      {{ formattedTime }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { TimerDisplayProps } from '../types/timer';

// Props definition based on design document
const props = withDefaults(defineProps<TimerDisplayProps>(), {
  remainingTime: 1200,
  isRunning: false,
  showWarning: false
});

// Format time in MM:SS format - Requirement 1.3, 5.1
const formattedTime = computed(() => {
  const minutes = Math.floor(props.remainingTime / 60);
  const seconds = props.remainingTime % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

// Dynamic classes for visual feedback - Requirements 2.3, 5.2, 5.3
const displayClasses = computed(() => {
  const isUrgent = props.remainingTime <= 300 && props.remainingTime > 0;
  const isFinished = props.remainingTime === 0;
  
  return {
    'timer-display--running': props.isRunning,
    'timer-display--warning': props.showWarning && isUrgent,
    'timer-display--urgent': isUrgent && !props.showWarning,
    'timer-display--finished': isFinished
  };
});
</script>

<style scoped>
.timer-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.timer-time {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  font-size: 4rem;
  font-weight: 600;
  line-height: 1;
  color: var(--color-primary);
  text-align: center;
  letter-spacing: 0.05em;
  
  /* Ensure large, readable display - Requirements 1.3, 5.1 */
  min-width: 280px;
}

/* Visual feedback based on remaining time - Requirements 2.3, 5.2, 5.3 */
.timer-display--running .timer-time {
  color: var(--color-primary);
}

/* Warning state - 5 minute warning */
.timer-display--warning {
  background: linear-gradient(135deg, #fff3e0 0%, #ffffff 100%);
  border: 2px solid var(--color-warning);
  box-shadow: 0 4px 20px rgba(255, 152, 0, 0.2);
  animation: warningPulse 2s ease-in-out infinite;
}

.timer-display--warning .timer-time {
  color: var(--color-warning);
  text-shadow: 0 2px 4px rgba(255, 152, 0, 0.3);
}

/* Urgent state - remaining time <= 5 minutes */
.timer-display--urgent {
  background: linear-gradient(135deg, #ffebee 0%, #ffffff 100%);
  border: 2px solid var(--color-urgent);
  box-shadow: 0 4px 20px rgba(244, 67, 54, 0.2);
}

.timer-display--urgent .timer-time {
  color: var(--color-urgent);
  text-shadow: 0 2px 4px rgba(244, 67, 54, 0.3);
}

/* Finished state - time is up */
.timer-display--finished {
  background: linear-gradient(135deg, #ffebee 0%, #ffffff 100%);
  border: 2px solid var(--color-urgent);
  box-shadow: 0 4px 20px rgba(244, 67, 54, 0.3);
  animation: finishedBlink 1s ease-in-out infinite;
}

.timer-display--finished .timer-time {
  color: var(--color-urgent);
  text-shadow: 0 2px 4px rgba(244, 67, 54, 0.4);
}

/* Animations for special visual feedback */
@keyframes warningPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 4px 20px rgba(255, 152, 0, 0.2);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 6px 25px rgba(255, 152, 0, 0.3);
  }
}

@keyframes finishedBlink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Mobile-first responsive design - Requirements 4.1, 4.2 */

/* Base mobile styles (320px+) */
.timer-display {
  padding: var(--spacing-md);
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  width: 100%;
  max-width: 280px;
}

.timer-time {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  font-size: var(--font-size-4xl);
  font-weight: 600;
  line-height: 1;
  color: var(--color-primary);
  text-align: center;
  letter-spacing: 0.05em;
  min-width: 140px;
  
  /* Ensure readability on mobile - Requirements 4.1, 5.1 */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Small mobile (375px+) */
@media (min-width: 375px) {
  .timer-display {
    max-width: 300px;
    padding: var(--spacing-lg);
  }
  
  .timer-time {
    font-size: var(--font-size-5xl);
    min-width: 160px;
  }
}

/* Large mobile (480px+) */
@media (min-width: 480px) {
  .timer-display {
    max-width: 320px;
  }
  
  .timer-time {
    min-width: 180px;
  }
}

/* Tablet (640px+) */
@media (min-width: 640px) {
  .timer-display {
    padding: var(--spacing-xl);
    max-width: 360px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .timer-time {
    min-width: 200px;
  }
}

/* Large tablet / Desktop (768px+) */
@media (min-width: 768px) {
  .timer-display {
    max-width: 400px;
  }
  
  .timer-time {
    min-width: 240px;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .timer-time {
    min-width: 280px;
  }
}

/* Screen rotation and orientation handling - Requirements 4.3, 4.4 */

/* Landscape orientation for tablets and larger screens */
@media (orientation: landscape) and (min-width: 768px) {
  .timer-display {
    max-width: 400px;
    padding: var(--spacing-xl);
  }
  
  .timer-time {
    min-width: 240px;
  }
}

/* Landscape orientation for mobile devices */
@media (orientation: landscape) and (max-height: 600px) and (max-width: 767px) {
  .timer-display {
    padding: var(--spacing-md);
    max-width: 260px;
  }
  
  .timer-time {
    font-size: var(--font-size-3xl);
    min-width: 140px;
  }
}

/* Very short landscape screens */
@media (orientation: landscape) and (max-height: 500px) {
  .timer-display {
    padding: var(--spacing-sm);
    max-width: 220px;
  }
  
  .timer-time {
    font-size: var(--font-size-2xl);
    min-width: 120px;
  }
}

/* Ultra-wide screens */
@media (min-aspect-ratio: 2/1) {
  .timer-display {
    max-width: 350px;
  }
}

/* Very tall screens (portrait tablets) */
@media (orientation: portrait) and (min-height: 1000px) {
  .timer-display {
    max-width: 450px;
    padding: var(--spacing-xxl);
  }
  
  .timer-time {
    min-width: 300px;
  }
}

/* Foldable devices and dual-screen layouts */
@media (min-width: 1024px) and (max-width: 1366px) and (orientation: landscape) {
  .timer-display {
    max-width: 320px;
  }
}

/* Large desktop screens */
@media (min-width: 1440px) {
  .timer-display {
    max-width: 500px;
  }
  
  .timer-time {
    min-width: 320px;
  }
}

/* 4K and ultra-high resolution screens */
@media (min-width: 2560px) {
  .timer-time {
    font-size: 6rem;
    min-width: 400px;
  }
}
</style>