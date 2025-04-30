export type Component<T extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap> = {
  readonly root: HTMLElementTagNameMap[T];
  children(children: Component | Component[]): Component;
  removeAttribute(name: string): Component;
  render(): HTMLElement | HTMLElement[];
  setAttribute(name: string, value: string): Component;
};

export type CanBeClicked = {
  onClick(callback: () => void): Component;
};

export type CanBeDisabled = {
  setDisabled(): CanBeDisabled;
  setEnabled(): CanBeDisabled;
  setStatus(status: 'disabled' | 'enabled'): CanBeDisabled;
};

export type CanBeRerendered = {
  renderContent(...args: unknown[]): void;
};

export type CanBeStyled = {
  addClass(className: string): CanBeStyled;
  addClasses(classNames: string[]): CanBeStyled;
  setStyle(style: Partial<CSSStyleDeclaration>): CanBeStyled;
  removeClass(className: string): CanBeStyled;
  removeClasses(classNames: string[]): CanBeStyled;
};

export type CabBeWritten = {
  setTextContent(text: string): CabBeWritten;
};
