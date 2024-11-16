import type { ConstAssertion } from '@/types/helpers';
import { exhaustiveCheck } from '@/utils/exhaustiveCheck';

export const LogLevel = {
  DEBUG: 'DEBUG',
  ERROR: 'ERROR',
  INFO: 'INFO',
  SUCCESS: 'SUCCESS',
  WARNING: 'WARNING',
} as const;
export type LogLevels = ConstAssertion<typeof LogLevel>;

// todo: refactor
export class Logger {
  static labels: Record<LogLevels, string> = {
    DEBUG: 'DEBUG',
    ERROR: 'ERROR',
    INFO: 'INFO',
    SUCCESS: 'SUCCESS',
    WARNING: 'WARNING',
  };

  static labelsLength = 7;

  static palette: Record<LogLevels, string> = {
    DEBUG: '\u001b[30;1m',
    ERROR: '\u001b[31;1m',
    INFO: '\u001b[36;1m',
    SUCCESS: '\u001b[32;1m',
    WARNING: '\u001b[33;1m',
  };

  color(message: string, severity: LogLevels) {
    return `${Logger.palette[severity]}${message}\u001b[0m`;
  }

  log(message: string, options: LogLevels = LogLevel.INFO): void {
    const timestamp = new Intl.DateTimeFormat('en-GB', {
      // todo: check if locale can be auto-selected
      day: '2-digit',
      fractionalSecondDigits: 3,
      hour: '2-digit',
      hourCycle: 'h23',
      minute: '2-digit',
      month: '2-digit',
      second: '2-digit',
      year: 'numeric',
    }).format(new Date());
    const pad = ''.padEnd(Logger.labelsLength - Logger.labels[options].length, ' ');
    const severity = this.color(Logger.labels[options], options);

    switch (options) {
      case LogLevel.DEBUG:
        // biome-ignore lint/suspicious/noConsole: this is a logger
        console.debug(`${timestamp}${pad} [${severity}] ${message}`);
        break;
      case LogLevel.ERROR:
        // biome-ignore lint/suspicious/noConsole: this is a logger
        console.error(`${timestamp}${pad} [${severity}] ${message}`);
        break;
      case LogLevel.INFO:
        // biome-ignore lint/suspicious/noConsole: this is a logger
        console.info(`${timestamp}${pad} [${severity}] ${message}`);
        break;
      case LogLevel.SUCCESS:
        // biome-ignore lint/suspicious/noConsole: this is a logger
        console.info(`${timestamp}${pad} [${severity}] ${message}`);
        break;
      case LogLevel.WARNING:
        // biome-ignore lint/suspicious/noConsole: this is a logger
        console.warn(`${timestamp}${pad} [${severity}] ${message}`);
        break;
      default:
        exhaustiveCheck(options);
    }
  }
}
