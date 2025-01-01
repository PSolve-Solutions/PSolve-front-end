import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { SwiperModule } from 'swiper/angular';
import SwiperCore, { SwiperOptions } from 'swiper';
import { HomeService } from '../../../Services/home.service';
import { FeedBack } from '../../../model/feedback';

@Component({
  selector: 'app-trainee',
  standalone: true,
  imports: [CommonModule,SwiperModule],
  templateUrl: './trainee.slider.component.html',
  styleUrls: ['./trainee.slider.component.scss']
})
export class TraineeComponent {

  @ViewChild('sliderTrainee') sliderTrainee: ElementRef<HTMLElement> | undefined;

  intervalId: any;

  currentStep:number = 0;

  slides:any = [
    { image: 'assets/img_public/p_solve_home/t1.svg' , text:"PROVIDE FOR TRAINEE ALL INFORMATION NEEDS TO KEEP HIM/HER UPDATED WITH NEW IN TRAINING."},
    { image: 'assets/img_public/p_solve_home/t2.svg' , text:"PROVIDE QRCODE FOR EVERY TRAINEE TO FACILITATE TAKING ATTENDANCE PROCESS." },
    { image: 'assets/img_public/p_solve_home/t3.svg' , text:"PROVIDE ALL MATERIALS NEED TO KEEP TRAINEE MOVING FORWARD IN TRAINING." },
    { image: 'assets/img_public/p_solve_home/t4.svg' , text:"DISPLAY TRAINEE RANKING FOR HELP TRAINEE ANALYSIS HIS/HER STATUS." },
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
    if (this.sliderTrainee) {
      this.sliderTrainee.nativeElement.style.transform = `translateX(-${index * 100}%)`;
    }
  }

  autoMove():void{
    this.currentStep = (this.currentStep + 1) % this.slides.length;
    if (this.sliderTrainee) {
      this.sliderTrainee.nativeElement.style.transform = `translateX(-${this.currentStep * 100}%)`;
    }
  }
  startAutoMove(): void {
    this.intervalId = setInterval(() => {
      this.autoMove();
    }, 5000);
  }




}
