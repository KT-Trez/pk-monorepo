import type { NotificationSeverity } from './types.ts';

export const notificationClassNames: Record<NotificationSeverity, string> = {
  error: 'Notification-root--error',
  info: 'Notification-root--info',
  success: 'Notification-root--success',
  warning: 'Notification-root--warning',
} as const;

export const notificationIcons: Record<NotificationSeverity, string> = {
  error: 'error',
  info: 'info',
  success: 'check_circle',
  warning: 'warning',
} as const;
