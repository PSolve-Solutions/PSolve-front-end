import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CasheService } from '../../../shared/services/cashe.service';
import { ResponseHeader } from '../../../shared/model/responseHeader';
@Injectable({
  providedIn: 'root',
})
export class RequestsLeaderService {
  http = inject(HttpClient);
  casheService = inject(CasheService);

  // get date
  traineesRegisterations(
    pageNumber: number,
    pageSize: number,
    campId: number,
    sortBy?: number,
    applySystemFilter?: boolean,
    codeforcesFilters?: any,
    vjudgeFilters?: any
  ): Observable<any> {
    const settingsRequest = {
      pageNumber,
      pageSize,
      campId,
      sortBy,
      applySystemFilter,
      vjudgeFilters,
      codeforcesFilters,
    };

    return this.http.post<any>(
      `${environment.BASE_URL}/api/Leader/traineesRegisterations`,
      settingsRequest
    );
  }

  openedCampsRegister(): Observable<ResponseHeader> {
    return this.http.get<any>(
      `${environment.BASE_URL}/api/Leader/openedCampsRegister`
    );
  }

  // delete
  deleteRequests(ids: any): Observable<ResponseHeader> {
    return this.http.delete<any>(
      `${environment.BASE_URL}/api/Leader/traineeRegisteration`,
      {
        body: ids,
      }
    );
  }

  // Submit
  traineeRequestsSubmit(info: any): Observable<ResponseHeader> {
    return this.http.post<any>(
      `${environment.BASE_URL}/api/Leader/traineeregisteration`,
      info
    );
  }

  getCommunities(): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Leader/getPublicCommunities`
    );
  }
}
