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

  employeeId:'EMP-2026-101',

  email: 'tamil@gmail.com',

  phone:'+91 9876543210',

  department: 'Development',

  location: 'Chennai, India',

  experience:'5 Years',

  joiningDate:'12 Jan 2024',

  teamLead:'Rahul Kumar',

  performance:92,

  attendance:96,

  projects:18,

  skills:[
    'Angular',
    'TypeScript',
    'Bootstrap',
    'Node JS',
    'SQL'
  ],

  about:'Passionate Angular developer with experience in enterprise dashboard systems.',

  image:'https://i.pravatar.cc/200?img=12'

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

/* save full profile */

localStorage.setItem(
'profile',
JSON.stringify(this.profile)
);

/* save image separately */

localStorage.setItem(
'profileImage',
this.profile.image
);

};

reader.readAsDataURL(file);

}

}
}