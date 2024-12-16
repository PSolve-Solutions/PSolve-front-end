import { NgClass } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../../authentication/services/auth.service';
import { AdminsService } from '../../../../../pages/Admin/services/admins.service';
import { OcSidebarService } from '../../../../../shared/services/oc-sidebar.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
  sanitizer = inject(DomSanitizer);
  isShow: 'hide' | 'semi' | 'show' = 'show';
  roles: string[] = [];

  leaderLinks: { name: string; link: string; icon: SafeHtml }[] = [];
  constructor() {
    this.leaderLinks = [
      {
        name: 'Dashboard',
        link: '/leader',
        icon: this.sanitizer.bypassSecurityTrustHtml(`<svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-7"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
              />
            </svg>`),
      },
      {
        name: 'Camps',
        link: '/leader/camps',
        icon: this.sanitizer.bypassSecurityTrustHtml(
          `  <svg
              class="size-7"
              viewBox="0 0 30 30"
              stroke="currentColor"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.624 17.5C14.374 18.1063 12.499 19.9306 12.499 21.875C12.499 23.8194 18.749 22.7775 18.749 24.7225C18.749 26.6662 11.874 27.5 11.874 27.5M21.249 10C21.874 5 19.4534 2.5 15.0784 2.5C10.7034 2.5 8.12403 5.625 8.74903 10C9.37403 14.375 13.2834 17.5 15.0784 17.5C16.874 17.5 20.624 15 21.249 10Z"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>`
        ),
      },
      {
        name: 'Staff',
        link: '/leader/staff',
        icon: this.sanitizer.bypassSecurityTrustHtml(
          `<svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-7"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
              />
            </svg>`
        ),
      },
      {
        name: 'Trainees',
        link: '/leader/trainees',
        icon: this.sanitizer.bypassSecurityTrustHtml(
          `<svg
              stroke="currentColor"
              class="size-7"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.9981 7.16C17.9381 7.15 17.8681 7.15 17.8081 7.16C16.4281 7.11 15.3281 5.98 15.3281 4.58C15.3281 3.15 16.4781 2 17.9081 2C19.3381 2 20.4881 3.16 20.4881 4.58C20.4781 5.98 19.3781 7.11 17.9981 7.16Z"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M16.9675 14.4402C18.3375 14.6702 19.8475 14.4302 20.9075 13.7202C22.3175 12.7802 22.3175 11.2402 20.9075 10.3002C19.8375 9.59016 18.3075 9.35016 16.9375 9.59016"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.97047 7.16C6.03047 7.15 6.10047 7.15 6.16047 7.16C7.54047 7.11 8.64047 5.98 8.64047 4.58C8.64047 3.15 7.49047 2 6.06047 2C4.63047 2 3.48047 3.16 3.48047 4.58C3.49047 5.98 4.59047 7.11 5.97047 7.16Z"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7.0014 14.4402C5.6314 14.6702 4.12141 14.4302 3.06141 13.7202C1.65141 12.7802 1.65141 11.2402 3.06141 10.3002C4.13141 9.59016 5.6614 9.35016 7.0314 9.59016"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M11.9981 14.6297C11.9381 14.6197 11.8681 14.6197 11.8081 14.6297C10.4281 14.5797 9.32812 13.4497 9.32812 12.0497C9.32812 10.6197 10.4781 9.46973 11.9081 9.46973C13.3381 9.46973 14.4881 10.6297 14.4881 12.0497C14.4781 13.4497 13.3781 14.5897 11.9981 14.6297Z"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M9.08875 17.7794C7.67875 18.7194 7.67875 20.2594 9.08875 21.1994C10.6888 22.2694 13.3087 22.2694 14.9087 21.1994C16.3187 20.2594 16.3187 18.7194 14.9087 17.7794C13.3187 16.7194 10.6888 16.7194 9.08875 17.7794Z"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>`
        ),
      },
      {
        name: 'Requests',
        link: '/leader/requests',
        icon: this.sanitizer.bypassSecurityTrustHtml(
          `<svg
              class="size-7"
              stroke="currentColor"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.4414 19.0503L15.9614 20.5703L19.0014 17.5303"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12.1586 10.87C12.0586 10.86 11.9386 10.86 11.8286 10.87C9.44863 10.79 7.55863 8.84 7.55863 6.44C7.54863 3.99 9.53863 2 11.9886 2C14.4386 2 16.4286 3.99 16.4286 6.44C16.4286 8.84 14.5286 10.79 12.1586 10.87Z"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M11.9891 21.8097C10.1691 21.8097 8.35906 21.3497 6.97906 20.4297C4.55906 18.8097 4.55906 16.1697 6.97906 14.5597C9.72906 12.7197 14.2391 12.7197 16.9891 14.5597"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>`
        ),
      },
      {
        name: 'Reports',
        link: '/leader/reports',
        icon: this.sanitizer.bypassSecurityTrustHtml(
          `  <svg
              class="size-7"
              stroke="currentColor"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 22H22"
                stroke-width="1.5"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M9.75 4V22H14.25V4C14.25 2.9 13.8 2 12.45 2H11.55C10.2 2 9.75 2.9 9.75 4Z"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M3 10V22H7V10C7 8.9 6.6 8 5.4 8H4.6C3.4 8 3 8.9 3 10Z"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M17 15V22H21V15C21 13.9 20.6 13 19.4 13H18.6C17.4 13 17 13.9 17 15Z"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>`
        ),
      },
      {
        name: 'Archive',
        link: '/leader/archive',
        icon: this.sanitizer.bypassSecurityTrustHtml(
          `    <svg
              class="size-7"
              stroke="currentColor"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17 21H7C3 21 2 20 2 16V8C2 4 3 3 7 3H17C21 3 22 4 22 8V16C22 20 21 21 17 21Z"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14 8H19"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M15 12H19"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M17 16H19"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8.50141 11.2899C9.50104 11.2899 10.3114 10.4796 10.3114 9.47992C10.3114 8.48029 9.50104 7.66992 8.50141 7.66992C7.50177 7.66992 6.69141 8.48029 6.69141 9.47992C6.69141 10.4796 7.50177 11.2899 8.50141 11.2899Z"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12 16.3298C11.86 14.8798 10.71 13.7398 9.26 13.6098C8.76 13.5598 8.25 13.5598 7.74 13.6098C6.29 13.7498 5.14 14.8798 5 16.3298"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>`
        ),
      },
      {
        name: 'Community',
        link: '/leader/community',
        icon: this.sanitizer.bypassSecurityTrustHtml(
          `    <svg
              class="size-7"
              stroke="currentColor"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17 21H7C3 21 2 20 2 16V8C2 4 3 3 7 3H17C21 3 22 4 22 8V16C22 20 21 21 17 21Z"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14 8H19"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M15 12H19"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M17 16H19"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8.50141 11.2899C9.50104 11.2899 10.3114 10.4796 10.3114 9.47992C10.3114 8.48029 9.50104 7.66992 8.50141 7.66992C7.50177 7.66992 6.69141 8.48029 6.69141 9.47992C6.69141 10.4796 7.50177 11.2899 8.50141 11.2899Z"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12 16.3298C11.86 14.8798 10.71 13.7398 9.26 13.6098C8.76 13.5598 8.25 13.5598 7.74 13.6098C6.29 13.7498 5.14 14.8798 5 16.3298"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>`
        ),
      },
    ];
    this.isShow = this.ocSidebarService.isOpen();
    this.roles = this.authService.currentUser().roles;
  }

  show(): void {
    if (this.ocSidebarService.isOpen() === 'show') {
      this.ocSidebarService.openSidebar('semi');
      this.isShow = this.ocSidebarService.isOpen();
    } else {
      this.ocSidebarService.openSidebar('show');
      this.isShow = this.ocSidebarService.isOpen();
    }
    console.log(this.isShow, this.ocSidebarService.isOpen());
  }
}
