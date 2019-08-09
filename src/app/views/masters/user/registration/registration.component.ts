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
    this.resetUserObject();
    this.bindUserData();
  }

  // resetRegistrationForm(){
  //   this.resetRegistrationObject();
  //   this.buildRegistrationForm();
  // }

  objUser: any;
  resetUserObject(){
    try{
      this.objUser = {
        UserId: 0,
        usercode: null,
        firstname: null,
        lastname: null,
        photopath: null,
        password: null,
        mobileno: null,
        emailid: null,
        joiningdate: null,
        isactive: 1,
      }
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  bindUserData(){
    try{
      this.userForm = this.formBuilder.group({
        UserId: [this.objUser.UserId, Validators.required],
        usercode: [this.objUser.usercode, Validators.required],
        firstname: [this.objUser.firstname, [Validators.required, Validators.pattern(this.charactersPattern)]],
        lastname: [this.objUser.lastname, [Validators.required, Validators.pattern(this.charactersPattern)]],
        photopath: [this.objUser.photopath],
        password: [this.objUser.password, Validators.required],
        // password: [{value: this.objUser.password, disabled: (this.objSessionInfo.role_id == 1 ? false : true)}, [Validators.required, Validators.pattern(this.passwordPattern)]],
        mobileno: [this.objUser.mobileno, [Validators.required, Validators.pattern(this.mobnumPattern)]],
        emailid: [this.objUser.emailid, [Validators.required, Validators.pattern(this.emailPattern)]],
        joiningdate: [this.objUser.joiningdate],
        isactive: [this.objUser.isactive, Validators.required]
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

      this.httpService.post(`Userinsert`, data).subscribe((res: any) => {
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

  onSubmit() {
    console.log("Submitted");
    // console.log("form value",this.registerForm.value);
  }

}
