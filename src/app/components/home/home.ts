import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmployeeService, Employee } from '../../services/employee.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  employees: Employee[] = [];
  loading = true;

  get totalEmployees() { return this.employees.length; }
  get activeEmployees() { return this.employees.filter(e => e.status === 'Active').length; }
  get departments() { return new Set(this.employees.map(e => e.department)).size; }
  get avgSalary() {
    if (!this.employees.length) return 0;
    return Math.round(this.employees.reduce((s, e) => s + e.salary, 0) / this.employees.length);
  }

  constructor(private empService: EmployeeService) {}

  ngOnInit() {
    this.empService.getEmployees().subscribe({
      next: data => { this.employees = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}