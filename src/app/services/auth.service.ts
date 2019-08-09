import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AuthService {
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private router: Router
  ) {}

  get isLoggedIn() {
    if (sessionStorage.getItem('userInfo')) {
      this.loggedIn.next(true);
    } else {
      this.loggedIn.next(false);
    }
    return this.loggedIn.asObservable();
  }

  getUserInfo() {
    if (sessionStorage.getItem('userInfo')) {
      return JSON.parse(sessionStorage.getItem('userInfo'));
    } else {
      return false;
    }
  }

  getAuthToken() {
    if (sessionStorage.getItem('authToken')) {
      return JSON.parse(sessionStorage.getItem('authToken'));
    } else {
      return false;
    }
  }

  login(user: any) {
    if (user.user_name !== '' && user.password !== '' ) {
      this.loggedIn.next(true);
      // console.log('Hey');
      console.log('sessionStorage.getItem(authToken)', sessionStorage.getItem('authToken'))
      if (sessionStorage.getItem('authToken')) {
        let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        this.router.navigate(['/dashboard']);
      }
    }
  }

  logout() {
    sessionStorage.clear();
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }
}
