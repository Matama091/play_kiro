<script setup lang="ts">
/**
 * Main App Component - MTG Time Manager
 * Integrates all components and composables for 20-minute meeting timer
 * Requirements: 1.1, 1.2, 1.3, 1.4
 */
import { watch, ref } from 'vue';
import TimerDisplay from './components/TimerDisplay.vue';
import ControlButtons from './components/ControlButtons.vue';
import ProgressCircle from './components/ProgressCircle.vue';
import WarningMessage from './components/WarningMessage.vue';
import { useTimer } from './composables/useTimer';
import { useNotification } from './composables/useNotification';

// デバッグモード状態管理
const isDebugMode = ref(false);

// Initialize composables - Requirements 1.1, 1.2
const timer = useTimer(1200, isDebugMode); // 20分（1200秒）、デバッグモードrefを渡す
const notification = useNotification();

// Watch for 5-minute warning trigger - Requirements 2.1, 2.2, 2.3
watch(
  () => timer.shouldShowFiveMinuteWarning(),
  (shouldShow) => {
    if (shouldShow && !notification.state.value.showFiveMinuteWarning) {
      notification.triggerFiveMinuteWarning();
    }
  }
);

// Timer control handlers - Requirements 1.2, 1.4, 3.1, 3.2
const handleStart = () => {
  timer.start();
};

const handlePause = () => {
  timer.pause();
};

const handleReset = () => {
  timer.reset();
  notification.hideWarning(); // Clear warning on reset
};

// Warning message handlers
const handleWarningClose = () => {
  notification.hideWarning();
};

// デバッグモード切り替え
const toggleDebugMode = () => {
  isDebugMode.value = !isDebugMode.value;
  // タイマーをリセットして新しいモードで再初期化
  timer.reset();
  const debugInfo = timer.getDebugInfo();
  console.log(`🔧 デバッグモード: ${isDebugMode.value ? 'ON' : 'OFF'}`);
  console.log('📊 タイマー設定:', debugInfo);
};
</script>

<template>
  <div class="app">
    <!-- Header - Requirements 1.1 -->
    <header class="app-header">
      <h1>商談タイマー</h1>
      <!-- デバッグモード切り替えボタン -->
      <div class="debug-controls">
        <button 
          @click="toggleDebugMode"
          :class="['debug-button', { 'debug-active': isDebugMode }]"
          title="デバッグモード: 20秒タイマー、10秒で5分警告をテスト"
        >
          🔧 {{ isDebugMode ? 'デバッグ ON' : 'デバッグ OFF' }}
        </button>
        <div v-if="isDebugMode" class="debug-info">
          <small>⚡ 高速テスト: 20秒タイマー、10秒で警告</small>
        </div>
      </div>
    </header>
    
    <!-- Main Timer Interface - Requirements 1.1, 1.2, 1.3 -->
    <main class="app-main">
      <div class="timer-layout">
        <!-- Progress Circle with Timer Display - Requirements 5.4, 1.3, 5.1 -->
        <div class="timer-display-container">
          <ProgressCircle 
            :percentage="timer.getProgressPercentage()"
            :size="280"
            :stroke-width="12"
          >
            <TimerDisplay
              :remaining-time="timer.state.value.remainingTime"
              :is-running="timer.state.value.isRunning"
              :show-warning="notification.state.value.showFiveMinuteWarning"
            />
          </ProgressCircle>
        </div>

        <!-- Control Buttons - Requirements 1.2, 1.4, 3.1, 3.2, 3.3, 3.4 -->
        <div class="controls-container">
          <ControlButtons
            :is-running="timer.state.value.isRunning"
            :is-paused="timer.state.value.isPaused"
            @start="handleStart"
            @pause="handlePause"
            @reset="handleReset"
          />
        </div>
      </div>
    </main>

    <!-- 5-Minute Warning Message - Requirements 2.1, 2.2, 2.3 -->
    <WarningMessage
      :show="notification.state.value.showFiveMinuteWarning"
      :message="notification.state.value.warningMessage"
      :consideration-items="notification.state.value.considerationItems"
      type="warning"
      @close="handleWarningClose"
    />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.app-header {
  margin-bottom: 2rem;
  text-align: center;
}

.app-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-primary);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 0 0 1rem 0;
}

.debug-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.debug-button {
  padding: 0.5rem 1rem;
  border: 2px solid #666;
  border-radius: 8px;
  background: white;
  color: #666;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.debug-button:hover {
  background: #f5f5f5;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.debug-button.debug-active {
  background: #ff9800;
  color: white;
  border-color: #ff9800;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 2px 4px rgba(255, 152, 0, 0.3); }
  50% { box-shadow: 0 4px 12px rgba(255, 152, 0, 0.6); }
  100% { box-shadow: 0 2px 4px rgba(255, 152, 0, 0.3); }
}

.debug-info {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  color: #856404;
  font-size: 0.8rem;
}

.app-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 600px;
}

.timer-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
}

.timer-display-container {
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  padding: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.timer-display-container:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.controls-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

/* Mobile-first responsive design - Requirements 4.1, 4.2, 4.3, 4.4 */

/* Base mobile styles (320px+) */
.app {
  padding: var(--spacing-sm);
  gap: var(--spacing-md);
}

.app-header {
  margin-bottom: var(--spacing-md);
  width: 100%;
  text-align: center;
}

.app-header h1 {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--color-primary);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 0;
  line-height: 1.2;
}

.app-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 100%;
}

.timer-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  width: 100%;
  max-width: 400px;
}

.timer-display-container {
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  padding: var(--spacing-sm);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  width: fit-content;
}

.timer-display-container:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.controls-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

