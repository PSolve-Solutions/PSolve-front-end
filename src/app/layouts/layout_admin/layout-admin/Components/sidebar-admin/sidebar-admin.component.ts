import { NgClass } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../../authentication/services/auth.service';
import { AdminsService } from '../../../../../pages/Admin/services/admins.service';
import { OcSidebarService } from '../../../../../shared/services/oc-sidebar.service';

@Component({
  selector: 'app-sidebar-admin',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './sidebar-admin.component.html',
  styleUrl: './sidebar-admin.component.scss',
})
export class SidebarAdminComponent {
  authService = inject(AuthService);
  ocSidebarService = inject(OcSidebarService);
  isShow: boolean = true;
  roles: string[] = [];
  constructor() {
    this.isShow = this.ocSidebarService.isOpen();
    this.roles = this.authService.currentUser().roles;
    console.log(this.roles);
  }

  show(): void {
    this.ocSidebarService.openSidebar();
    this.isShow = this.ocSidebarService.isOpen();
  }
}
