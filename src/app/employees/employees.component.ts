import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';

@Component({
  selector: 'app-employees',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './employees.component.html',

  styleUrls: ['./employees.component.css']
})

export class EmployeesComponent implements OnInit {

  searchText = '';

  showModal = false;

  editMode = false;

  currentIndex: number | null = null;

  employees: any[] = [];

  employee = {

    name: '',

    email: '',

    department: '',

    role: '',

    experience: '',

    status: 'Active',

    performance: 80,

    image: 'https://i.pravatar.cc/100?img=12'

  };

  constructor(
    private router: Router
  ) {}

  // VIEW EMPLOYEE

  viewEmployee(emp: any) {

    localStorage.setItem(
      'selectedEmployee',
      JSON.stringify(emp)
    );

    this.router.navigate([
      '/employee-details'
    ]);

  }

  // PAGE LOAD

  ngOnInit() {

    const defaultEmployees = [

      {
        name: 'Tamilmani',
        email: 'tamil@gmail.com',
        department: 'Development',
        role: 'Angular Developer',
        experience: '5 Years',
        status: 'Active',
        performance: 90,
        image: 'https://i.pravatar.cc/100?img=12'
      },

      {
        name: 'Rahul',
        email: 'rahul@gmail.com',
        department: 'Backend',
        role: '.NET Developer',
        experience: '4 Years',
        status: 'Active',
        performance: 80,
        image: 'https://i.pravatar.cc/100?img=18'
      }

    ];

    const savedEmployees =
      localStorage.getItem('employees');

    if (savedEmployees) {

      this.employees =
        JSON.parse(savedEmployees);

    }

    else {

      this.employees =
        defaultEmployees;

    }

  }

  // SAVE

  saveEmployees() {

    localStorage.setItem(

      'employees',

      JSON.stringify(this.employees)

    );

  }

  // OPEN MODAL

  openAddModal() {

    this.showModal = true;

    this.editMode = false;

    this.employee = {

      name: '',
      email: '',
      department: '',
      role: '',
      experience: '',
      status: 'Active',
      performance: 80,
      image: 'https://i.pravatar.cc/100'

    };

  }

  // CLOSE MODAL

  closeModal() {

    this.showModal = false;

  }

  // ADD EMPLOYEE

  addEmployee() {

    this.employees.push({

      ...this.employee

    });

    this.saveEmployees();

    this.closeModal();

  }

  // DELETE

  deleteEmployee(index: number) {

    const confirmDelete = confirm(

      'Are you sure want to delete?'

    );

    if (confirmDelete) {

      this.employees.splice(index, 1);

      this.saveEmployees();

    }

  }

  // EDIT

  editEmployee(emp: any, index: number) {

    this.editMode = true;

    this.currentIndex = index;

    this.showModal = true;

    this.employee = {

      ...emp

    };

  }

  // UPDATE

  updateEmployee() {

    if (this.currentIndex !== null) {

      this.employees[this.currentIndex] = {

        ...this.employee

      };

      this.saveEmployees();

    }

    this.closeModal();

  }

  // IMAGE UPLOAD

  onImageSelected(event: any) {

    const file = event.target.files[0];

    if (file) {

      const reader = new FileReader();

      reader.onload = () => {

        this.employee.image =
          reader.result as string;

      };

      reader.readAsDataURL(file);

    }

  }

  // SEARCH FILTER

  get filteredEmployees() {

    return this.employees.filter((emp: any) =>

      emp.name.toLowerCase().includes(
        this.searchText.toLowerCase()
      ) ||

      emp.email.toLowerCase().includes(
        this.searchText.toLowerCase()
      ) ||

      emp.department.toLowerCase().includes(
        this.searchText.toLowerCase()
      )

    );

  }

}