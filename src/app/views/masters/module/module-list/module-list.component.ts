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

import { ConfirmationDialogComponent } from '../../../confirmation-dialog/confirmation-dialog.component';
export interface ModuleElement {
  DisplayName: string;
  email_id: string;
  MobileNo: string;
  ModuleCode: string;
}

const ELEMENT_DATA: ModuleElement[] = [];
@Component({
  selector: 'app-module-list',
  templateUrl: './module-list.component.html',
  styleUrls: ['./module-list.component.scss']
})
export class ModuleListComponent implements OnInit {

  displayedColumns: string[] = ['moduleCode','moduleName','moduleDescription', 'action'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  constructor(private http: HttpClient,
    private snackbarService: SnackbarService,
    private httpService: HttpService,
    private appConfigService: AppConfigService,
    private masterService: MasterService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    try{
      this.getModuleList();
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }
  list_module: any = [];
  getModuleList(){
    try{
      this.masterService.selectModule().subscribe((res: any) => {

        if(res.status.trim().toLowerCase() === 'success'){
          this.list_module = res.data;
          this.dataSource =new MatTableDataSource(this.list_module);
        }else{
          this.snackbarService.openSnackBar(res.message, 'Close', 'error-snackbar');
        }
      });
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }
  addModule(){
    try{
      this.router.navigate(['/module/add-module', {moduleId: 0, profile_type: 'create'}]);
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }
  editModule(obj){
    try{
      this.router.navigate(['/module/add-module', {moduleId: obj.ModuleId, profile_type: 'edit'}]);
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }
    applyFilter(filterValue: string){
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    showLoading: boolean = false;
    indexValue: boolean = false;
    deleteModuleConfirmation(obj: any, indexValue: number){
      try{
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '50%',
          height: '35%',
          data: {
            dialogHeader: 'Delete Module',
            dialogContent: 'Do you want to delete this entry: ' + obj.ModuleName,
            moduleId: obj.ModuleId,
            reason: null
          }
        });
  
        dialogRef.afterClosed().subscribe(result => {
          if(result){
            this.deleteModule(result, indexValue);
          }
        });
      }catch(e){
        this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
      }
    }
  
    deleteModule(obj: any, indexValue: number){
      try{
  
        this.showLoading = true;
  
        let data = {
          moduleId: obj.moduleId,
          reason: obj.reason
        }
  
  
        this.httpService.post(`Deletemodulebyid`, data).subscribe( (res: any) => {
          if(res && res.status.trim().toLowerCase() == 'success'){
            this.snackbarService.openSnackBar('Record deleted successfully', 'Close', 'success-snackbar');
            this.getModuleList();
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

