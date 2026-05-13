import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit {

  darkMode = false;

  saving = false;

  showToast = false;

  currentTime: string = '';

  profile = {

    fullName: 'Tamilmani',
    email: 'tamil@gmail.com',
    department: 'Development',
    designation: 'Angular Developer'

  };

  security = {

    currentPassword: '',
    newPassword: ''

  };

  notifications = {

    emailNotifications: true,
    attendanceAlerts: true,
    pushNotifications: false

  };

  ngOnInit() {

    const savedTheme =
      localStorage.getItem('theme');

    if (savedTheme === 'dark') {

      this.darkMode = true;

      document.body.classList.add('dark-mode');

    }

    this.updateClock();

    setInterval(() => {

      this.updateClock();

    }, 1000);

  }

  updateClock() {

    const now = new Date();

    this.currentTime =
      now.toLocaleTimeString();

  }

  toggleTheme() {

    this.darkMode = !this.darkMode;

    if (this.darkMode) {

      document.body.classList.add('dark-mode');

      localStorage.setItem(
        'theme',
        'dark'
      );

    }

    else {

      document.body.classList.remove('dark-mode');

      localStorage.setItem(
        'theme',
        'light'
      );

    }

  }

  saveSettings() {

    this.saving = true;

    setTimeout(() => {

      this.saving = false;

      this.showToast = true;

      setTimeout(() => {

        this.showToast = false;

      }, 3000);

    }, 2000);

  }

}