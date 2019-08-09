import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { AuthService } from './auth.service';

const httpOptions = {
  headers: new HttpHeaders({
    'userid': '4',
    'Content-Type':  'application/json',
    'authtoken': JSON.parse(sessionStorage.getItem('authToken')),
    // 'Origin': 'http://localhost:4201'
  })
};

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  userInfo: any;
  authToken: string;
  baseUrl = 'http://localhost:3000/'; // Localhost
  // baseUrl = 'http://52.66.240.175/DBCBService/WCFService.svc/'; // Server dev

  constructor(private http: HttpClient, private authService: AuthService) {

    this.authToken = JSON.parse(sessionStorage.getItem('authToken'));
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    console.log('this.authToken', this.authToken, this.userInfo);

    console.log('this.headers', httpOptions)
  }

  get(url: string) {
    console.log('httpOptions', url, httpOptions)
    return this.http.get(this.baseUrl + url);
  }

  post(url: string, data: any, secureApi: boolean = true) {
    console.log('URL: ', this.baseUrl + url, httpOptions);
    if(secureApi){
      return this.http.post(this.baseUrl + url, data, httpOptions);
    }else{
      return this.http.post(this.baseUrl + url, data);
    }

  }

  put(url: string, data: any) {
    return this.http.put(this.baseUrl + url, data, httpOptions);
  }

  delete(url: string) {
    return this.http.delete(this.baseUrl + url, httpOptions);
  }
}
