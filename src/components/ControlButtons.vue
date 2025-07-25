<template>
  <div class="control-buttons-container">
    <div class="control-buttons">
      <button
        v-if="!isRunning && !isPaused"
        @click="$emit('start')"
        :disabled="disabled"
        class="btn btn-primary btn-start"
        type="button"
      >
        開始
      </button>
      
      <button
        v-if="isRunning"
        @click="$emit('pause')"
        :disabled="disabled"
        class="btn btn-warning btn-pause"
        type="button"
      >
        一時停止
      </button>
      
      <button
        v-if="isPaused"
        @click="$emit('start')"
        :disabled="disabled"
        class="btn btn-primary btn-resume"
        type="button"
      >
        再開
      </button>
      
      <button
        v-if="isRunning || isPaused"
        @click="handleReset"
        :disabled="disabled"
        class="btn btn-secondary btn-reset"
        type="button"
      >
        リセット
      </button>
    </div>

    <!-- Reset confirmation dialog -->
    <div v-if="showResetConfirmation" class="confirmation-overlay" @click="cancelReset">
      <div class="confirmation-dialog" @click.stop>
        <h3 class="confirmation-title">タイマーをリセットしますか？</h3>
        <p class="confirmation-message">
          現在の進行状況が失われ、タイマーが20:00に戻ります。
        </p>
        <div class="confirmation-buttons">
          <button
            @click="cancelReset"
            class="btn btn-secondary btn-cancel"
            type="button"
          >
            キャンセル
          </button>
          <button
            @click="confirmReset"
            class="btn btn-urgent btn-confirm"
            type="button"
          >
            リセット
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ControlButtonsProps } from '../types/timer';

// Props definition
interface Props extends ControlButtonsProps {}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
});

// Emits definition
const emit = defineEmits<{
  start: [];
  pause: [];
  reset: [];
}>();

// Reset confirmation state
const showResetConfirmation = ref(false);

// Handle reset button click - show confirmation dialog
const handleReset = () => {
  showResetConfirmation.value = true;
};

// Confirm reset - emit reset event and close dialog
const confirmReset = () => {
  showResetConfirmation.value = false;
  emit('reset');
};

// Cancel reset - close dialog without resetting
const cancelReset = () => {
  showResetConfirmation.value = false;
};
</script>

<style scoped>
.control-buttons-container {
  position: relative;
}

.control-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  margin: 2rem 0;
  flex-wrap: wrap;
}

.btn {
  /* Mobile-first touch-friendly sizing - Requirements 4.1, 4.2 */
  padding: var(--spacing-md) var(--spacing-lg);
  border: none;
  border-radius: 8px;
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
  min-height: var(--touch-target-min); /* iOS/Android minimum touch target */
  
  /* Enhanced touch interaction */
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  
  /* Accessibility */
  outline: none;
  position: relative;
  
  /* Better text rendering on mobile */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.btn:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn:not(:disabled):active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Button variants */
.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.btn-primary:not(:disabled):hover {
  background-color: #1976d2;
}

.btn-warning {
  background-color: var(--color-warning);
  color: white;
}

.btn-warning:not(:disabled):hover {
  background-color: #f57c00;
}

.btn-secondary {
  background-color: #757575;
  color: white;
}

.btn-secondary:not(:disabled):hover {
  background-color: #616161;
}

/* Mobile-first responsive design - Requirements 4.1, 4.2 */

/* Base mobile styles (320px+) */
.control-buttons {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: center;
  align-items: center;
  margin: var(--spacing-lg) 0;
  flex-wrap: wrap;
  width: 100%;
  max-width: 300px;
}

.btn {
  /* Enhanced mobile touch targets - Requirements 4.2 */
  min-height: 48px;
  min-width: 100px;
  font-size: var(--font-size-sm);
  padding: var(--spacing-sm) var(--spacing-md);
}

/* Small mobile (375px+) */
@media (min-width: 375px) {
  .control-buttons {
    gap: var(--spacing-md);
    max-width: 320px;
  }
  
  .btn {
    min-width: 110px;
    min-height: 50px;
    font-size: var(--font-size-base);
    padding: var(--spacing-md) var(--spacing-lg);
  }
}

/* Large mobile (480px+) */
@media (min-width: 480px) {
  .control-buttons {
    max-width: 400px;
  }
  
  .btn {
    min-width: 120px;
    min-height: 52px;
  }
}

/* Tablet (640px+) */
@media (min-width: 640px) {
  .control-buttons {
    gap: var(--spacing-lg);
    margin: var(--spacing-xl) 0;
    max-width: 500px;
  }
  
  .btn {
    min-width: 130px;
    min-height: 54px;
    font-size: var(--font-size-lg);
  }
}

/* Large tablet / Desktop (768px+) */
@media (min-width: 768px) {
  .btn {
    min-width: 140px;
    min-height: 56px;
    padding: var(--spacing-lg) var(--spacing-xl);
  }
}

/* Very small screens - stack buttons vertically */
@media (max-width: 360px) {
  .control-buttons {
    flex-direction: column;
    gap: var(--spacing-sm);
    max-width: 200px;
  }
  
  .btn {
    width: 100%;
    min-height: 52px;
  }
}

/* Screen rotation and size adaptations - Requirements 4.3, 4.4 */

/* Landscape orientation for tablets and larger screens */
@media (orientation: landscape) and (min-width: 768px) {
  .control-buttons {
    flex-direction: column;
    gap: var(--spacing-md);
    margin: 0 var(--spacing-lg);
    max-width: 200px;
  }
  
  .btn {
    width: 100%;
    min-width: 150px;
  }
}

/* Landscape orientation for mobile devices */
@media (orientation: landscape) and (max-height: 600px) and (max-width: 767px) {
  .control-buttons {
    margin: var(--spacing-sm) 0;
    gap: var(--spacing-xs);
    flex-wrap: nowrap;
  }
  
  .btn {
    min-height: 40px;
    min-width: 80px;
    font-size: var(--font-size-xs);
    padding: var(--spacing-xs) var(--spacing-sm);
  }
}

/* Very short landscape screens */
@media (orientation: landscape) and (max-height: 500px) {
  .control-buttons {
    margin: var(--spacing-xs) 0;
    gap: var(--spacing-xs);
  }
  
  .btn {
    min-height: 36px;
    min-width: 70px;
    font-size: var(--font-size-xs);
    padding: var(--spacing-xs);
  }
}

/* Ultra-wide screens */
@media (min-aspect-ratio: 2/1) {
  .control-buttons {
    flex-direction: column;
    gap: var(--spacing-lg);
    margin: 0 var(--spacing-xl);
  }
  
  .btn {
    min-width: 160px;
  }
}

/* Very tall screens (portrait tablets) */
@media (orientation: portrait) and (min-height: 1000px) {
  .control-buttons {
    gap: var(--spacing-xl);
    margin: var(--spacing-xxl) 0;
  }
  
  .btn {
    min-height: 60px;
    min-width: 160px;
    font-size: var(--font-size-xl);
    padding: var(--spacing-lg) var(--spacing-xxl);
  }
}

/* Large desktop screens */
@media (min-width: 1440px) {
  .btn {
    min-width: 180px;
    min-height: 64px;
    font-size: var(--font-size-xl);
  }
}

/* 4K and ultra-high resolution screens */
@media (min-width: 2560px) {
  .btn {
    min-width: 240px;
    min-height: 80px;
    font-size: 2rem;
    padding: var(--spacing-xl) var(--spacing-xxl);
  }
}

/* Foldable devices and dual-screen layouts */
@media (min-width: 1024px) and (max-width: 1366px) and (orientation: landscape) {
  .control-buttons {
    gap: var(--spacing-md);
  }
  
  .btn {
    min-width: 120px;
  }
}

/* Reset confirmation dialog styles */
.confirmation-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.confirmation-dialog {
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: dialogSlideIn 0.2s ease-out;
}

@keyframes dialogSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.confirmation-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.75rem;
  text-align: center;
}

