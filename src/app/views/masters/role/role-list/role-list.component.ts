import { Component, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSort, MatTableDataSource } from '@angular/material';

import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { SnackbarService } from '../../../../services/snackbar.service';
import { HttpService } from '../../../../services/http.service';
import { AppConfigService } from '../../../../services/app-config.service';
import { MasterService } from '../../../../services/master.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { ConfirmationDialogComponent } from '../../../confirmation-dialog/confirmation-dialog.component';

import * as _ from 'lodash';

// export class RoleListTable {
//   displayedColumns = ['DisplayName', 'email_id', 'MobileNo', 'RoleCode'];
//   dataSource = ELEMENT_DATA;
// }

export interface RoleElement {
  DisplayName: string;
  email_id: string;
  MobileNo: string;
  RoleCode: string;
}

const ELEMENT_DATA: RoleElement[] = [];

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css']
})
export class RoleListComponent implements OnInit {

  displayedColumns: string[] = ['roleName', 'roleDescription', 'action'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  destroySubscriptions$: Subject<boolean> = new Subject<boolean>();
  constructor(private http: HttpClient,
    private snackbarService: SnackbarService,
    private httpService: HttpService,
    private appConfigService: AppConfigService,
    private masterService: MasterService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  options: any;
  role_id: number = 0;
  ngOnInit() {
    try{
      this.getRoleList();
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  list_role: any = [];
  applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getRoleList(){
    try{
      this.masterService.selectRole().takeUntil(this.destroySubscriptions$).subscribe((res: any) => {

        if(res.status.trim().toLowerCase() === 'success'){
          this.list_role = res.data;
          this.dataSource = new MatTableDataSource(this.list_role);
        }else{
          this.snackbarService.openSnackBar(res.message, 'Close', 'error-snackbar');
        }
      });
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  addRole(){
    try{
      this.router.navigate(['/role/add-role', {role_id: 0, profile_type: 'create'}]);
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  editRole(obj){
    try{
      this.router.navigate(['/role/add-role', {role_id: obj.roleId, profile_type: 'edit'}]);
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  showLoading: boolean = false;
  indexValue: boolean = false;
  deleteRoleConfirmation(obj: any, indexValue: number){
    try{
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '50%',
        height: '35%',
        data: {
          dialogHeader: 'Delete Role',
          dialogContent: 'Are you sure you want to delete this role entry ' + obj.roleName,
          roleId: obj.roleId,
          reason: null
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.deleteRole(result, indexValue);
        }
      });
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  deleteRole(obj: any, indexValue: number){
    try{

      this.showLoading = true;

      let data = {
        roleId: obj.roleId,
        reason: obj.reason
      }

      console.log('data', data);

      this.httpService.post(`Deleterolebyid`, data).subscribe( (res: any) => {
        console.log('res', res);
        if(res && res.status.trim().toLowerCase() == 'success'){
          this.snackbarService.openSnackBar('Record deleted successfully', 'Close', 'success-snackbar');
          this.getRoleList();
        }else{
          this.snackbarService.openSnackBar(res.message ? res.message : 'Some error occurred', 'Close', 'error-snackbar');
        }
        this.showLoading = false;
      }, (err: any) => {
        this.showLoading = false;
        this.snackbarService.openSnackBar(err.statusText, 'Close', 'error-snackbar');
      });
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }
  ngOnDestroy(){
    this.destroySubscriptions$.next(true);
    this.destroySubscriptions$.complete();
  }
}
