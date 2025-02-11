import {
  Component,
  OnInit,
  AfterViewInit,
  inject,
  HostListener,
} from '@angular/core';
import { HomeHeroComponent } from '../../Components/Home-Components/home-hero/home-hero.component';
import { LeaderSlider } from '../../Components/Home-Components/leader-slider/leader.slider.component';
import { HeadOfCampSlider } from '../../Components/Home-Components/Head-of-camp-slider/Head-of-camp-slider.component';
import { MentorsComponent } from '../../Components/Home-Components/Mentors/mentors.slider.component';
import { FoundersComponent } from '../../Components/Home-Components/founder/founders.component';
import { TraineeComponent } from '../../Components/Home-Components/trainee/trainee.slider.component';
import { HomeService } from '../../Services/home.service';
import { CommunitiesComponent } from '../../Components/Home-Components/Communities/Communities.component';
import { AboutusComponent } from '../../Components/Home-Components/aboust-us/aboutus.component';
import { AdsService } from '../../../../shared/services/ads.service';
@Component({
  selector: 'app-home-public',
  standalone: true,
  imports: [
    HomeHeroComponent,
    LeaderSlider,
    HeadOfCampSlider,
    MentorsComponent,
    TraineeComponent,
    FoundersComponent,
    CommunitiesComponent,
    AboutusComponent,
  ],
  templateUrl: './home-public.component.html',
  styleUrls: ['./home-public.component.scss'],
})
export class HomePublicComponent implements OnInit, AfterViewInit {
  homeService = inject(HomeService);
  adsService = inject(AdsService);
  Clintes: { id: string; clientName: string; logoUrl: string }[] = [];
  isVisible: boolean = false;
  ngOnInit(): void {
    this.getAllClintes();
  }
  ngAfterViewInit() {
    this.adsService.loadAds();
  }
  getAllClintes(): void {
    this.homeService.getClintes().subscribe({
      next: ({ statusCode, data }) => {
        this.Clintes = data;
      },
    });
  }

  // Listen to the window scroll event
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isVisible = window.scrollY > 500;
  }

  // Scroll to top logic
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  //       next: ({ statusCode, data }) => {
  //         if (statusCode === 200) {
  //           this.Clintes = data;
  //         } else {
  //           console.log('Error');
  //         }
  //       },
  //       error(err) {
  //         console.log(err);
  //       },
  //     });
  //   }
}
