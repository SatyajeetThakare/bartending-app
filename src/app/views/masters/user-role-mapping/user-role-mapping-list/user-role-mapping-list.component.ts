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

// export class UserRoleMappingListTable {
//   displayedColumns = ['DisplayName', 'email_id', 'MobileNo', 'UserRoleMappingCode'];
//   dataSource = ELEMENT_DATA;
// }

export interface UserRoleMappingElement {
  DisplayName: string;
  email_id: string;
  MobileNo: string;
  UserRoleMappingCode: string;
}

const ELEMENT_DATA: UserRoleMappingElement[] = [];

@Component({
  selector: 'app-user-role-mapping-list',
  templateUrl: './user-role-mapping-list.component.html',
  styleUrls: ['./user-role-mapping-list.component.css']
})
export class UserRoleMappingListComponent implements OnInit {

  displayedColumns: string[] = ['UserRoleMappingName', 'UserRoleMappingDescription'];
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
  user_role_mapping_id: number = 0;
  ngOnInit() {
    try{
      console.log('In user-role-mapping list');
      // this.getUserRoleMappingList();
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  // list_user_role_mapping: any = [];
  // getUserRoleMappingList(){
  //   try{
  //     this.masterService.selectUserRoleMapping().subscribe((res: any) => {
  //       console.log('res', res);
  //       if(res.status.trim().toLowerCase() === 'success'){
  //         this.list_user_role_mapping = res.data;
  //         this.dataSource = this.list_user_role_mapping;
  //       }else{
  //         this.snackbarService.openSnackBar(res[0].message, 'Close', 'error-snackbar');
  //       }
  //     });
  //   }catch(e){
  //     this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
  //   }
  // }

  addUserRoleMapping(){
    try{
      this.router.navigate(['/user-role-mapping/add-user-role-mapping', {user_role_mapping_id: 0, profile_type: 'create'}]);
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  editUserRoleMapping(obj){
    try{
      console.log('obj', obj);
      this.router.navigate(['/user-role-mapping/add-user-role-mapping', {user_role_mapping_id: obj.UserRoleMappingId, profile_type: 'edit'}]);
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }
}
