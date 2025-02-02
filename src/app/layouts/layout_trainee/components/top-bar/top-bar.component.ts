import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  inject,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../authentication/services/auth.service';
import { HomeService } from '../../../../pages/Trainee/Services/home.service';
import { QRCodeModule } from 'angularx-qrcode';
import { ResponsiveService } from '../../../../pages/Trainee/Services/responsive.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { NotificationComponent } from '../../../../shared/Components/notification/notification.component';
declare var $: any;
@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    QRCodeModule,
    NotificationComponent,
  ],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
})
export class TopBarComponent {
  authService = inject(AuthService);
  responsive = inject(ResponsiveService);
  _homeService = inject(HomeService);
  router = inject(Router);
  isShow: boolean = false;
  navShow: boolean = false;
  currentUser: any;
  qrData: string = '';
  isOpen = false;
  isMenuOpen = false;
  notificationService = inject(NotificationService);
  ElementRef = inject(ElementRef);
  cdr = inject(ChangeDetectorRef);
  roles: string[] = [];
  profilePhoto: string = '';
  currentPath: string = '';
  isOpenNotification: boolean = false;
  isAnewNotification: boolean = false;
  navLinks = [
    { label: 'Home', path: '/trainee/home' },
    { label: 'Sheets', path: '/trainee/sheets' },
    { label: 'Contests', path: '/trainee/contests' },
    { label: 'Standing', path: '/trainee/standing' },
  ];
  @ViewChild(NotificationComponent) childComponent!: NotificationComponent;
  constructor(private elementRef: ElementRef) {}
  ngOnInit() {
    this.currentUser = this.authService.currentUser();
    this.profilePhoto = this.authService.currentUser().photoUrl;
    this.currentPath = this.router.url;
    this.loadRoles();
    this.detectLocalStorageChange();
    this.newNotificationCheck();
  }
  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement: HTMLElement): void {
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside && this.isShow) {
      this.isShow = false;
    }
    if (clickedInside && !$('.dialog-container').hasClass('hidden')) {
      this.toggleDialog();
    }
  }
  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }
  showRoles() {
    this.isShow = !this.isShow;
  }
  toggleNav() {
    this.navShow = !this.navShow;
  }
  goSpecificRole(role: string): void {
    this.router.navigate(['/', role.toLowerCase()]);
  }
  toggleDialog(): void {
    this.getQrCode();
    $('.dialog-container').fadeToggle(150);
  }
  getQrCode(): void {
    this._homeService.QRCode().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.qrData = data;
        }
      },
    });
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
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
}
