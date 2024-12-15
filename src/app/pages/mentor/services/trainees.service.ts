import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseHeader } from '../../../shared/model/responseHeader';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TraineesService {

  constructor(private http:HttpClient) { }
  getData(): Observable<ResponseHeader>{
    
    
    return this.http.get<ResponseHeader>(`${environment.BASE_URL}/api/Mentor/camps`)
  }
  trainees(id:any): Observable<ResponseHeader>{
    
    return this.http.get<ResponseHeader>(`${environment.BASE_URL}/api/Mentor/trainees?campId=${Number(id)}`)
  }
  info(id:any): Observable<ResponseHeader>{
    
    return this.http.get<ResponseHeader>(`${environment.BASE_URL}/api/Mentor/trainees/${Number(id)}`)
  }
}
