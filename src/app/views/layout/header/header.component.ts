import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
// import { Observable } from 'rxjs/Observable';
import { Observable, of as observableOf } from 'rxjs';
import { Injectable } from '@angular/core';

import { HttpService } from '../../../services/http.service';
import { AppConfigService } from '../../../services/app-config.service';
import { AuthService } from '../../../services/auth.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLoggedIn$: Observable<boolean>;
  selectAllValue: boolean;
  isUserValid: boolean = false;
  userInfo: any;

  constructor(private httpService: HttpService, private appConfigService: AppConfigService, private authService: AuthService,
    private snackbarService: SnackbarService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    try{
      // console.log('In header component');
      this.userInfo = this.authService.getUserInfo();
      // console.log('this.userInfo', this.userInfo);
      this.isLoggedIn$ = this.authService.isLoggedIn;
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  user_name: string = null;
  getUserName(){
    try{
      this.userInfo = this.authService.getUserInfo();
      // console.log('this.userInfo', this.userInfo)
      this.user_name = this.userInfo.firstName + ' ' + this.userInfo.lastName;
      return this.user_name;
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  displayMenu(){
    try{
      this.userInfo = this.authService.getUserInfo();
      if(this.userInfo.role_id == 1){
        return true;
      }else{
        return false;
      }
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  // navigate(pageId){
  //   try{
  //
  //     console.log('Hey')
  //     if(pageId === 1){
  //       this.router.navigate(['/admin-dashboard']);
  //     }else if(pageId === 2){
  //       this.router.navigate(['/user-dashboard']);
  //     }else if(pageId === 3){
  //       this.router.navigate(['/building-info-entry']);
  //     }else{
  //       alert('Wrong input');
  //     }
  //   }catch(e){
  //     this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
  //   }
  // }

  logout(){
    try{
      this.authService.logout();
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  // navigateToMaster(masterName: string): void{
  //   try {
  //     this.router.navigate([`/${masterName}`]);
  //   } catch (e) {
  //     this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
  //   }
  // }

  navigateToUserProfile(){
    try{

      this.userInfo = this.authService.getUserInfo();
      console.log('this.userInfo', this.userInfo);
      if(this.userInfo){
        this.router.navigate(['/user-profile', {user_id: this.userInfo.user_id, profile_type: 'edit'}]);
      }
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

}
