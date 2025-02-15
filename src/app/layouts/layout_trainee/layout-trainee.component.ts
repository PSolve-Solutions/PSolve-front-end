import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { RouterOutlet } from '@angular/router';
import { ResponsiveService } from '../../pages/Trainee/Services/responsive.service';
import { AdsService } from '../../shared/services/ads.service';
@Component({
  selector: 'app-layout-trainee',
  standalone: true,
  imports: [TopBarComponent, RouterOutlet],
  templateUrl: './layout-trainee.component.html',
  styleUrl: './layout-trainee.component.scss',
})
export class LayoutTraineeComponent
  implements OnDestroy, OnInit, AfterViewInit
{
  adsService = inject(AdsService);
  responsive = inject(ResponsiveService);
  ngOnInit(): void {
    this.responsive.start();
  }
  ngOnDestroy(): void {
    this.responsive.destroy();
  }
  ngAfterViewInit() {
    this.adsService.checkAndLoadAds();
  }
}
