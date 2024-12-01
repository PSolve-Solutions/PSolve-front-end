import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { task } from '../model/trinee-home';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  _HttpClient = inject(HttpClient);
  inProgress: BehaviorSubject<any> = new BehaviorSubject('');
  done: BehaviorSubject<any> = new BehaviorSubject('');
  toDo: BehaviorSubject<any> = new BehaviorSubject('');
  nextSession: BehaviorSubject<any> = new BehaviorSubject('');
  inComingContest: BehaviorSubject<any> = new BehaviorSubject('');
  currentSheet: BehaviorSubject<any> = new BehaviorSubject('');
  isLoading: boolean = true;

  constructor() {}

  TraineeCurrentSheet(): Observable<any> {
    return this._HttpClient.get(
      environment.BASE_URL + `/api/Trainee/currentSheet`
    );
  }
  TraineeSheetProgress(): Observable<any> {
    return this._HttpClient.get(
      environment.BASE_URL + `/api/Trainee/currentSheetProgress`
    );
  }
  TraineeIncomingContest(): Observable<any> {
    return this._HttpClient.get(
      environment.BASE_URL + `/api/Trainee/IncomingContest`
    );
  }
  TraineeNextSession(): Observable<any> {
    return this._HttpClient.get(
      environment.BASE_URL + `/api/Trainee/getNextSession`
    );
  }
  TraineeCanAddFeedBack(): Observable<any> {
    return this._HttpClient.get(
      environment.BASE_URL + `/api/Trainee/canAddFeedback`
    );
  }
  TraineeFeedBack(model: any): Observable<any> {
    return this._HttpClient.post(
      environment.BASE_URL + `/api/Trainee/feedback`,
      model
    );
  }
  MentorInfo(): Observable<any> {
    return this._HttpClient.get(
      environment.BASE_URL + `/api/Trainee/mentorInfo`
    );
  }
  QRCode(): Observable<any> {
    return this._HttpClient.get(environment.BASE_URL + `/api/Trainee/qrCode`);
  }
  nextPractice(): Observable<any> {
    return this._HttpClient.get(
      environment.BASE_URL + `/api/Trainee/getNextPractice`
    );
  }
  HeadsInfo(): Observable<any> {
    return this._HttpClient.get(
      environment.BASE_URL + `/api/Trainee/headsInfo`
    );
  }
  TraineeTasks(): Observable<any> {
    return this._HttpClient.get(environment.BASE_URL + `/api/Trainee/tasks`);
  }
  UpdateTraineeTask(model: any): Observable<any> {
    return this._HttpClient.put(
      environment.BASE_URL + `/api/Trainee/updatetaskStatus`,
      model
    );
  }

  loadTasks(): void {
    this.TraineeTasks().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.toDo.next(this.getTasksByStatus(data, 0));
          this.inProgress.next(this.getTasksByStatus(data, 1));
          this.done.next(this.getTasksByStatus(data, 2));
        }
      },
    });
  }

  assignTraineeNextSessionCard(): void {
    this.TraineeNextSession().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.nextSession.next(data);
          this.isLoading = false;
        }
      },
    });
  }
  assignTraineeIncomingContestCard(): void {
    this.isLoading = true;
    this.TraineeIncomingContest().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.inComingContest.next(data);
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.isLoading = false;
      },
    });
  }
  assignTraineeCurrentSheetCard(): void {
    this.TraineeCurrentSheet().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.currentSheet.next(data);
          this.isLoading = false;
        }
      },
    });
  }
  getTasksByStatus(data: any, status: number): task[] {
    const statusData = data.find(
      (item: { status: number }) => item.status === status
    );
    return statusData ? statusData.task : [];
  }
}
