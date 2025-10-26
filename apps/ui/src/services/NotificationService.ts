import { Notification, type NotificationProps } from '../components/Notification/Notification.ts';
import { NotificationsContainer } from '../components/Notification/NotificationsContainer.ts';
import type { Component } from '../types/component.ts';

export class NotificationService {
  #container: Component | null;
  #timeout: number;

  constructor(timeout = 10000) {
    this.#container = null;
    this.#timeout = timeout;
  }

  notify(props: NotificationProps) {
    const container = this.#container ?? new NotificationsContainer();

    if (!this.#container) {
      document.body.appendChild(container.render());
      this.#container = container;
    }

    const notification = new Notification(props).render();
    container.root.appendChild(notification);

    setTimeout(() => {
      notification.remove();

      if (container.root.children.length === 0) {
        container.root.remove();
        this.#container = null;
      }
    }, this.#timeout);
  }
}
