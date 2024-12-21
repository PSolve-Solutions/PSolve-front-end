import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { SwiperOptions } from 'swiper';


@Component({
  selector: 'app-communities',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './Communities.component.html',
  styleUrls: ['./Communities.component.scss']
})
export class CommunitiesComponent {




  images = [
    'assets/img_public/p_solve_home/Community (1).svg',
    'assets/img_public/p_solve_home/Community (2).svg',
    'assets/img_public/p_solve_home/Community (3).svg',
    'assets/img_public/p_solve_home/Community (4).svg',
    'assets/img_public/p_solve_home/Community (5).svg',
    'assets/img_public/p_solve_home/Community (6).svg'
  ];

  @ViewChild('slider', { static: false }) slider!: ElementRef;

  // ngAfterViewInit(): void {
  //   const sliderElement = this.slider.nativeElement;
  //   const slides = sliderElement.children;

  //   // Duplicate slides to create seamless effect
  //   for (let i = 0; i < slides.length; i++) {
  //     const clone = slides[i].cloneNode(true);
  //     sliderElement.appendChild(clone);
  //   }
  // }

}
