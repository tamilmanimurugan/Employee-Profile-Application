import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  mode: 'login' | 'register' = 'login';

  login = { email: '', password: '', remember: false };
  register = { name: '', email: '', password: '', confirm: '', role: 'Viewer', agree: false };

  loginErrors: any = {};
  registerErrors: any = {};
  showLoginPass = false;
  showRegPass = false;
  showConfirmPass = false;
  submitting = false;
  toast = '';
  toastType: 'success' | 'error' = 'success';

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  switchMode(m: 'login' | 'register') {
    this.mode = m;
    this.loginErrors = {};
    this.registerErrors = {};
  }

  validateLogin(): boolean {
    this.loginErrors = {};
    if (!this.login.email) this.loginErrors.email = 'Email is required';
    else if (!this.login.email.includes('@')) this.loginErrors.email = 'Enter a valid email';
    if (!this.login.password) this.loginErrors.password = 'Password is required';
    else if (this.login.password.length < 6) this.loginErrors.password = 'Minimum 6 characters';
    return Object.keys(this.loginErrors).length === 0;
  }

  validateRegister(): boolean {
    this.registerErrors = {};
    if (!this.register.name.trim()) this.registerErrors.name = 'Full name is required';
    if (!this.register.email) this.registerErrors.email = 'Email is required';
    else if (!this.register.email.includes('@')) this.registerErrors.email = 'Enter a valid email';
    if (!this.register.password) this.registerErrors.password = 'Password is required';
    else if (this.register.password.length < 8) this.registerErrors.password = 'Minimum 8 characters';
    if (this.register.confirm !== this.register.password) this.registerErrors.confirm = 'Passwords do not match';
    if (!this.register.agree) this.registerErrors.agree = 'You must accept the terms';
    return Object.keys(this.registerErrors).length === 0;
  }

  submitLogin() {
    if (!this.validateLogin()) return;
    this.submitting = true;
    setTimeout(() => {
      // Store auth state
      localStorage.setItem('ea_auth', JSON.stringify({
        email: this.login.email,
        name: this.login.email.split('@')[0],
        role: 'Admin',
        loggedIn: true
      }));
      this.submitting = false;
      this.showToast('Welcome back!');
      setTimeout(() => this.router.navigate(['/']), 800);
    }, 1200);
  }

  submitRegister() {
    if (!this.validateRegister()) return;
    this.submitting = true;
    setTimeout(() => {
      localStorage.setItem('ea_auth', JSON.stringify({
        email: this.register.email,
        name: this.register.name,
        role: this.register.role,
        loggedIn: true
      }));
      this.submitting = false;
      this.showToast('Account created! Welcome.');
      setTimeout(() => this.router.navigate(['/']), 800);
    }, 1400);
  }

  showToast(msg: string, type: 'success' | 'error' = 'success') {
    this.toast = msg; this.toastType = type;
    setTimeout(() => { this.toast = ''; this.cdr.detectChanges(); }, 3000);
  }

  getStrength(): { level: number; label: string; color: string } {
    const p = this.register.password;
    if (!p) return { level: 0, label: '', color: '' };
    let score = 0;
    if (p.length >= 8) score++;
    if (p.length >= 12) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^a-zA-Z0-9]/.test(p)) score++;
    if (score <= 1) return { level: 1, label: 'Weak', color: '#e11d48' };
    if (score <= 3) return { level: 2, label: 'Fair', color: '#d97706' };
    if (score <= 4) return { level: 3, label: 'Good', color: '#059669' };
    return { level: 4, label: 'Strong', color: '#4f46e5' };
  }
}