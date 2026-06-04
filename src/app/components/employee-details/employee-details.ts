import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmployeeService, Employee } from '../../services/employee.service';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './employee-details.html',
  styleUrls: ['./employee-details.css']
})
export class EmployeeDetailsComponent implements OnInit {

  employee: Employee | null = null;
  loading = true;
  showEditModal = false;
  showDeleteModal = false;
  saving = false;
  toast = '';
  toastType: 'success' | 'error' = 'success';
  avatarPreview = '';
  currentStep = 1;
  form: Employee = this.blank();

  constructor(
    private route: ActivatedRoute,
    private empService: EmployeeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) { this.loading = false; this.cdr.detectChanges(); return; }
    this.empService.getEmployeeById(id).subscribe({
      next: (data: Employee) => {
        this.employee = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.employee = null;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get initials(): string {
    if (!this.employee) return '';
    return this.employee.name.split(' ').slice(0, 2).map((w: string) => w[0] || '').join('').toUpperCase();
  }

  get formInitials(): string {
    if (!this.form.name) return '?';
    return this.form.name.split(' ').slice(0, 2).map((w: string) => w[0] || '').join('').toUpperCase();
  }

  get yearsAtCompany(): string {
    if (!this.employee?.joinDate) return '—';
    const joined = new Date(this.employee.joinDate);
    if (isNaN(joined.getTime())) return '—';
    const now = new Date();
    const totalMonths = (now.getFullYear() - joined.getFullYear()) * 12 + (now.getMonth() - joined.getMonth());
    if (totalMonths < 1) return 'Just joined';
    if (totalMonths < 12) return `${totalMonths} month${totalMonths > 1 ? 's' : ''}`;
    const y = Math.floor(totalMonths / 12);
    const m = totalMonths % 12;
    return m > 0 ? `${y}y ${m}m` : `${y} year${y > 1 ? 's' : ''}`;
  }

  get formattedJoinDate(): string {
    if (!this.employee?.joinDate) return '—';
    const d = new Date(this.employee.joinDate);
    if (isNaN(d.getTime())) return this.employee.joinDate;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  get formattedSalary(): string {
    if (!this.employee) return '—';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(this.employee.salary);
  }

  formatSalary(val: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(val);
  }

  openEdit() {
    if (!this.employee) return;
    this.form = { ...this.employee };
    this.avatarPreview = '';
    this.currentStep = 1;
    this.showEditModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeEdit() {
    this.showEditModal = false;
    document.body.style.overflow = '';
  }

  nextStep() { this.currentStep = 2; }
  prevStep() { this.currentStep = 1; }

  isStep1Valid(): boolean {
    return !!(this.form.name && this.form.email && this.form.email.includes('@') && this.form.phone);
  }

  isStep2Valid(): boolean {
    return !!(this.form.role && this.form.department && this.form.salary > 0 && this.form.joinDate);
  }

  onAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.avatarPreview = e.target?.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  save() {
    this.saving = true;
    this.empService.updateEmployee(this.form.id, this.form).subscribe({
      next: () => {
        this.employee = { ...this.form };
        this.closeEdit();
        this.saving = false;
        this.cdr.detectChanges();
        this.showToast('Employee updated successfully');
      },
      error: () => {
        this.saving = false;
        this.showToast('Failed to update', 'error');
      }
    });
  }

  openDelete() {
    this.showDeleteModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeDelete() {
    this.showDeleteModal = false;
    document.body.style.overflow = '';
  }

  confirmDelete() {
    if (!this.employee) return;
    this.empService.deleteEmployee(this.employee.id).subscribe({
      next: () => {
        this.closeDelete();
        this.showToast('Employee deleted');
        setTimeout(() => window.history.back(), 1200);
      },
      error: () => this.showToast('Failed to delete', 'error')
    });
  }

  showToast(msg: string, type: 'success' | 'error' = 'success') {
    this.toast = msg;
    this.toastType = type;
    setTimeout(() => { this.toast = ''; this.cdr.detectChanges(); }, 3200);
  }

  blank(): Employee {
    return { id: 0, name: '', role: '', email: '', phone: '', department: '', salary: 0, status: 'Active', joinDate: '' };
  }
}