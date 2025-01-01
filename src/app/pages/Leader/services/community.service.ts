import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ResponseHeader } from '../../../shared/model/responseHeader';
@Injectable({
  providedIn: 'root',
})
export class CommunityService {
  http = inject(HttpClient);
  getCommuinty(): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Leader/commuinty`
    );
  }
  updateCommuinty(formData: any): Observable<ResponseHeader> {
    return this.http.put<ResponseHeader>(
      `${environment.BASE_URL}/api/Leader/community`,
      formData
    );
  }
}
