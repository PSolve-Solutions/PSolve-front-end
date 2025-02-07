import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { InComingContest } from '../../../model/trinee-contest';
import { CommonModule } from '@angular/common';
import SwiperCore, { SwiperOptions } from 'swiper';
import Swiper, { Navigation } from 'swiper';
import { SwiperModule } from 'swiper/angular';
import { ContestService } from '../../../Services/contest.service';
import { FormatDatePipe } from '../../../Pipes/formatte-Date.pipe';
// Import and use Swiper modules (like Navigation)
Swiper.use([Navigation]);
@Component({
  selector: 'app-contest-carousel',
  standalone: true,
  imports: [CommonModule, SwiperModule, FormatDatePipe], // Include necessary modules and pipes
  templateUrl: './contest-carousel.component.html',
  styleUrls: ['./contest-carousel.component.scss'],
})
export class ContestCarouselComponent implements OnInit {
  @ViewChild('swiperRef', { static: false })
  swiperRef!: ContestCarouselComponent; // ViewChild to reference Swiper component
  // Inject ContestService for fetching contest data
  private contestService = inject(ContestService);
  // Array to hold incoming contests
  inComingContests: InComingContest[] = [];
  // Reference to Swiper instance
  private swiper?: SwiperCore;
  // Lifecycle hook to initialize component
  ngOnInit(): void {
    this.loadContestData(); // Load contest data when component initializes
  }
  // Method to load contest data using the ContestService
  private loadContestData(): void {
    this.contestService.inComingContest.subscribe({
      next: (response) => {
        this.inComingContests = response; // Update the incoming contests array with the response
      },
    });
  }
  // Swiper configuration options
  config1: SwiperOptions = {
    slidesPerView: 4, // Number of slides visible at a time
    spaceBetween: 40, // Space between slides
    navigation: false, // Disable built-in navigation
    pagination: { clickable: false }, // Disable clickable pagination
    scrollbar: false, // Disable scrollbar
    autoplay: false, // Disable autoplay
  };
  // Method to handle Swiper instance when it's ready
  onSwiper(swiper: SwiperCore) {
    this.swiper = swiper;
  }
  // Method to move to the next slide
  nextSlide() {
    if (this.swiper) {
      this.swiper.slideNext();
    }
  }
  // Method to move to the previous slide
  prevSlide() {
    if (this.swiper) {
      this.swiper.slidePrev();
    }
  }
}
