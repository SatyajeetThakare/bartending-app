import { Component, OnInit, TemplateRef, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
// import { RoleService } from '../services/role.service';

import { SnackbarService } from '../../../../services/snackbar.service';
import { HttpService } from '../../../../services/http.service';
import { AppConfigService } from '../../../../services/app-config.service';
import { MasterService } from '../../../../services/master.service';


@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss'],
  // providers: [RoleService]
})

export class AddRoleComponent implements OnInit {

  // registerForm: FormGroup;
  // cities = ['','Thane','Airoli','Bandra','Andheri'];
  // states = ['', 'Maharashtra','Punjab','Banglore'];
  // submitted = false;

  roleForm: FormGroup;
  charactersPattern = "^[a-zA-Z \-\']+";
  characterPattern = "^[a-zA-Z]+";
  mobnumPattern = "^((\\+91-?)|0)?[0-9]{10}$";
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  passwordPattern = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}';

  roleId: number = 0;
  objSessionInfo: any;
  pageTitle: string = 'Add Role';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private httpService: HttpService,
    private appConfigService: AppConfigService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private snackbarService: SnackbarService,
    // private roleService: RoleService
  ) { }

  ngOnInit() {
    console.log('In add-role component');
    // this.resetAddRoleForm();
    this.objSessionInfo = this.appConfigService.getSessionObj('userInfo');
    console.log('this.objSessionInfo');
    console.log(this.objSessionInfo);

    this.route.params.subscribe(params => {

      this.roleId = params.role_id;
      console.log('this.roleId', this.roleId);
      this.resetRoleObject();
      this.bindRoleData();

      if(params['role_id'] > 0) {
        this.pageTitle = 'Edit Role';
        this.getRoleDetails();
      }
    });
  }

  // resetAddRoleForm(){
  //   this.resetAddRoleObject();
  //   this.buildAddRoleForm();
  // }

  objRole: any;
  resetRoleObject(){
    try{
      this.objRole = {
        roleId: this.roleId > 0 ? Number(this.roleId) : 0,
        roleName: null,
        roleDescription: null,
        createdBy: this.appConfigService.getSessionObj('userInfo').userId,
        updatedBy: this.appConfigService.getSessionObj('userInfo').userId,
        isActive: 1,
      }
      console.log('this.objRole', this.objRole);
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  bindRoleData(){
    try{
      this.roleForm = this.formBuilder.group({
        roleId: [this.objRole.roleId, Validators.required],
        roleName: [this.objRole.roleName, Validators.required],
        roleDescription: [this.objRole.roleDescription, [Validators.required, Validators.pattern(this.charactersPattern)]],
        createdBy: [this.objRole.createdBy, Validators.required],
        updatedBy: [this.objRole.updatedBy, Validators.required],
        isActive: [this.objRole.isActive, Validators.required]
      });
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  getRoleDetails(){
    try{

      this.httpService.post(`Selectrolebyid`, {roleId: this.roleId}).subscribe((res: any) => {
        console.log('res', res);

        if(res && res.status.trim().toLowerCase() == 'success'){
          this.objRole = JSON.parse(JSON.stringify({...this.objRole, ...res.data }));
          console.log('this.objRole', this.objRole);
          this.bindRoleData();
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

  resetFormData(){
    this.resetRoleObject();
    this.bindRoleData();
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
  saveRole(){
    try{

      this.showLoading = true;

      let data = this.roleForm.getRawValue();

      console.log('data', data);

      let urlValue = this.roleId > 0 ? `Roleupdate` : `Roleinsert`;

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
    const controls = this.roleForm.controls;
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
