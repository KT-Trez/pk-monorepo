import './visibilityCell.css';
import type { ConstValues } from '@pk/types/helpers.js';
import type { Component } from '../../../types/component.ts';
import { BaseComponent } from '../../BaseComponent/BaseComponent.ts';
import { Icon } from '../../Icon/Icon.ts';
import { Typography } from '../../Typography/Typography.ts';

export const VisibilityType = {
  Public: 'public',
  Private: 'private',
} as const;
export type VisibilityTypes = ConstValues<typeof VisibilityType>;

const VISIBILITY_ICON: Record<VisibilityTypes, string> = {
  public: 'public',
  private: 'lock',
} as const;

const VISIBILITY_TEXT: Record<VisibilityTypes, string> = {
  public: 'Public',
  private: 'Private',
} as const;

export class VisibilityCell extends BaseComponent {
  #icon: Component;
  #text: Component;

  constructor(visibility: VisibilityTypes) {
    super('div');
    this.addClass('VisibilityCell-root');

    const icon = VISIBILITY_ICON[visibility];
    const text = VISIBILITY_TEXT[visibility];

    this.#icon = new Icon(icon);
    this.#text = new Typography({ text });
  }

  render(): HTMLElement {
    return this.children([this.#text, this.#icon]).root;
  }
}
