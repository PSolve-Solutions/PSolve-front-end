import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  http = inject(HttpClient)
  constructor() {}

  anyOpenCamps():Observable<any>{
    return this.http.get(environment.BASE_URL + `/api/Home/isAnyOpenCamps`)
  }
  getFeedBacks():Observable<any>{
    return this.http.get(environment.BASE_URL + `/api/Home/feedbacks`)
  }




}
