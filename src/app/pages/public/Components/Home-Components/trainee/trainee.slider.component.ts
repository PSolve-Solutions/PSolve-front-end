import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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

  currentStep:number = 0;


  slides:any = [
    { image: 'assets/for_carousel.png' , text:"PROVIDE FOR TRAINEE ALL INFORMATION NEEDS TO KEEP HIM/HER UPDATED WITH NEW IN TRAINING."},
    { image: 'assets/for_carousel.png' , text:"PROVIDE QRCODE FOR EVERY TRAINEE TO FACILITATE TAKING ATTENDANCE PROCESS." },
    { image: 'assets/for_carousel.png' , text:"PROVIDE ALL MATERIALS NEED TO KEEP TRAINEE MOVING FORWARD IN TRAINING." },
    { image: 'assets/for_carousel.png' , text:"DISPLAY TRAINEE RANKING FOR HELP TRAINEE ANALYSIS HIS/HER STATUS." },
  ];


  goToStep(index: number): void {

    this.currentStep = index;
    const slider = document.querySelector('#sliderTrainee') as HTMLElement;
    if (slider) {
      slider.style.transform = `translateX(-${index * 100}%)`;

    }
  }





}
