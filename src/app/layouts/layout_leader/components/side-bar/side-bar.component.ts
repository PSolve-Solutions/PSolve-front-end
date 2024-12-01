import { NgClass } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../authentication/services/auth.service';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
})
export class SideBarComponent implements OnInit {
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
