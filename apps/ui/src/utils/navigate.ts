import { navigationService } from '../main.ts';
import type { NavigationPaths } from '../types/navigationPaths.ts';

export const navigate = (path: `#${NavigationPaths}`) => {
  window.history.pushState(null, '', path);
  navigationService.onRouteChange();
};
