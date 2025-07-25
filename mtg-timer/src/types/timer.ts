/**
 * Timer related type definitions for MTG Time Manager
 */
import type { Ref } from 'vue';

export interface TimerState {
  totalDuration: number;      // 20分（秒）
  remainingTime: number;      // 残り時間（秒）
  isRunning: boolean;         // 動作状態
  isPaused: boolean;          // 一時停止状態
  fiveMinuteWarningShown: boolean; // 5分警告表示済み
  startTime: number | null;   // 開始時刻（timestamp）
  pausedTime: number;         // 一時停止時間の累計
}

export interface NotificationState {
  showFiveMinuteWarning: boolean;
  warningMessage: string;
  considerationItems: string[];
}

export interface UIState {
  currentView: 'timer' | 'warning';
  theme: 'default' | 'warning' | 'urgent';
  isFullscreen: boolean;
}

// Component Props Types
export interface TimerDisplayProps {
  remainingTime: number;
  isRunning: boolean;
  showWarning: boolean;
}

export interface ControlButtonsProps {
  isRunning: boolean;
  isPaused: boolean;
  disabled?: boolean;
}

export interface ProgressCircleProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export interface WarningMessageProps {
  show: boolean;
  message: string;
  type?: 'info' | 'warning' | 'error';
}

// Composable return types
export interface UseTimerReturn {
  state: Ref<TimerState>;
  start: () => void;
  pause: () => void;
  reset: () => void;
  formatTime: (seconds: number) => string;
  getProgressPercentage: () => number;
  shouldShowFiveMinuteWarning: () => boolean;
  cleanup: () => void; // Manual cleanup function
  getDebugInfo: () => any; // Debug information
}

export interface UseNotificationReturn {
  state: Ref<NotificationState>;
  triggerFiveMinuteWarning: () => void;
  hideWarning: () => void;
  getConsiderationItems: () => string[];
  playSound?: () => Promise<void>; // オプション
}