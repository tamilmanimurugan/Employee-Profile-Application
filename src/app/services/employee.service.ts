import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Employee {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  department: string;
  salary: number;
  status: string;
  joinDate: string;
  photoBase64?: string;   // ← add this
}

@Injectable({ providedIn: 'root' })
export class EmployeeService {

  private baseUrl = 'http://localhost:5028/api/employees';

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.baseUrl);
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/${id}`);
  }

  addEmployee(emp: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.baseUrl, emp);
  }

  updateEmployee(id: number, emp: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.baseUrl}/${id}`, emp);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  uploadPhoto(id: number, photoBase64: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/photo`, { photoBase64 });
  }
}