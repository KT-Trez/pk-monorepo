import '@fontsource/ubuntu/400.css';
import '@fontsource/ubuntu/500.css';
import 'material-icons/iconfont/material-icons.css';
import { UserCreateForm } from './modules/admin/users/UserCreateForm.ts';
import { UsersPage } from './modules/admin/users/UsersPage.ts';
import { DashboardPage } from './modules/dashboard/DashboardPage.ts';
import { CalendarFormPage } from './modules/home/calendars/CalendarFormPage.ts';
import { CalendarsPage } from './modules/home/calendars/CalendarsPage.ts';
import { EventFormPage } from './modules/home/events/EventFormPage.ts';
import { EventsPage } from './modules/home/events/EventsPage.ts';
import { LoginPage } from './modules/login/LoginPage.ts';
import { AccountPage } from './modules/settings/account/AccountPage.ts';
import { ApiService } from './services/ApiService.ts';
import { NavigationService } from './services/NavigationService.ts';
import { NotificationService } from './services/NotificationService.ts';
import { SessionService } from './services/SessionService.ts';
import type { NavigationPaths } from './types/navigationPaths.ts';

export const sessionService = new SessionService();

export const client = new ApiService(window.location.origin, sessionService);
export const notifier = new NotificationService();
export const navigation = new NavigationService<NavigationPaths>(sessionService)
  .addRoute('/', { Component: LoginPage, parentSelector: 'body' })
  .addRoute('/admin/users', { Component: UsersPage, Container: DashboardPage, parentSelector: 'main' })
  .addRoute('/admin/users/create', { Component: UserCreateForm, Container: DashboardPage, parentSelector: 'main' })
  .addRoute('/home/calendars', { Component: CalendarsPage, Container: DashboardPage, parentSelector: 'main' })
  .addRoute('/home/calendars/create', { Component: CalendarFormPage, Container: DashboardPage, parentSelector: 'main' })
  .addRoute('/home/events', { Component: EventsPage, Container: DashboardPage, parentSelector: 'main' })
  .addRoute('/home/events/create', { Component: EventFormPage, Container: DashboardPage, parentSelector: 'main' })
  .addRoute('/settings/account', { Component: AccountPage, Container: DashboardPage, parentSelector: 'main' })
  .start();
