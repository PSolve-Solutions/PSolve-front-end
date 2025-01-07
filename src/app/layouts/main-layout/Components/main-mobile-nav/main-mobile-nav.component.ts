import { Component, inject, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../authentication/services/auth.service';
import { OcSidebarService } from '../../../../shared/services/oc-sidebar.service';
import { NotificationComponent } from '../../../../shared/Components/notification/notification.component';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-main-mobile-nav',
  standalone: true,
  imports: [RouterLink, NotificationComponent],
  templateUrl: './main-mobile-nav.component.html',
  styleUrl: './main-mobile-nav.component.scss',
})
export class MainMobileNavComponent {
  ocSidebarService = inject(OcSidebarService);
  notificationService = inject(NotificationService);
  router = inject(Router);
  auth = inject(AuthService);
  profilePhoto: string = '';
  currentPath: string = '';
  isOpenNotification: boolean = false;
  isAnewNotification: boolean = false;
  isShow: boolean = false;

  @ViewChild(NotificationComponent) childComponent!: NotificationComponent;

  constructor() {
    this.currentPath = this.router.url;
    this.profilePhoto = this.auth.currentUser().photoUrl;
    this.newNotificationCheck();
  }

  openNotification(): void {
    this.childComponent.allNotification = [];
    this.childComponent.currentPage = 1;
    this.isShow = false;
    this.isOpenNotification = !this.isOpenNotification;
    if (this.isOpenNotification) {
      this.childComponent.getAllNotifications(
        this.childComponent.currentPage,
        this.childComponent.pageSize,
        this.childComponent.isRead
      );
    }
  }

  newNotificationCheck() {
    this.notificationService.newNotificationCheck().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.isAnewNotification = data;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
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
