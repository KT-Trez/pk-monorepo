import './notification.css';
import type { Component } from '../../types/component.ts';
import { BaseComponent } from '../BaseComponent/BaseComponent.ts';
import { Icon } from '../Icon/Icon.ts';
import { Typography } from '../Typography/Typography.ts';
import { notificationClassNames, notificationIcons } from './constants.ts';
import type { NotificationSeverity } from './types.ts';

export type NotificationProps = {
  text: string;
  severity?: NotificationSeverity;
};

export class Notification extends BaseComponent {
  #icon: Component;
  #message: Component;

  constructor({ text, severity = 'info' }: NotificationProps) {
    const className = notificationClassNames[severity];
    const icon = notificationIcons[severity];
    const normalizedText = `${text.charAt(0).toUpperCase()}${text.slice(1)}${text.endsWith('.') ? '' : '.'}`;

    super('div');
    this.addClasses(['Notification-root', className]);

    this.#icon = new Icon(icon);
    this.#message = new Typography({ text: normalizedText, variant: 'body2' });
  }

  render(): HTMLElement {
    return this.children([this.#icon, this.#message]).root;
  }
}
