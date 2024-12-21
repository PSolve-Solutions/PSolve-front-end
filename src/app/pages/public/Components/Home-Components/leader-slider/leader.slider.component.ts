import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';


@Component({
  selector: 'app-leader-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leader.slider.component.html',
  styleUrls: ['./leader.slider.component.scss']
})
export class LeaderSlider {
  currentStep:number = 0;

  slides:any = [
    { image: 'assets/for_carousel.png' , text:"Create your community camps and keep tracking for them" },
    { image: 'assets/for_carousel.png' , text:"TRACKING CAMPS STATUS" },
    { image: 'assets/for_carousel.png' , text:"FOLLOW COMMUNITY STATUS, ACCEPT CAMPS JOINING REQUESTS BASED ON DIFFERENT USEFUL FILTRATIONS, TRACKING TRAINEES, STAFF AND ARCHIVES."},
    { image: 'assets/for_carousel.png' , text:"ADD NEW MEMBERS TO YOUR COMMUNITY. " }
  ];



  goToStep(index: number): void {

    this.currentStep = index;
    const slider = document.querySelector('#sliderLeader') as HTMLElement;
    if (slider) {
      slider.style.transform = `translateX(-${index * 100}%)`;
    }
  }
}
