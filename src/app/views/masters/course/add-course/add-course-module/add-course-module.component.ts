import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { AppConfigService } from 'src/app/services/app-config.service';
import { MasterService } from 'src/app/services/master.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Location } from '@angular/common';
import { AngularEditorConfig } from '@kolkov/angular-editor';

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-add-course-module',
  templateUrl: './add-course-module.component.html',
  styleUrls: ['./add-course-module.component.scss']
})
export class AddCourseModuleComponent implements OnInit {

  moduleForm: FormGroup;
  charactersPattern = "^[a-zA-Z \-\']+";
  characterPattern = "^[a-zA-Z]+";
  mobnumPattern = "^((\\+91-?)|0)?[0-9]{10}$";
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  passwordPattern = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}';

  courseId: number = 0;
  objSessionInfo: any;
  pageTitle: string = 'Add module';
  questions = [
    { id: 1, name: 'Question 1' },
    { id: 2, name: 'Question 2' },
    { id: 3, name: 'Question 3' },
    { id: 4, name: 'Question 4' }
  ];

  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: 'auto',
      // height: '15rem',
      minHeight: '10rem',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Module description...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    sanitize: true,
    toolbarPosition: 'top',
  };

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
    // this.getCourseList();
    this.getQuestionList();
    this.route.params.subscribe(params => {

      this.courseId = params.courseId;
      this.resetModuleObject();
      this.bindModuleData();

      if(params['courseId'] > 0) {
        this.pageTitle = 'Edit course';
        this.getcourseDetails();
      }
    });
  }

  objCourseModule: any;
  resetModuleObject(){
    try{

      this.objCourseModule = {
        courseId: this.courseId,
        moduleName: null,
        moduleCode: null,
        moduleDescription: null,
        categoryId: null,
        imageFile: null,
        videoFile: null,
        questions: null,
        createdBy: this.appConfigService.getSessionObj('userInfo').userId
      }
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }
  bindModuleData(){
    try{
      this.moduleForm = this.formBuilder.group({
        courseId: [this.objCourseModule.courseId, Validators.required],
        moduleCode: [this.objCourseModule.moduleName], // Shared screen did not have moduleCode property
        moduleName: [this.objCourseModule.moduleName, Validators.required],
        moduleDescription: [this.objCourseModule.moduleDescription, Validators.required],
        questions: [this.objCourseModule.questions, Validators.required],
        imageFile: [this.objCourseModule.imageFile],
        videoFile: [this.objCourseModule.videoFile],
        createdBy: [this.objCourseModule.createdBy, Validators.required]
      });
      this.findInvalidControls();
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }
  // private addCheckboxes() {
  //   this.questions.map((o, i) => {
  //     const control = new FormControl(i === 0); // if first item set to true, else false
  //     (this.moduleForm.controls.questions as FormArray).push(control);
  //   });
  // }

  list_questions: any [];
  getQuestionList(){
    this.httpService.get(`QuestionSelect`).subscribe((res: any) =>{
      this.list_questions = res.data;
      console.log("this.list_questions", this.list_questions);
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
          this.bindModuleData();
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
    this.resetModuleObject();
    this.bindModuleData();
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
  saveModule(){
    try{

      this.showLoading = true;
      console.log('this.moduleForm.value.questions.toString()')

      this.moduleForm.patchValue({
        moduleCode: this.moduleForm.value.moduleName
      })

      let data = JSON.parse(JSON.stringify(this.moduleForm.getRawValue()));
      data.questions = this.moduleForm.value.questions.toString();

      let urlValue = this.courseId > 0 ? `Moduleinsert` : `Moduleinsert`;
      this.httpService.post(urlValue, data).subscribe((res: any) => {

        console.log('res', res)
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
    const controls = this.moduleForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }

    console.log('Invalid controls', invalid);
  }
}
