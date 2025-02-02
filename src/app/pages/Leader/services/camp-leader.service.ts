import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CasheService } from '../../../shared/services/cashe.service';
import { ResponseHeader } from '../../../shared/model/responseHeader';
@Injectable({
  providedIn: 'root',
})
export class CampLeaderService {
  http = inject(HttpClient);
  casheService = inject(CasheService);
  getAllWithPagination(currentPage: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('PageNumber', currentPage)
      .set('PageSize', pageSize);
    return this.casheService.get<any>(
      `${environment.BASE_URL}/api/Leader/camps/getAllWithPagination`,
      params
    );
  }
  deleteCamp(id: number): Observable<ResponseHeader> {
    return this.http.delete<any>(
      `${environment.BASE_URL}/api/Leader/camps/${id}`
    );
  }
  emptyCamp(id: number): Observable<ResponseHeader> {
    return this.http.delete<any>(
      `${environment.BASE_URL}/api/Leader/camps/Emtpy/${id}`
    );
  }
  standingCamp(campId: number): Observable<ResponseHeader> {
    const params = new HttpParams().set('campId', campId);
    return this.http.get<any>(`${environment.BASE_URL}/api/Leader/standing`, {
      params,
    });
  }
  getAllMentors(): Observable<ResponseHeader> {
    return this.http.get<any>(
      `${environment.BASE_URL}/api/Leader/camps/mentors`
    );
  }
  getAllHeadsOfCamp(): Observable<ResponseHeader> {
    return this.http.get<any>(
      `${environment.BASE_URL}/api/Leader/camps/headsOfCamp`
    );
  }
  getAllCamps(): Observable<ResponseHeader> {
    return this.http.get<any>(`${environment.BASE_URL}/api/CampModel`);
  }
  addCamp(name: string): Observable<ResponseHeader> {
    return this.http.post<any>(
      `${environment.BASE_URL}/api/CampModel/${name}`,
      null
    );
  }
  deleteCampFormDropdown(name: string): Observable<ResponseHeader> {
    return this.http.delete<any>(
      `${environment.BASE_URL}/api/CampModel/${name}`
    );
  }
  createCamp(formData: any): Observable<ResponseHeader> {
    const myHeaders = new HttpHeaders({
      Accept: 'text/plain',
    });
    return this.http.post<any>(
      `${environment.BASE_URL}/api/Leader/camps`,
      formData,
      { headers: myHeaders }
    );
  }
  getOneCamp(id: number): Observable<ResponseHeader> {
    return this.http.get<any>(
      `${environment.BASE_URL}/api/Leader/camps/displayEdit/${id}`
    );
  }
  updateCamp(id: number, info: any): Observable<ResponseHeader> {
    return this.http.put<any>(
      `${environment.BASE_URL}/api/Leader/camps/${id}`,
      info
    );
  }
}
