import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/dashboard']);
    }
  }

  login(): void {
    this.errorMessage = '';
    this.isLoading = true;

    setTimeout(() => {
      if (
        this.username === 'admin@gmail.com' &&
        this.password === '1234'
      ) {
        localStorage.setItem('token', 'employee-token');
        this.router.navigate(['/dashboard']);
      } else {
        this.isLoading = false;
        this.errorMessage = 'Invalid email or password. Please try again.';
      }
    }, 800);
  }

}