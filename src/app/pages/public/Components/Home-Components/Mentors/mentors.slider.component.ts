import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';


@Component({
  selector: 'app-mentors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mentors.slider.component.html',
  styleUrls: ['./mentors.slider.component.scss']
})
export class MentorsComponent {
  currentStep:number = 0;

  slides:any = [
    { image: 'assets/for_carousel.png' , text:"MANAGE YOUR TRAINEES’ TASKS AND KEEP YOU UPDATED FOR EVERY TASK."},
    { image: 'assets/for_carousel.png' , text:"TRACKING YOUR TRAINEES SOLVE FOR TRAINING SHEETS AND CONTESTS." },
    { image: 'assets/for_carousel.png' , text:"SET YOUR PRACTICES TIME TABLE AND ANNOUNCE TRAINEESWITH INCOMING EETING." },
  ];


  goToStep(index: number): void {

    this.currentStep = index;
    const slider = document.querySelector('#sliderMentor') as HTMLElement;
    if (slider) {
      slider.style.transform = `translateX(-${index * 100}%)`;

    }
  }
}