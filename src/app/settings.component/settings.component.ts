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

  profileImage: string = 'https://i.pravatar.cc/100?img=12';

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
      const savedProfile =
      localStorage.getItem('profile');

    if (savedProfile) {

      this.profile =
        JSON.parse(savedProfile);

    }

    }

    this.updateClock();
 
    setInterval(() => {

      this.updateClock();

    }, 1000);

    // load saved profile image if any
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      this.profileImage = savedImage;
    }

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

  onImageSelected(event: any) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.profileImage = reader.result as string;
      // persist image to localStorage so it stays between reloads
      try {
        localStorage.setItem('profileImage', this.profileImage);
      } catch (e) {
        // ignore storage errors
      }
    };
    reader.readAsDataURL(file);
  }

}