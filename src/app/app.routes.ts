import { Routes } from '@angular/router';

import { LoginComponent } from './login.component/login.component';

import { DashboardComponent } from './dashboard.component/dashboard.component';

import { ProfileComponent } from './profile.component/profile.component';

import { LayoutComponent } from './layout.component/layout.component';

import { AuthGuard } from './auth.guard/auth.guard';

import { EmployeesComponent } from './employees/employees.component';

import { AttendanceComponent } from './attendance.component/attendance.component';

import { SettingsComponent } from './settings.component/settings.component';

import { EmployeeDetailsComponent } from './employee-details/employee-details.component';

import { ContactComponent } from './contact/contact.component';
export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],

    children: [

      {
        path: 'dashboard',
        component: DashboardComponent
      },

      {
        path: 'employees',
        component: EmployeesComponent
      },

      {
        path: 'attendance',
        component: AttendanceComponent
      },

      {
        path: 'profile',
        component: ProfileComponent
      },

      {
        path: 'settings',
        component: SettingsComponent
      },

      {
  path: 'contact',
  component: ContactComponent
},

      {
        path: 'employee-details',
        component: EmployeeDetailsComponent
      }

    ]
  }

];  