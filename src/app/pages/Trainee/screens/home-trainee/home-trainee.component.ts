import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
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
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './home-trainee.component.html',
  styleUrls: ['./home-trainee.component.scss'],
})
export class HomeTraineeComponent implements OnInit {
  public homeService = inject(HomeService);
  rate: number = 0;
  enterFeedBack: boolean = false;
  SessionId: number = 0;
  private leaveTimer: any;
  stars: number[] = [1, 2, 3, 4, 5];
  feedBackForm: FormGroup = new FormGroup({
    feedback: new FormControl('', [Validators.required]),
  });

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
    if (this.feedBackForm.value) {
      const model = {
        feedback: this.feedBackForm.value.feedback,
        rate: this.rate,
        sessionId: this.SessionId,
      };
      this.homeService.TraineeFeedBack(model).subscribe({
        next: ({ statusCode, data }) => {},
      });
    }
    this.hideFeedBack();
  }

  calcTime(flag: any): void {
    if (flag != null) {
      const timeId = setInterval(() => {
        if (!this.homeService.isLoading) {
          this.showFeedBack();
          this.noEnterFeedBack();
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

  noEnterFeedBack(): void {
    const timeId = setInterval(() => {
      if (!this.enterFeedBack) {
        this.hideFeedBack();
        clearInterval(timeId);
      }
    }, 4000);
  }
  enterMouseFeedBack(): void {
    this.enterFeedBack = true;
  }
  // onLeave(): void {
  //   clearTimeout(this.leaveTimer);
  //   if(this.feedBackForm.get('feedback')?.value == '' && this.enterFeedBack == false){
  //     this.leaveTimer = setTimeout(() => {
  //       this.hideFeedBack()
  //       console.log('onLeave');

  //      }, 4000);
  //   }
  // }
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
}
