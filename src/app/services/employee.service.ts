import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class EmployeeService {

  apiUrl = 'https://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient) {}

  // GET API
  getEmployees() {

    return this.http.get<any[]>(this.apiUrl);

  }

  // POST API
  addEmployee(employee: any) {

    return this.http.post(
      this.apiUrl,
      employee
    );

  }

}