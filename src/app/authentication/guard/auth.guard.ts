import { inject } from '@angular/core';
import { CanActivateFn, Route, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

// to don't forwerd to any thing i went only if he logged in
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const toastr = inject(ToastrService);
  const router = inject(Router);
  if (!authService.isAuth()) {
    toastr.warning('برجاء تسجيل الدخول أولاً');
    router.navigate(['/login']);
  }
  return true;
};

// to don't back to /login or /register when logged in
export const authGuardLoggdIn: CanActivateFn = (route, state) => {
  const userInfo = JSON.parse(localStorage.getItem('CURRENT_USER') || '{}');
  const roles = userInfo.roles;
  const authService = inject(AuthService);

  const router = inject(Router);
  if (authService.isAuth() && roles.includes('Leader')) {
    return router.navigate(['/leader']);
  }

  if (authService.isAuth() && roles.includes('Head_Of_Camp')) {
    return router.navigate(['/head_of_camp']);
  }
  if (authService.isAuth() && roles.includes('Mentor')) {
    return router.navigate(['/mentor']);
  }
  if (authService.isAuth() && roles.includes('Trainee')) {
    return router.navigate(['/trainee']);
  }
  if (authService.isAuth() && roles.includes('Admin')) {
    return router.navigate(['/psovle']);
  }
  if (authService.isAuth()) {
    return router.navigate(['/']);
  }

  return true;
};
