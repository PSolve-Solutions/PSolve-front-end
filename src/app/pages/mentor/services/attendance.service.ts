import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseHeader } from '../../../shared/model/responseHeader';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  constructor(private http:HttpClient  ) { }
  getData(id:any): Observable<ResponseHeader>{
    
    return this.http.get<ResponseHeader>(`${environment.BASE_URL}/api/Mentor/attendances?campId=${id}`)
  }
}
