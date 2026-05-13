import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './profile.component.html',

  styleUrls: ['./profile.component.css']
})

export class ProfileComponent {

  showEditModal = false;

  profile = {

    name: 'Tamilmani',

    role: 'Senior Angular Developer',

    email: 'tamil@gmail.com',

    department: 'Development',

    location: 'Chennai, India',

    about:
      'Passionate Angular developer with experience in enterprise dashboard systems.',

    image:
      'https://i.pravatar.cc/200?img=12'

  };

  ngOnInit() {

    const savedProfile =
      localStorage.getItem('profile');

    if (savedProfile) {

      this.profile =
        JSON.parse(savedProfile);

    }

  }

  openEditModal() {

    this.showEditModal = true;

  }

  closeModal() {

    this.showEditModal = false;

  }

  saveProfile() {

    localStorage.setItem(

      'profile',

      JSON.stringify(this.profile)

    );

    this.closeModal();

  }

  onImageSelect(event: any) {

    const file = event.target.files[0];

    if(file){

      const reader = new FileReader();

      reader.onload = () => {

        this.profile.image =
          reader.result as string;

        localStorage.setItem(

          'profile',

          JSON.stringify(this.profile)

        );

      };

      reader.readAsDataURL(file);

    }

  }

}