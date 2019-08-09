import { Component, OnInit, TemplateRef, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
// import { UserRoleMappingService } from '../services/user-role-mapping.service';

import { SnackbarService } from '../../../../services/snackbar.service';
import { HttpService } from '../../../../services/http.service';
import { AppConfigService } from '../../../../services/app-config.service';
import { MasterService } from '../../../../services/master.service';


@Component({
  selector: 'app-add-user-role-mapping',
  templateUrl: './add-user-role-mapping.component.html',
  styleUrls: ['./add-user-role-mapping.component.scss'],
  // providers: [UserRoleMappingService]
})

export class AddUserRoleMappingComponent implements OnInit {

  // registerForm: FormGroup;
  // cities = ['','Thane','Airoli','Bandra','Andheri'];
  // states = ['', 'Maharashtra','Punjab','Banglore'];
  // submitted = false;

  userRoleMappingForm: FormGroup;
  charactersPattern = "^[a-zA-Z \-\']+";
  characterPattern = "^[a-zA-Z]+";
  mobnumPattern = "^((\\+91-?)|0)?[0-9]{10}$";
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  passwordPattern = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}';

  userRoleMappingId: number = 0;
  objSessionInfo: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private httpService: HttpService,
    private appConfigService: AppConfigService,
    private masterService: MasterService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private snackbarService: SnackbarService,
    // private user-role-mappingService: UserRoleMappingService
  ) { }

  ngOnInit() {
    console.log('In add-user-role-mapping component');
    // this.resetAddUserRoleMappingForm();
    this.objSessionInfo = this.appConfigService.getSessionObj('userInfo');
    console.log('this.objSessionInfo', this.objSessionInfo);

    this.getUserList();
    this.getRoleList();

    this.resetUserRoleMappingObject();
    this.bindUserRoleMappingData();
  }

  list_user: any = [];
  getUserList(){
    try{
      this.masterService.selectUser().subscribe((res: any) => {
        console.log('res', res);
        if(res.status.trim().toLowerCase() === 'success'){
          this.list_user = res.data;
        }else{
          this.snackbarService.openSnackBar(res[0].message, 'Close', 'error-snackbar');
        }
      });
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  list_role: any = [];
  getRoleList(){
    try{
      this.masterService.selectRole().subscribe((res: any) => {
        console.log('res', res);
        if(res.status.trim().toLowerCase() === 'success'){
          this.list_role = res.data;
        }else{
          this.snackbarService.openSnackBar(res[0].message, 'Close', 'error-snackbar');
        }
      });
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  objUserRoleMapping: any;
  resetUserRoleMappingObject(){
    try{
      this.objUserRoleMapping = {
        UserRoleMappingId: 0,
        UserId: null,
        RoleId: null,
        createdby: this.appConfigService.getSessionObj('userInfo').UserId,
        updatedby: this.appConfigService.getSessionObj('userInfo').UserId,
        IsActive: 1,
      }
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  bindUserRoleMappingData(){
    try{
      this.userRoleMappingForm = this.formBuilder.group({
        UserRoleMappingId: [this.objUserRoleMapping.UserRoleMappingId, Validators.required],
        UserId: [this.objUserRoleMapping.UserId, Validators.required],
        RoleId: [this.objUserRoleMapping.RoleId, Validators.required],
        createdby: [this.objUserRoleMapping.createdby, Validators.required],
        updatedby: [this.objUserRoleMapping.updatedby, Validators.required],
        IsActive: [this.objUserRoleMapping.IsActive, Validators.required]
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
  saveUserRoleMapping(){
    try{

      this.showLoading = true;

      let data = this.userRoleMappingForm.getRawValue();

      console.log('data', data);

      this.httpService.post(`Userrolemapping`, data).subscribe((res: any) => {
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
    const controls = this.userRoleMappingForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    console.log('invalid controls');
    console.log(invalid);
  }

  onSubmit() {
    console.log("Submitted");
    // console.log("form value",this.registerForm.value);
  }

}
