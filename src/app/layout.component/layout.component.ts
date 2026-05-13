import { Component ,OnInit} from '@angular/core';
import { AuthService } from '../auth.service/auth.service';
import {
  RouterOutlet,
  RouterLink,
  Router
} from '@angular/router';


@Component({
  selector: 'app-layout',
  standalone: true,

  imports: [
    RouterOutlet,
    RouterLink
  ],

  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})

export class LayoutComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  logout() {

    this.auth.logout();

    this.router.navigate(['/login']);

  }
 darkMode = false;

ngOnInit() {

  const savedTheme =
    localStorage.getItem('theme');

  if (savedTheme === 'dark') {

    this.darkMode = true;

    document.body.classList.add(
      'dark-theme'
    );

  }

}

toggleTheme() {

  this.darkMode = !this.darkMode;

  if (this.darkMode) {

    document.body.classList.add(
      'dark-theme'
    );

    localStorage.setItem(
      'theme',
      'dark'
    );

  }

  else {

    document.body.classList.remove(
      'dark-theme'
    );

    localStorage.setItem(
      'theme',
      'light'
    );

  }
  
}
} 