import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { EmployeeApiService } from '../services/employee-api.service';
import { Employee } from '../services/employee.model';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  private readonly api = inject(EmployeeApiService);

  selectedMonth = '';
  selectedYear  = '';
  submitted     = false;

  private allEmployees: Employee[] = [];

  readonly months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  readonly years = ['2026', '2025', '2024'];

  ngOnInit(): void {
    this.api.getAll().subscribe({
      next: emps => { this.allEmployees = emps; },
      error: () => { this.allEmployees = []; }
    });
  }

  get filtersSelected(): boolean {
    return !!this.selectedMonth && !!this.selectedYear;
  }

  get filteredReports(): Employee[] {
    if (!this.filtersSelected) return [];
    const prefix = `${this.selectedYear}-${this.selectedMonth}`;
    return this.allEmployees.filter(e => e.createdAtUtc?.startsWith(prefix));
  }

  get hasSearched(): boolean {
    return this.submitted;
  }

  search(): void {
    this.submitted = true;
  }

  download(): void {
    if (!this.filtersSelected || this.filteredReports.length === 0) return;

    const monthLabel = this.months.find(m => m.value === this.selectedMonth)?.label ?? this.selectedMonth;
    const title = `Employee Report — ${monthLabel} ${this.selectedYear}`;

    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFontSize(16);
    doc.text(title, 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 22);

    const rows = this.filteredReports.map(e => [
      e.name,
      e.email,
      e.department,
      e.role,
      e.status,
      String(e.performance ?? ''),
      e.createdAtUtc ? new Date(e.createdAtUtc).toLocaleDateString() : '',
    ]);

    autoTable(doc, {
      startY: 28,
      head: [['Name', 'Email', 'Department', 'Role', 'Status', 'Performance', 'Joined Date']],
      body: rows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [37, 99, 235] },
    });

    doc.save(`employee-report-${this.selectedYear}-${this.selectedMonth}.pdf`);
  }
}
