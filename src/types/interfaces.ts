/**
 * @deprecated
 */
export type ParserInterface<T> = {
  parse(filePath: string): T;
};

export type ParserInterfaceV2<IArg, RType> = {
  parse(args: IArg): RType;
};

/**
 * @deprecated
 */
export type WriterInterface<T> = {
  write(data: T, filePath: string): void;
};

export type WriterInterfaceV2<TInput, TOutput> = {
  bufor: TOutput;

  transform?: (data: TInput) => void;

  write(): void;
};
