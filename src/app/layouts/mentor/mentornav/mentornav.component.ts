import { NgClass } from '@angular/common';
import { NotificationComponent } from '../../../shared/Components/notification/notification.component';
import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../authentication/services/auth.service';
import { NotificationService } from '../../../shared/services/notification.service';
@Component({
  selector: 'app-mentornav',
  standalone: true,
  imports: [NgClass, RouterLink, RouterLinkActive, NotificationComponent],
  templateUrl: './mentornav.component.html',
  styleUrl: './mentornav.component.scss',
})
export class MentornavComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  isShow: boolean = false;
  currentUser: any;
  notificationService = inject(NotificationService);
  constructor(private elementRef: ElementRef) {}
  ngOnInit() {
    this.currentUser = this.authService.currentUser();
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
  isOpenNotification: boolean = false;
  isAnewNotification: boolean = false;
  @ViewChild(NotificationComponent) childComponent!: NotificationComponent;
  showRoles() {
    this.isShow = !this.isShow;
    this.isOpenNotification = false;
  }
  show(id: string) {
    document.getElementById(id)?.classList.toggle('hidden');
  }
  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement: HTMLElement): void {
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside && (this.isShow || this.isOpenNotification)) {
      this.isShow = false;
      this.isOpenNotification = false;
    }
  }
  // @HostListener('document:click', ['$event'])
  // onClickOutside(event: MouseEvent): void {
  //   const target = event.target as HTMLElement;
  //   // Check if the click was outside the dropdown and the related button
  //   if (!target.closest('.trag')) {
  //     document.getElementById('nav')?.classList.add('hidden');
  //   }
  //   if (!target.closest('.drop')) {
  //     this.isShow = false;
  //   }
  // }
  goSpecificRole(role: string): void {
    this.router.navigate(['/', role.toLowerCase()]);
  }
  goToProfile(): void {
    this.router.navigate(['/profile/mentor']);
  }
}
