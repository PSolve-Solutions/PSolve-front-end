import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import SwiperCore, { Pagination, SwiperOptions } from 'swiper';
import { SwiperModule } from 'swiper/angular';
SwiperCore.use([Pagination]);

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [SwiperModule,CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent {
  // Swiper configuration options
  config1: SwiperOptions = {
    slidesPerView: 1, // Number of slides visible at a time
    navigation: false, // Disable built-in navigation
    pagination: { clickable: true }, // Disable clickable pagination
    scrollbar: false, // Disable scrollbar
    autoplay: false, // Disable autoplay
  };

}
