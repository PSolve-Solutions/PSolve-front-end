import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CasheService } from '../../../shared/services/cashe.service';
import { ResponseHeader } from '../../../shared/model/responseHeader';
@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  http = inject(HttpClient);
  casheService = inject(CasheService);
  getAllClientsPagination(
    currentPage: number,
    pageSize: number
  ): Observable<any> {
    const params = new HttpParams()
      .set('PageNumber', currentPage)
      .set('PageSize', pageSize);
    return this.casheService.get<any>(
      `${environment.BASE_URL}/api/Admin/clients/pagination`,
      params
    );
  }
  deleteClient(id: string): Observable<ResponseHeader> {
    return this.http.delete<ResponseHeader>(
      `${environment.BASE_URL}/api/Admin/clients/${id}`
    );
  }
  createClient(formData: any): Observable<ResponseHeader> {
    return this.http.post<any>(
      `${environment.BASE_URL}/api/Admin/clients`,
      formData
    );
  }
  getClientById(id: string): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Admin/clients/${id}`
    );
  }
  changeLockStatus(id: string): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Admin/clients/${id}/changeLockStatus`
    );
  }
  updateSubscribtion(info: any): Observable<ResponseHeader> {
    return this.http.put<ResponseHeader>(
      `${environment.BASE_URL}/api/Admin/clients/subscribtion`,
      info
    );
  }
}
