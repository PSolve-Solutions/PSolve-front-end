import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import SwiperCore, { SwiperOptions } from 'swiper';
import Swiper, { Navigation } from 'swiper';
import { SwiperModule } from 'swiper/angular';
import { ContestService } from '../../../Services/contest.service';
import { FormatDatePipe } from '../../../Pipes/formatte-Date.pipe';
import { OldContest } from '../../../model/trinee-contest';
// Configure Swiper to use the Navigation module
Swiper.use([Navigation]);
@Component({
  selector: 'app-ended-carousel',
  standalone: true,
  imports: [CommonModule, SwiperModule, FormatDatePipe, NgOptimizedImage],
  templateUrl: './ended-carousel.component.html',
  styleUrls: ['./ended-carousel.component.scss'],
})
export class EndedCarouselComponent implements OnInit {
  // Reference to the Swiper instance
  @ViewChild('swiperRef', { static: false }) swiperRef!: any;
  // Array to hold old contests
  oldContests: OldContest[] = [];
  // Swiper instance
  private swiper?: SwiperCore;
  // Inject the ContestService for fetching contest data
  constructor(private contestService: ContestService) {}
  // Lifecycle hook to load contest data when component initializes
  ngOnInit(): void {
    this.loadContestData();
  }
  // Method to load old contest data from the service
  private loadContestData(): void {
    this.contestService.oldContest.subscribe({
      next: (response) => {
        this.oldContests = response;
      },
    });
  }
  // Swiper configuration options
  config1: SwiperOptions = {
    slidesPerView: 4,
    spaceBetween: 40,
    navigation: false,
    pagination: { clickable: false },
    scrollbar: false,
    autoplay: false,
  };
  // Method to set the Swiper instance
  onSwiper(swiper: SwiperCore) {
    this.swiper = swiper;
  }
  // Method to navigate to the next slide
  nextSlide() {
    this.swiper?.slideNext();
  }
  // Method to navigate to the previous slide
  prevSlide() {
    this.swiper?.slidePrev();
  }
  openLink(url: string): void {
    window.open(url, '_blank');
  }
}
