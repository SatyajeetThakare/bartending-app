import { Component, OnInit } from '@angular/core';

import { HttpService } from '../../services/http.service';
import { MasterService } from '../../services/master.service';
import { SnackbarService } from '../../services/snackbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {

  showLoading: boolean = false;
  
  constructor(private httpService: HttpService,
    private snackbarService: SnackbarService,
    private masterService: MasterService,
    private router: Router,
  ) { }

  ngOnInit() {
    try{
      this.getUserCourseMapping();
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'success-snackbar');
    }
  }

  list_user_courses: any[] = [];
  getUserCourseMapping(){
    try{
      this.masterService.selectCourseByUserId().subscribe((res: any) => {
        console.log('res', res);

        this.showLoading = false;

        if(res && res.status.trim().toLowerCase() == 'success'){
          this.list_user_courses = res.data;
        }else {
          this.snackbarService.openSnackBar(res.message, 'Close', 'error-snackbar');
        }
      }, (err) => {
        this.snackbarService.openSnackBar(err.statusText, 'Close', 'error-snackbar');
      });
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'success-snackbar');
    }

  }
clicked(){
  console.log("clicked");
  this.router.navigate(['/user-dashboard/course-exam',{moduleId:34}]);
}
}
