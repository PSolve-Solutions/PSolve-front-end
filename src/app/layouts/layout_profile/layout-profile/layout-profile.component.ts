import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SecondNavbarComponent } from '../../layout_leader/components/second-navbar/second-navbar.component';
import { SidebarProfileComponent } from '../components/sidebar-profile/sidebar-profile.component';
import { TopBarComponent } from '../../layout_trainee/components/top-bar/top-bar.component';
import { MentornavComponent } from '../../mentor/mentornav/mentornav.component';

@Component({
  selector: 'app-layout-profile',
  standalone: true,
  imports: [
    RouterOutlet,
    SecondNavbarComponent,
    TopBarComponent,
    MentornavComponent,
    SidebarProfileComponent,
  ],
  templateUrl: './layout-profile.component.html',
  styleUrl: './layout-profile.component.scss',
})
export class LayoutProfileComponent implements OnInit {
  router = inject(Router);
  currentPath: string = '';
  ngOnInit() {
    this.currentPath = this.router.url;
  }
}
