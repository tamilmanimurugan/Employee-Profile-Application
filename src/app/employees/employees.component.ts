  import { Component, OnInit } from '@angular/core';

  import { CommonModule } from '@angular/common';

  import { FormsModule } from '@angular/forms';

  import { Router } from '@angular/router';
  import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

submitted = false;

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

 this.submitted = true;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const namePattern = /^[A-Za-z ]+$/;

if (
 !this.employee.name.trim() ||
 !this.employee.email.trim() ||
 !this.employee.department.trim() ||
 !this.employee.role.trim() ||
 !this.employee.experience.trim()
){
 return;
}

if(!namePattern.test(this.employee.name)){
 alert('Name should contain only letters');
 return;
}

if(!emailPattern.test(this.employee.email)){
 alert('Enter valid email');
 return;
}

if(this.employee.department.length < 3){
 alert('Department name too short');
 return;
}

if(this.employee.role.length < 3){
 alert('Role name too short');
 return;
}

this.employees.push({
 ...this.employee
});

this.saveEmployees();
this.closeModal();
this.submitted = false;
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

downloadEmployeePDF() {

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Employee Report', 14, 15);

  doc.setFontSize(10);
  doc.text(
    'Generated : ' +
    new Date().toLocaleDateString(),
    14,
    25
  );

  autoTable(doc, {

    startY: 35,

    head: [[
      'Name',
      'Department',
      'Role',
      'Experience',
      'Status',
      'Performance'
    ]],

    body: this.employees.map(emp => [

      emp.name,
      emp.department,
      emp.role,
      emp.experience,
      emp.status,
      emp.performance + '%'

    ])

  });

  doc.save('employee-report.pdf');

}


// PRINT EMPLOYEE LIST

printEmployees() {

  window.print();

}
// EXPORT EXCEL

exportExcel() {

  import('xlsx').then((XLSX) => {

    const employeeData = this.employees.map(emp => ({

      Name: emp.name,
      Email: emp.email,
      Department: emp.department,
      Role: emp.role,
      Experience: emp.experience,
      Status: emp.status,
      Performance: emp.performance + '%'

    }));

    const worksheet =
      XLSX.utils.json_to_sheet(employeeData);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(

      workbook,
      worksheet,
      'Employees'

    );

    XLSX.writeFile(

      workbook,
      'employees-report.xlsx'

    );

  });

}
  }