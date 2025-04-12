import 'material-icons/iconfont/material-icons.css';
import { LoginPage } from './modules/login/LoginPage.ts';
import { NavigationService } from './services/NavigationService.ts';

new NavigationService();

document.body.appendChild(new LoginPage().render());
