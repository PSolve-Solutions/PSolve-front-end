import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-head-of-camp',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './Head-of-camp-slider.component.html',
  styleUrl: './Head-of-camp-slider.component.scss'
})
export class HeadOfCampSlider {

  currentStep:number = 0;

  slides:any = [
    { image: 'assets/img_public/p_solve_home/h1.svg' , text:"TRACKING CAMP STATUS AND PROGRESS, TAKE DECISIONS BASED ON DATA ANALYSIS FOR TRAINING. " },
    { image: 'assets/img_public/p_solve_home/h2.svg' , text:"ASSIGN SUITABLE MENTOR FOR TRAINEE. WHICH INCREASE PERCENTAGE OF TRAINING SUCCESS." },
    { image: 'assets/img_public/p_solve_home/h3.svg' , text:"TRACKING YOUR MENTORS PERFORMANCE TO KEEP YOUR TRAINING EFFECTIVE IN PROGRESS."},
    { image: 'assets/img_public/p_solve_home/h4.svg' , text:"UNQUALIFIED TRAINEES DETECTION, WHICH KEEPS TRAINING STATUS IN IMPROVEMENT AND PREVENT ANY DELAYS OR CONFUSIONS FOR CURRENT TRAINEES." }
  ];

  goToStep(index: number): void {
    this.currentStep = index;
    const slider = document.querySelector('#sliderHead') as HTMLElement;
    if (slider) {
      slider.style.transform = `translateX(-${index * 100}%)`;
    }
  }


}
