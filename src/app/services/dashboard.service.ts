import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EmployeeApiService } from './employee-api.service';
import { Employee } from './employee.model';

export interface DashboardSummary {
  totalCount: number;
  activeCount: number;
  onLeaveCount: number;
  departmentsCount: number;
  employees: Employee[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {

  constructor(private api: EmployeeApiService) {}

  getSummary(): Observable<DashboardSummary> {
    return this.api.getAll().pipe(
      map(employees => ({
        totalCount:       employees.length,
        activeCount:      employees.filter(e => e.status === 'Active').length,
        onLeaveCount:     employees.filter(e => e.status === 'On Leave').length,
        departmentsCount: new Set(employees.map(e => e.department?.trim()).filter(Boolean)).size,
        employees
      }))
    );
  }
}
