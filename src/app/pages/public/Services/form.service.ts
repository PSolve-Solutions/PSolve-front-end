import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  http = inject(HttpClient)
  constructor() {}

    getCamps():Observable<any>{
      return this.http.get(environment.BASE_URL + `/api/Home/campsForRegister`)
    }
    sendOtp(model:any):Observable<any>{
      const myHeaders = new HttpHeaders({
        'Content-Type':'application/json'
      })
      return this.http.post(environment.BASE_URL + `/api/Auth/sendConfirmOtp`,
             JSON.stringify(model),
             {headers:myHeaders})
    }
    applyForm(model:any):Observable<any>{
      return this.http.post(environment.BASE_URL + `/api/Auth/traineeRegister`,
             model)
    }




}
