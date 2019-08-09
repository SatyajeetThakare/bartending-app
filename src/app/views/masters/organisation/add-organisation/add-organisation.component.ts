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
  selector: 'app-add-organisation',
  templateUrl: './add-organisation.component.html',
  styleUrls: ['./add-organisation.component.scss'],
  // providers: [UserService]
})

export class AddOrganisationComponent implements OnInit {

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
    console.log('In add-organisation component');
    // this.resetAddOrganisationForm();
    this.objSessionInfo = this.appConfigService.getSessionObj('userInfo');
    console.log('this.objSessionInfo');
    console.log(this.objSessionInfo);
    this.resetUserObject();
    this.bindUserData();

    this.getOrganisationDetails();
  }

  // resetAddOrganisationForm(){
  //   this.resetAddOrganisationObject();
  //   this.buildAddOrganisationForm();
  // }

  getOrganisationDetails(){
    try{

      this.httpService.post(`selectOrgbyid`, {orgId: 1}).subscribe((res: any) => {
        console.log('res', res);

        if(res && res.status.trim().toLowerCase() == 'success'){

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

  objUser: any;
  resetUserObject(){
    try{
      this.objUser = {
        OrgId: 0,
        OrgName: null,
        OrgDescription: null,
        created_by: this.appConfigService.getSessionObj('userInfo').UserId,
        isactive: 1,
      }
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  bindUserData(){
    try{
      this.userForm = this.formBuilder.group({
        OrgId: [this.objUser.OrgId, Validators.required],
        OrgName: [this.objUser.OrgName, Validators.required],
        OrgDescription: [this.objUser.OrgDescription, [Validators.required, Validators.pattern(this.charactersPattern)]],
        created_by: [this.objUser.created_by, Validators.required],
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
  saveOrganisation(){
    try{

      this.showLoading = true;

      let data = this.userForm.getRawValue();

      console.log('data', data);

      this.httpService.post(`Orginsert`, data).subscribe((res: any) => {
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
