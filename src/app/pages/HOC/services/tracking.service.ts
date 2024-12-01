import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CasheService } from '../../../shared/services/cashe.service';
import { ResponseHeader } from '../../../shared/model/responseHeader';
@Injectable({
  providedIn: 'root',
})
export class TrackingService {
  http = inject(HttpClient);
  casheService = inject(CasheService);

  trackingWithPaingation(
    currentPage: number,
    pageSize: number
  ): Observable<any> {
    const params = new HttpParams()
      .set('PageNumber', currentPage)
      .set('PageSize', pageSize);
    return this.casheService.get<any>(
      `${environment.BASE_URL}/api/Head/mentors/trackingWithPaingation`,
      params
    );
  }

  getTasksByTaskStatus(
    mentorId: string,
    taskStatus: number
  ): Observable<ResponseHeader> {
    const params = new HttpParams()
      .set('MentorId', mentorId)
      .set('TaskStatus', taskStatus);
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Head/mentors/getTasksByTaskStatus`,
      { params }
    );
  }

  trackingTraineesSheets(
    currentPage: number,
    pageSize: number
  ): Observable<any> {
    const params = new HttpParams()
      .set('PageNumber', currentPage)
      .set('PageSize', pageSize);
    return this.http.get<any>(
      `${environment.BASE_URL}/api/Head/trackingTrainees/sheets`,
      { params }
    );
  }

  trackingTraineesContests(
    currentPage: number,
    pageSize: number
  ): Observable<any> {
    const params = new HttpParams()
      .set('PageNumber', currentPage)
      .set('PageSize', pageSize);
    return this.http.get<any>(
      `${environment.BASE_URL}/api/Head/trackingTrainees/contests`,
      { params }
    );
  }

  sheetNames(): Observable<ResponseHeader> {
    return this.casheService.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Head/sheets/names`
    );
  }
  contestsNames(): Observable<ResponseHeader> {
    return this.casheService.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Head/contests/names
`
    );
  }
}
