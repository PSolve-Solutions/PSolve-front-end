import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarAdminComponent } from './Components/sidebar-admin/sidebar-admin.component';
import { NavbarAdminComponent } from './Components/navbar-admin/navbar-admin.component';
import { NgClass } from '@angular/common';
import { SecondNavbarComponent } from '../../layout_leader/components/second-navbar/second-navbar.component';
import { OcSidebarService } from '../../../shared/services/oc-sidebar.service';
import { AuthService } from '../../../authentication/services/auth.service';
import { MainMobileNavComponent } from '../../../shared/Components/main-mobile-nav/main-mobile-nav.component';

@Component({
  selector: 'app-layout-admin',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarAdminComponent,
    NavbarAdminComponent,
    SecondNavbarComponent,
    MainMobileNavComponent,
    NgClass,
  ],
  templateUrl: './layout-admin.component.html',
  styleUrl: './layout-admin.component.scss',
})
export class LayoutAdminComponent {
  os = inject(OcSidebarService);
  router = inject(Router);
  currentPath: string = '';

  constructor() {
    this.currentPath = this.router.url;
  }
}
