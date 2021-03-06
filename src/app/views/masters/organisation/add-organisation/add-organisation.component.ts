import { Component, OnInit, TemplateRef, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';

import { SnackbarService } from '../../../../services/snackbar.service';
import { HttpService } from '../../../../services/http.service';
import { AppConfigService } from '../../../../services/app-config.service';
import { MasterService } from '../../../../services/master.service';


@Component({
  selector: 'app-add-organisation',
  templateUrl: './add-organisation.component.html',
  styleUrls: ['./add-organisation.component.scss'],
  // providers: [OrganisationService]
})

export class AddOrganisationComponent implements OnInit {

  // registerForm: FormGroup;
  // cities = ['','Thane','Airoli','Bandra','Andheri'];
  // states = ['', 'Maharashtra','Punjab','Banglore'];
  // submitted = false;

  organisationForm: FormGroup;
  charactersPattern = "^[a-zA-Z \-\']+";
  characterPattern = "^[a-zA-Z]+";
  mobnumPattern = "^((\\+91-?)|0)?[0-9]{10}$";
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  passwordPattern = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}';

  organisationId: number = 0;
  orgId: number = 0;
  objSessionInfo: any;
  pageTitle: string = 'Add Org';
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private httpService: HttpService,
    private appConfigService: AppConfigService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private snackbarService: SnackbarService,
    // private organisationService: OrganisationService
  ) { }

  ngOnInit() {
    
    this.objSessionInfo = this.appConfigService.getSessionObj('organisationInfo');
    
    this.route.params.subscribe(params => {

      this.orgId = params.orgId;
      console.log('this.orgId', this.orgId);
      this.resetOrganisationObject();
      this.bindOrganisationData();

      if(params['orgId'] > 0) {
        this.pageTitle = 'Edit Org';
        this.getOrgDetails();
      }
    });
  }

  objOrganisation: any;
  resetOrganisationObject(){
    try{
      this.objOrganisation = {
        orgId: this.orgId > 0 ? Number(this.orgId) : 0,
        orgName: null,
        orgDescription: null,
        createdBy: this.appConfigService.getSessionObj('userInfo').userId,
        updatedBy: this.appConfigService.getSessionObj('userInfo').userId,
        isActive: 1,
      }
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  bindOrganisationData(){
    try{
      this.organisationForm = this.formBuilder.group({
        orgId: [this.objOrganisation.orgId, Validators.required],
        orgName: [this.objOrganisation.orgName, Validators.required],
        orgDescription: [this.objOrganisation.orgDescription, [Validators.required, Validators.pattern(this.charactersPattern)]],
        orgLogo: '',
        updatedBy: [this.objOrganisation.updatedBy, Validators.required],
        isActive: [this.objOrganisation.isActive, Validators.required]
      });

      this.findInvalidControls();
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }
  getOrgDetails(){
    try{

      this.httpService.post(`selectOrgbyid`,{orgId:this.orgId}).subscribe((res: any) => {
        console.log('res', res);

        if(res && res.status.trim().toLowerCase() == 'success'){
          this.objOrganisation = JSON.parse(JSON.stringify({...this.objOrganisation, ...res.data }));
          console.log('this.objOrganisation', this.objOrganisation);
          this.objOrganisation.orgName = res.data.OrgName;
          this.objOrganisation.orgDescription = res.data.OrgDescription;
          this.bindOrganisationData();
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
    this.resetOrganisationObject();
    this.bindOrganisationData();
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
  saveOrganisation(){
    try{

      this.showLoading = true;

      let data = this.organisationForm.getRawValue();

      console.log('data', data);
      let urlValue = this.orgId > 0 ? `UpdateOrg` : `Orginsert`;
      this.httpService.post(urlValue, data).subscribe((res: any) => {
        console.log('res', res);

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
    const controls = this.organisationForm.controls;
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
