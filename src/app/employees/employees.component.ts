import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { timeout } from 'rxjs/operators';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { EmployeeApiService } from '../services/employee-api.service';
import { Employee, CreateEmployeePayload } from '../services/employee.model';

const LS_KEY = 'employees';
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const NAME_MAX_LENGTH = 100;

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
  loading     = false;   // true while fetching list data (skeleton)
  saving      = false;   // true while add/update API call in progress
  apiOnline   = false;   // true when API responded
  apiError    = '';
  saveError   = '';      // error shown inside the modal
  statusMsg   = '';      // shown in the UI header
  currentId:  number | null = null;
  currentCreatedAt: string | undefined = undefined;
  nextLocalId = 1000;

  employee: CreateEmployeePayload = this.emptyForm();

  constructor(
    private readonly api:    EmployeeApiService,
    private readonly router: Router
  ) {}

  ngOnInit(): void { this.loadEmployees(); }

  // ── Load employees — API first, localStorage only if API is truly offline ──

  private loadEmployees(): void {
    this.apiError = '';

    // Show cached data immediately — no skeleton wait
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      this.employees = JSON.parse(raw);
      this.loading   = false;
    } else {
      this.loading   = true;
    }

    // Fetch fresh from API in background
    this.api.getAll().subscribe({
      next: (data) => {
        this.employees = data;
        this.apiOnline = true;
        this.loading   = false;
        this.statusMsg = '';

        if (data.length > 0) {
          localStorage.setItem(LS_KEY, JSON.stringify(data));
        }
      },
      error: (err) => {
        this.apiOnline = false;
        this.loading   = false;
        this.statusMsg = 'API offline — using local data';

        if (!raw) {
          this.employees = [];
        }
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
    this.saveError = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.submitted = false;
    this.saveError = '';
    this.saving    = false;
  }

  // ── Add ────────────────────────────────────────────────────────────────────

  addEmployee(): void {
    this.submitted = true;
    if (!this.isFormValid()) return;

    if (!this.employee.image) {
      this.employee.image = this.pickUniqueAvatar();
    }

    // API requires non-empty strings and valid int for performance
    const payload = {
      ...this.employee,
      department:  this.employee.department?.trim()  || 'N/A',
      role:        this.employee.role?.trim()        || 'N/A',
      experience:  this.employee.experience?.trim()  || 'N/A',
      performance: this.employee.performance ?? 0,
    };

    // Optimistic add — close modal and show employee instantly
    const tempId  = -(Date.now());
    const tempEmp: Employee = { ...payload, id: tempId };
    this.employees = [...this.employees, tempEmp]
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    this.closeModal();

    if (this.apiOnline) {
      this.api.create(payload).pipe(timeout(15000)).subscribe({
        next: (created) => {
          // Replace temp entry with real server data (includes createdAtUtc, real id)
          this.employees = this.employees.map(e => e.id === tempId ? { ...e, ...created } : e);
          localStorage.setItem(LS_KEY, JSON.stringify(this.employees));
        },
        error: () => {
          // Revert optimistic add silently — employee was not saved
          this.employees = this.employees.filter(e => e.id !== tempId);
          localStorage.setItem(LS_KEY, JSON.stringify(this.employees));
        }
      });
    } else {
      // Offline fallback — replace temp id with a real local id
      this.employees = this.employees.map(e =>
        e.id === tempId ? { ...e, id: this.nextLocalId++ } : e
      );
      this.saveLocalStorage();
    }
  }

  // ── Edit ───────────────────────────────────────────────────────────────────

  editEmployee(emp: Employee): void {
    this.editMode       = true;
    this.submitted      = false;
    this.currentId      = emp.id ?? null;
    this.currentCreatedAt = emp.createdAtUtc;
    this.saveError      = '';
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

    // Optimistic update — apply changes to UI immediately and close modal
    const original = this.employees.find(e => e.id === this.currentId);
    this.employees = this.employees.map(e =>
      e.id === this.currentId ? { ...e, ...this.employee } : e
    );
    this.closeModal();

    if (this.apiOnline) {
      const updatePayload = {
        ...this.employee,
        department:  this.employee.department?.trim()  || 'N/A',
        role:        this.employee.role?.trim()        || 'N/A',
        experience:  this.employee.experience?.trim()  || 'N/A',
        performance: this.employee.performance ?? 0,
      };
      this.api.update(this.currentId, updatePayload).subscribe({
        next: (updated) => {
          // Replace optimistic entry with full server response (includes updatedAtUtc etc.)
          this.employees = this.employees.map(e => e.id === updated.id ? updated : e);
        },
        error: (err) => {
          // Revert to original on failure
          if (original) {
            this.employees = this.employees.map(e => e.id === this.currentId ? original : e);
          }
          alert('Update failed: ' + err.message);
        }
      });
    } else {
      this.saveLocalStorage();
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────

  deleteEmployee(emp: Employee): void {
    if (!confirm(`Delete ${emp.name}?`)) return;

    if (this.apiOnline) {
      this.api.delete(emp.id!).subscribe({
        next:  () => { this.employees = this.employees.filter(e => e.id !== emp.id); },
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

  get nameRequired():    boolean { return this.submitted && !this.employee.name?.trim(); }
  get nameTooLong():     boolean { return this.submitted && !!this.employee.name?.trim() && this.employee.name.trim().length > NAME_MAX_LENGTH; }
  get nameCharCount():   number  { return this.employee.name?.length ?? 0; }
  get emailRequired():   boolean { return this.submitted && !this.employee.email?.trim(); }
  get emailInvalid():    boolean { return this.submitted && !!this.employee.email?.trim() && !EMAIL_REGEX.test(this.employee.email.trim()); }
  get emailDuplicate():  boolean {
    if (!this.submitted || !this.employee.email?.trim()) return false;
    const lower = this.employee.email.trim().toLowerCase();
    return this.employees.some(e => e.email.toLowerCase() === lower && e.id !== this.currentId);
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
      this.employee.name?.trim()                         &&
      this.employee.name.trim().length <= 100            &&
      this.employee.email?.trim()                        &&
      EMAIL_REGEX.test(this.employee.email.trim())       &&
      !this.emailDuplicate
    );
  }

  private pickUniqueAvatar(): string {
    const name  = encodeURIComponent(this.employee.name.trim() || 'Employee');
    const colors = ['2563eb','7c3aed','059669','ea580c','db2777','0891b2'];
    const bg    = colors[Math.floor(Math.random() * colors.length)];
    return `https://ui-avatars.com/api/?name=${name}&background=${bg}&color=fff&size=128&bold=true&rounded=true`;
  }
}
