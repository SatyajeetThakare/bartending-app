import { Component, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MatSort, MatTableDataSource, MatDialog } from '@angular/material';

import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { SnackbarService } from '../../../../services/snackbar.service';
import { HttpService } from '../../../../services/http.service';
import { AppConfigService } from '../../../../services/app-config.service';
import { MasterService } from '../../../../services/master.service';

import * as _ from 'lodash';
import { ConfirmationDialogComponent } from 'src/app/views/confirmation-dialog/confirmation-dialog.component';

// export class OrganisationListTable {
//   displayedColumns = ['DisplayName', 'email_id', 'MobileNo', 'OrganisationCode'];
//   dataSource = ELEMENT_DATA;
// }

export interface OrganisationElement {
  DisplayName: string;
  email_id: string;
  MobileNo: string;
  OrganisationCode: string;
}

const ELEMENT_DATA: OrganisationElement[] = [];

@Component({
  selector: 'app-organisation-list',
  templateUrl: './organisation-list.component.html',
  styleUrls: ['./organisation-list.component.css']
})
export class OrganisationListComponent implements OnInit {

  displayedColumns: string[] = ['OrgName', 'OrgDescription','action'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private modalService: BsModalService,
    private snackbarService: SnackbarService,
    private httpService: HttpService,
    private appConfigService: AppConfigService,
    private masterService: MasterService,
    private router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) { }

  options: any;
  role_id: number = 0;
  ngOnInit() {
    try{
      console.log('In organisation list');
      this.getOrganisationList();
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  list_organisation: any = [];
  getOrganisationList(){
    try{
      this.masterService.selectOrg().subscribe((res: any) => {
        console.log('res', res);
        if(res.status.trim().toLowerCase() === 'success'){
          this.list_organisation = res.data;
          this.dataSource = new MatTableDataSource(this.list_organisation);
          console.log("this.dataSource",this.dataSource);
        }else{
          this.snackbarService.openSnackBar(res[0].message, 'Close', 'error-snackbar');
        }
      });
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  addOrganisation(){
    try{
      this.router.navigate(['/organisation/add-organisation', {orgId: 0, profile_type: 'create'}]);
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }
  applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  editOrganisation(obj){
    try{
      console.log('obj', obj);
      this.router.navigate(['/organisation/add-organisation', {orgId: obj.OrgId, profile_type: 'edit'}]);
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  deleteOrgConfirmation(obj: any, indexValue: number){
    try{
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '50%',
        height: '35%',
        data: {
          dialogHeader: 'Delete Role',
          dialogContent: 'Are you sure you want to delete this role entry ' + obj.OrgName,
          OrgId: obj.OrgId,
          reason: null
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result){
          console.log("result",result);
          this.deleteOrg(result, indexValue);
        }
      });
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }
  showLoading: boolean = false;
  deleteOrg(obj: any, indexValue: number){
    try{

      this.showLoading = true;

      let data = {
        orgId: obj.OrgId,
        reason: obj.reason
      }

      console.log('data', data);

      this.httpService.post(`DeleteOrgbyid`, data).subscribe( (res: any) => {
        console.log('res', res);
        if(res && res.status.trim().toLowerCase() == 'success'){
          this.snackbarService.openSnackBar('Record deleted successfully', 'Close', 'success-snackbar');
          this.getOrganisationList();
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
}
