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

  displayedColumns: string[] = ['CourseName', 'CourseDescription'];
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
  course_id: number = 0;
  ngOnInit() {
    try{
      console.log('In course list');
      // this.getCourseList();
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  // list_course: any = [];
  // getCourseList(){
  //   try{
  //     this.masterService.selectCourse().subscribe((res: any) => {
  //       console.log('res', res);
  //       if(res.status.trim().toLowerCase() === 'success'){
  //         this.list_course = res.data;
  //         this.dataSource = this.list_course;
  //       }else{
  //         this.snackbarService.openSnackBar(res[0].message, 'Close', 'error-snackbar');
  //       }
  //     });
  //   }catch(e){
  //     this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
  //   }
  // }

  addCourse(){
    try{
      this.router.navigate(['/course/add-course', {course_id: 0, profile_type: 'create'}]);
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  editCourse(obj){
    try{
      console.log('obj', obj);
      this.router.navigate(['/course/add-course', {course_id: obj.CourseId, profile_type: 'edit'}]);
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }
}
