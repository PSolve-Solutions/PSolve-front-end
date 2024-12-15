import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ResponseHeader } from '../../../shared/model/responseHeader';

@Injectable({
  providedIn: 'root',
})
export class RegisterationService {
  http = inject(HttpClient);

  getCamps(communityId: string): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Home/traineeApplication/campOfCommunity/${communityId}`
    );
  }
  getCommunities(): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Home/traineeApplication/communities`
    );
  }
  getUniversities(): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Home/universities`
    );
  }

  sendOtp(email: string): Observable<ResponseHeader> {
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/Auth/sendConfirmOtp`,
      JSON.stringify(email),
      { headers: myHeaders }
    );
  }

  applyForm(formData: any): Observable<ResponseHeader> {
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/Auth/traineeRegister`,
      formData
    );
  }
  checkNationalId(nationlId: string): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Home/traineeApplication/checkNationalId/${nationlId}`
    );
  }
  campConditions(campId: number): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Home/traineeApplication/campConditions/${campId}`
    );
  }
  checkContactInfo(contactInfo: any): Observable<ResponseHeader> {
    const params = new HttpParams()
      .set('CommunityId', contactInfo.communityId)
      .set('CampId', contactInfo.campId)
      .set('Email', contactInfo.email)
      .set('PhoneNumber', contactInfo.phoneNumber)
      .set('Codeforces', contactInfo.codeforces)
      .set('VjudgeHandle', contactInfo.vjudgeHandle)
      .set('OTP', contactInfo.otp);
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Home/traineeApplication/checkContactInfo`,
      { params }
    );
  }
}
