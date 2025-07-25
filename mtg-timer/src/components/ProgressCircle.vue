<template>
  <div class="progress-circle-container">
    <svg 
      :width="size" 
      :height="size" 
      class="progress-circle"
      :class="{ 'warning': isWarning, 'urgent': isUrgent }"
    >
      <!-- Background circle -->
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        class="progress-background"
        :stroke-width="strokeWidth"
      />
      
      <!-- Progress circle -->
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        class="progress-foreground"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="strokeDashoffset"
        :style="{ stroke: currentColor }"
      />
    </svg>
    
    <!-- Center content slot -->
    <div class="progress-center">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ProgressCircleProps } from '@/types/timer';

// Props with defaults
const props = withDefaults(defineProps<ProgressCircleProps>(), {
  size: 200,
  strokeWidth: 8,
  color: undefined
});

// Computed values for SVG circle
const center = computed(() => props.size / 2);
const radius = computed(() => (props.size - props.strokeWidth) / 2);
const circumference = computed(() => 2 * Math.PI * radius.value);

// Calculate stroke offset based on percentage (clockwise progress)
const strokeDashoffset = computed(() => {
  const progress = Math.max(0, Math.min(100, props.percentage));
  return circumference.value - (progress / 100) * circumference.value;
});

// Determine warning states based on percentage
const isWarning = computed(() => props.percentage >= 75); // 残り5分 (75% progress)
const isUrgent = computed(() => props.percentage >= 90);  // 残り2分 (90% progress)

// Dynamic color based on progress state
const currentColor = computed(() => {
  if (props.color) return props.color;
  if (isUrgent.value) return 'var(--color-urgent)';
  if (isWarning.value) return 'var(--color-warning)';
  return 'var(--color-primary)';
});
</script>

<style scoped>
.progress-circle-container {
  position: relative;
  display: inline-block;
}

.progress-circle {
  transform: rotate(-90deg); /* Start from top */
  transition: all 0.3s ease;
}

.progress-background {
  fill: none;
  stroke: #e0e0e0;
  opacity: 0.3;
}

.progress-foreground {
  fill: none;
  stroke-linecap: round;
  transition: stroke-dashoffset 1s ease-in-out, stroke 0.3s ease;
}

.progress-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

/* Warning state animations */
.progress-circle.warning .progress-foreground {
  animation: pulse-warning 2s ease-in-out infinite;
}

.progress-circle.urgent .progress-foreground {
  animation: pulse-urgent 1s ease-in-out infinite;
}

@keyframes pulse-warning {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes pulse-urgent {
  0%, 100% {
    opacity: 1;
    stroke-width: 8;
  }
  50% {
    opacity: 0.8;
    stroke-width: 10;
  }
}

/* Mobile-first responsive sizing - Requirements 4.1, 4.4 */

/* Base mobile styles - no scaling needed, use appropriate size props */
.progress-circle-container {
  display: inline-block;
  width: 100%;
  max-width: 280px;
  aspect-ratio: 1;
}

.progress-circle {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
}

/* Small mobile (375px+) */
@media (min-width: 375px) {
  .progress-circle-container {
    max-width: 300px;
  }
}

/* Large mobile (480px+) */
@media (min-width: 480px) {
  .progress-circle-container {
    max-width: 320px;
  }
}

/* Tablet (640px+) */
@media (min-width: 640px) {
  .progress-circle-container {
    max-width: 360px;
  }
}

/* Large tablet / Desktop (768px+) */
@media (min-width: 768px) {
  .progress-circle-container {
    max-width: 400px;
  }
}

/* Screen rotation and size adaptations - Requirements 4.3, 4.4 */

/* Landscape orientation for tablets and larger screens */
@media (orientation: landscape) and (min-width: 768px) {
  .progress-circle-container {
    max-width: 400px;
  }
}

/* Landscape orientation for mobile devices */
@media (orientation: landscape) and (max-height: 600px) and (max-width: 767px) {
  .progress-circle-container {
    max-width: 220px;
  }
}

/* Very short landscape screens */
@media (orientation: landscape) and (max-height: 500px) {
  .progress-circle-container {
    max-width: 180px;
  }
}

/* Ultra-wide screens */
@media (min-aspect-ratio: 2/1) {
  .progress-circle-container {
    max-width: 300px;
  }
}

/* Very tall screens (portrait tablets) */
@media (orientation: portrait) and (min-height: 1000px) {
  .progress-circle-container {
    max-width: 450px;
  }
}

/* Ensure proper scaling on very small screens */
@media (max-width: 320px) {
  .progress-circle-container {
    max-width: 220px;
  }
}

/* Large desktop screens */
@media (min-width: 1440px) {
  .progress-circle-container {
    max-width: 500px;
  }
}

/* 4K and ultra-high resolution screens */
@media (min-width: 2560px) {
  .progress-circle-container {
    max-width: 600px;
  }
}

/* Foldable devices and dual-screen layouts */
@media (min-width: 1024px) and (max-width: 1366px) and (orientation: landscape) {
  .progress-circle-container {
    max-width: 280px;
  }
}

/* Responsive stroke width based on screen size */
@media (max-width: 480px) {
  .progress-foreground,
  .progress-background {
    stroke-width: 6;
  }
}

@media (min-width: 1024px) {
  .progress-foreground,
  .progress-background {
    stroke-width: 10;
  }
}

@media (min-width: 1440px) {
  .progress-foreground,
  .progress-background {
    stroke-width: 12;
  }
}
</style>