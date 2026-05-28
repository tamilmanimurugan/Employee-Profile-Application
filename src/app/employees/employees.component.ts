import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { EmployeeApiService } from '../services/employee-api.service';
import { Employee, CreateEmployeePayload } from '../services/employee.model';

const LS_KEY = 'employees';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  employees:  Employee[] = [];
  searchText  = '';
  submitted   = false;
  showModal   = false;
  editMode    = false;
  loading     = false;
  apiOnline   = false;   // true when API responded
  apiError    = '';
  statusMsg   = '';      // shown in the UI header
  currentId:  number | null = null;
  nextLocalId = 1000;

  employee: CreateEmployeePayload = this.emptyForm();

  constructor(
    private readonly api:    EmployeeApiService,
    private readonly router: Router
  ) {}

  ngOnInit(): void { this.loadEmployees(); }

  // ── Load employees — API first, localStorage only if API is truly offline ──

  private loadEmployees(): void {
    this.loading  = true;
    this.apiError = '';

    this.api.getAll().subscribe({
      next: (data) => {
        this.employees = data;
        this.apiOnline = true;
        this.loading   = false;
        this.statusMsg = '';

        // Clear stale localStorage so old data doesn't cause confusion
        localStorage.removeItem(LS_KEY);
      },
      error: (err) => {
        this.apiOnline = false;
        this.loading   = false;
        this.statusMsg = 'API offline — using local data';

        // Only fall back to localStorage when API is genuinely unreachable
        const raw = localStorage.getItem(LS_KEY);
        this.employees = raw ? JSON.parse(raw) : [];
        const max = Math.max(0, ...this.employees.map(e => e.id ?? 0));
        this.nextLocalId = max + 1;

        console.warn('[Employees] API unavailable, using localStorage:', err.message);
      }
    });
  }

  // ── Modal ──────────────────────────────────────────────────────────────────

  openAddModal(): void {
    this.editMode  = false;
    this.submitted = false;
    this.currentId = null;
    this.employee  = this.emptyForm();
    this.apiError  = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.submitted = false;
    this.apiError  = '';
  }

  // ── Add ────────────────────────────────────────────────────────────────────

  addEmployee(): void {
    this.submitted = true;
    if (!this.isFormValid()) return;

    if (!this.employee.image) {
      this.employee.image = this.pickUniqueAvatar();
    }

    if (this.apiOnline) {
      // ✅ Save to SQL Server via API
      this.loading = true;
      this.api.create(this.employee).subscribe({
        next:  () => { this.loadEmployees(); this.closeModal(); },
        error: (err) => { this.apiError = err.message; this.loading = false; }
      });
    } else {
      // Offline fallback — save to localStorage only
      const newEmp: Employee = { ...this.employee, id: this.nextLocalId++ };
      this.employees = [...this.employees, newEmp];
      this.saveLocalStorage();
      this.closeModal();
    }
  }

  // ── Edit ───────────────────────────────────────────────────────────────────

  editEmployee(emp: Employee): void {
    this.editMode  = true;
    this.submitted = false;
    this.currentId = emp.id ?? null;
    this.apiError  = '';
    this.employee  = {
      name: emp.name, email: emp.email, department: emp.department,
      role: emp.role, experience: emp.experience, status: emp.status,
      performance: emp.performance, image: emp.image
    };
    this.showModal = true;
  }

  updateEmployee(): void {
    this.submitted = true;
    if (!this.isFormValid() || this.currentId === null) return;

    if (this.apiOnline) {
      this.loading = true;
      this.api.update(this.currentId, this.employee).subscribe({
        next:  () => { this.loadEmployees(); this.closeModal(); },
        error: (err) => { this.apiError = err.message; this.loading = false; }
      });
    } else {
      this.employees = this.employees.map(e =>
        e.id === this.currentId ? { ...e, ...this.employee } : e
      );
      this.saveLocalStorage();
      this.closeModal();
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────

  deleteEmployee(emp: Employee): void {
    if (!confirm(`Delete ${emp.name}?`)) return;

    if (this.apiOnline) {
      this.api.delete(emp.id!).subscribe({
        next:  () => this.loadEmployees(),
        error: (err) => alert('Delete failed: ' + err.message)
      });
    } else {
      this.employees = this.employees.filter(e => e.id !== emp.id);
      this.saveLocalStorage();
    }
  }

  // ── View details ───────────────────────────────────────────────────────────

  viewEmployee(emp: Employee): void {
    localStorage.setItem('selectedEmployee', JSON.stringify(emp));
    this.router.navigate(['/employee-details']);
  }

  // ── Image upload ───────────────────────────────────────────────────────────

  onImageSelected(event: any): void {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { this.employee.image = reader.result as string; };
    reader.readAsDataURL(file);
  }

  // ── Computed ───────────────────────────────────────────────────────────────

  get filteredEmployees(): Employee[] {
    const q = this.searchText.toLowerCase();
    if (!q) return this.employees;
    return this.employees.filter(e =>
      e.name.toLowerCase().includes(q)       ||
      e.email.toLowerCase().includes(q)      ||
      e.department.toLowerCase().includes(q)
    );
  }

  get activeEmployeesCount():  number { return this.employees.filter(e => e.status === 'Active').length; }
  get onLeaveEmployeesCount(): number { return this.employees.filter(e => e.status === 'On Leave').length; }
  get departmentsCount():      number { return new Set(this.employees.map(e => e.department)).size; }

  // ── Export ─────────────────────────────────────────────────────────────────

  downloadEmployeePDF(): void {
    const doc = new jsPDF();
    doc.setFontSize(18); doc.text('Employee Report', 14, 15);
    doc.setFontSize(10); doc.text('Generated: ' + new Date().toLocaleDateString(), 14, 25);
    autoTable(doc, {
      startY: 35,
      head: [['Name','Department','Role','Experience','Status','Performance']],
      body: this.employees.map(e => [e.name, e.department, e.role, e.experience, e.status, e.performance + '%'])
    });
    doc.save('employee-report.pdf');
  }

  printEmployees(): void { window.print(); }

  exportExcel(): void {
    import('xlsx').then(XLSX => {
      const data = this.employees.map(e => ({
        Name: e.name, Email: e.email, Department: e.department,
        Role: e.role, Experience: e.experience, Status: e.status,
        Performance: e.performance + '%'
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Employees');
      XLSX.writeFile(wb, 'employees-report.xlsx');
    });
  }

  // ── Private ────────────────────────────────────────────────────────────────

  private saveLocalStorage(): void {
    localStorage.setItem(LS_KEY, JSON.stringify(this.employees));
  }

  private emptyForm(): CreateEmployeePayload {
    return { name:'', email:'', department:'', role:'', experience:'', status:'Active', performance:80, image:'' };
  }

  private isFormValid(): boolean {
    return !!(
      this.employee.name?.trim()       &&
      this.employee.email?.trim()      &&
      this.employee.department?.trim() &&
      this.employee.role?.trim()       &&
      this.employee.experience?.trim()
    );
  }

  private pickUniqueAvatar(): string {
    const used = this.employees
      .map(e => { const m = e.image?.match(/img=(\d+)/); return m ? +m[1] : -1; })
      .filter(n => n > 0);
    let n: number, tries = 0;
    do { n = Math.floor(Math.random() * 70) + 1; tries++; }
    while (used.includes(n) && tries < 100);
    return `https://i.pravatar.cc/100?img=${n}`;
  }
}
