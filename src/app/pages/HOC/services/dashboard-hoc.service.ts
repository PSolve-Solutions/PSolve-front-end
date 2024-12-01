import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CasheService } from '../../../shared/services/cashe.service';
import { ResponseHeader } from '../../../shared/model/responseHeader';
@Injectable({
  providedIn: 'root',
})
export class DashboardHocService {
  http = inject(HttpClient);
  casheService = inject(CasheService);
  standingCamp(): Observable<ResponseHeader> {
    return this.casheService.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Head/standing`
    );
  }
  dashboard(): Observable<ResponseHeader> {
    return this.casheService.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Head/dashboard`
    );
  }
}
