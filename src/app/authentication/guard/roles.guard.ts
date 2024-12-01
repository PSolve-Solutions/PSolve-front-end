import { inject } from '@angular/core';
import { CanActivateFn, Route, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const rolesGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const userInfo = JSON.parse(localStorage.getItem('CURRENT_USER') || '{}');
  const { routeConfig } = route;
  const authService = inject(AuthService);
  const { path } = routeConfig as Route;

  const roles = userInfo.roles;
  if (path === '' && !authService.isAuth()) {
    return true;
  }
  if (path === 'leader' && roles.includes('Leader')) {
    return true;
  }
  if (path === 'head_of_camp' && roles.includes('Head_Of_Camp')) {
    return true;
  }
  if (path === 'mentor' && roles.includes('Mentor')) {
    return true;
  }

  if (path === 'trainee' && roles.includes('Trainee')) {
    return true;
  }
  if (path === 'psovle' && roles.includes('Admin')) {
    return true;
  }

  router.navigateByUrl(
    roles.includes('Leader')
      ? '/leader'
      : roles.includes('Mentor')
      ? '/mentor'
      : roles.includes('Head_Of_Camp')
      ? '/head_of_camp'
      : roles.includes('Trainee')
      ? '/trainee'
      : roles.includes('Admin')
      ? '/psovle'
      : '/'
  );

  return false;
};
