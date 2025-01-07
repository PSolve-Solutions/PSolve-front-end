import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseHeader } from '../../../shared/model/responseHeader';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StandingsService {

  constructor(private http:HttpClient) { }
  getData(id:any): Observable<ResponseHeader>{
    
    return this.http.get<ResponseHeader>(`${environment.BASE_URL}/api/Mentor/standing/${(id)}`)
  }
  updateData(data: any): Observable<any> {
    return this.http.put<any>(`${environment.BASE_URL}/api/Mentor/updateTraineePoints`, data); 
  }
}
