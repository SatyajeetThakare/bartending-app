import { Component, OnInit, TemplateRef, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
// import { CourseService } from '../services/course.service';

import { SnackbarService } from '../../../../services/snackbar.service';
import { HttpService } from '../../../../services/http.service';
import { AppConfigService } from '../../../../services/app-config.service';
import { MasterService } from '../../../../services/master.service';


@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss'],
  // providers: [CourseService]
})

export class AddCourseComponent implements OnInit {

  // registerForm: FormGroup;
  // cities = ['','Thane','Airoli','Bandra','Andheri'];
  // states = ['', 'Maharashtra','Punjab','Banglore'];
  // submitted = false;

  courseForm: FormGroup;
  charactersPattern = "^[a-zA-Z \-\']+";
  characterPattern = "^[a-zA-Z]+";
  mobnumPattern = "^((\\+91-?)|0)?[0-9]{10}$";
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  passwordPattern = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}';

  courseId: number = 0;
  objSessionInfo: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private httpService: HttpService,
    private appConfigService: AppConfigService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private snackbarService: SnackbarService,
    // private courseService: CourseService
  ) { }

  ngOnInit() {
    console.log('In add-course component');
    // this.resetAddCourseForm();
    this.objSessionInfo = this.appConfigService.getSessionObj('userInfo');
    console.log('this.objSessionInfo');
    console.log(this.objSessionInfo);
    this.resetCourseObject();
    this.bindCourseData();
  }

  // resetAddCourseForm(){
  //   this.resetAddCourseObject();
  //   this.buildAddCourseForm();
  // }

  objCourse: any;
  resetCourseObject(){
    try{
      this.objCourse = {
        CourseId: 0,
        CourseName: null,
        CourseCode: null,
        CourseDescription: null,
        createdby: this.appConfigService.getSessionObj('userInfo').UserId,
        updatedby: this.appConfigService.getSessionObj('userInfo').UserId,
        isactive: 1,
      }
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  bindCourseData(){
    try{
      this.courseForm = this.formBuilder.group({
        CourseId: [this.objCourse.CourseId, Validators.required],
        CourseName: [this.objCourse.CourseName, Validators.required],
        CourseCode: [this.objCourse.CourseCode, Validators.required],
        CourseDescription: [this.objCourse.CourseDescription, [Validators.required, Validators.pattern(this.charactersPattern)]],
        createdby: [this.objCourse.createdby, Validators.required],
        updatedby: [this.objCourse.updatedby, Validators.required],
        isactive: [this.objCourse.isactive, Validators.required]
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
  saveCourse(){
    try{

      this.showLoading = true;

      let data = this.courseForm.getRawValue();

      console.log('data', data);

      this.httpService.post(`Courseinsert`, data).subscribe((res: any) => {
        console.log('res', res);

        this.showLoading = false;

        if(res && res.status.trim().toLowerCase() == 'success'){
          this.snackbarService.openSnackBar('Course added successfully', 'Close', 'success-snackbar');
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
    const controls = this.courseForm.controls;
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

  onSubmit() {
    console.log("Submitted");
    // console.log("form value",this.registerForm.value);
  }

}
