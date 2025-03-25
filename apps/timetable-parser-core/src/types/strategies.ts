import type { Severity } from '@/types/severity';

export type LogStrategy = {
  log: (message: string, severity: Severity) => void;
};
