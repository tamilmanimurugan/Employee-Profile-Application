import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EmployeeApiService } from '../services/employee-api.service';
import { Employee } from '../services/employee.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],

  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  searchText = '';
  showModal  = false;
  submitted  = false;
  loading    = false;

  employees: Employee[] = [];

  // Real counts from API
  totalCount      = 0;
  activeCount     = 0;
  onLeaveCount    = 0;
  departmentsCount = 0;

  constructor(
    private router: Router,
    private api: EmployeeApiService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.api.getAll().subscribe({
      next: (data) => {
        this.employees        = data;
        this.totalCount       = data.length;
        this.activeCount      = data.filter(e => e.status === 'Active').length;
        this.onLeaveCount     = data.filter(e => e.status === 'On Leave').length;
        this.departmentsCount = new Set(data.map(e => e.department)).size;
        this.loading = false;
      },
      error: () => {
        // API offline — fall back to localStorage so dashboard isn't blank
        const raw = localStorage.getItem('employees');
        const local: Employee[] = raw ? JSON.parse(raw) : [];
        this.employees        = local;
        this.totalCount       = local.length;
        this.activeCount      = local.filter(e => e.status === 'Active').length;
        this.onLeaveCount     = local.filter(e => e.status === 'On Leave').length;
        this.departmentsCount = new Set(local.map(e => e.department)).size;
        this.loading = false;
      }
    });
  }

  openModal()  { this.showModal = true;  this.submitted = false; }
  closeModal() { this.showModal = false; }

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