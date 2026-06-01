import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username='';
  password='';

  constructor(
    private router: Router
  ){}

  login(){

    if(
      this.username==="admin@gmail.com" &&
      this.password==="1234"
    ){

      localStorage.setItem(
        'token',
        'employee-token'
      );

      this.router.navigate(
        ['/dashboard']
      );

    }

    else{

      alert(
        "Invalid Email or Password"
      );

    }

  }

}