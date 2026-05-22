import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-employee-details',

  standalone: true,

  imports: [CommonModule, RouterModule],

  templateUrl: './employee-details.component.html',

  styleUrls: ['./employee-details.component.css']
})

export class EmployeeDetailsComponent
implements OnInit {

  employee: any;

  constructor(private router: Router) {}

  ngOnInit(): void {

    const data = localStorage.getItem(
      'selectedEmployee'
    );

    if (data) {

      this.employee = JSON.parse(data);

    }

  }

  goBack(){

    this.router.navigate(['/employees']);

  }

}