.confirmation-message {
  color: var(--color-text-light);
  line-height: 1.5;
  margin-bottom: 2rem;
  text-align: center;
}

.confirmation-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-urgent {
  background-color: var(--color-urgent);
  color: white;
}

.btn-urgent:not(:disabled):hover {
  background-color: #d32f2f;
}

.btn-cancel {
  background-color: #e0e0e0;
  color: var(--color-text);
}

.btn-cancel:not(:disabled):hover {
  background-color: #d5d5d5;
}

/* Mobile-first responsive confirmation dialog - Requirements 4.1, 4.2 */

/* Base mobile styles */
.confirmation-overlay {
  padding: var(--spacing-md);
}

.confirmation-dialog {
  padding: var(--spacing-lg);
  margin: var(--spacing-sm);
  max-width: 90vw;
}

.confirmation-buttons {
  gap: var(--spacing-sm);
}

.confirmation-buttons .btn {
  min-height: 48px;
  min-width: 100px;
  flex: 1;
}

/* Small mobile (375px+) */
@media (min-width: 375px) {
  .confirmation-dialog {
    padding: var(--spacing-xl);
    max-width: 350px;
  }
  
  .confirmation-buttons {
    gap: var(--spacing-md);
  }
}

/* Large mobile (480px+) */
@media (min-width: 480px) {
  .confirmation-dialog {
    max-width: 400px;
  }
}

/* Very small screens - stack confirmation buttons */
@media (max-width: 360px) {
  .confirmation-buttons {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .confirmation-buttons .btn {
    width: 100%;
    min-height: 52px;
  }
}

/* Screen rotation and size adaptations for confirmation dialog */

/* Landscape orientation for tablets and larger screens */
@media (orientation: landscape) and (min-width: 768px) {
  .confirmation-dialog {
    max-width: 500px;
    padding: var(--spacing-xxl);
  }
}

/* Landscape orientation for mobile devices */
@media (orientation: landscape) and (max-height: 600px) and (max-width: 767px) {
  .confirmation-dialog {
    padding: var(--spacing-md);
    max-width: 400px;
    max-height: 80vh;
    overflow-y: auto;
  }
  
  .confirmation-buttons .btn {
    min-height: 40px;
    font-size: var(--font-size-sm);
  }
}

/* Very short landscape screens */
@media (orientation: landscape) and (max-height: 500px) {
  .confirmation-dialog {
    max-width: 350px;
    max-height: 90vh;
    padding: var(--spacing-sm);
  }
  
  .confirmation-title {
    font-size: var(--font-size-base);
    margin-bottom: var(--spacing-sm);
  }
  
  .confirmation-message {
    font-size: var(--font-size-sm);
    margin-bottom: var(--spacing-md);
  }
  
  .confirmation-buttons .btn {
    min-height: 36px;
    font-size: var(--font-size-xs);
  }
}

/* Ultra-wide screens */
@media (min-aspect-ratio: 2/1) {
  .confirmation-dialog {
    max-width: 600px;
  }
}

/* Very tall screens */
@media (orientation: portrait) and (min-height: 1000px) {
  .confirmation-dialog {
    max-width: 500px;
    padding: var(--spacing-xxl);
  }
  
  .confirmation-buttons .btn {
    min-height: 56px;
    font-size: var(--font-size-lg);
  }
}
</style>