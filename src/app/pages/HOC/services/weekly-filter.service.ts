import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CasheService } from '../../../shared/services/cashe.service';
import { ResponseHeader } from '../../../shared/model/responseHeader';
@Injectable({
  providedIn: 'root',
})
export class WeeklyFilterService {
  http = inject(HttpClient);
  casheService = inject(CasheService);

  getToFilter(): Observable<ResponseHeader> {
    return this.casheService.get<any>(
      `${environment.BASE_URL}/api/Head/weeklyFilter/getToFilter`
    );
  }
  getOthers(traineesIds: any): Observable<ResponseHeader> {
    return this.http.post<any>(
      `${environment.BASE_URL}/api/Head/weeklyFilter/getOthers`,
      traineesIds
    );
  }
  filterTrainees(traineesId: any): Observable<ResponseHeader> {
    return this.http.delete<any>(
      `${environment.BASE_URL}/api/Head/weeklyFilter/filterTrainees`,
      { body: traineesId }
    );
  }

  filterTrainee(traineeId: any): Observable<ResponseHeader> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete<any>(
      `${environment.BASE_URL}/api/Head/weeklyFilter/filterTrainee`,
      { headers, body: JSON.stringify(traineeId) }
    );
  }
}
