import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService, Employee } from '../../services/employee.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employees.html',
  styleUrls: ['./employees.css']
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  filtered: Employee[] = [];
  search = '';
  deptFilter = '';
  statusFilter = '';
  sortField: keyof Employee = 'name';
  sortAsc = true;
  loading = true;
  showModal = false;
  editMode = false;
  saving = false;
  toast = '';
  toastType: 'success' | 'error' = 'success';
  deleteEmployeeId: number | null = null;
  avatarPreview = '';
  currentStep = 1;
  form: Employee = this.blank();
  isDirty = false;
  showUnsavedWarning = false;
  pageSize = 10;
  currentPage = 1;
  selectedIds = new Set<number>();

  get deptList() { return [...new Set(this.employees.map(e => e.department))].sort(); }
  get totalActive() { return this.employees.filter(e => e.status === 'Active').length; }
  get totalInactive() { return this.employees.filter(e => e.status === 'Inactive').length; }
  get avgSalary() {
    if (!this.employees.length) return 0;
    return Math.round(this.employees.reduce((s, e) => s + e.salary, 0) / this.employees.length);
  }
  get totalPages() { return Math.ceil(this.filtered.length / this.pageSize); }
  get paginatedList() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }
  get pageNumbers() { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }
  get allSelected() { return this.paginatedList.length > 0 && this.paginatedList.every(e => this.selectedIds.has(e.id)); }
  get someSelected() { return this.selectedIds.size > 0; }

  min(a: number, b: number) { return Math.min(a, b); }

  constructor(
    private empService: EmployeeService,
    public cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() { this.load(); }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.showUnsavedWarning) { this.showUnsavedWarning = false; return; }
    if (this.showModal) this.tryClose();
    if (this.deleteEmployeeId !== null) this.closeDeleteModal();
  }

  navigateTo(id: number) { this.router.navigate(['/employees', id]); }

  load() {
    this.loading = true;
    this.cdr.detectChanges();
    this.empService.getEmployees().subscribe({
      next: (data: Employee[]) => {
        this.employees = data ?? [];
        this.filtered = [...this.employees];
        this.applyFilter();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.employees = [];
        this.filtered = [];
        this.loading = false;
        this.cdr.detectChanges();
        this.showToast('Could not connect to server', 'error');
      }
    });
  }

  applyFilter() {
    const q = this.search.toLowerCase();
    let list = this.employees.filter(e =>
      (!q || e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q) ||
       e.email.toLowerCase().includes(q) || e.department.toLowerCase().includes(q)) &&
      (!this.deptFilter || e.department === this.deptFilter) &&
      (!this.statusFilter || e.status === this.statusFilter)
    );
    list = list.sort((a, b) => {
      const av = String(a[this.sortField]).toLowerCase();
      const bv = String(b[this.sortField]).toLowerCase();
      return this.sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    this.filtered = list;
    this.currentPage = 1;
    this.selectedIds.clear();
    this.cdr.detectChanges();
  }

  sortBy(field: keyof Employee) {
    if (this.sortField === field) this.sortAsc = !this.sortAsc;
    else { this.sortField = field; this.sortAsc = true; }
    this.applyFilter();
  }

  sortIcon(field: keyof Employee) {
    if (this.sortField !== field) return '↕';
    return this.sortAsc ? '↑' : '↓';
  }

  goToPage(p: number) {
    this.currentPage = p;
    this.selectedIds.clear();
    this.cdr.detectChanges();
  }

  prevPage() { if (this.currentPage > 1) this.goToPage(this.currentPage - 1); }
  nextPage() { if (this.currentPage < this.totalPages) this.goToPage(this.currentPage + 1); }

  toggleAll() {
    if (this.allSelected) this.paginatedList.forEach(e => this.selectedIds.delete(e.id));
    else this.paginatedList.forEach(e => this.selectedIds.add(e.id));
    this.cdr.detectChanges();
  }

  toggleSelect(id: number) {
    if (this.selectedIds.has(id)) this.selectedIds.delete(id);
    else this.selectedIds.add(id);
    this.cdr.detectChanges();
  }

  bulkDelete() {
    if (!confirm(`Delete ${this.selectedIds.size} employees? This cannot be undone.`)) return;
    const ids = [...this.selectedIds];
    let done = 0;
    ids.forEach(id => {
      this.empService.deleteEmployee(id).subscribe({
        next: () => {
          done++;
          if (done === ids.length) {
            this.showToast(`${ids.length} removed`);
            this.selectedIds.clear();
            this.load();
          }
        }
      });
    });
  }

  bulkSetStatus(status: string) {
    const ids = [...this.selectedIds];
    let done = 0;
    ids.forEach(id => {
      const emp = this.employees.find(e => e.id === id);
      if (!emp) return;
      this.empService.updateEmployee(id, { ...emp, status }).subscribe({
        next: () => {
          done++;
          if (done === ids.length) {
            this.showToast(`${ids.length} set to ${status}`);
            this.selectedIds.clear();
            this.load();
          }
        }
      });
    });
  }

  exportExcel() {
    const data = this.filtered.map(e => ({
      'Name': e.name, 'Role': e.role, 'Department': e.department,
      'Email': e.email, 'Phone': e.phone,
      'Salary': e.salary, 'Join Date': e.joinDate, 'Status': e.status
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Employees');
    XLSX.writeFile(wb, 'employees.xlsx');
    this.showToast('Excel downloaded');
  }

  exportCSV() {
    const headers = ['Name','Role','Department','Email','Phone','Salary','Join Date','Status'];
    const rows = this.filtered.map(e =>
      [e.name,e.role,e.department,e.email,e.phone,e.salary,e.joinDate,e.status].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'employees.csv'; a.click();
    URL.revokeObjectURL(url);
    this.showToast('CSV downloaded');
  }

  exportPDF() {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`
      <html><head><style>
        body{font-family:Arial,sans-serif;padding:24px;color:#0f172a}
        h2{color:#4f46e5;margin-bottom:4px}
        p{color:#64748b;font-size:13px;margin-bottom:16px}
        table{width:100%;border-collapse:collapse}
        th{background:#4f46e5;color:white;padding:10px 12px;text-align:left;font-size:12px}
        td{padding:9px 12px;font-size:12px;border:1px solid #e2e8f0}
        tr:nth-child(even) td{background:#f8fafc}
      </style></head><body>
        <h2>Employee Report</h2>
        <p>Generated: ${new Date().toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}
        &nbsp;·&nbsp; ${this.filtered.length} records</p>
        <table>
          <thead>
            <tr><th>#</th><th>Name</th><th>Role</th><th>Department</th>
            <th>Email</th><th>Salary</th><th>Joined</th><th>Status</th></tr>
          </thead>
          <tbody>
            ${this.filtered.map((e, i) => `<tr>
              <td>${i+1}</td><td>${e.name}</td><td>${e.role}</td>
              <td>${e.department}</td><td>${e.email}</td>
              <td>&#8377;${e.salary.toLocaleString('en-IN')}</td>
              <td>${e.joinDate}</td><td>${e.status}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </body></html>`);
    w.document.close();
    w.print();
  }

  openAdd() {
    this.form = this.blank();
    this.editMode = false;
    this.showModal = true;
    this.avatarPreview = '';
    this.currentStep = 1;
    this.isDirty = false;
    document.body.style.overflow = 'hidden';
  }

  openEdit(e: Employee) {
    this.form = { ...e };
    this.editMode = true;
    this.showModal = true;
    this.avatarPreview = e.photoBase64 || '';
    this.currentStep = 1;
    this.isDirty = false;
    document.body.style.overflow = 'hidden';
  }

  markDirty() { this.isDirty = true; }

  tryClose() {
    if (this.isDirty) this.showUnsavedWarning = true;
    else this.closeModal();
  }

  closeModal() {
    this.showModal = false;
    this.showUnsavedWarning = false;
    this.isDirty = false;
    document.body.style.overflow = '';
  }

  nextStep() { this.currentStep = 2; }
  prevStep() { this.currentStep = 1; }

  isStep1Valid() {
    return !!(this.form.name && this.form.email &&
      this.form.email.includes('@') && this.form.phone);
  }

  isStep2Valid() {
    return !!(this.form.role && this.form.department &&
      this.form.salary > 0 && this.form.joinDate);
  }

  onAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      console.log('File selected:', file.name, 'Size:', file.size);

      if (file.size > 1024 * 1024) {
        this.showToast('Photo must be under 1MB', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.avatarPreview    = e.target?.result as string;
        this.form.photoBase64 = this.avatarPreview;
        this.isDirty          = true;
        console.log('Photo loaded into form, length:', this.form.photoBase64?.length);
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  getPhoto(emp: Employee): string {
    return emp.photoBase64 || '';
  }

  save() {
    this.saving = true;

    console.log('=== SAVE CALLED ===');
    console.log('editMode:', this.editMode);
    console.log('form.id:', this.form.id);
    console.log('photoBase64 length:', this.form.photoBase64?.length ?? 0);
    console.log('photoBase64 start:', this.form.photoBase64?.substring(0, 60) ?? 'EMPTY');

    const payload: Employee = {
      id:          this.form.id,
      name:        this.form.name,
      role:        this.form.role,
      email:       this.form.email,
      phone:       this.form.phone,
      department:  this.form.department,
      salary:      this.form.salary,
      status:      this.form.status,
      joinDate:    this.form.joinDate,
      photoBase64: this.form.photoBase64 || ''
    };

    console.log('payload.photoBase64 length:', payload.photoBase64?.length ?? 0);

    const call = this.editMode
      ? this.empService.updateEmployee(payload.id, payload)
      : this.empService.addEmployee(payload);

    call.subscribe({
      next: (response: any) => {
        console.log('Save response photoBase64 length:', response?.photoBase64?.length ?? 0);
        this.load();
        this.closeModal();
        this.saving = false;
        this.showToast(this.editMode ? 'Employee updated' : 'Employee added');
      },
      error: (err: any) => {
        console.error('Save error:', err);
        this.saving = false;
        this.showToast('Save failed', 'error');
      }
    });
  }

  openDeleteModal(id: number) { this.deleteEmployeeId = id; }

  confirmDelete() {
    if (this.deleteEmployeeId === null) return;
    this.empService.deleteEmployee(this.deleteEmployeeId).subscribe({
      next: () => {
        this.load();
        this.showToast('Employee removed');
        this.deleteEmployeeId = null;
      },
      error: () => {
        this.showToast('Delete failed', 'error');
        this.deleteEmployeeId = null;
      }
    });
  }

  closeDeleteModal() { this.deleteEmployeeId = null; }

  showToast(msg: string, type: 'success' | 'error' = 'success') {
    this.toast = msg; this.toastType = type;
    setTimeout(() => { this.toast = ''; this.cdr.detectChanges(); }, 3000);
  }

  initials(name: string) {
    return name.split(' ').slice(0, 2)
      .map((w: string) => w[0] || '').join('').toUpperCase();
  }

  formatSalary(val: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(val);
  }

  blank(): Employee {
    return {
      id: 0, name: '', role: '', email: '', phone: '',
      department: '', salary: 0, status: 'Active',
      joinDate: '', photoBase64: ''
    };
  }
}