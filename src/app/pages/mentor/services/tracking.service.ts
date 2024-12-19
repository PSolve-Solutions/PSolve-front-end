import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseHeader } from '../../../shared/model/responseHeader';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {

  constructor(private http:HttpClient) { }
  getContest(id:any): Observable<ResponseHeader>{
    return this.http.get<ResponseHeader>(`${environment.BASE_URL}/api/Mentor/contestsTracking/${Number(id)}`)
  }
  getSheet(id:any): Observable<ResponseHeader>{
    return this.http.get<ResponseHeader>(`${environment.BASE_URL}/api/Mentor/sheetsTracking/${Number(id)}`)
  }
  
}


