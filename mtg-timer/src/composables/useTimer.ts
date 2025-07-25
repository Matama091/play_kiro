/**
 * Timer composable for managing 20-minute meeting timer
 * Enhanced with browser compatibility and Page Visibility API support
 */
import { ref, onMounted, onUnmounted } from 'vue';
import type { TimerState, UseTimerReturn } from '@/types/timer';
import { getHighResTime, warnUnsupportedFeatures } from '@/utils/browserCompat';

export function useTimer(initialDuration: number = 1200, debugModeRef?: Ref<boolean>): UseTimerReturn {
  // Basic timer state management - Task 2.1
  const debugMode = debugModeRef || ref(false);
  
  // デバッグモードに応じた設定を計算
  const getTimerConfig = () => {
    const isDebug = debugMode.value;
    return {
      duration: isDebug ? 20 : initialDuration, // デバッグ: 20秒, 通常: 20分
      fiveMinuteThreshold: isDebug ? 10 : 300   // デバッグ: 10秒, 通常: 5分
    };
  };
  
  const config = getTimerConfig();
  
  const state = ref<TimerState>({
    totalDuration: config.duration,
    remainingTime: config.duration,
    isRunning: false,
    isPaused: false,
    fiveMinuteWarningShown: false,
    startTime: null,
    pausedTime: 0
  });

  let intervalId: number | null = null;
  let lastUpdateTime: number = 0;
  let isPageVisible: boolean = true;
  let backgroundStartTime: number = 0;

  // Browser compatibility check for Page Visibility API
  const getVisibilityAPI = () => {
    if (typeof document === 'undefined') return null;
    
    if (typeof document.hidden !== 'undefined') {
      return {
        hidden: 'hidden',
        visibilityChange: 'visibilitychange'
      };
    } else if (typeof (document as any).webkitHidden !== 'undefined') {
      return {
        hidden: 'webkitHidden',
        visibilityChange: 'webkitvisibilitychange'
      };
    } else if (typeof (document as any).mozHidden !== 'undefined') {
      return {
        hidden: 'mozHidden',
        visibilityChange: 'mozvisibilitychange'
      };
    } else if (typeof (document as any).msHidden !== 'undefined') {
      return {
        hidden: 'msHidden',
        visibilityChange: 'msvisibilitychange'
      };
    }
    return null;
  };

  // Page Visibility API handler
  const handleVisibilityChange = () => {
    try {
      const visibilityAPI = getVisibilityAPI();
      if (!visibilityAPI) return;

      const isHidden = (document as any)[visibilityAPI.hidden];
      
      if (isHidden && isPageVisible && state.value.isRunning) {
        // Page became hidden while timer is running
        isPageVisible = false;
        backgroundStartTime = getHighResTime();
      } else if (!isHidden && !isPageVisible) {
        // Page became visible again
        isPageVisible = true;
        
        if (state.value.isRunning && backgroundStartTime > 0) {
          // Adjust for time spent in background
          const backgroundTime = getHighResTime() - backgroundStartTime;
          if (state.value.startTime !== null) {
            state.value.startTime -= backgroundTime;
          }
          // Force immediate update
          updateTimer();
        }
        backgroundStartTime = 0;
      }
    } catch (error) {
      console.warn('Page visibility change error:', error);
    }
  };

  // Timer control functions - Task 2.2
  const start = () => {
    if (state.value.isRunning) return;
    
    state.value.isRunning = true;
    state.value.isPaused = false;
    
    // 高精度タイマーを使用（ブラウザ互換性対応）
    const now = getHighResTime();
    state.value.startTime = now;
    lastUpdateTime = now;
    
    // setInterval を使用した1秒間隔の更新（精度向上）
    intervalId = setInterval(() => {
      updateTimer();
    }, 100); // より頻繁な更新で精度向上
  };

  const pause = () => {
    if (!state.value.isRunning) return;
    
    state.value.isRunning = false;
    state.value.isPaused = true;
    
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
    
    // 一時停止時間を累積（精度向上）
    if (state.value.startTime !== null) {
      const now = Date.now();
      state.value.pausedTime += now - state.value.startTime;
      state.value.startTime = now; // 次回開始時のベース時間を更新
    }
  };

  const reset = () => {
    // デバッグモード変更時に設定を更新
    const config = getTimerConfig();
    
    state.value.isRunning = false;
    state.value.isPaused = false;
    state.value.totalDuration = config.duration;
    state.value.remainingTime = config.duration;
    state.value.fiveMinuteWarningShown = false;
    state.value.startTime = null;
    state.value.pausedTime = 0;
    
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  // 実時間ベースの正確な時間計算（精度向上）
  const updateTimer = () => {
    if (!state.value.isRunning || state.value.startTime === null) return;
    
    try {
      const now = getHighResTime();
      
      // 前回の更新から1秒以上経過した場合のみ更新（精度とパフォーマンスのバランス）
      if (now - lastUpdateTime < 950) return;
      
      const elapsedTime = Math.floor((now - state.value.startTime + state.value.pausedTime) / 1000);
      const newRemainingTime = Math.max(0, state.value.totalDuration - elapsedTime);
      
      // 時間が実際に変化した場合のみ状態を更新
      if (state.value.remainingTime !== newRemainingTime) {
        state.value.remainingTime = newRemainingTime;
        lastUpdateTime = now;
        
        // 5分警告機能の実装 - Task 2.3
        checkFiveMinuteWarning(newRemainingTime);
      }
      
      // タイマー終了時の処理
      if (newRemainingTime === 0) {
        state.value.isRunning = false;
        if (intervalId !== null) {
          clearInterval(intervalId);
          intervalId = null;
        }
      }
    } catch (error) {
      console.error('Timer update error:', error);
      // エラー時はタイマーを停止
      pause();
    }
  };

  // 残り5分（300秒）での警告トリガー（デバッグモード対応）
  const checkFiveMinuteWarning = (remainingTime: number) => {
    const config = getTimerConfig();
    if (remainingTime <= config.fiveMinuteThreshold && !state.value.fiveMinuteWarningShown) {
      state.value.fiveMinuteWarningShown = true;
      console.log(`🚨 5分警告トリガー! 残り時間: ${remainingTime}秒 (閾値: ${config.fiveMinuteThreshold}秒) [デバッグモード: ${debugMode.value}]`);
      // 警告の表示は useNotification composable で処理される
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (): number => {
    return ((state.value.totalDuration - state.value.remainingTime) / state.value.totalDuration) * 100;
  };

  // 5分警告状態の取得（デバッグモード対応）
  const shouldShowFiveMinuteWarning = (): boolean => {
    const config = getTimerConfig();
    return state.value.remainingTime <= config.fiveMinuteThreshold && state.value.fiveMinuteWarningShown;
  };

  // デバッグ用の状態取得関数
  const getDebugInfo = () => {
    const config = getTimerConfig();
    return {
      debugMode: debugMode.value,
      fiveMinuteThreshold: config.fiveMinuteThreshold,
      actualDuration: config.duration,
      shouldShowWarning: shouldShowFiveMinuteWarning(),
      warningShown: state.value.fiveMinuteWarningShown,
      remainingTime: state.value.remainingTime
    };
  };

  // エラーハンドリング付きのクリーンアップ関数
  const cleanup = () => {
    try {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
      
      // Page Visibility API のイベントリスナーを削除
      const visibilityAPI = getVisibilityAPI();
      if (visibilityAPI && typeof document !== 'undefined') {
        document.removeEventListener(visibilityAPI.visibilityChange, handleVisibilityChange);
      }
    } catch (error) {
      console.warn('Timer cleanup error:', error);
    }
  };

  // ブラウザ互換性チェック
  const checkBrowserSupport = () => {
    const support = {
      setInterval: typeof setInterval !== 'undefined',
      dateNow: typeof Date.now !== 'undefined',
      pageVisibility: getVisibilityAPI() !== null
    };
    
    if (!support.setInterval || !support.dateNow) {
      console.warn('Basic timer functionality may not be supported in this browser');
    }
    
    return support;
  };

  // 初期化処理
  onMounted(() => {
    try {
      // ブラウザサポートチェックと警告表示
      checkBrowserSupport();
      warnUnsupportedFeatures();
      
      // Page Visibility API の設定
      const visibilityAPI = getVisibilityAPI();
      if (visibilityAPI && typeof document !== 'undefined') {
        document.addEventListener(visibilityAPI.visibilityChange, handleVisibilityChange, false);
      }
    } catch (error) {
      console.warn('Timer initialization error:', error);
    }
  });

  // クリーンアップ処理
  onUnmounted(() => {
    cleanup();
  });

  return {
    state,
    start,
    pause,
    reset,
    formatTime,
    getProgressPercentage,
    shouldShowFiveMinuteWarning,
    cleanup, // 手動クリーンアップ用
    getDebugInfo // デバッグ情報取得
  };
}