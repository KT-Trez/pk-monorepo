import './typography.css';
import { BaseComponent } from '../BaseComponent/BaseComponent.ts';
import { typographyClassNames, typographyTagNames } from './constants.ts';
import type { TypographyVariants } from './types.ts';

type TypographyProps<T extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap> = {
  tag?: T;
  text: string;
  variant?: TypographyVariants;
};

export class Typography<T extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap> extends BaseComponent<T> {
  constructor({ tag, text, variant = 'body1' }: TypographyProps<T>) {
    const className = typographyClassNames[variant];
    const tagName = tag ?? typographyTagNames[variant];

    super(tagName as T);
    this.addClass(className).setTextContent(text);
  }

  render(): HTMLElement {
    return this.root;
  }
}
