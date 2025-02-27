import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarProfileComponent } from '../components/sidebar-profile/sidebar-profile.component';
import { TopBarComponent } from '../../layout_trainee/components/top-bar/top-bar.component';
import { MentornavComponent } from '../../mentor/mentornav/mentornav.component';
import { MainNavbarComponent } from '../../main-layout/Components/main-navbar/main-navbar.component';
import { AdsService } from '../../../shared/services/ads.service';
@Component({
  selector: 'app-layout-profile',
  standalone: true,
  imports: [
    RouterOutlet,
    MainNavbarComponent,
    TopBarComponent,
    MentornavComponent,
    SidebarProfileComponent,
  ],
  templateUrl: './layout-profile.component.html',
  styleUrl: './layout-profile.component.scss',
})
export class LayoutProfileComponent implements OnInit, AfterViewInit {
  adsService = inject(AdsService);
  router = inject(Router);
  currentPath: string = '';
  ngOnInit() {
    this.currentPath = this.router.url;
  }
  ngAfterViewInit() {
    this.adsService.checkAndLoadAds();
  }
}
