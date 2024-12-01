
import { NgClass } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../authentication/services/auth.service';
@Component({
  selector: 'app-hoc-side-bar',
  standalone: true,
  imports: [[NgClass, RouterLink, RouterLinkActive]],
  templateUrl: './hoc-side-bar.component.html',
  styleUrl: './hoc-side-bar.component.scss'
})
export class HocSideBarComponent {
  authService = inject(AuthService);
  currentUser: any;
  role: any;

  isShow: boolean = false;
  // menu_show: boolean = true;

  show_menu(): void {
    this.isShow = !this.isShow;
  }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser();
    // this.role = this.authService.currentUser().roleDto.roleName;
  }
}
