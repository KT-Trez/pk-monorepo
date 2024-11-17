import type { ConstAssertion } from '@/types/helpers';

export const Severity = {
  DEBUG: 'DEBUG',
  ERROR: 'ERROR',
  INFO: 'INFO',
  SUCCESS: 'SUCCESS',
  WARNING: 'WARNING',
} as const;
export type Severity = ConstAssertion<typeof Severity>;
