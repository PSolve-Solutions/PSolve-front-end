import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SetpassService {

  constructor(private http : HttpClient) {  }
  reset(data: any): Observable<any> {
    
    return this.http.post<any>(`${environment.BASE_URL}/api/Auth/reset-password`, data); 
  }
  
}
