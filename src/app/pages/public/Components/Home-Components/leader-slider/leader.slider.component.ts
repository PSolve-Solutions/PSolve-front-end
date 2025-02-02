import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
@Component({
  selector: 'app-leader-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leader.slider.component.html',
  styleUrls: ['./leader.slider.component.scss'],
})
export class LeaderSlider {
  @ViewChild('sliderLeader') sliderLeader: ElementRef<HTMLElement> | undefined;
  intervalId: any;
  currentStep: number = 0;
  slides: any = [
    {
      image: 'assets/img_public/p_solve_home/Group (1).svg',
      text: 'Create your community camps and keep tracking for them',
    },
    {
      image: 'assets/img_public/p_solve_home/Group1.svg',
      text: 'TRACKING CAMPS STATUS',
    },
    {
      image: 'assets/img_public/p_solve_home/Group2.svg',
      text: 'FOLLOW COMMUNITY STATUS, ACCEPT CAMPS JOINING REQUESTS BASED ON DIFFERENT USEFUL FILTRATIONS, TRACKING TRAINEES, STAFF AND ARCHIVES.',
    },
    {
      image: 'assets/img_public/p_solve_home/Group3.svg',
      text: 'ADD NEW MEMBERS TO YOUR COMMUNITY. ',
    },
  ];
  ngOnInit(): void {
    this.startAutoMove();
  }
  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  goToStep(index: number): void {
    this.currentStep = index;
    if (this.sliderLeader) {
      this.sliderLeader.nativeElement.style.transform = `translateX(-${
        index * 100
      }%)`;
    }
  }
  autoMove(): void {
    this.currentStep = (this.currentStep + 1) % this.slides.length;
    if (this.sliderLeader) {
      this.sliderLeader.nativeElement.style.transform = `translateX(-${
        this.currentStep * 100
      }%)`;
    }
  }
  startAutoMove(): void {
    this.intervalId = setInterval(() => {
      this.autoMove();
    }, 5000);
  }
}
