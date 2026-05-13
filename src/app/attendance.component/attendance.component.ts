import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

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

  attendanceMarked = false;

  ngOnInit(): void {

    this.updateDateTime();

    setInterval(() => {

      this.updateDateTime();

    }, 1000);

  }

  updateDateTime() {

    const now = new Date();

    this.currentDate = now.toDateString();

    this.currentTime = now.toLocaleTimeString();

    const hours = now.getHours() - 9;

    const mins = now.getMinutes();

    this.workingHours = `${hours}h ${mins}m`;

  }

  openAttendanceModal() {

    this.showAttendanceModal = true;

  }

  closeAttendanceModal() {

    this.showAttendanceModal = false;

  }

  markAttendance() {

    this.attendanceMarked = true;

    this.showAttendanceModal = false;

    setTimeout(() => {

      this.attendanceMarked = false;

    }, 3000);

  }

}