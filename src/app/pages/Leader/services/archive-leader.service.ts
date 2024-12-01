import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CasheService } from '../../../shared/services/cashe.service';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { ResponseHeader } from '../../../shared/model/responseHeader';

@Injectable({
  providedIn: 'root',
})
export class ArchiveLeaderService {
  http = inject(HttpClient);
  casheService = inject(CasheService);

  traineesArchiveWithPagination(
    currentPage: number,
    pageSize: number,
    KeyWord?: string,
    SortBy?: any
  ): Observable<any> {
    let params;
    if (SortBy !== 0 && SortBy !== 1 && SortBy !== 2) {
      params = new HttpParams()
        .set('PageNumber', currentPage)
        .set('PageSize', pageSize)
        .set('KeyWord', KeyWord ? KeyWord : '');
    } else {
      params = new HttpParams()
        .set('PageNumber', currentPage)
        .set('PageSize', pageSize)
        .set('KeyWord', KeyWord ? KeyWord : '')
        .set('SortBy', SortBy);
    }

    return this.casheService.get<any>(
      `${environment.BASE_URL}/api/Leader/traineesArchiveWithPagination`,
      params
    );
  }

  getTraineeArchiveById(id: number): Observable<ResponseHeader> {
    return this.http.get<any>(
      `${environment.BASE_URL}/api/Leader/traineeArchive/${id}`
    );
  }

  staffArchiveWithPagination(
    currentPage: number,
    pageSize: number,
    KeyWord?: string,
    SortBy?: any
  ): Observable<any> {
    let params;
    if (SortBy !== 0 && SortBy !== 1 && SortBy !== 2) {
      params = new HttpParams()
        .set('PageNumber', currentPage)
        .set('PageSize', pageSize)
        .set('KeyWord', KeyWord ? KeyWord : '');
    } else {
      params = new HttpParams()
        .set('PageNumber', currentPage)
        .set('PageSize', pageSize)
        .set('KeyWord', KeyWord ? KeyWord : '')
        .set('SortBy', SortBy);
    }

    return this.casheService.get<any>(
      `${environment.BASE_URL}/api/Leader/staffArchiveWithPagination`,
      params
    );
  }

  getStaffArchiveById(id: number): Observable<ResponseHeader> {
    return this.http.get<any>(
      `${environment.BASE_URL}/api/Leader/staffArchive/${id}`
    );
  }
}
