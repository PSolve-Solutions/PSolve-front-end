import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ResponseHeader } from '../../../shared/model/responseHeader';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  http = inject(HttpClient);
  // Roles
  unAssignToRole(roleInfo: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete<any>(
      `${environment.BASE_URL}/api/Roles/unAssignToRole`,
      { headers, body: roleInfo }
    );
  }
  assignToRole(roleInfo: any): Observable<ResponseHeader> {
    return this.http.post<any>(
      `${environment.BASE_URL}/api/Roles/assignToRole`,
      roleInfo
    );
  }
  addNewRole(roleName: any): Observable<ResponseHeader> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const raw = JSON.stringify(roleName);
    return this.http.post<any>(`${environment.BASE_URL}/api/Roles`, raw, {
      headers: headers,
    });
  }
  removeRoleFromSystem(roleName: any): Observable<ResponseHeader> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const raw = JSON.stringify(roleName);
    return this.http.delete<any>(`${environment.BASE_URL}/api/Roles`, {
      headers,
      body: raw,
    });
  }
}
