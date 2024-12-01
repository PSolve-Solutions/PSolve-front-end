import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContestService {
  _HttpClient = inject(HttpClient);
  inComingContest: BehaviorSubject<any> = new BehaviorSubject('');
  nextContest: BehaviorSubject<any> = new BehaviorSubject('');
  oldContest: BehaviorSubject<any> = new BehaviorSubject('');
  isLoading: boolean = true;
  constructor() {}

  assignContests(): void {
    this.isLoading = true;
    this.getAllTraineeContest().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.isLoading = false;
          this.inComingContest.next(data.inComingContests);
          this.nextContest.next(data.nextContest);
          this.oldContest.next(data.oldContests);
        }
      },
    });
  }
  getAllTraineeContest(): Observable<any> {
    return this._HttpClient.get(environment.BASE_URL + `/api/Trainee/contests`);
  }
}
