import type { ConstValues } from '@pk/types/helpers.js';

export type Log<TSeverity extends string> = {
  env?: string;
  message: string;
  severity: TSeverity;
  timestamp: Date;
  uid: string;
};

export type LoggerStrategy<TSeverity extends string, TLogFields extends keyof Log<TSeverity>> = {
  log(log: Pick<Log<TSeverity>, TLogFields>): void;
};

export type LoggerTransportStrategy<TSeverity extends string> = {
  _loadSeveritiesConfig(severities: SeverityConfig<TSeverity>[]): void;
  _log(log: Log<TSeverity>): void | Promise<void>;
};

export const Severity = {
  Debug: 'debug',
  Error: 'error',
  Fatal: 'fatal',
  Info: 'info',
  Success: 'success',
  Warn: 'warn',
} as const;
export type Severities = ConstValues<typeof Severity>;

export type SeverityConfig<TSeverity extends string> = {
  label: string;
  severity: TSeverity;
  std: 'err' | 'out';
};
