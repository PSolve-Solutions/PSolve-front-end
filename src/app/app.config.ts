import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
  provideRouter,
  RouterModule,
  withViewTransitions,
} from '@angular/router';

import { routes } from './app.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { authInterceptor } from './authentication/services/auth.interceptor';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(withFetch()),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(
      RouterModule.forRoot(routes, {
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      })
    ),
    provideToastr({
      timeOut: 5000,
      closeButton: true,
      progressBar: true,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      progressAnimation: 'increasing',
    }),
    provideAnimations(),
  ],
};
