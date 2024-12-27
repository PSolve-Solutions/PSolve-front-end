import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../authentication/services/auth.service';
import { OcSidebarService } from '../../../../shared/services/oc-sidebar.service';

@Component({
  selector: 'app-main-mobile-nav',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './main-mobile-nav.component.html',
  styleUrl: './main-mobile-nav.component.scss',
})
export class MainMobileNavComponent {
  ocSidebarService = inject(OcSidebarService);
  router = inject(Router);
  auth = inject(AuthService);
  profilePhoto: string = '';
  currentPath: string = '';
  constructor() {
    this.currentPath = this.router.url;
    this.profilePhoto = this.auth.currentUser().photoUrl;
  }

  show(): void {
    if (
      this.ocSidebarService.isOpen() === 'show' ||
      this.ocSidebarService.isOpen() === 'semi'
    ) {
      this.ocSidebarService.openSidebar('hide');
    } else {
      this.ocSidebarService.openSidebar('show');
    }
    console.log(this.ocSidebarService.isOpen());
  }
}
