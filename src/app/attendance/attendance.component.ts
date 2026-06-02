import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-attendance',
  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './attendance.html',
  styleUrls: ['./attendance.component.css']
})

export class AttendanceComponent {

  attendanceList = [

    {
      date: '10-05-2026',
      status: 'Present'
    },

    {
      date: '11-05-2026',
      status: 'Absent'
    },

    {
      date: '12-05-2026',
      status: 'Present'
    }

  ];

}