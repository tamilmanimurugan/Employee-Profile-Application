import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ReportRow {
  storyNumber: string;
  storyName:   string;
  project:     string;
  subProject:  string;
  assignedUser: string;
  teamLead:    string;
  projectManager: string;
  resolvedDate: string; // ISO yyyy-mm-dd
}

const ALL_REPORTS: ReportRow[] = [
  { storyNumber: '5335', storyName: 'Bind Angular dashboard cards and charts to API response', project: 'EmployeeProfileManagement', subProject: 'Dashboard', assignedUser: 'Tamilmani Murugan', teamLead: 'Amzath Khan', projectManager: 'Victor Joseph Clement', resolvedDate: '2026-06-08' },
  { storyNumber: '5336', storyName: 'Build Angular login flow and protected route handling',   project: 'EmployeeProfileManagement', subProject: 'Authentication', assignedUser: 'Tamilmani Murugan', teamLead: 'Amzath Khan', projectManager: 'Victor Joseph Clement', resolvedDate: '2026-06-08' },
  { storyNumber: '5337', storyName: 'Build employee list and employee detail UI pages',         project: 'EmployeeProfileManagement', subProject: 'EmployeeProfile', assignedUser: 'Tamilmani Murugan', teamLead: 'Amzath Khan', projectManager: 'Victor Joseph Clement', resolvedDate: '2026-06-08' },
  { storyNumber: '5340', storyName: 'Build reports page with month filter and download action', project: 'EmployeeProfileManagement', subProject: 'Reports', assignedUser: 'Tamilmani Murugan', teamLead: 'Amzath Khan', projectManager: 'Victor Joseph Clement', resolvedDate: '2026-06-08' },
  { storyNumber: '5320', storyName: 'Mobile responsive UI for Dashboard and Attendance',        project: 'EmployeeProfileManagement', subProject: 'Dashboard', assignedUser: 'Gnanasekar Devendran', teamLead: 'Amzath Khan', projectManager: 'Victor Joseph Clement', resolvedDate: '2026-06-06' },
  { storyNumber: '5321', storyName: 'Mobile responsive UI for Employees and Settings',          project: 'EmployeeProfileManagement', subProject: 'EmployeeProfile', assignedUser: 'Gnanasekar Devendran', teamLead: 'Amzath Khan', projectManager: 'Victor Joseph Clement', resolvedDate: '2026-06-06' },
  { storyNumber: '5300', storyName: 'Setup Angular project with routing and layout',            project: 'EmployeeProfileManagement', subProject: 'Setup', assignedUser: 'Tamilmani Murugan', teamLead: 'Amzath Khan', projectManager: 'Victor Joseph Clement', resolvedDate: '2026-05-15' },
  { storyNumber: '5301', storyName: 'Integrate Employee API service',                           project: 'EmployeeProfileManagement', subProject: 'EmployeeProfile', assignedUser: 'Tamilmani Murugan', teamLead: 'Amzath Khan', projectManager: 'Victor Joseph Clement', resolvedDate: '2026-05-20' },
  { storyNumber: '5302', storyName: 'Build attendance tracking UI',                             project: 'EmployeeProfileManagement', subProject: 'Attendance', assignedUser: 'Tamilmani Murugan', teamLead: 'Amzath Khan', projectManager: 'Victor Joseph Clement', resolvedDate: '2026-05-25' },
];

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {

  selectedMonth = '';
  selectedYear  = '';
  submitted     = false;

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

  get filtersSelected(): boolean {
    return !!this.selectedMonth && !!this.selectedYear;
  }

  get filteredReports(): ReportRow[] {
    if (!this.filtersSelected) return [];
    const prefix = `${this.selectedYear}-${this.selectedMonth}`;
    return ALL_REPORTS.filter(r => r.resolvedDate.startsWith(prefix));
  }

  get hasSearched(): boolean {
    return this.submitted;
  }

  search(): void {
    this.submitted = true;
  }

  download(): void {
    if (!this.filtersSelected) return;

    const monthLabel = this.months.find(m => m.value === this.selectedMonth)?.label ?? this.selectedMonth;
    const title = `Employee Portal Report — ${monthLabel} ${this.selectedYear}`;

    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFontSize(16);
    doc.text(title, 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 22);

    const rows = this.filteredReports.map(r => [
      r.storyNumber,
      r.storyName,
      r.project,
      r.subProject,
      r.assignedUser,
      r.resolvedDate,
      r.teamLead,
      r.projectManager,
    ]);

    autoTable(doc, {
      startY: 28,
      head: [['Story #', 'Story Name', 'Project', 'Sub-Project', 'Assigned User', 'Resolved Date', 'Team Lead', 'Project Manager']],
      body: rows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [37, 99, 235] },
    });

    doc.save(`report-${this.selectedYear}-${this.selectedMonth}.pdf`);
  }
}
