import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CasheService } from '../../../shared/services/cashe.service';
import { ResponseHeader } from '../../../shared/model/responseHeader';
@Injectable({
  providedIn: 'root',
})
export class SheetsHOCService {
  http = inject(HttpClient);
  casheService = inject(CasheService);
  getAllSheets(currentPage: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('PageNumber', currentPage)
      .set('PageSize', pageSize);
    return this.casheService.get<any>(
      `${environment.BASE_URL}/api/Head/sheets`,
      params
    );
  }
  updateSheetsOrder(info: any): Observable<ResponseHeader> {
    return this.http.put<ResponseHeader>(
      `${environment.BASE_URL}/api/Head/updateSheetsOrder`,
      info
    );
  }
  deleteSheet(id: number): Observable<ResponseHeader> {
    return this.http.delete<ResponseHeader>(
      `${environment.BASE_URL}/api/Head/sheets/${id}`
    );
  }
  getMaterailsBySheetId(id: number): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Head/getMaterailsBySheetId/${id}`
    );
  }
  updateOrdersMaterails(info: any): Observable<ResponseHeader> {
    return this.http.put<ResponseHeader>(
      `${environment.BASE_URL}/api/Head/materials/updateOrders`,
      info
    );
  }
  deleteMaterial(id: number): Observable<ResponseHeader> {
    return this.http.delete<ResponseHeader>(
      `${environment.BASE_URL}/api/Head/materials/${id}`
    );
  }
  addMaterialToSheet(materialInfo: any): Observable<ResponseHeader> {
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/Head/materials`,
      materialInfo
    );
  }
  createSheet(formData: any): Observable<ResponseHeader> {
    const myHeaders = new HttpHeaders({
      Accept: 'text/plain',
    });
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/Head/sheets`,
      formData,
      { headers: myHeaders }
    );
  }
  getOneSheet(id: number): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Head/sheets/${id}`
    );
  }
  updateSheet(info: any): Observable<ResponseHeader> {
    return this.http.put<ResponseHeader>(
      `${environment.BASE_URL}/api/Head/sheets`,
      info
    );
  }
  getPublicCommunities(): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Head/getPublicCommunities`
    );
  }
}
