import type { Log, LoggerStrategy, LoggerTransportStrategy } from './types.ts';

export type LoggerFields = 'env' | 'message' | 'severity';

export class Logger<TSeverity extends string> implements LoggerStrategy<TSeverity, LoggerFields> {
  #transports: LoggerTransportStrategy<TSeverity>[] = [];

  constructor(transports: LoggerTransportStrategy<TSeverity>[]) {
    this.#transports = transports;
  }

  log(log: Pick<Log<TSeverity>, LoggerFields>): void {
    if (log.env && !process.env[log.env]) {
      return;
    }

    const fullLog: Log<TSeverity> = {
      ...log,
      timestamp: new Date(),
      uid: crypto.randomUUID(),
    };

    for (const transport of this.#transports) {
      transport._log(fullLog);
    }
  }
}
