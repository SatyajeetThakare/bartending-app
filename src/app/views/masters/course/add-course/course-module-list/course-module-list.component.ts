import { Component, OnInit } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';

import { HttpService } from '../../../../../services/http.service';
import { SnackbarService } from '../../../../../services/snackbar.service';
import { AppConfigService } from '../../../../../services/app-config.service';

@Component({
  selector: 'app-course-module-list',
  templateUrl: './course-module-list.component.html',
  styleUrls: ['./course-module-list.component.scss']
})
export class CourseModuleListComponent implements OnInit {

  courseId: number = 0;
  profile_type: string = 'create';
  objSessionInfo: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appConfigService: AppConfigService,
    private httpService: HttpService,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit() {

    this.objSessionInfo = this.appConfigService.getSessionObj('userInfo');

    this.route.params.subscribe(params => {

      this.courseId = params.courseId;
      this.profile_type = params.profile_type;
      console.log("courseId", params['courseId']);
      if(params['courseId'] > 0) {
        this.getCourseModules();
      }
    });
  }

  list_course_modules: any[] = [];
  getCourseModules(){
    try{

      let data = {
        courseId: this.courseId
      }

      this.httpService.post('GetCourseModules', data).subscribe((res: any) => {
        console.log('res', res)
        this.list_course_modules = res.data;
        if(res && res.status.trim().toLowerCase() != 'success'){
          this.snackbarService.openSnackBar(res.message, 'Close', 'error-snackbar');
        }
      }, (err) => {
        this.snackbarService.openSnackBar(err.statusText, 'Close', 'error-snackbar');
      });
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  addModule(){
    try{
      this.router.navigate(['/course/add-course/add-course-module', {courseId: this.courseId, profile_type: this.profile_type}]);
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

}
