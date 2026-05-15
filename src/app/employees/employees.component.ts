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
      status: 'On Leave',
      performance: 80,
      image: 'https://i.pravatar.cc/100?img=18'
    },

    {
      name: 'Priya',
      email: 'priya@gmail.com',
      department: 'UI/UX',
      role: 'UI Designer',
      experience: '3 Years',
      status: 'Active',
      performance: 88,
      image: 'https://i.pravatar.cc/100?img=32'
    },

    {
      name: 'Karthika',
      email: 'karthika@gmail.com',
      department: 'Testing',
      role: 'QA Engineer',
      experience: '6 Years',
      status: 'Active',
      performance: 92,
      image: 'https://i.pravatar.cc/100?img=45'
    },

    {
      name: 'Sneha',
      email: 'sneha@gmail.com',
      department: 'HR',
      role: 'HR Manager',
      experience: '7 Years',
      status: 'On Leave',
      performance: 75,
      image: 'https://i.pravatar.cc/100?img=25'
    },

    {
      name: 'Arun',
      email: 'arun@gmail.com',
      department: 'Support',
      role: 'Support Engineer',
      experience: '2 Years',
      status: 'Active',
      performance: 70,
      image: 'https://i.pravatar.cc/100?img=60'
    },

    {
      name: 'Divya',
      email: 'divya@gmail.com',
      department: 'Development',
      role: 'Frontend Developer',
      experience: '4 Years',
      status: 'Active',
      performance: 95,
      image: 'https://i.pravatar.cc/100?img=15'
    },

    {
      name: 'Vijay',
      email: 'vijay@gmail.com',
      department: 'Marketing',
      role: 'Marketing Lead',
      experience: '5 Years',
      status: 'Active',
      performance: 82,
      image: 'https://i.pravatar.cc/100?img=68'
    },

    {
      name: 'Meena',
      email: 'meena@gmail.com',
      department: 'Finance',
      role: 'Accountant',
      experience: '8 Years',
      status: 'On Leave',
      performance: 78,
      image: 'https://i.pravatar.cc/100?img=49'
    },

    {
      name: 'siva',
      email: 'siva@gmail.com',
      department: 'Security',
      role: 'Security Analyst',
      experience: '5 Years',
      status: 'Active',
      performance: 85,
      image: 'https://i.pravatar.cc/100?img=53'
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

      this.saveEmployees();

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
    // ACTIVE EMPLOYEES

  get activeEmployeesCount() {

    return this.employees.filter(
      emp => emp.status === 'Active'
    ).length;

  }

  // ON LEAVE EMPLOYEES

  get onLeaveEmployeesCount() {

    return this.employees.filter(
      emp => emp.status === 'On Leave'
    ).length;

  }

  // TOTAL DEPARTMENTS

  get departmentsCount() {

    const departments = this.employees.map(
      emp => emp.department
    );

    return new Set(departments).size;

  }
  }