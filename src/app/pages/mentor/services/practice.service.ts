import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseHeader } from '../../../shared/model/responseHeader';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class PracticeService {
  constructor(private http: HttpClient) {}
  getData(id: any): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Mentor/practices/${id}`
    );
  }
  addPractice(data: any): Observable<any> {
    return this.http.post<any>(
      `${environment.BASE_URL}/api/Mentor/practices`,
      data
    );
  }
  upd(item: any): Observable<any> {
    return this.http.put<any>(`${environment.BASE_URL}/api/Mentor/practices`, {
      practiceId: item.practiceId,
      title: item.title,
      meetingLink: item.meetingLink,
      note: item.note,
      time: item.time,
      state: item.state,
    });
  }
  updstat(item: any): Observable<any> {
    console.log(item);
    return this.http.put<any>(
      `${environment.BASE_URL}/api/Mentor/updatePracticeStatus`,
      {
        practiceId: item.practiceId,
        status: item.status,
      }
    );
  }
  del(data: any): Observable<any> {
    return this.http.delete<any>(
      `${environment.BASE_URL}/api/Mentor/practices`,
      {
        body: {
          practiceId: data,
        },
      }
    );
  }
}
