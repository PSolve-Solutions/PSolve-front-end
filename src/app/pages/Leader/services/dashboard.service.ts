import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ResponseHeader } from '../../../shared/model/responseHeader';
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  http = inject(HttpClient);

  //Dashboard Service
  traineesAnalysis(): Observable<any> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Leader/dashboard/traineesAnalysis`
    );
  }
  dashboardCamps(): Observable<any> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Leader/dashboard/camps`
    );
  }
  dashboardFeedbacks(): Observable<any> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Leader/dashboard/feedbacks`
    );
  }

  roles(): Observable<ResponseHeader> {
    return this.http.get<any>(`${environment.BASE_URL}/api/Roles/roles`);
  }

  getAllCamps(): Observable<ResponseHeader> {
    return this.http.get<any>(
      `${environment.BASE_URL}/api/Leader/camps/getAll`
    );
  }

  createAccount(formData: any): Observable<ResponseHeader> {
    const myHeaders = new HttpHeaders({
      Accept: 'text/plain',
    });
    return this.http.post<any>(
      `${environment.BASE_URL}/api/Leader/createAccount`,
      formData,
      { headers: myHeaders }
    );
  }
}
