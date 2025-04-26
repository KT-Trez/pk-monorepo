import type { CabBeWritten, CanBeStyled, Component } from '../../types/component.ts';

export class BaseComponent<T extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap>
  implements Component, CanBeStyled, CabBeWritten
{
  readonly root: HTMLElementTagNameMap[T];

  constructor(tag: T) {
    this.root = document.createElement(tag);
  }

  addClass(className: string) {
    this.root.classList.add(className);
    return this;
  }

  addClasses(classNames: string[]) {
    for (const className of classNames) {
      this.root.classList.add(className);
    }
    return this;
  }

  children(maybeChildren: Component | Component[]): Component {
    const children = Array.isArray(maybeChildren) ? maybeChildren : [maybeChildren];

    for (const maybeElement of children) {
      const maybeElements = maybeElement.render();
      const elements = Array.isArray(maybeElements) ? maybeElements : [maybeElements];

      for (const child of elements) {
        this.root.appendChild(child);
      }
    }

    return this;
  }

  removeAttribute(name: string) {
    this.root.removeAttribute(name);
    return this;
  }

  removeClass(className: string) {
    this.root.classList.remove(className);
    return this;
  }

  removeClasses(classNames: string[]) {
    for (const className of classNames) {
      this.root.classList.remove(className);
    }
    return this;
  }

  render(): HTMLElement | HTMLElement[] {
    return this.root;
  }

  setAttribute(name: string, value: string) {
    this.root.setAttribute(name, value);
    return this;
  }

  setStyle(style: Partial<CSSStyleDeclaration>) {
    for (const key in style) {
      this.root.style[key] = style[key] as string;
    }
    return this;
  }

  setTextContent(text: string) {
    this.root.textContent = text;
    return this;
  }
}
