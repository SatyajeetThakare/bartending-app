import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { AppConfigService } from 'src/app/services/app-config.service';
import { MasterService } from 'src/app/services/master.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Location } from '@angular/common';
class ImageSnippet {
  constructor(public src: string, public file: File) {}
}
@Component({
  selector: 'app-add-course-module',
  templateUrl: './add-course-module.component.html',
  styleUrls: ['./add-course-module.component.scss']
})
export class AddCourseModuleComponent implements OnInit {

  courseForm: FormGroup;
  charactersPattern = "^[a-zA-Z \-\']+";
  characterPattern = "^[a-zA-Z]+";
  mobnumPattern = "^((\\+91-?)|0)?[0-9]{10}$";
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  passwordPattern = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}';

  courseId: number = 0;
  objSessionInfo: any;
  pageTitle: string = 'Add course';
  questions = [
    { id: 100, name: 'Question 1' },
    { id: 200, name: 'Question 2' },
    { id: 300, name: 'Question 3' },
    { id: 400, name: 'Question 4' }
  ];
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private httpService: HttpService,
    private appConfigService: AppConfigService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private masterService: MasterService,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit() {
    this.objSessionInfo = this.appConfigService.getSessionObj('userInfo');
    this.getCourseList();
    this.route.params.subscribe(params => {

      this.courseId = params.courseId;
      console.log('this.courseId', this.courseId)
      this.resetcourseObject();
      this.bindcourseData();

      if(params['courseId'] > 0) {
        this.pageTitle = 'Edit course';
        this.getcourseDetails();
      }
    });
  }
  objCourseModule: any;
  resetcourseObject(){
    try{
      this.objCourseModule= {
        courseId: this.courseId > 0 ? Number(this.courseId) : 0,
        courseName: null,
        courseCode: null,
        courseDescription: null,
        categoryId: null,
        userId: this.appConfigService.getSessionObj('userInfo').userId
      }
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }
  bindcourseData(){
    try{
      this.courseForm = this.formBuilder.group({
        courseId: [this.objCourseModule.courseId, Validators.required],
        courseCode: [this.objCourseModule.courseCode, Validators.required],
        courseName: [this.objCourseModule.courseName, Validators.required],
        courseDescription: [this.objCourseModule.courseDescription, [Validators.required, Validators.pattern(this.charactersPattern)]],
        categoryId: [this.objCourseModule.categoryId, Validators.required],
        questions: new FormArray([]),
        userId: [this.objCourseModule.userId, Validators.required]
      });
      this.addCheckboxes();
      this.findInvalidControls();
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }
  private addCheckboxes() {
    this.questions.map((o, i) => {
      const control = new FormControl(i === 0); // if first item set to true, else false
      (this.courseForm.controls.questions as FormArray).push(control);
    });
  }
  list_course: any = [];
  getCourseList(){
    try{
      this.masterService.selectCourse().subscribe((res:any) =>{
        if(res.status.trim().toLowerCase() === 'success'){
          this.list_course = res.data;
        }else{
          this.snackbarService.openSnackBar(res.message, 'Close', 'error-snackbar');
        }
      })
    } catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  getcourseDetails(){
    try{

      this.httpService.post(`Selectcoursebyid`, {courseId: this.courseId}).subscribe((res: any) => {
        if(res && res.status.trim().toLowerCase() == 'success'){
          this.objCourseModule = JSON.parse(JSON.stringify({...this.objCourseModule, ...res.data }));
          // this.objCoursecourse.courseCode = res.data.courseCode;
          // this.objCoursecourse.courseName = res.data.courseName;
          // this.objCoursecourse.courseDescription = res.data.courseDescription;
          // this.objCoursecourse.courseId = res.data.CourseId;
          this.bindcourseData();
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

  resetFormData(){
    this.resetcourseObject();
    this.bindcourseData();
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
  selectedImages: any = [];
  uploadImage(event: any){
    let files = event.target.files;
    this.selectedImages = [];
    if(files[0]){
    if (!this.validateFile(files[0].name,"Image")) {
        console.log('Selected file format is not supported');
        this.snackbarService.openSnackBar("Selected file format is not supported",'Close', 'error-snackbar');
        return false;
    }
    else{
    this.selectedImages = files[0];
    }
  }
    let fData: FormData = new FormData;

    for (var i = 0; i < files.length; i++) {
        fData.append("file", files[i]);
    }
    var _data = {
        filename: 'Sample File',
        id: '0001'
    }

    fData.append("data", JSON.stringify(_data));
    // this._service.uploadFile(fData).subscribe(
    //     response => console.log(response),
    //     error => console.log(error)
    // )
  }
  validateFile(name: String, type:string) {
    var ext = name.substring(name.lastIndexOf('.') + 1);
    console.log(ext);
    if (type == 'Image'){
      if (ext.toLowerCase() == 'png' || ext.toLowerCase() == 'jpeg' || ext.toLowerCase() == 'jpg') {
        return true;
    }
    else {
        return false;
    }
    }
    if (type == 'Video'){
      if (ext.toLowerCase() == 'mp4' || ext.toLowerCase() == '3gp' || ext.toLowerCase() == 'ogg' || ext.toLowerCase() == 'wmv' || ext.toLowerCase() == 'avi'|| ext.toLowerCase() == 'flv' || ext.toLowerCase() == 'mxf' || ext.toLowerCase() == 'hdv') {
        return true;
    }
    else {
      return false;
    } 
    }
  }
  selectedVideos: any = [];
  uploadVideo(event: any) { 
    let files = event.target.files;
    this.selectedVideos = [];
    if(files[0]){
    if (!this.validateFile(files[0].name,"Video")) {
        console.log('Selected file format is not supported');
        this.snackbarService.openSnackBar("Selected file format is not supported",'Close', 'error-snackbar');
        return false;
    }
    else{
    this.selectedVideos = files[0];
    }
  }
    let fData: FormData = new FormData;

    for (var i = 0; i < files.length; i++) {
        fData.append("file", files[i]);
    }
    var _data = {
        filename: 'Sample File',
        id: '0001'
    }

    fData.append("data", JSON.stringify(_data));
    // this._service.uploadFile(fData).subscribe(
    //     response => console.log(response),
    //     error => console.log(error)
    // )
   
  }

  showLoading: boolean = false;
  savecourse(){
    try{

      this.showLoading = true;

      let data = this.courseForm.getRawValue();
      let urlValue = this.courseId > 0 ? `Updatecourse` : `courseinsert`;
      this.httpService.post(urlValue, data).subscribe((res: any) => {

        this.showLoading = false;

        if(res && res.status.trim().toLowerCase() == 'success'){
          this.snackbarService.openSnackBar(res.message, 'Close', 'success-snackbar');
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
  }
}
