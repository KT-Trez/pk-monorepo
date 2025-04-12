import { Logger } from './Logger.ts';
import type { LoggerTransportStrategy, SeverityConfig } from './types.ts';

export class LoggerBuilder<TSeverity extends string> {
  #severities: SeverityConfig<TSeverity>[] = [];
  #transports: LoggerTransportStrategy<TSeverity>[] = [];

  addSeverity(config: SeverityConfig<TSeverity>): this {
    this.#severities.push(config);
    return this;
  }

  addTransport(transport: LoggerTransportStrategy<TSeverity>): this {
    this.#transports.push(transport);
    return this;
  }

  build(): Logger<TSeverity> {
    for (const transport of this.#transports) {
      transport._loadSeveritiesConfig(this.#severities);
    }

    return new Logger<TSeverity>(this.#transports);
  }
}
