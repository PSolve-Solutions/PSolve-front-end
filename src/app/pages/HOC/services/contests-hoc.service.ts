import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CasheService } from '../../../shared/services/cashe.service';
import { ResponseHeader } from '../../../shared/model/responseHeader';
@Injectable({
  providedIn: 'root',
})
export class ContestsHocService {
  http = inject(HttpClient);
  casheService = inject(CasheService);
  getAllContests(
    currentPage: number,
    pageSize: number,
    KeyWord?: string
  ): Observable<any> {
    const params = new HttpParams()
      .set('PageNumber', currentPage)
      .set('PageSize', pageSize)
      .set('KeyWord', KeyWord ? KeyWord : '');
    return this.casheService.get<any>(
      `${environment.BASE_URL}/api/Head/contests`,
      params
    );
  }

  deleteContest(id: number): Observable<ResponseHeader> {
    return this.http.delete<any>(`${environment.BASE_URL}/api/Head/contests`, {
      body: id,
    });
  }

  getOneContest(id: number): Observable<ResponseHeader> {
    return this.http.get<any>(
      `${environment.BASE_URL}/api/Head/contests/${id}`
    );
  }

  createContest(formData: any): Observable<ResponseHeader> {
    const myHeaders = new HttpHeaders({
      Accept: 'text/plain',
    });
    return this.http.post<any>(
      `${environment.BASE_URL}/api/Head/contests`,
      formData,
      { headers: myHeaders }
    );
  }

  updateContest(info: any): Observable<ResponseHeader> {
    return this.http.put<any>(
      `${environment.BASE_URL}/api/Head/contests`,
      info
    );
  }
}
