import { NgClass } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../authentication/services/auth.service';
import { NotificationComponent } from '../../../../shared/Components/notification/notification.component';
import { NotificationService } from '../../../../shared/services/notification.service';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
@Component({
  selector: 'app-second-navbar',
  standalone: true,
  imports: [NgClass, RouterLink, NotificationComponent],
  templateUrl: './second-navbar.component.html',
  styleUrl: './second-navbar.component.scss',
})
export class SecondNavbarComponent implements OnInit {
  authService = inject(AuthService);
  notificationService = inject(NotificationService);
  elementRef = inject(ElementRef);
  cdr = inject(ChangeDetectorRef);
  router = inject(Router);
  isShow: boolean = false;
  currentUser: any;
  roles: string[] = [];
  profilePhoto: string = '';
  currentPath: string = '';
  isOpenNotification: boolean = false;
  isAnewNotification: boolean = false;

  @ViewChild(NotificationComponent) childComponent!: NotificationComponent;

  ngOnInit() {
    this.currentUser = this.authService.currentUser();
    this.profilePhoto = this.authService.currentUser().photoUrl;
    this.currentPath = this.router.url;
    this.loadRoles();
    this.detectLocalStorageChange();
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

  loadRoles(): void {
    const storedData = JSON.parse(localStorage.getItem('CURRENT_USER') || '{}');
    const customOrder = ['Leader', 'Head_Of_Camp', 'Mentor', 'Trainee'];
    this.roles =
      storedData.roles.sort(
        (a: any, b: any) => customOrder.indexOf(a) - customOrder.indexOf(b)
      ) || [];
    this.profilePhoto = storedData.photoUrl;
    this.cdr.detectChanges();
  }

  detectLocalStorageChange(): void {
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = (key: string, value: string): void => {
      originalSetItem.apply(localStorage, [key, value]);
      if (key === 'CURRENT_USER') {
        this.loadRoles();
      }
    };
  }

  showRoles() {
    this.isShow = !this.isShow;
    this.isOpenNotification = false;
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement: HTMLElement): void {
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside && (this.isShow || this.isOpenNotification)) {
      this.isShow = false;
      this.isOpenNotification = false;
    }
  }

  goSpecificRole(role: string): void {
    this.router.navigate(['/', role.toLowerCase()]);
  }

  isIncludes(route: string): boolean {
    debugger;
    if (this.currentPath.includes(route)) {
      return true;
    } else {
      return false;
    }
  }
}
