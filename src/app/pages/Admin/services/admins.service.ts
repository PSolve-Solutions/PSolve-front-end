import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CasheService } from '../../../shared/services/cashe.service';
import { ResponseHeader } from '../../../shared/model/responseHeader';
@Injectable({
  providedIn: 'root',
})
export class AdminsService {
  http = inject(HttpClient);
  casheService = inject(CasheService);
  getAllAdminsPagination(
    currentPage: number,
    pageSize: number
  ): Observable<any> {
    const params = new HttpParams()
      .set('PageNumber', currentPage)
      .set('PageSize', pageSize);
    return this.casheService.get<any>(
      `${environment.BASE_URL}/api/Admin/admins/pagination`,
      params
    );
  }

  deleteAdmin(id: string): Observable<ResponseHeader> {
    return this.http.delete<ResponseHeader>(
      `${environment.BASE_URL}/api/Admin/admins/${id}`
    );
  }

  actionsAdmin(formData: any): Observable<ResponseHeader> {
    return this.http.post<any>(
      `${environment.BASE_URL}/api/Admin/admins`,
      formData
    );
  }
  getAdminById(id: string): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Admin/admins/${id}`
    );
  }

  // Universities

  deleteUniversity(name: string): Observable<ResponseHeader> {
    return this.http.delete<ResponseHeader>(
      `${environment.BASE_URL}/api/Admin/universities/${name}`
    );
  }
  addUniversity(name: string): Observable<ResponseHeader> {
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/Admin/universities/${name}`,
      name
    );
  }

  getUniversities(): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Home/universities`
    );
  }
}
