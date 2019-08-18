import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-module-list',
  templateUrl: './course-module-list.component.html',
  styleUrls: ['./course-module-list.component.scss']
})
export class CourseModuleListComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }
addModule(){
  this.router.navigate(['/course/add-course-module']);
}
}
