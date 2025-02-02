import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CasheService } from '../../../shared/services/cashe.service';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ResponseHeader } from '../../../shared/model/responseHeader';
@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  http = inject(HttpClient);
  casheService = inject(CasheService);
  reportsWithPagination(
    currentPage: number,
    pageSize: number
  ): Observable<any> {
    let params = new HttpParams()
      .set('PageNumber', currentPage)
      .set('PageSize', pageSize);
    return this.casheService.get<any>(
      `${environment.BASE_URL}/api/Leader/camps/reports`,
      params
    );
  }
  reportsInDetails(
    campId: number,
    currentDate: string
  ): Observable<ResponseHeader> {
    const params = new HttpParams()
      .set('CampId', campId)
      .set('CurrentDate', currentDate);
    return this.casheService.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Leader/camps/reportsInDetails`,
      params
    );
  }
}
