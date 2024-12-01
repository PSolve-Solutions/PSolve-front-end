import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class OtpService {



  constructor(private http: HttpClient) {}

  // Method to get data with OTP and email as query parameters
  getData(email: string, otp: string): Observable<any> {
    const params = new HttpParams()
      .set('otp', otp)
      .set('email', email);

    return this.http.get(`${environment.BASE_URL}/api/Auth/checkResetOtp`, { params });
  }
}
