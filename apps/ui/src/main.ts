import 'material-icons/iconfont/material-icons.css';
import { DashboardPage } from './modules/dashboard/DashboardPage.ts';
import { NavigationService } from './services/NavigationService.ts';

new NavigationService();

// document.body.appendChild(new LoginPage().render());
document.body.appendChild(new DashboardPage().render());
