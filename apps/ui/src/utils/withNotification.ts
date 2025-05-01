import { notifier } from '../main.ts';

type WithNotificationOptions<T> = {
  errorMessage?: string;
  onError?: () => void;
  onSuccess?: (result: T) => void;
  promise: Promise<T>;
  successMessage?: string | ((result: T) => string);
};

export const withNotification = async <T>({
  errorMessage,
  onError,
  onSuccess,
  promise,
  successMessage,
}: WithNotificationOptions<T>) => {
  try {
    const resolved = await promise;

    const message = typeof successMessage === 'string' ? successMessage : successMessage?.(resolved);

    onSuccess?.(resolved);

    if (message) {
      notifier.notify({ severity: 'success', text: message });
    }

    return resolved;
  } catch (error) {
    const fallbackMessage = errorMessage ?? 'Failed to follow calendar.';
    const message = error instanceof Error ? error.message : undefined;

    onError?.();
    notifier.notify({ severity: 'error', text: message ?? fallbackMessage });

    return undefined;
  }
};
