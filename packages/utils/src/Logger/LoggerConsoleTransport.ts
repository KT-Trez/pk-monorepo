import type { Log, LoggerTransportStrategy, SeverityConfig } from './types.js';

type ConsoleColor = `\u001b[${number};1m`;

export class LoggerConsoleTransport<TSeverity extends string> implements LoggerTransportStrategy<TSeverity> {
  #colorsConfig = new Map<TSeverity, ConsoleColor>();
  #dateTimeFormat = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    fractionalSecondDigits: 3,
    hour: '2-digit',
    hourCycle: 'h23',
    minute: '2-digit',
    month: '2-digit',
    second: '2-digit',
    year: 'numeric',
  });
  #severitiesConfig = new Map<TSeverity, SeverityConfig<TSeverity>>();
  #severityPad = 0;

  constructor(dateTimeFormat?: Intl.DateTimeFormat) {
    if (dateTimeFormat) {
      this.#dateTimeFormat = dateTimeFormat;
    }
  }

  configureColor(severity: TSeverity, color: ConsoleColor): this {
    this.#colorsConfig.set(severity, color);
    return this;
  }

  _loadSeveritiesConfig(severities: SeverityConfig<TSeverity>[]): void {
    for (const severity of severities) {
      this.#severitiesConfig.set(severity.severity, severity);
      this.#severityPad = Math.max(this.#severityPad, severity.label.length + 1);
    }
  }

  _log(log: Log<TSeverity>): void {
    const config = this.#severitiesConfig.get(log.severity);
    if (!config) {
      throw new Error(`Severity config not found for severity: ${log.severity}`);
    }

    const color = this.#formatColor(log.severity);
    const pad = this.#formatPad(log.severity);
    const std = config.std === 'err' ? console.error : console.log;
    const timestamp = this.#formatDateTime(log.timestamp);

    std(`${timestamp}${pad}[${color.start}${log.severity.toUpperCase()}${color.end}] ${log.message}`);
  }

  #formatColor(severity: TSeverity) {
    const color = this.#colorsConfig.get(severity);
    if (!color) {
      return { end: '', start: '' };
    }

    return { end: '\u001b[0m', start: color };
  }

  #formatDateTime(date: Date): string {
    return this.#dateTimeFormat.format(date);
  }

  #formatPad(severity: TSeverity): string {
    return ''.padEnd(this.#severityPad - severity.length, ' ');
  }
}
