import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { AuthService } from './auth.service';
import { SnackbarService } from './snackbar.service';

// const httpOptions = {
//   headers: new HttpHeaders({
//     'userid': this.authService.getUserInfo().userId,
//     'Content-Type':  'application/json',
//     'authtoken': this.authService.getAuthToken()
//     // 'Origin': 'http://localhost:4201'
//   })
// };

@Injectable()
export class ServiceInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private snackbarService: SnackbarService
  ) {
  }

  //function which will be called for all http calls
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //how to update the request Parameters
    // const updatedRequest = req.clone({
    //   headers: req.headers.set("authtoken", this.authService.getAuthToken())
    // });

    const authReq = req.clone({ setHeaders: { "authtoken": this.authService.getAuthToken(), "userid": this.authService.getUserInfo().userId ? this.authService.getUserInfo().userId : 0 } });

    //logging the updated Parameters to browser's console
    console.log("Before making api call : ", authReq);

    let urlPathValue: string = null;
    if(authReq.url){
      urlPathValue = new URL(authReq.url).pathname;
    }
    console.log('urlPathValue', urlPathValue)

    if(urlPathValue != '/login'){

      return next.handle(authReq).pipe(
        tap(
          event => {
            //logging the http response to browser's console in case of a success
            if (event instanceof HttpResponse) {
              console.log("api call success :", event);
            }
          },
          error => {

            //logging the http response to browser's console in case of a failuer
            if (event instanceof HttpResponse) {
              console.log("api call error :", event);
            }else if(error.status === 401){
              console.log('Error', error)
              this.snackbarService.openSnackBar('Session expired, please login again.', 'Close', 'error-snackbar');
              this.doErrorProcessing();
            }
          }
        )
      );
    }else{
      return next.handle(authReq)
    }
  }

  doErrorProcessing(){
    try{
      console.log('Doing error processing');
      this.authService.logout();
    }catch(e){

    }
  }
}
