export class StoreService<TState extends Record<string, unknown>> extends Map<keyof TState, TState[keyof TState]> {
  get(key: keyof TState): TState[keyof TState] {
    const value = super.get(key);

    if (value === undefined) {
      throw new Error(`Key ${key.toString()} not found in store`);
    }

    return value;
  }

  getOptional(key: keyof TState): TState[keyof TState] | undefined {
    return super.get(key);
  }
}
