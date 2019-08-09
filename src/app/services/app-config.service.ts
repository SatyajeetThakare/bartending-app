import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';

import { HttpService } from './http.service';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

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

  getDistrictList() {
    try {
      return this.httpService.post('getDistrictList', this.data);
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  getCityList() {
    try {
      return this.httpService.post('getCityList', this.data);
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  getAreaList() {
    try {
      return this.httpService.post('getAreaList', this.data);
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  getBuildingGradeList() {
    try {
      return this.httpService.post('getBuildingGradeList', this.data);
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  getDesignationList() {
    try {
      return this.httpService.post('getDesignationList', this.data);
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  getFloorGradeList() {
    try {
      return this.httpService.post('getFloorGradeList', this.data);
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  getUsageList() {
    try {
      return this.httpService.post('getUsageList', this.data);
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  getUnitGradeList() {
    try {
      return this.httpService.post('getUnitGradeList', this.data);
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  getUserList() {
    try {
      return this.httpService.get('getUserList/4');
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  getVisitorList() {
    try {
      return this.httpService.get('getVisitorList');
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  getAllUserList() {
    try {
      return this.httpService.get('getUserList/0');
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  getRoleList() {
    try {
      return this.httpService.get('getRoleList');
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  getOpportunityList() {
    try {
      return this.httpService.post('getOpportunityList', this.data);
    } catch (e) {
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
