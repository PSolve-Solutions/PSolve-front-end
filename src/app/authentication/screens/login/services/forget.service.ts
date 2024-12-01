import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ForgetService {
email:any;
token:any;
  constructor(private http:HttpClient, private route: ActivatedRoute) { }
  otp(data: any): Observable<any> {
    return this.http.post<any>(`${environment.BASE_URL}/api/Auth/forget-password?email=${data}`, data); 
  }
  ngOnInit(): void {
    this.email = this.route.snapshot.paramMap.get('email')!;
    this.token = this.route.snapshot.paramMap.get('token')!;
    
  }
}
