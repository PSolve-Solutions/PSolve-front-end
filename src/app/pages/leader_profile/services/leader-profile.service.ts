import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ResponseHeader } from '../../../shared/model/responseHeader';
@Injectable({
  providedIn: 'root',
})
export class LeaderProfileService {
  http = inject(HttpClient);
  generalLeaderProfile(): Observable<ResponseHeader> {
    return this.http.get<any>(
      `${environment.BASE_URL}/api/User/generalProfile`
    );
  }
  generalHeadProfile(): Observable<ResponseHeader> {
    return this.http.get<any>(`${environment.BASE_URL}/api/User/headProfile`);
  }
  generalMentorProfile(): Observable<ResponseHeader> {
    return this.http.get<any>(`${environment.BASE_URL}/api/User/mentorProfile`);
  }
  updateProfile(info: any): Observable<ResponseHeader> {
    return this.http.put<ResponseHeader>(
      `${environment.BASE_URL}/api/User/updateProfile`,
      info
    );
  }
  updateHeadOfCamp(info: any): Observable<ResponseHeader> {
    return this.http.put<ResponseHeader>(
      `${environment.BASE_URL}/api/User/updateHeadOfCamp`,
      info
    );
  }
  updateMentor(info: any): Observable<ResponseHeader> {
    return this.http.put<ResponseHeader>(
      `${environment.BASE_URL}/api/User/updateMentor`,
      info
    );
  }
  updateTraineeProfile(info: any): Observable<ResponseHeader> {
    return this.http.put<ResponseHeader>(
      `${environment.BASE_URL}/api/User/updateTraineeProfile`,
      info
    );
  }
  updateProfileImage(image: any): Observable<ResponseHeader> {
    return this.http.put<ResponseHeader>(
      `${environment.BASE_URL}/api/User/updateProfileImage`,
      image
    );
  }
  deleteProfileImage(): Observable<ResponseHeader> {
    return this.http.delete<ResponseHeader>(
      `${environment.BASE_URL}/api/User/profileImage`,
      {}
    );
  }
}
