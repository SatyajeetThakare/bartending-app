import { Component, OnInit, TemplateRef, ViewContainerRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { AppConfigService } from '../../services/app-config.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  public modalRef: BsModalRef;
  passwordPattern = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}';

  constructor(private httpService: HttpService,
    private authService: AuthService,
    private appConfigService: AppConfigService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private snackbarService: SnackbarService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) { }

  ngOnInit() {
    try{
      this.authService.logout();
      this.resetLoginObject();
      this.bindLoginData();
      this.cdr.detectChanges();
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  objLogin: any;
  resetLoginObject(){
    try{
      this.objLogin = {
        userName: null,
        password: null,
        deviceType: 'web'
      }
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  bindLoginData(){
    try{
      this.loginForm = this.formBuilder.group({
        userName: [this.objLogin.userName, Validators.required],
        // password: [this.objLogin.password, [Validators.required, Validators.pattern(this.passwordPattern)]],
        password: [this.objLogin.password, Validators.required],
        deviceType: [this.objLogin.deviceType, Validators.required],
      });
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  displayText: boolean = false;
  togglePasswordVisibility() {
    try{
      var x: any = document.getElementById("accountPassword");

      if (x.type === "password") {
        x.type = "text";
        this.displayText = true;
        setTimeout(() => {
          this.hidePassword();
        }, 5000);
      } else {
        this.displayText = false;
        x.type = "password";
      }
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  hidePassword(){
    try{

      var x: any = document.getElementById("accountPassword");

      if(x.type && x.type == 'text'){
        x.type = "password";
      }
      this.displayText = false;

    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  showLoading: boolean = false;
  submitLogin(){
    try{
      this.showLoading = true;

      let data = this.loginForm.value;

      this.httpService.post('login', data, false).subscribe((res: any) => {

        if(res.status.trim().toLowerCase() === 'success'){
          let sessionAuthToken = this.appConfigService.setSessionObj('authToken', res.data.token.authToken);
          let sessionUserInfo = this.appConfigService.setSessionObj('userInfo', res.data.userdata);
          this.authService.login(this.loginForm.value);
          this.showLoading = false;
        }else{
          this.showLoading = false;
          this.snackbarService.openSnackBar(res[0].message, 'Close', 'error-snackbar');
        }
      }, (err: any) => {
        this.showLoading = false;
        this.snackbarService.openSnackBar(err.statusText, 'Close', 'error-snackbar');
      });

    }catch(e){
      this.showLoading = false;
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  user_name: string;
  forgotPassword(template: TemplateRef<any>){
    try{
      if(this.loginForm.value.user_name){
        this.user_name = this.loginForm.value.user_name;
        this.modalRef = this.modalService.show(template);
      }else{
        this.snackbarService.openSnackBar('Please enter valid username', 'Close', 'error-snackbar');
      }
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  navigateInside(): void{
    try{
      console.log('Here')
      this.router.navigate(['/questions']);
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  sendPassword(){
    try{

      this.objLogin.user_name = this.user_name;

      let data = {
        objLoginData: this.objLogin
      }

      this.httpService.post('sendPassword', data).subscribe((res: any) => {

        if(res.status === 'success'){
          this.snackbarService.openSnackBar(res.message, 'Close', 'success-snackbar');
          this.closeModal();
        }else{
          this.snackbarService.openSnackBar(res.message, 'Close', 'error-snackbar');
        }
      }, (err: any) => {
        this.snackbarService.openSnackBar(err.statusText, 'Close', 'error-snackbar');
      });
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  closeModal(){
    try{
      this.modalRef.hide();
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

}
