import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-details',

  standalone: true,

  imports: [CommonModule],

  templateUrl: './employee-details.component.html',

  styleUrls: ['./employee-details.component.css']
})

export class EmployeeDetailsComponent
implements OnInit {

  employee: any;

  ngOnInit(): void {

    const data = localStorage.getItem(
      'selectedEmployee'
    );

    if (data) {

      this.employee = JSON.parse(data);

    }

  }

}