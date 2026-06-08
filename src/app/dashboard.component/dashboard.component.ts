import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DashboardService } from '../services/dashboard.service';
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
  apiError   = '';
  today      = new Date();

  employees: Employee[] = [];

  totalCount       = 0;
  activeCount      = 0;
  onLeaveCount     = 0;
  departmentsCount = 0;

  constructor(
    private router: Router,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    const raw = localStorage.getItem('employees');
    if (raw) {
      this.applyData(JSON.parse(raw));
    } else {
      this.loading = true;
    }

    this.dashboardService.getSummary().subscribe({
      next: (summary) => {
        this.totalCount       = summary.totalCount;
        this.activeCount      = summary.activeCount;
        this.onLeaveCount     = summary.onLeaveCount;
        this.departmentsCount = summary.departmentsCount;
        this.employees        = summary.employees;
        this.loading          = false;
        this.apiError         = '';
        if (summary.employees.length > 0) {
          localStorage.setItem('employees', JSON.stringify(summary.employees));
        }
      },
      error: () => {
        this.loading  = false;
        this.apiError = 'Could not load latest data — showing cached results.';
        if (!raw) {
          this.applyData([]);
        }
      }
    });
  }

  private applyData(data: Employee[]): void {
    this.employees        = data;
    this.totalCount       = data.length;
    this.activeCount      = data.filter(e => e.status === 'Active').length;
    this.onLeaveCount     = data.filter(e => e.status === 'On Leave').length;
    this.departmentsCount = new Set(data.map(e => e.department?.trim()).filter(Boolean)).size;
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