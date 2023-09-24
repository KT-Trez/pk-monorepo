export type ParserInterface<T> = {
  parse(filePath: string): T;
};

export type WriterInterface<T> = {
  write(data: T, filePath: string): void;
};
