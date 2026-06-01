import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

export class DashboardComponent implements OnInit {

  searchText = '';

  showModal = false;

  submitted = false;

  employees: any[] = [];

  newEmployee = {

    name: '',
    email: '',
    department: '',
    role: '',
    status: 'Active',
    experience: '',
    performance: 80,
    image: 'https://i.pravatar.cc/100'

  };

  constructor(
    private router: Router
  ) {}

  ngOnInit() {

    const savedEmployees =
      localStorage.getItem('dashboardEmployees');

    if (savedEmployees) {

      this.employees =
        JSON.parse(savedEmployees);

    }

    else {

      this.employees = [

        {
          id: 1,
          name: 'Tamilmani',
          email: 'tamil@gmail.com',
          department: 'Development',
          role: 'Senior Angular Developer',
          status: 'Active',
          experience: '3+ Years',
          performance: 90,
          image: 'https://i.pravatar.cc/100?img=12'
        },

        {
          id: 2,
          name: 'Rahul',
          email: 'rahul@gmail.com',
          department: 'Backend',
          role: '.NET API Developer',
          status: 'Active',
          experience: '5+ Years',
          performance: 82,
          image: 'https://i.pravatar.cc/100?img=18'
        },

        {
          id: 3,
          name: 'Priya',
          email: 'priya@gmail.com',
          department: 'UI / UX',
          role: 'Product Designer',
          status: 'On Leave',
          experience: '2+ Years',
          performance: 74,
          image: 'https://i.pravatar.cc/100?img=15'
        }

      ];

      this.saveEmployees();

    }

  }

  saveEmployees() {

    localStorage.setItem(

      'dashboardEmployees',

      JSON.stringify(this.employees)

    );

  }

  openModal() {

    this.showModal = true;

    this.submitted = false;

  }

  closeModal() {

    this.showModal = false;

  }

  addEmployee() {

    this.submitted = true;

    // Empty validation

    if (

      !this.newEmployee.name ||

      !this.newEmployee.email ||

      !this.newEmployee.department ||

      !this.newEmployee.role ||

      !this.newEmployee.experience

    ) {

      return;

    }

    // Email validation

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (

      !emailPattern.test(
        this.newEmployee.email
      )

    ) {

      alert(
        'Enter valid email address'
      );

      return;

    }

    this.employees.push({

      ...this.newEmployee,

      id: this.employees.length + 1

    });

    this.saveEmployees();

    this.newEmployee = {

      name: '',
      email: '',
      department: '',
      role: '',
      status: 'Active',
      experience: '',
      performance: 80,
      image: 'https://i.pravatar.cc/100'

    };

    this.submitted = false;

    this.closeModal();

  }

  deleteEmployee(index: number) {

    this.employees.splice(index, 1);

    this.saveEmployees();

  }

  viewProfile(emp: any) {

    alert(

      'Viewing Profile : ' +

      emp.name

    );

  }

  get filteredEmployees() {

    return this.employees.filter(emp =>

      (emp.name || '')
      .toLowerCase()
      .includes(
        this.searchText.toLowerCase()
      )

      ||

      (emp.role || '')
      .toLowerCase()
      .includes(
        this.searchText.toLowerCase()
      )

      ||

      (emp.department || '')
      .toLowerCase()
      .includes(
        this.searchText.toLowerCase()
      )

    );

  }

}