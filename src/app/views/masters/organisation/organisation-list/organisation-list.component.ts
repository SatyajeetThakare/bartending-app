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

  displayedColumns: string[] = ['OrgName', 'OrgDescription'];
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
          this.dataSource = this.list_organisation;
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
      this.router.navigate(['/organisation/add-organisation', {organisation_id: 0, profile_type: 'create'}]);
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  editOrganisation(obj){
    try{
      console.log('obj', obj);
      this.router.navigate(['/organisation/add-organisation', {organisation_id: obj.OrgId, profile_type: 'edit'}]);
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }
}
