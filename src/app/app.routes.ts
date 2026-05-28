import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login';
import { HomeComponent } from './components/home/home';
import { EmployeesComponent } from './components/employees/employees';
import { EmployeeDetailsComponent } from './components/employee-details/employee-details';
import { DepartmentsComponent } from './components/departments/departments';
import { ContactComponent } from './components/contact/contact';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard]
  },

  {
    path: 'employees',
    component: EmployeesComponent,
    canActivate: [authGuard]
  },

  {
    path: 'employees/:id',
    component: EmployeeDetailsComponent,
    canActivate: [authGuard]
  },

  {
    path: 'departments',
    component: DepartmentsComponent,
    canActivate: [authGuard]
  },

  {
    path: 'contact',
    component: ContactComponent,
    canActivate: [authGuard]
  },

  {
    path: '**',
    redirectTo: ''
  }

];