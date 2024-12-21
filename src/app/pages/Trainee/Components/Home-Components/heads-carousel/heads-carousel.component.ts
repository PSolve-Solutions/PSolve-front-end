import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import SwiperCore, { SwiperOptions } from 'swiper';
import Swiper, { Navigation } from 'swiper';
import { SwiperModule } from 'swiper/angular';
import { HomeService } from '../../../Services/home.service';
import { Mentor } from '../../../model/trinee-home';
import { ResponsiveService } from '../../../Services/responsive.service';

// Import and use Swiper modules
Swiper.use([Navigation]);

@Component({
  selector: 'app-heads-carousel',
  standalone: true,
  imports: [CommonModule, SwiperModule],
  templateUrl: './heads-carousel.component.html',
  styleUrls: ['./heads-carousel.component.scss']
})
export class HeadsCarouselComponent implements OnInit {
  @ViewChild('swiperRef', { static: false }) swiperRef!: HeadsCarouselComponent;

  // Dependency injection for HomeService
  private _homeService = inject(HomeService);
  public _responsive = inject(ResponsiveService);


  // Array to hold Mentor data
  mentors: Mentor[] = [];

  // Lifecycle hook to initialize component
  ngOnInit(): void {
    this.loadHeadsData();
  }




  // Method to load mentor data from service
  loadHeadsData(): void {
    this._homeService.HeadsInfo().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.mentors = data; // Set mentors data on successful response
        }
      }
    });
  }

  // Swiper configuration options
  config1: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 50,
    navigation: false,
    pagination: { clickable: false },
    scrollbar: false,
    autoplay: false,
  };
  // Swiper configuration options for more then 1
  config2: SwiperOptions = {
    slidesPerView: 3,
    spaceBetween: 50,
    navigation: false,
    pagination: { clickable: false },
    scrollbar: false,
    autoplay: false,
  };


  // Reference to Swiper instance
  private swiper?: SwiperCore;

  // Method to handle Swiper instance
  onSwiper(swiper: SwiperCore) {
    this.swiper = swiper;
  }

  // Method to move to the next slide
  nextSlide() {
    if (this.swiper) {
      this.swiper.slideNext(); // Move to the next slide
    }
  }

  // Method to move to the previous slide
  prevSlide() {
    if (this.swiper) {
      this.swiper.slidePrev(); // Move to the previous slide
    }
  }
}
