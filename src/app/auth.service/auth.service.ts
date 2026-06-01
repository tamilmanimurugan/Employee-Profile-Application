import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  // LOGIN

  login(username: string, password: string): boolean {

    if (
      username === 'admin' &&
      password === '1234'
    ) {

      localStorage.setItem('isLoggedIn', 'true');

      return true;
    }

    return false;
  }

  // CHECK LOGIN

  isAuthenticated(): boolean {

    return localStorage.getItem('isLoggedIn') === 'true';

  }

  // LOGOUT

  logout() {

    localStorage.removeItem('isLoggedIn');

  }

}