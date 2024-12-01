import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseHeader } from '../model/responseHeader';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  http = inject(HttpClient);

  getAllNotifications(
    currentPage: number,
    pageSize: number,
    isRead: boolean
  ): Observable<any> {
    const params = new HttpParams()
      .set('PageNumber', currentPage)
      .set('PageSize', pageSize)
      .set('IsRead', isRead);
    return this.http.get<any>(
      `${environment.BASE_URL}/api/User/notifications`,
      { params }
    );
  }

  markasRead(notificationId: number): Observable<ResponseHeader> {
    return this.http.put<any>(
      `${environment.BASE_URL}/api/User/notifications/MarkasRead/${notificationId}`,
      {}
    );
  }
  newNotificationCheck(): Observable<ResponseHeader> {
    return this.http.get<any>(
      `${environment.BASE_URL}/api/User/newNotificationCheck`
    );
  }
}
