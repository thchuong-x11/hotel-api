/* eslint-disable no-console */
export enum LogLevel {
  Debug,
  Info,
  Warn,
  Error,
}

export interface Logger {
  debug(message: string): void;
  info(message: string): void;
  warn(message: string, err?: unknown): void;
  error(message: string, err?: unknown): void;
}

abstract class AbstractLogger implements Logger {
  constructor(protected readonly logLevel: LogLevel) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected abstract logMessage(level: LogLevel, message: string, ...params: any): void;

  debug(message: string): void {
    this.logMessage(LogLevel.Debug, message);
  }

  info(message: string): void {
    this.logMessage(LogLevel.Info, message);
  }

  warn(message: string, err?: unknown): void {
    this.logMessage(LogLevel.Warn, message, err);
  }

  error(message: string, err?: unknown): void {
    this.logMessage(LogLevel.Error, message, err);
  }
}

export class ConsoleLogger extends AbstractLogger {
  constructor(logLevel: LogLevel) {
    super(logLevel);
  }

  protected logMessage(level: LogLevel, message: string, ...params: any): void {
    if (level >= this.logLevel) {
      switch (level) {
        case LogLevel.Debug:
          console.debug(`[${LogLevel[level].toUpperCase()}] ${message}`, params);
          break;
        case LogLevel.Error:
          console.error(`[${LogLevel[level].toUpperCase()}] ${message}`, params);
          break;
        case LogLevel.Info:
          console.debug(`[${LogLevel[level].toUpperCase()}] ${message}`, params);
          break;
        case LogLevel.Warn:
          console.debug(`[${LogLevel[level].toUpperCase()}] ${message}`, params);
          break;
      }
    }
  }
}
