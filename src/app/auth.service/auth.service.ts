import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';

const AUTH_BASE = `${environment.apiUrl}/auth`;
const DEV_TOKEN = 'dev-bypass-token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  login(email: string, password: string): Observable<{ token: string }> {
    if (environment.devBypassAuth) {
      localStorage.setItem('token', DEV_TOKEN);
      return of({ token: DEV_TOKEN });
    }

    return this.http
      .post<{ token: string }>(`${AUTH_BASE}/login`, { email, password })
      .pipe(tap(res => localStorage.setItem('token', res.token)));
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
