import { Component, inject, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../authentication/services/auth.service';
import { OcSidebarService } from '../../../../shared/services/oc-sidebar.service';
import { NotificationComponent } from '../../../../shared/Components/notification/notification.component';
import { NotificationService } from '../../../../shared/services/notification.service';
import { NgClass } from '@angular/common';
@Component({
  selector: 'app-main-mobile-nav',
  standalone: true,
  imports: [RouterLink, NotificationComponent, NgClass],
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
  isShowR: boolean = false;
  roles: string[] = [];
  @ViewChild(NotificationComponent) childComponent!: NotificationComponent;
  constructor() {
    this.currentPath = this.router.url;
    this.profilePhoto = this.auth.currentUser().photoUrl;
    const storedData = JSON.parse(localStorage.getItem('CURRENT_USER') || '{}');
    const customOrder = ['Leader', 'Head_Of_Camp', 'Mentor', 'Trainee'];
    this.roles =
      storedData.roles.sort(
        (a: any, b: any) => customOrder.indexOf(a) - customOrder.indexOf(b)
      ) || [];
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
  goSpecificRole(role: string): void {
    this.router.navigate(['/', role.toLowerCase()]);
    this.isShowR = false;
  }
  showRoles(): void {
    this.isShowR = !this.isShowR;
  }
}
