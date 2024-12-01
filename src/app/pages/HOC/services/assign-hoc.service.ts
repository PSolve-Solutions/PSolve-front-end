import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ResponseHeader } from '../../../shared/model/responseHeader';

@Injectable({
  providedIn: 'root',
})
export class AssignHocService {
  http = inject(HttpClient);
  // casheService = inject(CasheService);

  getAllAssignTrainees(
    SortBy: any,
    KeyWord?: string
  ): Observable<ResponseHeader> {
    let params;
    if (SortBy !== 0 && SortBy !== 1 && SortBy !== 2) {
      params = new HttpParams().set('KeyWord', KeyWord ? KeyWord : '');
    } else {
      params = new HttpParams()
        .set('SortBy', SortBy)
        .set('KeyWord', KeyWord ? KeyWord : '');
    }
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Head/assign/trainees`,
      { params }
    );
  }

  getAllAssignMentors(): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Head/assign/mentors`
    );
  }
  assignTraniee(data: {
    traineeId: string;
    mentorId: any;
  }): Observable<ResponseHeader> {
    return this.http.put<ResponseHeader>(
      `${environment.BASE_URL}/api/Head/assignTraniee`,
      data,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
  unAssignTrainee(traineeId: string): Observable<ResponseHeader> {
    return this.http.put<ResponseHeader>(
      `${environment.BASE_URL}/api/Head/unAssignTrainee`,
      JSON.stringify(traineeId),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
}
