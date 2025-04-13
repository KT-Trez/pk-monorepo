import 'material-icons/iconfont/material-icons.css';
import { PermissionsPage } from './modules/admin/permissions/PermissionsPage.ts';
import { UsersPage } from './modules/admin/users/UsersPage.ts';
import { DashboardPage } from './modules/dashboard/DashboardPage.ts';
import { EventsPage } from './modules/home/events/EventsPage.ts';
import { SchedulePage } from './modules/home/schedule/SchedulePage.ts';
import { LoginPage } from './modules/login/LoginPage.ts';
import { AccountPage } from './modules/settings/account/AccountPage.ts';
import { NavigationService } from './services/NavigationService.ts';
import type { NavigationPaths } from './types/navigationPaths.ts';

new NavigationService();

new NavigationService<NavigationPaths>()
    .addRoute('/', { Component: LoginPage, parentSelector: 'body' })
    .addRoute('/admin/permissions', { Component: PermissionsPage, Container: DashboardPage, parentSelector: 'main' })
    .addRoute('/admin/users', { Component: UsersPage, Container: DashboardPage, parentSelector: 'main' })
    .addRoute('/home/events', { Component: EventsPage, Container: DashboardPage, parentSelector: 'main' })
    .addRoute('/home/schedule', { Component: SchedulePage, Container: DashboardPage, parentSelector: 'main' })
    .addRoute('/settings/account', { Component: AccountPage, Container: DashboardPage, parentSelector: 'main' })
    .start();
