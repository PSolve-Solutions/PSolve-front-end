import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from '../../../../authentication/services/auth.service';
import { OcSidebarService } from '../../../../shared/services/oc-sidebar.service';

@Component({
  selector: 'app-main-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './main-sidebar.component.html',
  styleUrl: './main-sidebar.component.scss',
})
export class MainSidebarComponent {
  authService = inject(AuthService);
  ocSidebarService = inject(OcSidebarService);
  sanitizer = inject(DomSanitizer);
  router = inject(Router);
  roles: string[] = [];
  currentPath: string = '';

  leaderLinks: { name: string; link: string; icon: SafeHtml }[] = [];
  hocLinks: { name: string; link: string; icon: SafeHtml }[] = [];
  constructor() {
    this.hocLinks = [
      {
        name: 'Dashboard',
        link: '/head_of_camp',
        icon: this.sanitizer.bypassSecurityTrustHtml(`  <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                />`),
      },
      {
        name: 'Assign',
        link: '/head_of_camp/assign',
        icon: this.sanitizer.bypassSecurityTrustHtml(
          `     <svg
                class="size-6"
                stroke="currentColor"
                viewBox="0 0 24 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.15467 24.1599C1.55733 24.1599 1.04889 23.9487 0.629333 23.5263C0.209778 23.104 0 22.5926 0 21.9922V4.85211C0 4.25258 0.209778 3.7412 0.629333 3.31796C1.04889 2.89561 1.55733 2.68443 2.15467 2.68443H8.42133C8.29955 1.99901 8.46222 1.38024 8.90933 0.828147C9.35555 0.276049 9.94133 0 10.6667 0C11.4089 0 12.0036 0.276049 12.4507 0.828147C12.8978 1.38024 13.052 1.99901 12.9133 2.68443H19.18C19.7756 2.68443 20.2836 2.89561 20.704 3.31796C21.1236 3.74031 21.3333 4.25214 21.3333 4.85345V12.8396C21.0996 12.7582 20.8756 12.692 20.6613 12.641C20.448 12.5909 20.2276 12.5408 20 12.4907V4.85345C20 4.64675 19.9147 4.45705 19.744 4.28435C19.5733 4.11165 19.3849 4.02575 19.1787 4.02665H2.15467C1.94933 4.02665 1.76089 4.11255 1.58933 4.28435C1.41778 4.45615 1.33244 4.64585 1.33333 4.85345V21.9922C1.33333 22.198 1.41867 22.3873 1.58933 22.56C1.76 22.7327 1.948 22.8186 2.15333 22.8177H9.708C9.74 23.0682 9.78133 23.3013 9.832 23.517C9.88266 23.7317 9.948 23.946 10.028 24.1599H2.15467ZM1.33333 21.4754V22.8177V4.02665V12.4907V12.39V21.4754ZM4.66667 19.1534H9.94666C9.99555 18.9234 10.0622 18.7011 10.1467 18.4863L10.4133 17.8099H4.66667V19.1534ZM4.66667 14.0933H13.44C13.8782 13.7837 14.3098 13.5215 14.7347 13.3067C15.1596 13.0911 15.6156 12.922 16.1027 12.7994V12.751H4.66667V14.0933ZM4.66667 9.03311H16.6667V7.69089H4.66667V9.03311ZM10.6667 3.27903C10.9556 3.27903 11.1947 3.18418 11.384 2.99448C11.5733 2.80478 11.6676 2.56408 11.6667 2.27237C11.6658 1.98066 11.5711 1.74041 11.3827 1.5516C11.1942 1.3628 10.9556 1.26705 10.6667 1.26437C10.3778 1.26168 10.1391 1.35698 9.95066 1.55026C9.76222 1.74354 9.66755 1.98379 9.66666 2.27103C9.66578 2.55826 9.76044 2.79897 9.95066 2.99314C10.1409 3.18731 10.3796 3.28351 10.6667 3.27903ZM18.6667 27C17.1813 27 15.9213 26.4788 14.8867 25.4363C13.8511 24.3948 13.3333 23.1264 13.3333 21.6311C13.3333 20.1359 13.8511 18.8671 14.8867 17.8246C15.9222 16.7822 17.1822 16.2614 18.6667 16.2623C20.1511 16.2632 21.4116 16.784 22.448 17.8246C23.4844 18.8653 24.0018 20.1341 24 21.6311C24 23.1255 23.4827 24.3939 22.448 25.4363C21.4116 26.4788 20.1511 27 18.6667 27ZM18.1547 25.5021H19.18V22.1466H22.5133V21.113H19.18V17.7575H18.1533V21.113H14.82V22.1466H18.1533L18.1547 25.5021Z"
                />
              </svg>`
        ),
      },
      {
        name: 'Contests',
        link: '/head_of_camp/contests',
        icon: this.sanitizer.bypassSecurityTrustHtml(
          `  <svg
                class="size-6"
                stroke="currentColor"
                viewBox="0 0 26 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.65309 2.84779C8.67556 2.7296 8.67496 2.60793 8.65131 2.48998C8.62766 2.37204 8.58146 2.26023 8.51542 2.16117C8.44939 2.06212 8.36488 1.97784 8.26691 1.91333C8.16893 1.84883 8.05948 1.8054 7.94504 1.78563C7.8306 1.76587 7.71351 1.77016 7.60069 1.79826C7.48788 1.82636 7.38165 1.87769 7.2883 1.94922C7.19495 2.02074 7.11638 2.111 7.05724 2.21465C6.9981 2.31829 6.9596 2.43321 6.94402 2.55259L3.47736 24.1526C3.45488 24.2708 3.45549 24.3925 3.47913 24.5104C3.50278 24.6283 3.54899 24.7402 3.61502 24.8392C3.68105 24.9383 3.76556 25.0225 3.86354 25.087C3.96152 25.1516 4.07097 25.195 4.18541 25.2147C4.29984 25.2345 4.41694 25.2302 4.52975 25.2021C4.64256 25.174 4.74879 25.1227 4.84214 25.0512C4.93549 24.9796 5.01407 24.8894 5.07321 24.7857C5.13235 24.6821 5.17085 24.5672 5.18642 24.4478L6.34776 17.2118C7.74482 17.4242 9.25456 17.4944 10.4436 18.3602C11.1793 18.9092 12.03 19.2688 12.9258 19.4096C14.6002 19.6724 16.0978 18.7166 17.7514 18.9884L19.9856 19.3376C20.4363 19.4096 20.9043 19.0496 20.9719 18.5816L22.5042 7.90039L22.5111 7.89319C22.5346 7.65806 22.4713 7.42243 22.3339 7.23396C22.1965 7.04549 21.9953 6.91825 21.771 6.87799L19.5367 6.52879C17.8675 6.27139 16.3664 7.20019 14.7128 6.94279C13.9712 6.82583 13.2657 6.53194 12.6519 6.08419C11.371 5.15359 9.84562 4.99879 8.34282 4.77919L8.65309 2.84779ZM7.63042 9.21619L8.20242 5.66659C9.24069 5.81419 10.3396 5.89879 11.3016 6.33079L10.7903 9.86779C9.80229 9.44839 8.68602 9.36739 7.63042 9.21619ZM6.49162 16.3262L7.06362 12.773C8.13829 12.9278 9.27709 13.007 10.2842 13.4354L10.8042 9.87859C11.9447 10.3646 12.8131 11.198 14.0854 11.3924L14.6054 7.82839C15.8846 8.02819 16.9436 7.50979 18.1726 7.40719L17.6526 10.946C16.4219 11.054 15.3576 11.594 14.0819 11.396L13.5862 14.9564C12.3104 14.7584 11.4403 13.9214 10.2946 13.4372L9.77456 16.994C8.74322 16.5638 7.58536 16.4882 6.49162 16.3262ZM13.5879 14.9582C14.8602 15.1562 15.9296 14.6126 17.1603 14.5064L17.6526 10.946C18.7879 10.838 19.9492 11.1458 21.0638 11.3222L20.5784 14.879C19.4622 14.7044 18.2974 14.3948 17.162 14.5064L16.642 18.0632C15.4131 18.1496 14.328 18.7112 13.0679 18.5132L13.5879 14.9582Z"
                />
              </svg>`
        ),
      },
      {
        name: 'Sessions',
        link: '/head_of_camp/sessions',
        icon: this.sanitizer.bypassSecurityTrustHtml(
          ` <svg
                class="size-6"
                stroke="currentColor"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 16.7397V4.6697C22 3.4697 21.02 2.5797 19.83 2.6797H19.77C17.67 2.8597 14.48 3.9297 12.7 5.0497L12.53 5.1597C12.24 5.3397 11.76 5.3397 11.47 5.1597L11.22 5.0097C9.44 3.8997 6.26 2.8397 4.16 2.6697C2.97 2.5697 2 3.4697 2 4.6597V16.7397C2 17.6997 2.78 18.5997 3.74 18.7197L4.03 18.7597C6.2 19.0497 9.55 20.1497 11.47 21.1997L11.51 21.2197C11.78 21.3697 12.21 21.3697 12.47 21.2197C14.39 20.1597 17.75 19.0497 19.93 18.7597L20.26 18.7197C21.22 18.5997 22 17.6997 22 16.7397Z"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 5.49023V20.4902"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7.75 8.49023H5.5"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8.5 11.4902H5.5"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>`
        ),
      },
      {
        name: 'Sheets',
        link: '/head_of_camp/sheets',
        icon: this.sanitizer.bypassSecurityTrustHtml(
          `      <svg
                class="size-6"
                stroke="currentColor"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.0584 19.3896C14.4384 19.8096 13.6584 20.1596 12.7084 20.4696L11.1284 20.9896C7.15839 22.2696 5.06839 21.1996 3.77839 17.2296L2.49839 13.2796C1.21839 9.30961 2.27839 7.20961 6.24839 5.92961L7.82839 5.40961C8.23839 5.27961 8.62839 5.16961 8.99839 5.09961C8.69839 5.70961 8.45839 6.44961 8.25839 7.29961L7.27839 11.4896C6.29839 15.6696 7.58839 17.7296 11.7584 18.7196L13.4384 19.1196C14.0184 19.2596 14.5584 19.3496 15.0584 19.3896Z"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12.6406 8.53027L17.4906 9.76027"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M11.6602 12.4004L14.5602 13.1404"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M20.9602 5.09952C22.0402 6.29952 22.2302 8.01952 21.6602 10.4395L20.6802 14.6195C19.8402 18.2295 18.1802 19.6895 15.0602 19.3895C14.5602 19.3495 14.0202 19.2595 13.4402 19.1195L11.7602 18.7195C7.59018 17.7295 6.30018 15.6695 7.28018 11.4895L8.26018 7.29952C8.46018 6.44952 8.70018 5.70952 9.00018 5.09952C10.1702 2.67952 12.1602 2.02952 15.5002 2.81952L17.1702 3.20952"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>`
        ),
      },
      {
        name: 'Mentors',
        link: '/head_of_camp/mentors-tracking',
        icon: this.sanitizer.bypassSecurityTrustHtml(
          `    <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
<path d="M20.25 3.75H3.75C3.35218 3.75 2.97064 3.90804 2.68934 4.18934C2.40804 4.47064 2.25 4.85218 2.25 5.25V18.75C2.25 19.1478 2.40804 19.5294 2.68934 19.8107C2.97064 20.092 3.35218 20.25 3.75 20.25H5.00531C5.14726 20.25 5.2863 20.2098 5.40628 20.134C5.52627 20.0581 5.62227 19.9498 5.68313 19.8216C6.04783 19.0516 6.62363 18.4009 7.34357 17.9453C8.06351 17.4897 8.898 17.2478 9.75 17.2478C10.602 17.2478 11.4365 17.4897 12.1564 17.9453C12.8764 18.4009 13.4522 19.0516 13.8169 19.8216C13.8777 19.9498 13.9737 20.0581 14.0937 20.134C14.2137 20.2098 14.3527 20.25 14.4947 20.25H20.25C20.6478 20.25 21.0294 20.092 21.3107 19.8107C21.592 19.5294 21.75 19.1478 21.75 18.75V5.25C21.75 4.85218 21.592 4.47064 21.3107 4.18934C21.0294 3.90804 20.6478 3.75 20.25 3.75ZM7.5 13.5C7.5 13.055 7.63196 12.62 7.87919 12.25C8.12643 11.88 8.47783 11.5916 8.88896 11.4213C9.3001 11.251 9.7525 11.2064 10.189 11.2932C10.6254 11.38 11.0263 11.5943 11.341 11.909C11.6557 12.2237 11.87 12.6246 11.9568 13.061C12.0436 13.4975 11.999 13.9499 11.8287 14.361C11.6584 14.7722 11.37 15.1236 11 15.3708C10.63 15.618 10.195 15.75 9.75 15.75C9.15326 15.75 8.58097 15.5129 8.15901 15.091C7.73705 14.669 7.5 14.0967 7.5 13.5ZM20.25 18.75H14.9466C14.3202 17.6732 13.3761 16.8166 12.2438 16.2975C12.8115 15.792 13.2122 15.1258 13.3927 14.3874C13.5732 13.649 13.5251 12.8731 13.2546 12.1627C12.9842 11.4522 12.5042 10.8408 11.8783 10.4093C11.2524 9.97787 10.5102 9.74684 9.75 9.74684C8.98982 9.74684 8.24758 9.97787 7.6217 10.4093C6.99581 10.8408 6.51582 11.4522 6.24536 12.1627C5.9749 12.8731 5.92675 13.649 6.10728 14.3874C6.28782 15.1258 6.68851 15.792 7.25625 16.2975C6.12388 16.8166 5.1798 17.6732 4.55344 18.75H3.75V5.25H20.25V18.75ZM5.25 9V7.5C5.25 7.30109 5.32902 7.11032 5.46967 6.96967C5.61032 6.82902 5.80109 6.75 6 6.75H18C18.1989 6.75 18.3897 6.82902 18.5303 6.96967C18.671 7.11032 18.75 7.30109 18.75 7.5V16.5C18.75 16.6989 18.671 16.8897 18.5303 17.0303C18.3897 17.171 18.1989 17.25 18 17.25H16.5C16.3011 17.25 16.1103 17.171 15.9697 17.0303C15.829 16.8897 15.75 16.6989 15.75 16.5C15.75 16.3011 15.829 16.1103 15.9697 15.9697C16.1103 15.829 16.3011 15.75 16.5 15.75H17.25V8.25H6.75V9C6.75 9.19891 6.67098 9.38968 6.53033 9.53033C6.38968 9.67098 6.19891 9.75 6 9.75C5.80109 9.75 5.61032 9.67098 5.46967 9.53033C5.32902 9.38968 5.25 9.19891 5.25 9Z"/>
</svg>
`
        ),
      },
      {
        name: 'Solve',
        link: '/head_of_camp/trainee-tracking',
        icon: this.sanitizer.bypassSecurityTrustHtml(
          `   <svg width="24" height="24" stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 12C13.1935 12 14.3381 11.5259 15.182 10.682C16.0259 9.83807 16.5 8.69347 16.5 7.5C16.5 6.30653 16.0259 5.16193 15.182 4.31802C14.3381 3.47411 13.1935 3 12 3C10.8065 3 9.66193 3.47411 8.81802 4.31802C7.97411 5.16193 7.5 6.30653 7.5 7.5C7.5 8.69347 7.97411 9.83807 8.81802 10.682C9.66193 11.5259 10.8065 12 12 12ZM15 7.5C15 8.29565 14.6839 9.05871 14.1213 9.62132C13.5587 10.1839 12.7956 10.5 12 10.5C11.2044 10.5 10.4413 10.1839 9.87868 9.62132C9.31607 9.05871 9 8.29565 9 7.5C9 6.70435 9.31607 5.94129 9.87868 5.37868C10.4413 4.81607 11.2044 4.5 12 4.5C12.7956 4.5 13.5587 4.81607 14.1213 5.37868C14.6839 5.94129 15 6.70435 15 7.5ZM21 19.5C21 21 19.5 21 19.5 21H4.5C4.5 21 3 21 3 19.5C3 18 4.5 13.5 12 13.5C19.5 13.5 21 18 21 19.5ZM19.5 19.494C19.4985 19.125 19.269 18.015 18.252 16.998C17.274 16.02 15.4335 15 12 15C8.5665 15 6.726 16.02 5.748 16.998C4.731 18.015 4.503 19.125 4.5 19.494H19.5Z"/>
<rect x="12" y="18" width="9" height="4" />
</svg>
`
        ),
      },
      {
        name: 'Attendance',
        link: '/head_of_camp/attendance',
        icon: this.sanitizer.bypassSecurityTrustHtml(
          `   <svg
                class="size-6"
                stroke="currentColor"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_3043_12628)">
                  <path
                    d="M13.499 14.7823C14.6747 14.0501 15.5799 12.9548 16.0777 11.6622C16.5755 10.3697 16.6388 8.95013 16.258 7.61839C15.8772 6.28666 15.073 5.11518 13.9671 4.2812C12.8612 3.44721 11.5138 2.99609 10.1287 2.99609C8.74355 2.99609 7.39612 3.44721 6.29023 4.2812C5.18433 5.11518 4.38015 6.28666 3.99933 7.61839C3.61852 8.95013 3.6818 10.3697 4.1796 11.6622C4.6774 12.9548 5.58263 14.0501 6.75835 14.7823C4.82241 15.4161 3.08054 16.6002 1.67991 18.267C1.55186 18.4193 1.48956 18.6162 1.5067 18.8145C1.52384 19.0127 1.61903 19.196 1.77132 19.3241C1.92361 19.4521 2.12053 19.5144 2.31877 19.4973C2.517 19.4801 2.7003 19.3849 2.82835 19.2327C4.70991 16.9864 7.30304 15.7498 10.124 15.7498C12.9449 15.7498 15.538 16.9864 17.4243 19.2327C17.5523 19.3849 17.7356 19.4801 17.9339 19.4973C18.1321 19.5144 18.329 19.4521 18.4813 19.3241C18.6336 19.196 18.7288 19.0127 18.7459 18.8145C18.7631 18.6162 18.7008 18.4193 18.5727 18.267C17.1721 16.6002 15.4302 15.4161 13.499 14.7823ZM5.24898 9.37484C5.24898 8.41066 5.53489 7.46813 6.07056 6.66644C6.60623 5.86475 7.3676 5.23991 8.25839 4.87093C9.14918 4.50195 10.1294 4.40541 11.075 4.59351C12.0207 4.78162 12.8893 5.24592 13.5711 5.9277C14.2529 6.60948 14.7172 7.47812 14.9053 8.42378C15.0934 9.36943 14.9969 10.3496 14.6279 11.2404C14.2589 12.1312 13.6341 12.8926 12.8324 13.4283C12.0307 13.9639 11.0882 14.2498 10.124 14.2498C8.8315 14.2484 7.59239 13.7343 6.67847 12.8203C5.76456 11.9064 5.25046 10.6673 5.24898 9.37484ZM23.7796 12.5305L20.7796 15.5305C20.7099 15.6002 20.6272 15.6555 20.5362 15.6933C20.4451 15.731 20.3475 15.7504 20.249 15.7504C20.1504 15.7504 20.0528 15.731 19.9618 15.6933C19.8707 15.6555 19.788 15.6002 19.7183 15.5305L18.2183 14.0305C18.0776 13.8897 17.9986 13.6989 17.9986 13.4998C17.9986 13.3008 18.0776 13.1099 18.2183 12.9692C18.3591 12.8285 18.55 12.7494 18.749 12.7494C18.948 12.7494 19.1389 12.8285 19.2796 12.9692L20.249 13.9395L22.7183 11.4692C22.8591 11.3285 23.05 11.2494 23.249 11.2494C23.448 11.2494 23.6389 11.3285 23.7796 11.4692C23.9203 11.6099 23.9994 11.8008 23.9994 11.9998C23.9994 12.1989 23.9203 12.3897 23.7796 12.5305Z"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_3043_12628">
                    <rect class="size-5" />
                  </clipPath>
                </defs>
              </svg>`
        ),
      },
      {
        name: 'Weekly filter',
        link: '/head_of_camp/Weekly-filter',
        icon: this.sanitizer.bypassSecurityTrustHtml(
          ` <svg
                class="size-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.75 6C2.55109 6 2.36032 6.07902 2.21967 6.21967C2.07902 6.36032 2 6.55109 2 6.75C2 6.94891 2.07902 7.13968 2.21967 7.28033C2.36032 7.42098 2.55109 7.5 2.75 7.5H21.25C21.4489 7.5 21.6397 7.42098 21.7803 7.28033C21.921 7.13968 22 6.94891 22 6.75C22 6.55109 21.921 6.36032 21.7803 6.21967C21.6397 6.07902 21.4489 6 21.25 6H2.75ZM6 11.75C6 11.5511 6.07902 11.3603 6.21967 11.2197C6.36032 11.079 6.55109 11 6.75 11H17.25C17.4489 11 17.6397 11.079 17.7803 11.2197C17.921 11.3603 18 11.5511 18 11.75C18 11.9489 17.921 12.1397 17.7803 12.2803C17.6397 12.421 17.4489 12.5 17.25 12.5H6.75C6.55109 12.5 6.36032 12.421 6.21967 12.2803C6.07902 12.1397 6 11.9489 6 11.75ZM10 16.688C10 16.4891 10.079 16.2983 10.2197 16.1577C10.3603 16.017 10.5511 15.938 10.75 15.938H13.25C13.4489 15.938 13.6397 16.017 13.7803 16.1577C13.921 16.2983 14 16.4891 14 16.688C14 16.8869 13.921 17.0777 13.7803 17.2183C13.6397 17.359 13.4489 17.438 13.25 17.438H10.75C10.5511 17.438 10.3603 17.359 10.2197 17.2183C10.079 17.0777 10 16.8869 10 16.688Z"
                  fill="#777575"
                />
              </svg>`
        ),
      },
    ];
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
    this.roles = this.authService.currentUser().roles;
    this.currentPath = this.router.url;
  }

  show(): void {
    if (this.ocSidebarService.isOpen() === 'show') {
      this.ocSidebarService.openSidebar('semi');
    } else {
      this.ocSidebarService.openSidebar('show');
    }
    console.log(this.ocSidebarService.isOpen());
  }

  hideSidebar(): void {
    this.ocSidebarService.openSidebar('hide');
  }
}