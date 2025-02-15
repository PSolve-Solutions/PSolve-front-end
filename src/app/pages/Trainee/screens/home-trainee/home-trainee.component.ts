import { Component, OnInit, inject } from '@angular/core';
import { TraineeCardsComponent } from '../../Components/Home-Components/trainee-cards/trainee-cards.component';
import { TraineeHomeMentorComponent } from '../../Components/Home-Components/trainee-home-mentor/trainee-home-mentor.component';
import { HeadsCarouselComponent } from '../../Components/Home-Components/heads-carousel/heads-carousel.component';
import { HomeTasksToDoComponent } from '../../Components/Home-Components/home-tasks-todo/home-tasks-todo.component';
import { TraineeChartComponent } from '../../Components/Home-Components/trainee-chart/trainee-chart.component';
import { CommonModule } from '@angular/common';
import { HomeTasksInProgressComponent } from '../../Components/Home-Components/home-tasks-in-progress/home-tasks-in-progress.component';
import { HomeTasksDoneComponent } from '../../Components/Home-Components/home-tasks-done/home-tasks-done.component';
import { HomeService } from '../../Services/home.service';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
@Component({
  selector: 'app-home-trainee',
  standalone: true,
  imports: [
    TraineeCardsComponent,
    TraineeHomeMentorComponent,
    HeadsCarouselComponent,
    HomeTasksToDoComponent,
    HomeTasksDoneComponent,
    TraineeChartComponent,
    HomeTasksInProgressComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './home-trainee.component.html',
  styleUrls: ['./home-trainee.component.scss'],
})
export class HomeTraineeComponent implements OnInit {
  homeService = inject(HomeService);
  toastr = inject(ToastrService);
  rate: number = 0;
  enterFeedBack: boolean = false;
  SessionId: number = 0;
  leaveTimer: any;
  isShowErr: boolean = false;
  stars: number[] = [1, 2, 3, 4, 5];
  feedBackForm: FormGroup = new FormGroup({
    feedback: new FormControl('', [Validators.required]),
  });
  currentStep: number = 0;
  slides: any = [
    { image: 'assets/for_carousel.png' },
    { image: 'assets/for_carousel.png' },
    { image: 'assets/for_carousel.png' },
    { image: 'assets/for_carousel.png' },
  ];
  ngOnInit(): void {
    this.canAddFeedBack();
    this.getCards();
  }
  getCards(): void {
    this.homeService.assignTraineeCurrentSheetCard();
    this.homeService.assignTraineeIncomingContestCard();
    this.homeService.assignTraineeNextSessionCard();
  }
  canAddFeedBack(): void {
    this.homeService.TraineeCanAddFeedBack().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.SessionId = data;
          this.calcTime(data);
        }
      },
    });
  }
  addFeedBack(): void {
    if (this.rate === 0) {
      this.isShowErr = true;
      return;
    }
    const model = {
      feedback: this.feedBackForm.value.feedback,
      rate: this.rate,
      sessionId: this.SessionId,
    };
    this.homeService.TraineeFeedBack(model).subscribe({
      next: ({ statusCode, message }) => {
        if (statusCode === 200) {
          this.hideFeedBack();
          this.toastr.success(message);
        } else {
          this.toastr.error(message);
        }
      },
    });
  }
  calcTime(data: any): void {
    if (typeof data == 'number') {
      const timeId = setInterval(() => {
        if (!this.homeService.isLoading) {
          this.showFeedBack();
          this.onEnterFeedBack(false);
          clearInterval(timeId);
        }
      }, 500);
    }
  }
  showFeedBack(): void {
    $('.feed-back').removeClass('hidden').animate({ top: '75%' });
  }
  hideFeedBack(): void {
    $('.feed-back').animate(
      { top: '150%' },
      { complete: () => $('.feed-back').addClass('hidden') }
    );
  }
  onEnterFeedBack(bool: boolean): void {
    if (!bool) {
      this.leaveTimer = setTimeout(() => {
        this.hideFeedBack();
        clearTimeout(this.leaveTimer);
      }, 4000);
    } else {
      clearTimeout(this.leaveTimer);
    }
  }
  onLeave(): void {
    this.enterFeedBack = true;
    if (
      this.feedBackForm.get('feedback')?.value == '' &&
      !this.feedBackForm.get('feedback')?.touched
    ) {
      this.onEnterFeedBack(false);
    }
  }
  getRating(rate: number): void {
    for (let i = 0; i < rate; i++) {
      $(`#${i}`).removeClass('text-black').removeClass('text-opacity-25');
      $(`#${i}`).addClass('text-[#E69C24]');
    }
    for (let i = rate; i <= 5; i++) {
      $(`#${i}`).addClass('text-black').addClass('text-opacity-25');
      $(`#${i}`).removeClass('text-[#E69C24]');
    }
    this.rate = rate;
  }
  goToStep(index: number): void {
    this.currentStep = index;
    const slider = document.querySelector('.slider') as HTMLElement;
    if (slider) {
      slider.style.transform = `translateX(-${index * 100}%)`;
    }
  }
}
