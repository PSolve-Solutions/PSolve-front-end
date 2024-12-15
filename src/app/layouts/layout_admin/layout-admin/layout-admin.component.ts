import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarAdminComponent } from './Components/sidebar-admin/sidebar-admin.component';
import { NavbarAdminComponent } from './Components/navbar-admin/navbar-admin.component';
import { NgClass } from '@angular/common';
import { SecondNavbarComponent } from '../../layout_leader/components/second-navbar/second-navbar.component';
import { OcSidebarService } from '../../../shared/services/oc-sidebar.service';

@Component({
  selector: 'app-layout-admin',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarAdminComponent,
    NavbarAdminComponent,
    SecondNavbarComponent,
    NgClass,
  ],
  templateUrl: './layout-admin.component.html',
  styleUrl: './layout-admin.component.scss',
})
export class LayoutAdminComponent {
  os = inject(OcSidebarService);
}
