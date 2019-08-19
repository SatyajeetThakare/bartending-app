import { Component, OnInit } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';

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
  pageTitle: string = 'Add Course';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appConfigService: AppConfigService,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit() {

    this.objSessionInfo = this.appConfigService.getSessionObj('userInfo');

    this.route.params.subscribe(params => {

      this.courseId = params.courseId;
      this.profile_type = params.profile_type;
      console.log("courseId", params['courseId']);
      if(params['courseId'] > 0) {
        this.pageTitle = 'Edit Course';
      }
    });
  }

  addModule(){
    this.router.navigate(['/course/add-course/course-module-list', {courseId: this.courseId, profile_type: this.profile_type}]);
  }
}