/* Small mobile (375px+) */
@media (min-width: 375px) {
  .timer-layout {
    max-width: 350px;
    gap: var(--spacing-lg);
  }
  
  .timer-display-container {
    padding: var(--spacing-md);
  }
}

/* Large mobile / Small tablet (480px+) */
@media (min-width: 480px) {
  .app {
    padding: var(--spacing-md);
  }
  
  .app-header h1 {
    font-size: var(--font-size-4xl);
  }
  
  .timer-layout {
    max-width: 450px;
    gap: var(--spacing-xl);
  }
  
  .app-header {
    margin-bottom: var(--spacing-lg);
  }
}

/* Tablet (640px+) */
@media (min-width: 640px) {
  .app {
    padding: var(--spacing-lg);
  }
  
  .timer-layout {
    max-width: 500px;
  }
  
  .app-header h1 {
    font-size: var(--font-size-5xl);
  }
}

/* Large tablet / Small desktop (768px+) */
@media (min-width: 768px) {
  .app {
    padding: var(--spacing-xl);
  }
  
  .timer-layout {
    max-width: 600px;
    gap: var(--spacing-xxl);
  }
  
  .app-header {
    margin-bottom: var(--spacing-xl);
  }
  
  .timer-display-container {
    padding: var(--spacing-lg);
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .app-main {
    max-width: var(--container-lg);
  }
}

/* Screen rotation and size adaptations - Requirements 4.3, 4.4 */

/* Landscape orientation handling for tablets and larger screens */
@media (orientation: landscape) and (min-width: 768px) {
  .app {
    flex-direction: row;
    gap: var(--spacing-xxl);
    padding: var(--spacing-xl);
    align-items: center;
    justify-content: center;
  }
  
  .app-header {
    margin-bottom: 0;
    margin-right: var(--spacing-xl);
    width: auto;
    flex-shrink: 0;
  }
  
  .timer-layout {
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-xxl);
    max-width: none;
  }
}

/* Landscape orientation for mobile devices - compact layout */
@media (orientation: landscape) and (max-height: 600px) and (max-width: 767px) {
  .app {
    flex-direction: row;
    gap: var(--spacing-lg);
    padding: var(--spacing-sm) var(--spacing-md);
    min-height: 100vh;
    min-height: 100dvh;
  }
  
  .app-header {
    margin-bottom: 0;
    margin-right: var(--spacing-md);
    width: auto;
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }
  
  .app-header h1 {
    font-size: var(--font-size-2xl);
    writing-mode: vertical-rl;
    text-orientation: mixed;
    white-space: nowrap;
  }
  
  .timer-layout {
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-md);
    max-width: none;
    flex: 1;
  }
  
  .timer-display-container {
    flex-shrink: 0;
  }
  
  .controls-container {
    flex-shrink: 0;
  }
}

/* Very short landscape screens (phones in landscape) */
@media (orientation: landscape) and (max-height: 500px) {
  .app {
    padding: var(--spacing-xs) var(--spacing-sm);
    gap: var(--spacing-sm);
  }
  
  .app-header h1 {
    font-size: var(--font-size-xl);
  }
  
  .timer-layout {
    gap: var(--spacing-sm);
  }
}

/* Ultra-wide screens (aspect ratio > 2:1) */
@media (min-aspect-ratio: 2/1) {
  .app {
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    max-width: 1400px;
    margin: 0 auto;
  }
  
  .app-header {
    margin-bottom: 0;
    margin-right: 0;
  }
  
  .timer-layout {
    flex-direction: row;
    gap: var(--spacing-xxl);
  }
}

/* Portrait orientation optimizations for tablets */
@media (orientation: portrait) and (min-width: 768px) and (min-height: 1000px) {
  .app {
    gap: var(--spacing-xxl);
    padding: var(--spacing-xxl);
  }
  
  .app-header {
    margin-bottom: var(--spacing-xxl);
  }
  
  .app-header h1 {
    font-size: 4rem;
  }
  
  .timer-layout {
    gap: var(--spacing-xxl);
    max-width: 600px;
  }
}

/* Very tall screens (aspect ratio < 1:2) */
@media (max-aspect-ratio: 1/2) {
  .app {
    justify-content: flex-start;
    padding-top: var(--spacing-xxl);
  }
  
  .app-header {
    margin-bottom: var(--spacing-xxl);
  }
  
  .timer-layout {
    gap: var(--spacing-xxl);
  }
}

/* Large desktop screens (1440px+) */
@media (min-width: 1440px) {
  .app {
    max-width: var(--container-xl);
    margin: 0 auto;
  }
  
  .timer-layout {
    max-width: 800px;
  }
}

/* 4K and ultra-high resolution screens */
@media (min-width: 2560px) {
  .app {
    max-width: 1600px;
  }
  
  .app-header h1 {
    font-size: 6rem;
  }
  
  .timer-layout {
    max-width: 1000px;
    gap: 4rem;
  }
}

/* Foldable devices and dual-screen support */
@media (min-width: 1024px) and (max-width: 1366px) and (orientation: landscape) {
  .app {
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }
  
  .timer-layout {
    flex-direction: column;
    max-width: 500px;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .app-header h1 {
    text-shadow: none;
    border-bottom: 3px solid var(--color-primary);
    padding-bottom: var(--spacing-sm);
  }
  
  .timer-display-container {
    border: 3px solid var(--color-primary);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .timer-display-container {
    transition: box-shadow 0.2s ease;
  }
  
  .timer-display-container:hover {
    transform: none;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .app {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  }
  
  .app-header h1 {
    color: #ffffff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .timer-display-container {
    background: #2d2d2d;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  }
  
  .timer-display-container:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  }
}
</style>
