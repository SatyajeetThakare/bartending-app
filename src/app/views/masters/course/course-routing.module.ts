import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CourseListComponent } from './course-list/course-list.component';
import { AddCourseComponent } from './add-course/add-course.component';

const routes: Routes = [
  {path: '', redirectTo: 'course-list', pathMatch: 'full'},
  {path: 'course-list', component: CourseListComponent},
  {path: 'add-course', component: AddCourseComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseRoutingModule { }
