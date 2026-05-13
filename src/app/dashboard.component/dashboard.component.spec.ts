import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  employees = [
    {
      id: 101,
      name: 'Tamilmani',
      department: 'Developer'
    }
  ];

  employee = {
    name: '',
    department: ''
  };

  addEmployee() {

    const newEmployee = {
      id: this.employees.length + 101,
      name: this.employee.name,
      department: this.employee.department
    };

    this.employees.push(newEmployee);

    this.employee = {
      name: '',
      department: ''
    };

    alert("Employee Added Successfully ✅");
  }

}