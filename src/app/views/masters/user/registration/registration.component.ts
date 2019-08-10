import { Component, OnInit, TemplateRef, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
// import { UserService } from '../services/user.service';

import { SnackbarService } from '../../../../services/snackbar.service';
import { HttpService } from '../../../../services/http.service';
import { AppConfigService } from '../../../../services/app-config.service';
import { MasterService } from '../../../../services/master.service';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  // providers: [UserService]
})

export class RegistrationComponent implements OnInit {

  // registerForm: FormGroup;
  // cities = ['','Thane','Airoli','Bandra','Andheri'];
  // states = ['', 'Maharashtra','Punjab','Banglore'];
  // submitted = false;

  userForm: FormGroup;
  charactersPattern = "^[a-zA-Z \-\']+";
  characterPattern = "^[a-zA-Z]+";
  mobnumPattern = "^((\\+91-?)|0)?[0-9]{10}$";
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  passwordPattern = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}';

  userId: number = 0;
  objSessionInfo: any;
  pageTitle: string = 'Add User';
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private httpService: HttpService,
    private appConfigService: AppConfigService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private snackbarService: SnackbarService,
    // private userService: UserService
  ) { }

  ngOnInit() {
    console.log('In registration component');
    // this.resetRegistrationForm();
    this.objSessionInfo = this.appConfigService.getSessionObj('userInfo');
    console.log('this.objSessionInfo');
    console.log(this.objSessionInfo);
    this.route.params.subscribe(params => {

      this.userId = params.userId;
      console.log('this.userId', this.userId);
      this.resetUserObject();
      this.bindUserData();

      if(params['userId'] > 0) {
        this.pageTitle = 'Edit User';
        this.getUserDetails();
      }
    });
  }

  // resetRegistrationForm(){
  //   this.resetRegistrationObject();
  //   this.buildRegistrationForm();
  // }

  objUser: any;
  resetUserObject(){
    try{
      this.objUser = {
        userId: this.userId > 0 ? Number(this.userId) : 0,
        userCode: null,
        firstName: null,
        lastName: null,
        photoPath: null,
        password: null,
        mobileNo: null,
        email_Id: null,
        joiningDate: null,
        createdBy: this.appConfigService.getSessionObj('userInfo').userId,
        updatedBy: this.appConfigService.getSessionObj('userInfo').userId,
        isActive: 1,
      }
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }
  getUserDetails(){
    try{

      this.httpService.post(`Selectuserbyid`, {userId: this.userId}).subscribe((res: any) => {
        console.log('res', res);

        if(res && res.status.trim().toLowerCase() == 'success'){
          this.objUser = JSON.parse(JSON.stringify({...this.objUser, ...res.data }));
          console.log('this.objUser', this.objUser);
          this.bindUserData();
        }else {
          this.snackbarService.openSnackBar(res.message, 'Close', 'error-snackbar');
        }
      }, (err) => {
        this.snackbarService.openSnackBar(err.statusText, 'Close', 'error-snackbar');
      });
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }
  bindUserData(){
    try{
      this.userForm = this.formBuilder.group({
        userId: [this.objUser.userId, Validators.required],
        userCode: [this.objUser.userCode, Validators.required],
        firstName: [this.objUser.firstName, [Validators.required, Validators.pattern(this.charactersPattern)]],
        lastName: [this.objUser.lastName, [Validators.required, Validators.pattern(this.charactersPattern)]],
        photoPath: '',
        password: [this.objUser.password, Validators.required],
        // password: [{value: this.objUser.password, disabled: (this.objSessionInfo.user_id == 1 ? false : true)}, [Validators.required, Validators.pattern(this.passwordPattern)]],
        mobileNo: [this.objUser.mobileNo, [Validators.required, Validators.pattern(this.mobnumPattern)]],
        email_Id: [this.objUser.email_Id, [Validators.required, Validators.pattern(this.emailPattern)]],
        joiningDate: [this.objUser.joiningDate],
        createdBy: [this.objUser.createdBy, Validators.required],
        updatedBy: [this.objUser.updatedBy, Validators.required],
        isActive: [this.objUser.isActive, Validators.required]
      });

      this.findInvalidControls();
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  aplphabetsOnly(event: any) {
    try{

      var value = String.fromCharCode(event.which);
      if(/^[a-zA-Z \-\']+$/.test(value)){

      }else{
        return false;
      }
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  showLoading: boolean = false;
  saveUserProfile(){
    try{
      this.showLoading = true;
      let data = this.userForm.getRawValue();
      console.log('data', data);
      let urlValue = this.userId > 0 ? `UpdateUser` : `Userinsert`;
      this.httpService.post(urlValue, data).subscribe((res: any) => {
        console.log('res', res);
        this.showLoading = false;
        if(res && res.status.trim().toLowerCase() == 'success'){
          this.snackbarService.openSnackBar(res.message, 'Close', 'success-snackbar');
          this.location.back();
        }else {
          this.snackbarService.openSnackBar(res.message, 'Close', 'error-snackbar');
        }

      }, (err) => {
        this.snackbarService.openSnackBar(err.statusText, 'Close', 'error-snackbar');
      });
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.userForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    console.log('invalid controls');
    console.log(invalid);
  }

  // convenience getter for easy access to form fields
  // get f() { return this.registerForm.controls; }
}
