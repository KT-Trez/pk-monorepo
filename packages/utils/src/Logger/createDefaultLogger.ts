import type { Logger } from './Logger.ts';
import { LoggerBuilder } from './LoggerBuilder.ts';
import { LoggerConsoleTransport } from './LoggerConsoleTransport.ts';
import { type Severities, Severity } from './types.ts';

export const createDefaultLogger = (): Logger<Severities> => {
  const transport = new LoggerConsoleTransport<Severities>()
    .configureColor(Severity.Debug, '\u001b[37;1m')
    .configureColor(Severity.Error, '\u001b[31;1m')
    .configureColor(Severity.Fatal, '\u001b[35;1m')
    .configureColor(Severity.Info, '\u001b[36;1m')
    .configureColor(Severity.Success, '\u001b[32;1m')
    .configureColor(Severity.Warn, '\u001b[33;1m');

  return new LoggerBuilder<Severities>()
    .addSeverity({
      label: 'DEBUG',
      severity: Severity.Debug,
      std: 'out',
    })
    .addSeverity({
      label: 'ERROR',
      severity: Severity.Error,
      std: 'err',
    })
    .addSeverity({
      label: 'FATAL',
      severity: Severity.Fatal,
      std: 'err',
    })
    .addSeverity({
      label: 'INFO',
      severity: Severity.Info,
      std: 'out',
    })
    .addSeverity({
      label: 'SUCCESS',
      severity: Severity.Success,
      std: 'out',
    })
    .addSeverity({
      label: 'WARNING',
      severity: Severity.Warn,
      std: 'err',
    })
    .addTransport(transport)
    .build();
};
