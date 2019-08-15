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
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import * as _ from 'lodash';
import { ConfirmationDialogComponent } from 'src/app/views/confirmation-dialog/confirmation-dialog.component';

// export class CourseListTable {
//   displayedColumns = ['DisplayName', 'email_id', 'MobileNo', 'CourseCode'];
//   dataSource = ELEMENT_DATA;
// }

export interface CourseElement {
  DisplayName: string;
  email_id: string;
  MobileNo: string;
  CourseCode: string;
}

const ELEMENT_DATA: CourseElement[] = [];

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {

  displayedColumns: string[] = ['CourseName', 'CourseDescription','action'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  destroySubscriptions$: Subject<boolean> = new Subject<boolean>();
  constructor(private http: HttpClient, private formBuilder: FormBuilder, private modalService: BsModalService,
    private snackbarService: SnackbarService,
    private httpService: HttpService,
    private appConfigService: AppConfigService,
    private masterService: MasterService,
    private router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) { }
  
  ngOnInit() {
    try{
      console.log('In course list');
      this.getCourseList();
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }
  list_course: any = [];
  getCourseList(){
    try{
     this.masterService.selectCourse().takeUntil(this.destroySubscriptions$).subscribe((res: any) => {
        console.log('res', res);
        if(res.status.trim().toLowerCase() === 'success'){
          this.list_course = res.data;
          this.dataSource = new MatTableDataSource(this.list_course);
          console.log("list_course",this.list_course);
        }else{
          this.snackbarService.openSnackBar(res[0].message, 'Close', 'error-snackbar');
        }
      });
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  addCourse(){
    try{
      this.router.navigate(['/course/add-course', {courseId: 0, profile_type: 'create'}]);
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  editCourse(obj){
    try{
      console.log('obj', obj);
      this.router.navigate(['/course/add-course', {courseId: obj.courseId, profile_type: 'edit'}]);
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }
  showLoading: boolean = false;
  indexValue: boolean = false;
  deleteCourseConfirmation(obj: any, indexValue: number){
    try{
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '50%',
        height: '35%',
        data: {
          dialogHeader: 'Delete Course',
          dialogContent: 'Do you want to delete this entry: ' + obj.courseName,
          courseId: obj.courseId,
          reason: null
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.deleteCourse(result, indexValue);
        }
      });
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }
  applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  deleteCourse(obj: any, indexValue: number){
    try{

      this.showLoading = true;

      let data = {
        courseId: obj.courseId,
        reason: obj.reason
      }


      this.httpService.post(`Deletecoursebyid`, data).subscribe( (res: any) => {
        if(res && res.status.trim().toLowerCase() == 'success'){
          this.snackbarService.openSnackBar('Record deleted successfully', 'Close', 'success-snackbar');
          this.getCourseList();
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
