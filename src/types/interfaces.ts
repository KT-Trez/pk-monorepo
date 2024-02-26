export type ParserInterface<T> = {
  parse(filePath: string): T;
};

export type ParserInterfaceV2<IArg, RType> = {
  parse(args: IArg): RType;
};

export type WriterInterface<T> = {
  write(data: T, filePath: string): void;
};
