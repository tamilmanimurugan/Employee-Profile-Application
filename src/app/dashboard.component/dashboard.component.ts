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
  today      = new Date();

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
    // Show cached data immediately — no skeleton wait
    const raw = localStorage.getItem('employees');
    if (raw) {
      const local: Employee[] = JSON.parse(raw);
      this.setData(local);
      this.loading = false;
    } else {
      this.loading = true;
    }

    // Fetch fresh from API in background
    this.api.getAll().subscribe({
      next: (data) => {
        this.setData(data);
        this.loading = false;
        if (data.length > 0) {
          localStorage.setItem('employees', JSON.stringify(data));
        }
      },
      error: () => {
        if (!raw) {
          this.setData([]);
        }
        this.loading = false;
      }
    });
  }

  private setData(data: Employee[]): void {
    this.employees        = data;
    this.totalCount       = data.length;
    this.activeCount      = data.filter(e => e.status === 'Active').length;
    this.onLeaveCount     = data.filter(e => e.status === 'On Leave').length;
    this.departmentsCount = new Set(data.map(e => e.department)).size;
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