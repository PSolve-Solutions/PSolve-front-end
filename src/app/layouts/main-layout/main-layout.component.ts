import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { MainSidebarComponent } from './Components/main-sidebar/main-sidebar.component';
import { MainNavbarComponent } from './Components/main-navbar/main-navbar.component';
import { MainMobileNavComponent } from './Components/main-mobile-nav/main-mobile-nav.component';
import { OcSidebarService } from '../../shared/services/oc-sidebar.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    MainSidebarComponent,
    MainNavbarComponent,
    MainMobileNavComponent,
    NgClass,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  os = inject(OcSidebarService);
  router = inject(Router);
  currentPath: string = '';

  constructor() {
    this.currentPath = this.router.url;
  }
}
