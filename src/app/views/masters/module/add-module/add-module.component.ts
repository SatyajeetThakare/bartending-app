import { Component, OnInit, TemplateRef, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { SnackbarService } from '../../../../services/snackbar.service';
import { HttpService } from '../../../../services/http.service';
import { AppConfigService } from '../../../../services/app-config.service';
@Component({
  selector: 'app-add-module',
  templateUrl: './add-module.component.html',
  styleUrls: ['./add-module.component.scss']
})
export class AddModuleComponent implements OnInit {

  moduleForm: FormGroup;
  charactersPattern = "^[a-zA-Z \-\']+";
  characterPattern = "^[a-zA-Z]+";
  mobnumPattern = "^((\\+91-?)|0)?[0-9]{10}$";
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  passwordPattern = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}';

  moduleId: number = 0;
  objSessionInfo: any;
  pageTitle: string = 'Add Module';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private httpService: HttpService,
    private appConfigService: AppConfigService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit() {
    this.objSessionInfo = this.appConfigService.getSessionObj('userInfo');
    this.getCourseList();
    this.route.params.subscribe(params => {

      this.moduleId = params.moduleId;
      this.resetModuleObject();
      this.bindModuleData();

      if(params['moduleId'] > 0) {
        this.pageTitle = 'Edit Module';
        this.getModuleDetails();
      }
    });
  }
  objModule: any;
  resetModuleObject(){
    try{
      this.objModule = {
        moduleId: this.moduleId > 0 ? Number(this.moduleId) : 0,
        moduleName: null,
        moduleCode: null,
        moduleDescription: null,
        moduleRefFile: null,
        courseId: null,
        createdBy: this.appConfigService.getSessionObj('userInfo').userId,
        updatedBy: this.appConfigService.getSessionObj('userInfo').userId,
        isActive: 1,
      }
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }
  bindModuleData(){
    try{
      this.moduleForm = this.formBuilder.group({
        moduleId: [this.objModule.moduleId, Validators.required],
        moduleCode: [this.objModule.moduleCode, Validators.required],
        moduleName: [this.objModule.moduleName, Validators.required],
        moduleDescription: [this.objModule.moduleDescription, [Validators.required, Validators.pattern(this.charactersPattern)]],
        courseId: [this.objModule.courseId, Validators.required],
        moduleRefFile: '',
        createdBy: [this.objModule.createdBy, Validators.required],
        updatedBy: [this.objModule.updatedBy, Validators.required],
        isActive: [this.objModule.isActive, Validators.required]
      });
      this.findInvalidControls();
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }
  list_course: any = [];
  getCourseList(){
    try{
      this.httpService.get('selectCourse').subscribe((res:any) =>{
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
  getModuleDetails(){
    try{

      this.httpService.post(`Selectmodulebyid`, {moduleId: this.moduleId}).subscribe((res: any) => {
        if(res && res.status.trim().toLowerCase() == 'success'){
          this.objModule = JSON.parse(JSON.stringify({...this.objModule, ...res.data }));
          this.objModule.moduleCode = res.data.ModuleCode;
          this.objModule.moduleName = res.data.ModuleName;
          this.objModule.moduleDescription = res.data.ModuleDescription;
          this.objModule.courseId = res.data.CourseId;
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
  showLoading: boolean = false;
  saveModule(){
    try{

      this.showLoading = true;

      let data = this.moduleForm.getRawValue();
      let urlValue = this.moduleId > 0 ? `UpdateModule` : `Moduleinsert`;
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
    const controls = this.moduleForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
  }
}
