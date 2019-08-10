import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';

import { HttpService } from './http.service';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  data: any = {
    "objUserData": {
      // "user_id": this.getSessionObj('userInfo') ? this.getSessionObj('userInfo').user_id : null
      "user_id": 1,
    }
  }

  constructor(private http: HttpClient,
    private httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute,
    private snackbarService: SnackbarService
  ) {

    // console.log(this.getSessionObj('userInfo'));
  }

  selectUser() {
    try {
      return this.httpService.get('Selectuser');
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  selectOrg() {
    try {
      return this.httpService.get('Selectorg');
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  selectRole() {
    try {
      return this.httpService.get('Selectrole');
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }
  selectModule(){
    try{
      return this.httpService.get('Selectmodule');
    } catch (e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }
  selectCourse(){
    try{
      return this.httpService.get('selectCourse');
    } catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }
  setSessionObj(key: string, data: any): void {
    sessionStorage.setItem(key, JSON.stringify(data));
  }

  getSessionObj(key: string) {
    return JSON.parse(sessionStorage.getItem(key));
  }

  logout() {
    try {
      sessionStorage.clear();
      this.router.navigate(['/login']);
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  authenticateUser() {
    try {
      let userInfo = this.getSessionObj('userInfo');
      // console.log('userInfo');
      // console.log(userInfo);

      if (userInfo) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }
}
