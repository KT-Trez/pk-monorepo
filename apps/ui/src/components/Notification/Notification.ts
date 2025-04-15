import './notification.css';
import type { Component } from '../../types/component.ts';
import { BaseComponent } from '../BaseComponent.ts';
import { Icon } from '../Icon/Icon.ts';
import { Typography } from '../Typography/Typography.ts';
import { notificationClassNames, notificationIcons } from './constants.ts';
import type { NotificationSeverity } from './types.ts';

export type NotificationProps = {
  index?: number;
  text: string;
  severity?: NotificationSeverity;
};

export class Notification extends BaseComponent {
  #icon: Component;
  #message: Component;

  constructor({ index = 0, text, severity = 'info' }: NotificationProps) {
    const className = notificationClassNames[severity];
    const icon = notificationIcons[severity];
    const normalizedText = `${text.charAt(0).toUpperCase()}${text.slice(1)}${text.endsWith('.') ? '' : '.'}`;

    super('div');
    this.addClasses(['Notification-root', className]).setStyle({
      // todo: check if notification height can be measured dinamically instead of ${index} * 47px
      bottom: `calc(${index} * var(--sizing-4) + ${index} * 47px + var(--sizing-8))`,
    });

    this.#icon = new Icon(icon);
    this.#message = new Typography({ text: normalizedText, variant: 'body2' });
  }

  render(): HTMLElement {
    return this.children([this.#icon, this.#message]).root;
  }
}
