import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ResponseHeader } from '../../../shared/model/responseHeader';
@Injectable({
  providedIn: 'root',
})
export class ProfileTraineeService {
  http = inject(HttpClient);
  traineeProfile(): Observable<ResponseHeader> {
    return this.http.get<any>(
      `${environment.BASE_URL}/api/User/traineeProfile`
    );
  }
  updateTraineeProfile(info: any): Observable<ResponseHeader> {
    return this.http.put<ResponseHeader>(
      `${environment.BASE_URL}/api/User/updateTraineeProfile`,
      info
    );
  }
}
