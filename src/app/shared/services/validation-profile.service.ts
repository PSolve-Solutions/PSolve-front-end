import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseHeader } from '../model/responseHeader';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ValidationProfileService {
  http = inject(HttpClient);
  validatePhoneNumber(phoneNumber: number): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Validations/validatePhoneNumber/${phoneNumber}`
    );
  }
  validateNationalId(nationalId: number): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Validations/validateNationalId/${nationalId}`
    );
  }
  // Account
  accountInfo(): Observable<ResponseHeader> {
    return this.http.get<any>(`${environment.BASE_URL}/api/User/accountInfo`);
  }
  //email
  updateEmail(email: string): Observable<ResponseHeader> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<ResponseHeader>(
      `${environment.BASE_URL}/api/User/updateEmail`,
      JSON.stringify(email),
      { headers }
    );
  }
  validateEmail(email: string): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Validations/validateEmail/${email}`
    );
  }
  // username
  updateUsername(username: string): Observable<ResponseHeader> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<ResponseHeader>(
      `${environment.BASE_URL}/api/User/updateUsername`,
      JSON.stringify(username),
      { headers }
    );
  }
  validateUsername(username: string): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Validations/validateUsername/${username}`
    );
  }
  // codeforces
  updateCodeforceHandle(codeForcesHandle: string): Observable<ResponseHeader> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<ResponseHeader>(
      `${environment.BASE_URL}/api/User/updateCodeforceHandle`,
      JSON.stringify(codeForcesHandle),
      { headers }
    );
  }
  validateCodeForcesHandle(
    codeForcesHandle: string
  ): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Validations/validateCodeForcesHandle/${codeForcesHandle}`
    );
  }
  // codeforces
  updateVjudgeHandle(vjudgeHandle: string): Observable<ResponseHeader> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<ResponseHeader>(
      `${environment.BASE_URL}/api/User/updateVjudgeHandle`,
      JSON.stringify(vjudgeHandle),
      { headers }
    );
  }
  validateVjudgeHandle(vjudgeHandle: string): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Validations/validateVjudgeHandle/${vjudgeHandle}`
    );
  }
  updatePassword(passInfo: any): Observable<ResponseHeader> {
    return this.http.put<ResponseHeader>(
      `${environment.BASE_URL}/api/User/updatePassword`,
      passInfo
    );
  }
}
