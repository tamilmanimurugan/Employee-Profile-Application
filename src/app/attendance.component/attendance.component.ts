import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EmployeeApiService } from '../services/employee-api.service';
import { Employee } from '../services/employee.model';

@Component({
  selector: 'app-attendance.component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css',
})
export class AttendanceComponent implements OnInit {

  currentDate: string = '';
  currentTime: string = '';
  workingHours: string = '0h 00m';

  showAttendanceModal = false;
  attendanceMarked    = false;
  loading             = true;

  employees:   Employee[] = [];
  activeList:  Employee[] = [];
  leaveList:   Employee[] = [];

  get activeCount()  { return this.activeList.length;  }
  get leaveCount()   { return this.leaveList.length;   }
  get absentCount()  { return Math.max(0, this.employees.length - this.activeList.length - this.leaveList.length); }
  get totalCount()   { return this.employees.length;   }

  constructor(private api: EmployeeApiService) {}

  ngOnInit(): void {
    this.updateDateTime();
    setInterval(() => this.updateDateTime(), 1000);

    this.api.getAll().subscribe({
      next: (data) => {
        this.employees  = data;
        this.activeList = data.filter(e => e.status === 'Active');
        this.leaveList  = data.filter(e => e.status === 'On Leave');
        this.loading    = false;
      },
      error: () => { this.loading = false; }
    });
  }

  updateDateTime() {
    const now = new Date();
    this.currentDate = now.toDateString();
    this.currentTime = now.toLocaleTimeString();
    const hours = Math.max(0, now.getHours() - 9);
    const mins  = now.getMinutes();
    this.workingHours = `${hours}h ${mins}m`;
  }

  openAttendanceModal()  { this.showAttendanceModal = true;  }
  closeAttendanceModal() { this.showAttendanceModal = false; }

  markAttendance() {
    this.attendanceMarked = true;
    this.showAttendanceModal = false;
    setTimeout(() => { this.attendanceMarked = false; }, 3000);
  }
}
