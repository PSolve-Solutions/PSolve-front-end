import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';


@Component({
  selector: 'app-mentors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mentors.slider.component.html',
  styleUrls: ['./mentors.slider.component.scss']
})
export class MentorsComponent {
 @ViewChild('sliderMentor') sliderMentor: ElementRef<HTMLElement> | undefined;

  intervalId: any;

  currentStep:number = 0;

  slides:any = [
    { image: 'assets/img_public/p_solve_home/m1.svg' , text:"MANAGE YOUR TRAINEES’ TASKS AND KEEP YOU UPDATED FOR EVERY TASK."},
    { image: 'assets/img_public/p_solve_home/m2.svg' , text:"TRACKING YOUR TRAINEES SOLVE FOR TRAINING SHEETS AND CONTESTS." },
    { image: 'assets/img_public/p_solve_home/m3.svg' , text:"SET YOUR PRACTICES TIME TABLE AND ANNOUNCE TRAINEESWITH INCOMING EETING." },
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
    if (this.sliderMentor) {
      this.sliderMentor.nativeElement.style.transform = `translateX(-${index * 100}%)`;
    }
  }

  autoMove():void{
    this.currentStep = (this.currentStep + 1) % this.slides.length;
    if (this.sliderMentor) {
      this.sliderMentor.nativeElement.style.transform = `translateX(-${this.currentStep * 100}%)`;
    }
  }
  startAutoMove(): void {
    this.intervalId = setInterval(() => {
      this.autoMove();
    }, 5000);
  }
}
