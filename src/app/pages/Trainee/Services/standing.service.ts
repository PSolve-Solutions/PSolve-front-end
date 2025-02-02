import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class StandingService {
  _HttpClient = inject(HttpClient);
  constructor() {}
  getStanding(): Observable<any> {
    return this._HttpClient.get(environment.BASE_URL + `/api/Trainee/standing`);
  }
}
