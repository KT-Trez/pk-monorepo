export type LoggerInterface<T> = {
  log(message: string, options?: T): void;
};

export type ParserInterface<T> = {
  parse(filePath: string): T;
};

export type WriterInterface<T> = {
  write(data: T, filePath: string): void;
};
