import { Component, OnInit, TemplateRef, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { Observable, forkJoin } from 'rxjs';

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
  pageTitle: string = 'Add Course';
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private httpService: HttpService,
    private appConfigService: AppConfigService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private snackbarService: SnackbarService,
    private masterService: MasterService
  ) { }

  ngOnInit() {
    this.objSessionInfo = this.appConfigService.getSessionObj('userInfo');
    this.route.params.subscribe(params => {

      this.courseId = params.courseId;
      console.log("courseId", params['courseId']);
      this.resetCourseObject();
      this.bindCourseData();
      if(params['courseId'] > 0) {
        this.pageTitle = 'Edit Course';
        this.getCourseDetails();
      }else{
        this.getCategoriesList();
      }
    });
  }

  list_category: any[] = [];
  getCategoriesList(){
    this.masterService.GetCategories().subscribe((res: any) => {
      this.list_category = res.data;
      console.log('this.list_category', this.list_category);
    });
  }

  // resetAddCourseForm(){
  //   this.resetAddCourseObject();
  //   this.buildAddCourseForm();
  // }

  objCourse: any;
  resetCourseObject(){
    try{
      this.objCourse = {
        courseId: this.courseId > 0 ? Number(this.courseId) : 0,
        courseName: null,
        courseCode: null,
        courseDescription: null,
        coursePosterImage: null,
        courseReferenceLink: null,
        categoryId: null,
        userId: this.appConfigService.getSessionObj('userInfo').userId,
        createdBy: this.appConfigService.getSessionObj('userInfo').userId,
        updatedby: this.appConfigService.getSessionObj('userInfo').userId,
        isActive: 1,
      }
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  bindCourseData(){
    try{
      this.courseForm = this.formBuilder.group({
        courseId: [this.objCourse.courseId, Validators.required],
        courseName: [this.objCourse.courseName, Validators.required],
        courseCode: [this.objCourse.courseCode, Validators.required],
        courseDescription: [this.objCourse.courseDescription, [Validators.required, Validators.pattern(this.charactersPattern)]],
        coursePosterImage: '',
        courseReferenceLink: '',
        categoryId: [this.objCourse.categoryId, Validators.required],
        userId: [this.objCourse.createdBy, Validators.required],
        createdBy: [this.objCourse.createdBy, Validators.required],
        updatedby: [this.objCourse.updatedby, Validators.required],
        isActive: [this.objCourse.isActive, Validators.required]
      });

      this.findInvalidControls();
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  getCourseDetails(){
    try{
      console.log('id', this.courseId);
      let getCategoriesService = this.masterService.GetCategories();
      let selectCourse = this.httpService.post(`selectCoursebyId`, {courseId: this.courseId})

      forkJoin([getCategoriesService, selectCourse]).subscribe((results: any) => {
        console.log(results);
        this.list_category = results[0].data;
        this.objCourse = JSON.parse(JSON.stringify({...this.objCourse, ...results[1].data }));
        this.bindCourseData();
      }, (err) => {
        this.snackbarService.openSnackBar(err.statusText, 'Close', 'error-snackbar');
      });

      // this.httpService.post(`selectCoursebyId`, {courseId: this.courseId}).subscribe((res: any) => {
      //   console.log("in getCoursedetails",res);
      //   if(res && res.status.trim().toLowerCase() == 'success'){
      //     this.objCourse = JSON.parse(JSON.stringify({...this.objCourse, ...res.data }));
      //     console.log("this.objCourse",this.objCourse);
      //     this.bindCourseData();
      //   }else {
      //     this.snackbarService.openSnackBar(res.message, 'Close', 'error-snackbar');
      //   }
      // }, (err) => {
      //   this.snackbarService.openSnackBar(err.statusText, 'Close', 'error-snackbar');
      // });
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  // list_category: any = [];
  // getCategoryDetails(){
  //   this.httpService.get(`GetCategoryDetails`).subscribe((res: any) =>{
  //     this.list_category = res.data;
  //     console.log("categryList",this.list_category);
  //   });
  // }

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

  resetFormData(){
    this.resetCourseObject();
    this.bindCourseData();
  }

  showLoading: boolean = false;
  saveCourse(){
    try{

      this.showLoading = true;

      let data = this.courseForm.getRawValue();
      console.log('data', data);

      let urlValue = this.courseId > 0 ? `UpdateCourse` : `Courseinsert`;
      this.httpService.post(urlValue, data).subscribe((res: any) => {
        console.log('res', res);
        this.showLoading = false;

        if(res && res.status.trim().toLowerCase() == 'success'){
          this.snackbarService.openSnackBar('Course added successfully', 'Close', 'success-snackbar');
          this.router.navigate(['/course/add-course/course-module-list', {courseId: res.data[0].courseId, profile_type: 'create'}]);
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
  }

}
