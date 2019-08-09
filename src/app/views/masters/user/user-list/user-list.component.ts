import { Component, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MatSort, MatTableDataSource } from '@angular/material';

import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { SnackbarService } from '../../../../services/snackbar.service';
import { HttpService } from '../../../../services/http.service';
import { AppConfigService } from '../../../../services/app-config.service';
import { MasterService } from '../../../../services/master.service';

import * as _ from 'lodash';

// export class UserListTable {
//   displayedColumns = ['DisplayName', 'email_id', 'MobileNo', 'UserCode'];
//   dataSource = ELEMENT_DATA;
// }

export interface UserElement {
  DisplayName: string;
  email_id: string;
  MobileNo: string;
  UserCode: string;
}

const ELEMENT_DATA: UserElement[] = [];

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  userForm: FormGroup;
  public modalRef: BsModalRef;

  displayedColumns: string[] = ['DisplayName', 'email_id', 'MobileNo', 'UserCode'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private modalService: BsModalService,
    private snackbarService: SnackbarService,
    private httpService: HttpService,
    private appConfigService: AppConfigService,
    private masterService: MasterService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  options: any;
  role_id: number = 0;
  ngOnInit() {
    try{
      console.log('In user list');
      this.getUserList();
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  list_user: any = [];
  getUserList(){
    try{
      this.masterService.selectUser().subscribe((res: any) => {
        console.log('res', res);
        if(res.status.trim().toLowerCase() === 'success'){
          this.list_user = res.data;
          this.dataSource = this.list_user;
        }else{
          this.snackbarService.openSnackBar(res[0].message, 'Close', 'error-snackbar');
        }
      });
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  objUser: any;
  resetUserObject(){
    try{
      this.objUser = {
        user_id: 0,
        user_code: null,
        first_name: null,
        last_name: null,
        user_name: null,
        password: null,
        mobile_number: null,
        alternate_contact_numbers: null,
        email_id: null,
        alternate_email_id: null,
        active: 1
      }
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  bindUserData(){
    try{
      this.userForm = this.formBuilder.group({
        user_id: [this.objUser.user_id, Validators.required],
        first_name: [this.objUser.first_name, Validators.required],
        last_name: [this.objUser.last_name, Validators.required],
        user_name: [this.objUser.user_name, Validators.required],
        password: [this.objUser.password, Validators.required],
        mobile_number: [this.objUser.mobile_number, Validators.required],
        alternate_contact_numbers: [this.objUser.alternate_contact_numbers, Validators.required],
        email_id: [this.objUser.email_id, Validators.required],
        alternate_email_id: [this.objUser.alternate_email_id, Validators.required],
        active: [this.objUser.active],

      });
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  saveuser(){
    try{

      let userData = [];
      if(userData){

      }else{
        userData = [];
      }

      userData.push(this.userForm.value);

      this.modalRef.hide();
      this.getUserList();
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  addUser(){
    try{
      this.router.navigate(['/user/registration', {user_id: 0, profile_type: 'create'}]);
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  editUser(obj){
    try{
      console.log('obj', obj);
      this.router.navigate(['/user/registration', {user_id: obj.UserId, profile_type: 'edit'}]);
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  user_name_modal: string;
  deleteUserConfirmation(template: TemplateRef<any>, objUser){
    try{

      if(objUser){
        this.user_name_modal = objUser.user_name;

        this.resetUserObject();
        // Assign selected district obj to district object of view (i.e. html)
        this.objUser = objUser;
        this.bindUserData();

        this.modalRef = this.modalService.show(template);
      }
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  reason: string;
  deleteUser(){
    try{

      let data = {
        'objUserData': this.userForm.value
      }

      this.userForm.value.reason = this.reason;

      console.log(this.userForm.value);

      this.httpService.put('deleteUser', data).subscribe((res: any) => {

        console.log(res);

        if(res.status === 'success'){
          this.snackbarService.openSnackBar('Data deleted successfully', 'Close', 'success-snackbar');
          this.modalRef.hide();

          this.getUserList(); // Bind user data
        }else{
          this.snackbarService.openSnackBar(res.message, 'Close', 'error-snackbar');
        }
      }, (err) => {
        this.snackbarService.openSnackBar(err.statusText, 'Close', 'error-snackbar');
      });

      this.modalRef.hide();

    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  closeModal(template: TemplateRef<any>){
    try{
      this.modalRef.hide();
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }
}
