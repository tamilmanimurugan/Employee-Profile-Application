import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {

  const router = inject(Router);

  const auth = localStorage.getItem('ea_auth');

  if (auth) {

    try {

      const data = JSON.parse(auth);

      if (data.loggedIn) {
        return true;
      }

    } catch {}

  }

  router.navigate(['/login']);

  return false;
};