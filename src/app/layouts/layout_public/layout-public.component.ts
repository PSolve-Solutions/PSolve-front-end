import { AfterViewInit, Component, inject } from '@angular/core';
import { TopBarComponent } from '../layout_public/components/top-bar/top-bar.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { AdsService } from '../../shared/services/ads.service';
@Component({
  selector: 'app-layout-public',
  standalone: true,
  imports: [TopBarComponent, RouterOutlet, FooterComponent],
  templateUrl: './layout-public.component.html',
  styleUrl: './layout-public.component.scss',
})
export class LayoutPublicComponent implements AfterViewInit {
  adsService = inject(AdsService);
  ngAfterViewInit() {
    this.adsService.checkAndLoadAds();
  }
}
