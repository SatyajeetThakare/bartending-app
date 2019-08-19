import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CourseListComponent } from './course-list/course-list.component';
import { AddCourseComponent } from './add-course/add-course.component';
import { CourseModuleListComponent } from './add-course/course-module-list/course-module-list.component';
import { AddCourseModuleComponent } from './add-course/add-course-module/add-course-module.component';

const routes: Routes = [
  {path: '', redirectTo: 'course-list', pathMatch: 'full'},
  {path: 'course-list', component: CourseListComponent},
  {path: 'add-course', children : [
    {path: '', component: AddCourseComponent},
    {path: 'course-module-list', component: CourseModuleListComponent},
    {path: 'add-course-module', component: AddCourseModuleComponent} ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseRoutingModule { }
