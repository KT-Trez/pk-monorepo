import './dashboard.css';
import { BaseComponent } from '../../components/BaseComponent/BaseComponent.ts';
import { DesktopNav } from '../../components/Nav/desktop/DesktopNav.ts';
import { MobileNav } from '../../components/Nav/mobile/MobileNav.ts';
import { TopBar } from '../../components/TopBar/TopBar.ts';
import type { Component } from '../../types/component.ts';
import { useNavConfig } from './hooks/useNavConfig.ts';

export class DashboardPage extends BaseComponent {
  #content: Component;
  #desktopNav: Component;
  #main: Component;
  #mobileNav: Component;
  #topBar: Component;

  constructor() {
    super('div');

    const navConfig = useNavConfig();

    this.#content = new BaseComponent('div').addClass('Dashboard-root');
    this.#desktopNav = new DesktopNav(navConfig);
    this.#main = new BaseComponent('main').addClass('Dashboard-main');
    this.#mobileNav = new MobileNav(navConfig);
    this.#topBar = new TopBar();
  }

  render(): HTMLElement {
    return this.children([this.#topBar, this.#content.children([this.#desktopNav, this.#main, this.#mobileNav])]).root;
  }
}
