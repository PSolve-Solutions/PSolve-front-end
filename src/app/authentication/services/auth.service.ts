import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { CurrentUser, ResponseHeader } from '../../shared/model/responseHeader';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  router = inject(Router);
  // Varibles
  currentUser = signal<CurrentUser>({} as CurrentUser);
  isAuth = signal<boolean>(false);
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly IS_AUTH = 'IS_AUTH';
  private readonly CURRENT_USER = 'CURRENT_USER';
  constructor() {
    const savedIsAuth = localStorage.getItem(this.IS_AUTH);
    this.isAuth.set(savedIsAuth ? JSON.parse(savedIsAuth) : false);
    const savedCurrentUser = localStorage.getItem(this.CURRENT_USER);
    this.currentUser.set(
      savedCurrentUser ? JSON.parse(savedCurrentUser) : null
    );
  }
  /// All Funs.
  // Login Fun.
  loginUser(userBody: {
    username: string;
    password: string;
    rememberMe: boolean;
  }): Observable<ResponseHeader> {
    return this.http
      .post<ResponseHeader>(`${environment.BASE_URL}/api/Auth/login`, userBody)
      .pipe(
        tap(({ statusCode, data }: ResponseHeader) => {
          if (statusCode === 200) {
            this.doLoggedUser(data);
          }
        })
      );
  }
  // fun to store token of the user in localStorage and user data
  doLoggedUser(userData: any) {
    this.setToken(userData.token);
    this.setCurrentUser(userData);
  }
  getToken(): string {
    return localStorage.getItem(this.JWT_TOKEN) || '';
  }
  private setToken(token: string): void {
    localStorage.setItem(this.JWT_TOKEN, token);
  }
  // Is LoggedIn
  setIsAuth(isAuth: boolean): void {
    this.isAuth.set(isAuth);
    localStorage.setItem(this.IS_AUTH, JSON.stringify(isAuth));
  }
  // Current User
  setCurrentUser(userData: any): void {
    if (userData) {
      this.currentUser.set(userData);
      localStorage.setItem(this.CURRENT_USER, JSON.stringify(userData));
    }
  }
  updateUserRoles(newRole: any, action: string): void {
    let savedCurrentUser = JSON.parse(
      localStorage.getItem(this.CURRENT_USER) || '{}'
    );
    if (savedCurrentUser) {
      if (action === 'add') {
        savedCurrentUser.roles = [...savedCurrentUser.roles, newRole];
      } else {
        savedCurrentUser.roles = newRole;
      }
      localStorage.setItem(this.CURRENT_USER, JSON.stringify(savedCurrentUser));
    }
  }
  updatePhotoUrl(newPhotoUrl: string | null): void {
    const currentUser = JSON.parse(
      localStorage.getItem(this.CURRENT_USER) || '{}'
    );
    if (currentUser) {
      currentUser.photoUrl = newPhotoUrl;
      localStorage.setItem('CURRENT_USER', JSON.stringify(currentUser)); // Sync to localStorage
    }
  }
  // LogOut Fun.
  logout() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.CURRENT_USER);
    this.setIsAuth(false);
    localStorage.clear();
    this.router.navigateByUrl('/');
  }
}
