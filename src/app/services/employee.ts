import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class EmployeeService {

  apiUrl = 'https://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient) {}

  getEmployees() {

    return this.http.get<any[]>(this.apiUrl);

  }

  addEmployee(employee: any) {

    return this.http.post(
      this.apiUrl,
      employee
    );

  }

}