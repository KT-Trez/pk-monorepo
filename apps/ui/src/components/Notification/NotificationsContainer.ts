import './notificationsContainer.css';
import { BaseComponent } from '../BaseComponent/BaseComponent.ts';

export class NotificationsContainer extends BaseComponent {
  constructor() {
    super('div');
    this.addClass('NotificationContainer-root');
  }
}
