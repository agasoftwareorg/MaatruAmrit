import { CanActivateFn, Router } from '@angular/router';
import { BackendService } from './backend.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {

  let backend = inject(BackendService)
  let router = inject(Router)

  return backend.isLoggedIn().pipe(
    map(isAuthenticated => {
      if (!isAuthenticated) {
        router.navigate(['/login']);
        return false;
      }
      return true;
    })
  );
};

export const authGuardReverse: CanActivateFn = (route, state) => {

  let backend = inject(BackendService)
  let router = inject(Router)

  return backend.isLoggedIn().pipe(
    map(isAuthenticated => {
      if (isAuthenticated) {
        router.navigate(['/hospital']);
        return false;
      }
      return true;
    })
  );
};
