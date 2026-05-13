import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {

  isSending = false;

  showToast = false;

  formData = {

    name: '',
    email: '',
    subject: '',
    message: ''

  };

  sendMessage() {

    if (
      !this.formData.name ||
      !this.formData.email ||
      !this.formData.subject ||
      !this.formData.message
    ) {

      alert('Please fill all fields ⚠️');
      return;

    }

    this.isSending = true;

    setTimeout(() => {

      this.isSending = false;

      this.showToast = true;

      this.formData = {

        name: '',
        email: '',
        subject: '',
        message: ''

      };

      setTimeout(() => {

        this.showToast = false;

      }, 3000);

    }, 2200);

  }

  toggleFaq(event: any) {

    const parent =
      event.currentTarget.parentElement;

    parent.classList.toggle('active');

  }

}