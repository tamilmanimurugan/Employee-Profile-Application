import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: { navigate: () => {} } }]
    });
  });

  it('should return true when user is logged in', () => {
    localStorage.setItem('isLoggedIn', 'true');
    TestBed.runInInjectionContext(() => {
      expect(AuthGuard()).toBe(true);
    });
    localStorage.removeItem('isLoggedIn');
  });

  it('should return false when user is not logged in', () => {
    localStorage.removeItem('isLoggedIn');
    TestBed.runInInjectionContext(() => {
      expect(AuthGuard()).toBe(false);
    });
  });
});



