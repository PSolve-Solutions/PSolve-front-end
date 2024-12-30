import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-head-of-camp',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './Head-of-camp-slider.component.html',
  styleUrl: './Head-of-camp-slider.component.scss'
})
export class HeadOfCampSlider {

  @ViewChild('sliderHead') sliderHead: ElementRef<HTMLElement> | undefined;

    intervalId: any;

    currentStep:number = 0;

  slides:any = [
    { image: 'assets/img_public/p_solve_home/h1.svg' , text:"TRACKING CAMP STATUS AND PROGRESS, TAKE DECISIONS BASED ON DATA ANALYSIS FOR TRAINING. " },
    { image: 'assets/img_public/p_solve_home/h2.svg' , text:"ASSIGN SUITABLE MENTOR FOR TRAINEE. WHICH INCREASE PERCENTAGE OF TRAINING SUCCESS." },
    { image: 'assets/img_public/p_solve_home/h3.svg' , text:"TRACKING YOUR MENTORS PERFORMANCE TO KEEP YOUR TRAINING EFFECTIVE IN PROGRESS."},
    { image: 'assets/img_public/p_solve_home/h4.svg' , text:"UNQUALIFIED TRAINEES DETECTION, WHICH KEEPS TRAINING STATUS IN IMPROVEMENT AND PREVENT ANY DELAYS OR CONFUSIONS FOR CURRENT TRAINEES." }
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
    if (this.sliderHead) {
      this.sliderHead.nativeElement.style.transform = `translateX(-${index * 100}%)`;
    }
  }

  autoMove():void{
    this.currentStep = (this.currentStep + 1) % this.slides.length;
    if (this.sliderHead) {
      this.sliderHead.nativeElement.style.transform = `translateX(-${this.currentStep * 100}%)`;
    }
  }
  startAutoMove(): void {
    this.intervalId = setInterval(() => {
      this.autoMove();
    }, 5000);
  }


}
