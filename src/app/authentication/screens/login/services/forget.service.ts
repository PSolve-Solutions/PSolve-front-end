import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { ResponseHeader } from '../../../../shared/model/responseHeader';

@Injectable({
  providedIn: 'root',
})
export class ForgetService {
  http = inject(HttpClient);
  route = inject(ActivatedRoute);
  forgetPassword(email: string): Observable<ResponseHeader> {
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/Auth/forget-password?email=${email}`,
      email
    );
  }

  checkResetOtp(email: string, otp: string): Observable<ResponseHeader> {
    const params = new HttpParams().set('otp', otp).set('email', email);
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Auth/checkResetOtp`,
      {
        params,
      }
    );
  }

  resetPassword(data: any): Observable<ResponseHeader> {
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/Auth/reset-password`,
      data
    );
  }
}
