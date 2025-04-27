import { Notification, type NotificationProps } from '../components/Notification/Notification.ts';

export class NotificationService {
  #notifications: HTMLElement[] = [];
  #timeout: number;

  constructor(timeout = 10000) {
    this.#timeout = timeout;
  }

  notify(props: NotificationProps) {
    const notification = new Notification({ ...props, index: this.#notifications.length }).render();
    document.body.appendChild(notification);
    this.#notifications.push(notification);

    setTimeout(() => {
      this.#notifications.pop();
      notification.remove(); // todo: https://github.com/KT-Trez/pk-monorepo/issues/23
    }, this.#timeout);
  }
}
