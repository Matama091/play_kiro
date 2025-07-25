<script setup lang="ts">
/**
 * WarningMessage Component
 * Displays 5-minute warning message with consideration items
 * Requirements: 2.1, 2.2, 2.3
 */
import type { WarningMessageProps } from '@/types/timer';

interface Props {
  show: boolean;
  message: string;
  considerationItems?: string[];
  type?: 'info' | 'warning' | 'error';
}

const props = withDefaults(defineProps<Props>(), {
  considerationItems: () => [],
  type: 'warning'
});

const emit = defineEmits<{
  close: [];
}>();

const handleClose = () => {
  emit('close');
};
</script>

<template>
  <Transition name="warning-fade">
    <div v-if="show" class="warning-overlay">
      <div class="warning-container" :class="`warning-${type}`">
        <!-- Warning Icon -->
        <div class="warning-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L1 21H23L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            <path d="M12 9V13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M12 17H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>

        <!-- Warning Message -->
        <div class="warning-content">
          <h2 class="warning-title">{{ message }}</h2>
          
          <!-- Consideration Items -->
          <div v-if="considerationItems.length > 0" class="consideration-section">
            <h3 class="consideration-title">検討内容：</h3>
            <ul class="consideration-list">
              <li 
                v-for="(item, index) in considerationItems" 
                :key="index"
                class="consideration-item"
              >
                {{ item }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Close Button -->
        <button 
          class="warning-close-btn"
          @click="handleClose"
          aria-label="警告を閉じる"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Warning Overlay - Full screen overlay for prominence */
.warning-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

/* Warning Container - Main warning box */
.warning-container {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  text-align: center;
  animation: warning-pulse 2s infinite;
}

/* Warning type variations */
.warning-warning {
  border: 4px solid #FF9800;
  background: linear-gradient(135deg, #FFF3E0 0%, #FFFFFF 100%);
}

.warning-error {
  border: 4px solid #F44336;
  background: linear-gradient(135deg, #FFEBEE 0%, #FFFFFF 100%);
}

.warning-info {
  border: 4px solid #2196F3;
  background: linear-gradient(135deg, #E3F2FD 0%, #FFFFFF 100%);
}

/* Warning Icon */
.warning-icon {
  margin-bottom: 1.5rem;
  color: #FF9800;
}

.warning-error .warning-icon {
  color: #F44336;
}

.warning-info .warning-icon {
  color: #2196F3;
}

/* Warning Content */
.warning-content {
  margin-bottom: 1.5rem;
}

.warning-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin: 0 0 1.5rem 0;
  line-height: 1.4;
}

/* Consideration Section */
.consideration-section {
  background: rgba(255, 152, 0, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1.5rem;
  text-align: left;
}

.consideration-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: #E65100;
  margin: 0 0 1rem 0;
}

.consideration-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.consideration-item {
  background: white;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  border-left: 4px solid #FF9800;
  font-weight: 500;
  color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.consideration-item:last-child {
  margin-bottom: 0;
}

/* Close Button */
.warning-close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.warning-close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #333;
}

.warning-close-btn:focus {
  outline: 2px solid #FF9800;
  outline-offset: 2px;
}

/* Animations */
@keyframes warning-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

/* Transition animations */
.warning-fade-enter-active,
.warning-fade-leave-active {
  transition: all 0.3s ease;
}

.warning-fade-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.warning-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Mobile-first responsive design - Requirements 4.1, 4.2 */

/* Base mobile styles (320px+) */
.warning-overlay {
  padding: var(--spacing-sm);
}

.warning-container {
  padding: var(--spacing-lg);
  margin: var(--spacing-xs);
  max-width: 90vw;
  width: 100%;
}

.warning-title {
  font-size: var(--font-size-xl);
  line-height: 1.3;
}

.consideration-section {
  padding: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.consideration-title {
  font-size: var(--font-size-base);
  margin-bottom: var(--spacing-sm);
}

.consideration-item {
  padding: var(--spacing-sm) var(--spacing-md);
  margin-bottom: var(--spacing-xs);
  font-size: var(--font-size-sm);
  line-height: 1.4;
}

.warning-close-btn {
  padding: var(--spacing-sm);
  min-width: var(--touch-target-min);
  min-height: var(--touch-target-min);
  top: var(--spacing-sm);
  right: var(--spacing-sm);
}

/* Small mobile (375px+) */
@media (min-width: 375px) {
  .warning-container {
    padding: var(--spacing-xl);
    max-width: 350px;
  }
  
  .warning-title {
    font-size: var(--font-size-2xl);
  }
  
  .consideration-item {
    font-size: var(--font-size-base);
  }
}

/* Large mobile (480px+) */
@media (min-width: 480px) {
  .warning-overlay {
    padding: var(--spacing-md);
  }
  
  .warning-container {
    max-width: 400px;
  }
  
  .consideration-section {
    padding: var(--spacing-lg);
  }
}

/* Tablet (640px+) */
@media (min-width: 640px) {
  .warning-container {
    max-width: 500px;
    padding: var(--spacing-xxl);
  }
  
  .warning-title {
    font-size: var(--font-size-3xl);
  }
  
  .consideration-title {
    font-size: var(--font-size-lg);
  }
  
  .warning-close-btn {
    top: var(--spacing-md);
    right: var(--spacing-md);
  }
}

/* Very small screens adjustments */
@media (max-width: 360px) {
  .warning-container {
    padding: var(--spacing-md);
    margin: var(--spacing-xs);
  }
  
  .warning-title {
    font-size: var(--font-size-lg);
  }
  
  .consideration-section {
    padding: var(--spacing-sm);
  }
  
  .consideration-item {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-xs);
  }
}

/* Screen rotation and size adaptations - Requirements 4.3, 4.4 */

/* Landscape orientation for tablets and larger screens */
@media (orientation: landscape) and (min-width: 768px) {
  .warning-container {
    max-width: 700px;
    max-height: 80vh;
    overflow-y: auto;
    padding: var(--spacing-xxl);
    display: flex;
    flex-direction: column;
  }
  
  .warning-content {
    flex: 1;
  }
}

/* Landscape orientation for mobile devices */
@media (orientation: landscape) and (max-height: 600px) and (max-width: 767px) {
  .warning-container {
    max-width: 90vw;
    max-height: 85vh;
    overflow-y: auto;
    padding: var(--spacing-md);
  }
  
  .warning-title {
    font-size: var(--font-size-lg);
    margin-bottom: var(--spacing-sm);
  }
  
  .consideration-section {
    padding: var(--spacing-sm);
    margin-top: var(--spacing-sm);
  }
  
  .consideration-item {
    padding: var(--spacing-xs) var(--spacing-sm);
    margin-bottom: var(--spacing-xs);
  }
}

/* Very short landscape screens */
@media (orientation: landscape) and (max-height: 500px) {
  .warning-container {
    max-height: 95vh;
    padding: var(--spacing-sm);
    max-width: 95vw;
  }
  
  .warning-title {
    font-size: var(--font-size-base);
    margin-bottom: var(--spacing-xs);
  }
  
  .warning-icon {
    margin-bottom: var(--spacing-sm);
  }
  
  .warning-icon svg {
    width: 32px;
    height: 32px;
  }
  
  .consideration-section {
    padding: var(--spacing-xs);
    margin-top: var(--spacing-xs);
  }
  
  .consideration-item {
    padding: var(--spacing-xs);
    font-size: var(--font-size-xs);
  }
}

/* Ultra-wide screens */
@media (min-aspect-ratio: 2/1) {
  .warning-container {
    max-width: 800px;
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: var(--spacing-xl);
    align-items: start;
  }
  
  .warning-icon {
    grid-column: 1;
    margin-bottom: 0;
  }
  
  .warning-content {
    grid-column: 2;
  }
  
  .warning-close-btn {
    grid-column: 1 / -1;
    justify-self: end;
  }
}

/* Very tall screens (portrait tablets) */
@media (orientation: portrait) and (min-height: 1000px) {
  .warning-container {
    max-width: 600px;
    padding: var(--spacing-xxl);
  }
  
  .warning-title {
    font-size: var(--font-size-4xl);
    margin-bottom: var(--spacing-xl);
  }
  
  .warning-icon {
    margin-bottom: var(--spacing-xl);
  }
  
  .warning-icon svg {
    width: 64px;
    height: 64px;
  }
  
  .consideration-section {
    padding: var(--spacing-xl);
    margin-top: var(--spacing-xl);
  }
  
  .consideration-title {
    font-size: var(--font-size-xl);
  }
  
  .consideration-item {
    padding: var(--spacing-md) var(--spacing-lg);
    font-size: var(--font-size-lg);
    margin-bottom: var(--spacing-md);
  }
}

/* Large desktop screens */
@media (min-width: 1440px) {
  .warning-container {
    max-width: 800px;
  }
  
  .warning-title {
    font-size: var(--font-size-3xl);
  }
}

/* 4K and ultra-high resolution screens */
@media (min-width: 2560px) {
  .warning-container {
    max-width: 1000px;
    padding: 4rem;
  }
  
  .warning-title {
    font-size: 4rem;
  }
  
  .warning-icon svg {
    width: 80px;
    height: 80px;
  }
  
  .consideration-item {
    font-size: var(--font-size-xl);
    padding: var(--spacing-lg) var(--spacing-xl);
  }
}

/* Foldable devices and dual-screen layouts */
@media (min-width: 1024px) and (max-width: 1366px) and (orientation: landscape) {
  .warning-container {
    max-width: 600px;
    max-height: 70vh;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .warning-container {
    border-width: 3px;
  }
  
  .consideration-item {
    border-left-width: 6px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .warning-container {
    animation: none;
  }
  
  .warning-fade-enter-active,
  .warning-fade-leave-active {
    transition: opacity 0.2s ease;
  }
}
</style>