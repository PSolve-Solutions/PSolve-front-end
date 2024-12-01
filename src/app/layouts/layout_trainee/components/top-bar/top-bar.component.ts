import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../authentication/services/auth.service';
import { HomeService } from '../../../../pages/Trainee/Services/home.service';
import { QRCodeModule } from 'angularx-qrcode';
import { ResponsiveService } from '../../../../pages/Trainee/Services/responsive.service';
declare var $: any;


@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule,RouterLink,RouterLinkActive,QRCodeModule],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
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
  navLinks = [
    { label: 'Home', path: '/trainee/home' },
    { label: 'Sheets', path: '/trainee/sheets' },
    { label: 'Contests', path: '/trainee/contests' },
    { label: 'Standing', path: '/trainee/standing' },
  ];

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUser();
     }
  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement: HTMLElement): void {
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside && this.isShow) {
      this.isShow = false;
    }
    if(clickedInside && !$('.dialog-container').hasClass('hidden')){

      this.toggleDialog()
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
  toggleDialog():void{
    this.getQrCode()
    $('.dialog-container').fadeToggle(150)
  }
  getQrCode():void{
    this._homeService.QRCode().subscribe({
      next:({statusCode,data})=>{
        if(statusCode===200){
          this.qrData=data

        }
      }
    })
  }


  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }


}
