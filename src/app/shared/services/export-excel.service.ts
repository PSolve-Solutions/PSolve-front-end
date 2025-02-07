import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ExportExcelService {
  http = inject(HttpClient);
  downloadExcelLeader(campId: number): Observable<any> {
    const params = new HttpParams().set('campId', campId);
    return this.http.get(
      `${environment.BASE_URL}/api/Leader/exportCampTrainees`,
      { params }
    );
  }
  downloadExcelHOC(): Observable<any> {
    return this.http.get(`${environment.BASE_URL}/api/Head/exportCampTrainees`);
  }
}
