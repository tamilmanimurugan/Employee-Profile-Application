import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  users: any[] = [];

  constructor() { }

  addUser(user: any) {
    this.users.push(user);
  }

  getUsers() {
    return this.users;
  }

}