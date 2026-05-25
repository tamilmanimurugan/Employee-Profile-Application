import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  Router,
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  NavigationEnd
} from '@angular/router';

import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {

  currentUrl = '';

  constructor(private router: Router) {

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentUrl = event.url;
      });

  }

  isLoginPage(): boolean {
    return this.currentUrl === '/login';
  }

  logout(): void {

    localStorage.removeItem('ea_auth');

    this.router.navigate(['/login']);

  }
}